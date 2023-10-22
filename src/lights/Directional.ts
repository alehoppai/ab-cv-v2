import * as THREE from "three";

export class DirectionalLight extends THREE.DirectionalLight {
  constructor() {
    super(0x002090, 100);
    this.position.set(10, 10, 10);
  }
}
