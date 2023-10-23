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
import { Grid } from "../Grid";

export class MainScene {
  private scene: THREE.Scene;
  private readonly mainCamera = new MainCamera();
  private renderer: THREE.WebGLRenderer;
  private eventManager = EventManager.Instance;

  constructor() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.init();
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
    this.scene.add(new Grid());

    new MainCamera();
    Inputs.Instance;

    document.body.appendChild(this.renderer.domElement);
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
