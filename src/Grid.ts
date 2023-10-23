import * as THREE from "three";

export class Grid extends THREE.GridHelper {
  constructor(size = 250, divisions = 500) {
    super(size, divisions);
    this.material.transparent = true;
    this.material.opacity = 0.2;
  }
}
