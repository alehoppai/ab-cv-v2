import * as THREE from "three";
import { ModelLoader } from "../models/ModelLoader";
import { AmbientLight } from "../lights/Ambient";
import { DirectionalLight } from "../lights/Directional";
import { RainbowRays } from "../fx/RainbowRais";
import { DiagonalGradientBackground } from "../Background";
import { StarField } from "../StarField";

export class MainScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group;
  private modelLoader: ModelLoader;
  private rainbowRays: RainbowRays;
  private mousePosition = { x: 0, y: 0 };
  private starField: StarField;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.z = 10;
    this.camera.position.y = 5;
    this.camera.rotateX(-0.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    this.modelLoader = new ModelLoader();
    this.init();

    document.addEventListener("mousemove", (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

      if (this.rainbowRays) {
        this.rainbowRays.updateMousePosition({
          x: this.mousePosition.x,
          y: this.mousePosition.y,
        });
      }

      if (this.starField) {
        this.starField.updateMousePosition({
          x: this.mousePosition.x,
          y: this.mousePosition.y,
        });
      }
    });

    document.addEventListener("touchmove", (event) => {
      this.mousePosition.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;

      if (this.rainbowRays) {
        this.rainbowRays.updateMousePosition({
          x: this.mousePosition.x,
          y: this.mousePosition.y,
        });
      }

      if (this.starField) {
        this.starField.updateMousePosition({
          x: this.mousePosition.x,
          y: this.mousePosition.y,
        });
      }
    });

    document.addEventListener("keypress", (event) => {
      switch (event.key) {
        case "a":
        case "A":
          this.camera.rotation.y += 0.1;
          break;
        case "d":
        case "D":
          this.camera.rotation.y -= 0.1;
          break;
        case "w":
        case "W":
          this.camera.rotation.x += 0.1;
          break;
        case "s":
        case "S":
          this.camera.rotation.x -= 0.1;
          break;
      }
    });
  }

  private init() {
    this.modelLoader.loadModel("/assets/cone_v1.glb", (glft) => {
      this.model = glft.scene;
      this.model.position.y = 2;
      this.model.position.z = 2;
      this.scene.add(this.model);

      const box = new THREE.Box3().setFromObject(this.model);
      const modelCenter = box.getCenter(new THREE.Vector3());
      this.rainbowRays = new RainbowRays(this.scene, modelCenter);
      this.starField = new StarField(this.scene, modelCenter, this.camera);
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

    // Axis
    // const axesHelper = new THREE.AxesHelper(10);
    // axesHelper.position.y = -2;
    // axesHelper.position.z = 1;
    // axesHelper.position.x = -5;
    // this.scene.add(axesHelper);

    new DiagonalGradientBackground(this.scene);
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

    if (this.starField) {
      this.starField.update();
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
