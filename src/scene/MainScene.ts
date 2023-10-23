import * as THREE from "three";
import { ModelLoader } from "../models/ModelLoader";
import { AmbientLight } from "../lights/Ambient";
import { DirectionalLight } from "../lights/Directional";
import { RainbowRays } from "../fx/RainbowRais";
import { DiagonalGradientBackground } from "../Background";
import { StarField } from "../StarField";
import { EventManager } from "../EventManger";
import { MainCamera } from "../MainCamera";
import { Inputs } from "../Inputs";

export class MainScene {
  private scene: THREE.Scene;
  private readonly mainCamera = new MainCamera();
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group;
  private modelLoader: ModelLoader;
  private mousePosition = { x: 0, y: 0 };
  private eventManager = EventManager.Instance;

  constructor() {
    this.scene = new THREE.Scene();
    new MainCamera();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    this.modelLoader = new ModelLoader();
    Inputs.Instance;
    this.init();
  }

  private init() {
    this.modelLoader.loadModel("/assets/cone_v1.glb", (glft) => {
      this.model = glft.scene;
      this.model.position.y = 2;
      this.model.position.z = 2;
      this.scene.add(this.model);

      const box = new THREE.Box3().setFromObject(this.model);
      const modelCenter = box.getCenter(new THREE.Vector3());

      // TODO: control Scene children.
      // FYI: this 2 should be "static" children
      new RainbowRays(this.scene, modelCenter);
      new StarField(this.scene, modelCenter, this.mainCamera);
    });

    this.scene.add(new AmbientLight());
    this.scene.add(new DirectionalLight());

    // Grid
    const size = 250;
    const divisions = 500;
    const gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    this.scene.add(gridHelper);

    new DiagonalGradientBackground(this.scene);
    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

    if (this.model) {
      this.model.rotation.x = this.mousePosition.y * Math.PI * 0.5;
      this.model.rotation.y = this.mousePosition.x * Math.PI * 0.5;
    }

    this.eventManager.publish("animUpdate", null);
    this.renderer.render(this.scene, this.mainCamera);
  }

  get Camera() {
    return this.mainCamera;
  }

  get Renderer() {
    return this.renderer;
  }
}
