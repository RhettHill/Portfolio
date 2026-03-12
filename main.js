import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';




// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Get the existing canvas
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas ,alpha:true});

// Set renderer size to match the canvas container
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(window.devicePixelRatio);



// Add a Cube for Testing
const loader = new GLTFLoader();

// Variable to hold the loaded model
let model = null;



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



let animationStarted = false;

function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.005;
  particles.rotation.y += 0.0005;
  renderer.render(scene, camera);
}

loader.load('public/models/html.glb', (gltf) => {
  model = gltf.scene;
  scene.add(model);
  if (!animationStarted) {
    animationStarted = true;
    animate();
  }
});


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

// Get elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');

// Add click events to all project images
document.querySelectorAll('.project-img').forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src; // Show clicked image
    lightboxImg.alt = img.alt;
  });
});

// Close lightbox when clicking close button
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});