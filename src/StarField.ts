import * as THREE from "three";
import type { Coords2D } from "./types/common";
import { EventManager } from "./events/EventManger";

export class StarField {
  private scene: THREE.Scene;
  private stars: THREE.Points;
  private numStars: number;
  private modelCenter: THREE.Vector3;
  private mousePos = { x: 0, y: 0 };
  private previousMousePos = { x: 0, y: 0 };

  private sphereRadius: number;
  private camera: THREE.Camera;
  private readonly eventManager = EventManager.getInstance();

  constructor(
    scene: THREE.Scene,
    modelCenter: THREE.Vector3,
    camera: THREE.Camera,
    numStars = 15000,
  ) {
    this.scene = scene;
    this.modelCenter = modelCenter;
    this.numStars = numStars;
    this.camera = camera;

    // Calculate the sphere radius based on the distance from the camera to the model center
    this.sphereRadius = this.modelCenter.distanceTo(camera.position) * 0.8; // 80% of the distance

    this.eventManager.subscribe<Coords2D>("updateMousePos", (message) => {
      this.updateMousePosition(message);
    });
    this.eventManager.subscribe("animUpdate", () => {
      this.update();
    });
    this.generateStars();
  }

  private generateStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.5,
    });

    const starsVertices = [];

    const cameraToModel = this.modelCenter.clone().sub(this.camera.position).normalize();

    for (let i = 0; i < this.numStars; i++) {
      // Randomly place stars within the sphere
      const vector = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
      )
        .normalize()
        .multiplyScalar(this.sphereRadius * Math.random()); // Random distance from the center

      const cameraToStar = vector.clone().normalize();

      if (cameraToModel.dot(cameraToStar) < 0) {
        starsVertices.push(
          this.modelCenter.x + vector.x,
          this.modelCenter.y + vector.y,
          this.modelCenter.z + vector.z,
        );
      }
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  public updateMousePosition(mousePos: { x: number; y: number }) {
    this.mousePos = mousePos;
  }

  public update() {
    if (
      this.previousMousePos.x !== this.mousePos.x ||
      this.previousMousePos.y !== this.mousePos.y
    ) {
      this.stars.rotation.x += this.mousePos.y * 0.001;
      this.stars.rotation.y += this.mousePos.x * 0.001;

      this.previousMousePos = { ...this.mousePos };
    }
  }
}
