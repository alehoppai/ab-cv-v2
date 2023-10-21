import * as THREE from 'three';
import { ModelLoader } from '../models/ModelLoader';
import { AmbientLight } from '../lights/Ambient';
import { DirectionalLight } from '../lights/Directional';

export class MainScene {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private model: THREE.Group;
    private modelLoader: ModelLoader;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.modelLoader = new ModelLoader();
        this.init();
    }

    private init() {
        this.modelLoader.loadModel('/assets/cone_v1.glb', glft => {
            this.model = glft.scene;
            this.scene.add(this.model);
        });
        this.scene.add(new AmbientLight());
        this.scene.add(new DirectionalLight());
        this.animate();
    }

    private animate() {
        requestAnimationFrame(() => this.animate());
        if (this.model) {
            this.model.rotation.x += 0.01;
            this.model.rotation.y += 0.01;
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
