import * as THREE from 'three';

export class DirectionalLight extends THREE.DirectionalLight {
    constructor() {
        super(0xffffff, 1);
        this.position.set(5, 5, 10);
    }
}
