import * as THREE from "three";

export class AmbientLight extends THREE.AmbientLight {
  constructor() {
    super(0xff0050, 10);
  }
}
