import { MainScene } from "./scene/MainScene";
import { handleResize } from "./utils/handleResize";

const mainScene = new MainScene();
handleResize(mainScene.Camera, mainScene.Renderer);
