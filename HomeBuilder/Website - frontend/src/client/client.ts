import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 10
camera.position.y = 60
camera.position.z = -110


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

// Reference to the table cells
let numberOfItemCell = document.querySelector('#numberOfItem') as any;
let itemNameCell = document.querySelector('#itemName')  as any;
let materialsCell = document.querySelector('#materials')  as any;
let totalCostCell = document.querySelector('#totalCost')  as any;




const loader = new GLTFLoader();
loader.load('./house.gltf', (gltf) => {
  // Get the scene and traverse the child nodes
  const sceneo = gltf.scene;
  sceneo.traverse(function (child) {
    if (child.name) {
      updateTableWithItemDetails(child.name);
    }
  });
  scene.add(gltf.scene);
});

function updateTableWithItemDetails(childName: String) {
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

        // Find the table body
        const tableBody = document.querySelector('#tbody');


        // Check if an existing row with the same item name already exists in the table
        let existingRow = null;

        for (const row of (tableBody as any).querySelectorAll('tr')) {
      
          const itemNameCell = row.querySelector('td:nth-child(2)');
          console.log(itemNameCell);
          if(itemNameCell)
          if (itemNameCell.textContent === itemDetails.itemName) {
            existingRow = row;
            break;
          }
        }
        if (existingRow) {
     
          // Item already exists in the table, update the count and total cost
          const numberOfItemCell = (existingRow as any).querySelector('td:nth-child(1)');
          const totalCostCell = (existingRow as any).querySelector('td:nth-child(4)');
          const currentCount = parseInt(numberOfItemCell.textContent, 10);
          const newCount = currentCount + 1;
          numberOfItemCell.textContent = newCount;
          totalCostCell.textContent = `$${newCount * itemDetails.baseCost}`;
        } else {
          // Item doesn't exist in the table, create a new row
          const newRow = document.createElement('tr');

          // Add cells to the new row
          const numberOfItemCell = document.createElement('td');
          numberOfItemCell.textContent = '1'; // You have 1 of this item
          newRow.appendChild(numberOfItemCell);

          const itemNameCell = document.createElement('td');
          itemNameCell.textContent = itemDetails.itemName;
          newRow.appendChild(itemNameCell);

          const materialsCell = document.createElement('td');
          materialsCell.textContent = itemDetails.materials;
          newRow.appendChild(materialsCell);

          const totalCostCell = document.createElement('td');
          totalCostCell.textContent = `$${itemDetails.baseCost}`;
          newRow.appendChild(totalCostCell);

          // Append the new row to the table body
          (tableBody as any).appendChild(newRow);
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
