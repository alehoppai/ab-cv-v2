import * as THREE from 'three';

export class RainbowRays {
    private scene: THREE.Scene;
    private rays: THREE.Line[] = [];
    private modelCenter: THREE.Vector3;
    private numRays: number;
    private rayLength: number;
    private mousePos = { x: 0, y: 0 };
    private initialAngles: number[] = [];

    constructor(scene: THREE.Scene, modelCenter: THREE.Vector3, numRays = 12, rayLength = 5) {
        this.scene = scene;
        this.modelCenter = modelCenter;
        this.numRays = numRays;
        this.rayLength = rayLength;
        this.init();
    }

    private init() {
        const rainbowColors = [
            0xFF0000, 0xFF7F00, 0xFFFF00, 0x7FFF00, 0x00FF00,
            0x00FF7F, 0x00FFFF, 0x007FFF, 0x0000FF, 0x7F00FF,
            0xFF00FF, 0xFF007F
        ];

        for (let i = 0; i < this.numRays; i++) {
            const angle = (i / this.numRays) * 2 * Math.PI;
            this.initialAngles.push(angle);
            const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0).normalize();
            const rayGeometry = new THREE.BufferGeometry().setFromPoints([this.modelCenter, direction.multiplyScalar(this.rayLength)]);
            const rayMaterial = new THREE.LineBasicMaterial({ color: rainbowColors[i % rainbowColors.length] });
            const ray = new THREE.Line(rayGeometry, rayMaterial);
            this.rays.push(ray);
            this.scene.add(ray);
        }
    }

    public updateMousePosition(mousePos: { x: number, y: number }) {
        this.mousePos = mousePos;
    }

    public update() {
        const mouseAngleX = (this.mousePos.x + 1) * Math.PI;
        const mouseAngleY = (this.mousePos.y + 1) * Math.PI;

        this.rays.forEach((ray, index) => {
            const angle = this.initialAngles[index] + mouseAngleX;
            const direction = new THREE.Vector3(
                Math.cos(angle),
                Math.sin(angle + mouseAngleY),
                0
            ).normalize();
            ray.geometry.setFromPoints([this.modelCenter, direction.multiplyScalar(this.rayLength)]);
        });
    }
}
