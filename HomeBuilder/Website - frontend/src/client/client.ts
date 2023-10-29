import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = -10
camera.position.y = 10
//camera.position.z = -110


// Add ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
scene.add(ambientLight);

// Add directional lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(1, 1, 2);
scene.add(directionalLight); 

// Add hemisphere lighting
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);

// Add point lighting
const pointLight = new THREE.PointLight(0xffffff, 0.8, 18);
pointLight.position.set(2, 2, 4); 
scene.add(pointLight);

const renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Enable anti-aliasing

// Increase render resolution 
renderer.setPixelRatio(window.devicePixelRatio);

// Add a CSS rule for better image quality
renderer.domElement.style.imageRendering = 'high-quality'; 

// Increase shadow map resolution
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

const controls = new OrbitControls(camera, renderer.domElement);





const loader = new GLTFLoader();
loader.load('./received_model.gltf', (gltf) => {
  // Get the scene and traverse the child nodes
  const sceneo = gltf.scene;
  sceneo.traverse(function (child) {
    if (child.name) {
      console.log(child.name);
      updateSidebarWithItemDetails(child.name);
    }
  });
  //scene.add(gltf.scene);
});

function updateSidebarWithItemDetails(childName: String) {
  // Load and parse the item details JSON file
  fetch('items.json')
    .then((response) => response.json())
    .then((data) => {
      // Normalize the child name (e.g., "Wall," "Wall1," "Wall001" all become "Wall")
      const normalizedChildName = childName.replace(/\d/g, '');

      // Check if the normalized child name exists in the JSON data
      if (normalizedChildName in data) {
        // Item details found
        const itemDetails = data[normalizedChildName];

        // Find the sidebar content element
        const sidebarContent = document.querySelector('.itemInfo') as any;

        // Check if there is already a card in the sidebar with the same information as the new item
        let existingCard = null;

        for (const card of sidebarContent.querySelectorAll('.card')) {
          const itemNameElement = card.querySelector('h2');
          const costElement = card.querySelector('p:last-child');

          if (itemNameElement.textContent === itemDetails.itemName && costElement.textContent === itemDetails.baseCost) {
            existingCard = card;
            break;
          }
        }

        if (!existingCard) {
          const newItemElement = document.createElement('div');
          newItemElement.classList.add('card');

          const itemNameElement = document.createElement('h2');
          itemNameElement.textContent = itemDetails.itemName;
          newItemElement.appendChild(itemNameElement);

          const descriptionElement = document.createElement('p');
          descriptionElement.textContent = itemDetails.description;
          newItemElement.appendChild(descriptionElement);

          const dimensionElement = document.createElement('p');
          dimensionElement.textContent = itemDetails.dimensions;
          newItemElement.appendChild(dimensionElement);

          const costElement = document.createElement('p');
          costElement.textContent = itemDetails.baseCost;
          newItemElement.appendChild(costElement);

          sidebarContent.appendChild(newItemElement);
        }
      }
    })
    .catch((error) => {
      console.error('Error loading item details:', error);
    });
}



window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
