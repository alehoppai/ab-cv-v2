import * as THREE from "three";
import { ModelLoader } from "../models/ModelLoader";
import { EventManager } from "../EventManger";
import type { Coords2D } from "../types/common";

export class CCube {
  private scene: THREE.Scene;
  private model: THREE.Group;
  private modelLoader: ModelLoader;
  private eventManager = EventManager.Instance;
  private mousePosition = { x: 0, y: 0 };

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.modelLoader = new ModelLoader();
    this.eventManager.subscribe("animUpdate", () => {
      this.update();
    });
    this.eventManager.subscribe<Coords2D>("updateMousePos", (message) => {
      this.updateMousePosition(message);
    });
  }

  public async init() {
    return new Promise((resolve, reject) => {
      try {
        this.modelLoader.loadModel("/assets/cone_v1.glb", (glft) => {
          this.model = glft.scene;
          this.model.position.y = 2;
          this.model.position.z = 2;
          this.scene.add(this.model);
          resolve(this.model);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public get center() {
    const box = new THREE.Box3().setFromObject(this.model);
    return box.getCenter(new THREE.Vector3());
  }

  public update() {
    this.model.rotation.x = this.mousePosition.y * Math.PI * 0.5;
    this.model.rotation.y = this.mousePosition.x * Math.PI * 0.5;
  }

  public updateMousePosition(mousePosition: { x: number; y: number }) {
    this.mousePosition = mousePosition;
  }
}

export async function getCCube(scene: THREE.Scene) {
  const ccube = new CCube(scene);
  await ccube.init();
  return ccube;
}
