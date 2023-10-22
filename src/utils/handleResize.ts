import * as THREE from "three";

export function handleResize(camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) {
  window.addEventListener("resize", () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}
