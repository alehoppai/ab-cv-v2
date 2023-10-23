import * as THREE from "three";

export class MainCamera extends THREE.PerspectiveCamera {
  constructor() {
    super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.position.z = 10;
    this.position.y = 5;
    this.rotateX(-0.5);
  }
}
