import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
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
      const angle = (i / this.numRays) * 2 * Math.PI;
      this.initialAngles.push(angle);

      const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0).normalize();
      const rayGeometry = new LineGeometry();

      rayGeometry.setPositions([
        this.modelCenter.x,
        this.modelCenter.y,
        this.modelCenter.z,
        direction.x * this.rayLength,
        direction.y * this.rayLength,
        direction.z * this.rayLength,
      ]);

      const rayMaterial = new LineMaterial({
        color: rainbowColors[i % rainbowColors.length],
        linewidth: 2.5, // Adjust this value for desired thickness
      });
      rayMaterial.resolution.set(window.innerWidth, window.innerHeight);

      const ray = new Line2(rayGeometry, rayMaterial);
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
      const geometry = ray.geometry as LineGeometry;
      geometry.setPositions([
        this.modelCenter.x,
        this.modelCenter.y,
        this.modelCenter.z,
        direction.x * this.rayLength,
        direction.y * this.rayLength,
        direction.z * this.rayLength,
      ]);
    });
  }
}
