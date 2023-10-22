import * as THREE from "three";

export class DirectionalLight extends THREE.DirectionalLight {
  constructor() {
    super(0x000040, 100);
    this.position.set(10, 10, 10);
  }
}
