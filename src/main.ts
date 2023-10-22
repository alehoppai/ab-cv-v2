import { MainScene } from "./scene/MainScene";
import { handleResize } from "./utils/handleResize";

console.log("Aleh Belski - Software Developer CV");

const mainScene = new MainScene();
handleResize(mainScene.Camera, mainScene.Renderer);
