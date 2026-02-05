import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

/* ---------- SCENE ---------- */
const scene = new THREE.Scene();

/* ---------- CAMERA ---------- */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

/* ---------- RENDERER ---------- */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* ---------- PARTICLES ---------- */
const particleCount = 4000;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 5;
  positions[i3 + 1] = (Math.random() - 0.5) * 5;
  positions[i3 + 2] = (Math.random() - 0.5) * 5;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

/* ---------- TOUCH CONTROLS ---------- */
let lastTouchX = 0;
let lastTouchY = 0;
let rotationX = 0;
let rotationY = 0;
let scaleFactor = 1;
let startDistance = null;

window.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  }

  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    startDistance = Math.sqrt(dx * dx + dy * dy);
  }
});

window.addEventListener("touchmove", (e) => {
  e.preventDefault();

  // Rotate
  if (e.touches.length === 1) {
    const dx = e.touches[0].clientX - lastTouchX;
    const dy = e.touches[0].clientY - lastTouchY;

    rotationY += dx * 0.005;
    rotationX += dy * 0.005;

    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  }

  // Pinch zoom
  if (e.touches.length === 2 && startDistance) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const newDistance = Math.sqrt(dx * dx + dy * dy);

    scaleFactor = newDistance / startDistance;
    scaleFactor = Math.max(0.5, Math.min(scaleFactor, 3));
  }
}, { passive: false });

window.addEventListener("touchend", () => {
  startDistance = null;
});

// Tap → change color
window.addEventListener("click", () => {
  material.color.setHSL(Math.random(), 1, 0.6);
});

/* ---------- ANIMATE ---------- */
function animate() {
  requestAnimationFrame(animate);

  particles.rotation.x = rotationX;
  particles.rotation.y = rotationY;
  particles.scale.setScalar(scaleFactor);

  renderer.render(scene, camera);
}
animate();

/* ---------- RESIZE ---------- */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});