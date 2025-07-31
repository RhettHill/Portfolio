import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';




// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Get the existing canvas
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas ,alpha:true});

// Set renderer size to match the canvas container
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);



// Add a Cube for Testing
const loader = new GLTFLoader();

// Variable to hold the loaded model
let model = null;

// Load the GLTF model
loader.load(
    'public/models/html.glb',
    function (gltf) {
        model = gltf.scene; // Store the model in the global variable
        scene.add(model);
        model.position = (0,0,0)
        console.log("Model successfully loaded");

        // Start the animation loop after the model is loaded
        animate();
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

// Camera Position
camera.position.z = 10;

const directionalLight = new THREE.DirectionalLight(0xffddaa, 0.3); // Warm light
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xaaaaff, 1); // Cool light
scene.add(ambientLight);

// --- Particle Background ---
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 400;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 30; // spread particles out
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x9999ff,
    transparent: true,
    opacity: 0.7
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);



// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.01;
    }

    // Particle movement
    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0004;

    renderer.render(scene, camera);
}

// Start the initial animation loop
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});



const uls = document.querySelectorAll("section");

function handleScroll() {
    uls.forEach((ul) => {
        const rect = ul.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        // Add the 'appear' class if the element is visible
        if (isVisible) {
            ul.classList.add('appear');
        }
    });
}

window.addEventListener('scroll', handleScroll);

// Trigger once on load in case element is already in view
handleScroll();

document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("appear");
                }
            });
        },
        { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));
});

// Technology Items Animation
const techItems = document.querySelectorAll('.tech-item');

techItems.forEach((item, index) => {
  setTimeout(() => {
    item.classList.add('appear');
  }, index * 150); // 150ms delay between each
});