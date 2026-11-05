import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector('#canvas');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let renderer;

// Keep the 3D background decorative and responsive without letting it block the page.
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
} catch (error) {
  console.warn('WebGL is unavailable; showing the CSS background instead.', error);
}

if (renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 12;

  scene.add(new THREE.AmbientLight(0xaaaaff, 1.35));
  const keyLight = new THREE.DirectionalLight(0xffddaa, 2.2);
  keyLight.position.set(-4, 5, 8);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x7777ff, 15, 28);
  rimLight.position.set(5, -2, 4);
  scene.add(rimLight);

  const particleCount = window.innerWidth < 700 ? 180 : 360;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particlePositions.length; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 34;
    particlePositions[i + 1] = (Math.random() - 0.5) * 24;
    particlePositions[i + 2] = (Math.random() - 0.5) * 18 - 2;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
    size: 0.075,
    color: 0xb2b8ff,
    transparent: true,
    opacity: 0.68,
    sizeAttenuation: true,
  }));
  scene.add(particles);

  const loader = new GLTFLoader();
  loader.load(
    `${import.meta.env.BASE_URL}models/html.glb`,
    ({ scene: model }) => {
      model.position.set(0, 0, -1);
      model.scale.setScalar(1.25);
      scene.add(model);
      canvas.classList.add('model-loaded');
      canvas.userDataModel = model;
    },
    undefined,
    (error) => console.warn('The 3D emblem could not be loaded.', error),
  );

  let frameId;
  const animate = () => {
    if (document.hidden || prefersReducedMotion.matches) return;
    frameId = window.requestAnimationFrame(animate);
    particles.rotation.y += 0.00035;
    particles.rotation.x += 0.00008;
    if (canvas.userDataModel) canvas.userDataModel.rotation.y += 0.004;
    renderer.render(scene, camera);
  };
  const startAnimation = () => {
    if (!frameId && !document.hidden && !prefersReducedMotion.matches) animate();
    if (prefersReducedMotion.matches || document.hidden) renderer.render(scene, camera);
  };
  const stopAnimation = () => {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = undefined;
  };

  startAnimation();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAnimation();
    else startAnimation();
  });
  prefersReducedMotion.addEventListener('change', () => {
    stopAnimation();
    startAnimation();
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

const sections = document.querySelectorAll('.fade-in');
const navigationLinks = document.querySelectorAll('.site-header nav a[href^="#"]');
if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        navigationLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { threshold: 0.12 });
  sections.forEach((section) => sectionObserver.observe(section));
} else {
  sections.forEach((section) => section.classList.add('appear'));
}

document.querySelectorAll('.tech-item').forEach((item, index) => {
  window.setTimeout(() => item.classList.add('appear'), index * 80);
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox.querySelector('.lightbox-img');
const closeButton = lightbox.querySelector('.lightbox-close');
let lastFocusedElement;

const closeLightbox = () => {
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusedElement?.focus();
};

document.querySelectorAll('.project-img').forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `View larger image: ${image.alt}`);
  const openLightbox = () => {
    lastFocusedElement = image;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  };
  image.addEventListener('click', openLightbox);
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox();
    }
  });
});

closeButton.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
});
