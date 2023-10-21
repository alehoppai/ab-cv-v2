import * as THREE from 'three';
import { ModelLoader } from '../models/ModelLoader';
import { AmbientLight } from '../lights/Ambient';
import { DirectionalLight } from '../lights/Directional';
import { RainbowRays } from '../fx/RainbowRais';
import { DiagonalGradientBackground } from '../Background';

export class MainScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private model: THREE.Group;
    private modelLoader: ModelLoader;
    private rainbowRays: RainbowRays;
    private mousePosition = { x: 0, y: 0 };
    private background: DiagonalGradientBackground;

    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this.renderer.domElement);

        this.modelLoader = new ModelLoader();
        this.init();

        document.addEventListener('mousemove', (event) => {
            this.mousePosition.x = event.clientX / window.innerWidth * 2 - 1;
            this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

            if (this.rainbowRays) {
                this.rainbowRays.updateMousePosition({
                    x: this.mousePosition.x,
                    y: this.mousePosition.y,
                });
            }
        });
    }

    private init() {
        this.modelLoader.loadModel('/assets/cone_v1.glb', glft => {
            this.model = glft.scene;
            this.scene.add(this.model);

            const box = new THREE.Box3().setFromObject(this.model);
            const modelCenter = box.getCenter(new THREE.Vector3());
            this.rainbowRays = new RainbowRays(this.scene, modelCenter);
        });
        this.scene.add(new AmbientLight());
        this.scene.add(new DirectionalLight());
        this.background = new DiagonalGradientBackground(this.scene);
        this.animate();
    }

    private animate() {
        requestAnimationFrame(() => this.animate());

        if (this.model) {
            this.model.rotation.x = this.mousePosition.y * Math.PI * 0.5;
            this.model.rotation.y = this.mousePosition.x * Math.PI * 0.5;
        }

        if (this.rainbowRays) {
            this.rainbowRays.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    get Camera() {
        return this.camera;
    }

    get Renderer() {
        return this.renderer;
    }
}
