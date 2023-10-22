import * as THREE from "three";
import { dimColor } from "../utils/dimColor";

export class RainbowRays {
  private scene: THREE.Scene;
  private rays: THREE.Mesh[] = [];
  private modelCenter: THREE.Vector3;
  private numRays: number;
  private rayLength: number;
  private mousePos = { x: 0, y: 0 };
  private initialAngles: number[] = [];

  constructor(scene: THREE.Scene, modelCenter: THREE.Vector3, numRays = 21, rayLength = 35) {
    this.scene = scene;
    this.modelCenter = modelCenter;
    this.numRays = numRays;
    this.rayLength = rayLength;

    this.init();
  }

  private init() {
    const rainbowColors = [
      0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3,
    ].map((color) => dimColor(color, 0.3));

    for (let i = 0; i < this.numRays; i++) {
      let angle = (i / this.numRays) * 2 * Math.PI;
      this.initialAngles.push(angle);

      // Adjust the angle based on the color for the prism effect
      angle += (i - this.numRays / 2) * 0.005;

      const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0).normalize();

      const startPos = this.modelCenter.clone();
      const endPos = this.modelCenter.clone().add(direction.multiplyScalar(this.rayLength));

      // Create custom geometry for the ray (trapezoid)
      const rayGeometry = new THREE.BufferGeometry();
      const vertices = [
        // Base at the model center
        startPos.x,
        startPos.y,
        startPos.z,
        endPos.x,
        endPos.y - 0.1,
        endPos.z,
        endPos.x,
        endPos.y + 0.1,
        endPos.z,
        // ... You can add more vertices to define the larger base of the trapezoid
      ];
      rayGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

      const rayMaterial = new THREE.MeshBasicMaterial({
        color: rainbowColors[i % rainbowColors.length],
        side: THREE.DoubleSide, // Render both sides of the geometry
      });

      const ray = new THREE.Mesh(rayGeometry, rayMaterial);
      this.rays.push(ray);
      this.scene.add(ray);
    }
  }

  public updateMousePosition(mousePos: { x: number; y: number }) {
    this.mousePos = mousePos;
  }

  public update() {
    const mouseAngleX = this.mousePos.x * 0.25 * Math.PI;
    const mouseAngleY = this.mousePos.y * 0.25 * Math.PI;

    this.rays.forEach((ray, index) => {
      const angle = this.initialAngles[index] + mouseAngleX;
      const direction = new THREE.Vector3(
        Math.cos(angle),
        Math.sin(angle + mouseAngleY),
        0,
      ).normalize();

      // Set the new direction for the ray
      const endPos = this.modelCenter.clone().add(direction.multiplyScalar(this.rayLength));
      const geometry = ray.geometry as THREE.BufferGeometry;
      const positions = geometry.attributes.position.array as Float32Array;

      // Update positions for the ray based on new direction
      positions[3] = endPos.x;
      positions[4] = endPos.y - 0.1; // Adjust for the trapezoid shape
      positions[5] = endPos.z;
      positions[6] = endPos.x;
      positions[7] = endPos.y + 0.1; // Adjust for the trapezoid shape
      positions[8] = endPos.z;

      geometry.attributes.position.needsUpdate = true; // Inform Three.js to update the geometry
    });
  }
}
