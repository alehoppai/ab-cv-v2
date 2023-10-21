import { GLTFLoader, GLTF } from 'three-stdlib';

export class ModelLoader {
    private loader: GLTFLoader;

    constructor() {
        this.loader = new GLTFLoader();
    }

    loadModel(url: string, onLoad: (gltf: GLTF) => void) {
        this.loader.load(url, onLoad, undefined, (error) => {
            console.error(error);
        });
    }
}

