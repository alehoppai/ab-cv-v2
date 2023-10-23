import * as THREE from "three";
import { AmbientLight } from "../lights/Ambient";
import { DirectionalLight } from "../lights/Directional";
import { RainbowRays } from "../models/RainbowRais";
import { DiagonalGradientBackground } from "../Background";
import { StarField } from "../models/StarField";
import { EventManager } from "../EventManger";
import { MainCamera } from "../MainCamera";
import { Inputs } from "../Inputs";
import { getCCube } from "../models/CCube";

export class MainScene {
  private scene: THREE.Scene;
  private readonly mainCamera = new MainCamera();
  private renderer: THREE.WebGLRenderer;
  private eventManager = EventManager.Instance;

  constructor() {
    this.scene = new THREE.Scene();
    new MainCamera();

    Inputs.Instance;
    this.init();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  private async init() {
    const ccube = await getCCube(this.scene);
    // TODO: control Scene children.
    // FYI: this 3 should be "static" children
    new RainbowRays(this.scene, ccube.center);
    new StarField(this.scene, ccube.center, this.mainCamera);
    new DiagonalGradientBackground(this.scene);

    this.scene.add(new AmbientLight());
    this.scene.add(new DirectionalLight());

    // Grid
    const size = 250;
    const divisions = 500;
    const gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    this.scene.add(gridHelper);

    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());

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
