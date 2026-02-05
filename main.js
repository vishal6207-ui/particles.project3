import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let isTouching = false;
let lastTouchX = 0;
let lastTouchY = 0;

let rotationX = 0;
let rotationY = 0;

let scaleFactor = 1;

// Particles
const count = 4000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 5;
  positions[i3 + 1] = (Math.random() - 0.5) * 5;
  positions[i3 + 2] = (Math.random() - 0.5) * 5;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animate
function animate() {
  requestAnimationFrame(animate);

  particles.rotation.x = rotationX;
  particles.rotation.y = rotationY;
  particles.scale.setScalar(scaleFactor);

  renderer.render(scene, camera);
}

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// Touch start
window.addEventListener("touchstart", (e) => {
  isTouching = true;
  lastTouchX = e.touches[0].clientX;
  lastTouchY = e.touches[0].clientY;
});

// Touch move
window.addEventListener("touchmove", (e) => {
  if (!isTouching) return;

  // Single finger = rotate
  if (e.touches.length === 1) {
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouchX;
    const deltaY = touch.clientY - lastTouchY;

    rotationY += deltaX * 0.005;
    rotationX += deltaY * 0.005;

    lastTouchX = touch.clientX;
    lastTouchY = touch.clientY;
  }

  // Two fingers = pinch zoom
  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    scaleFactor = THREE.MathUtils.clamp(distance / 200, 0.5, 3);
  }
});

// Touch end
window.addEventListener("touchend", () => {
  isTouching = false;
});

// Tap = change color
window.addEventListener("click", () => {
  particles.material.color.setHSL(Math.random(), 1, 0.6);
});