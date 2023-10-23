import { EventManager } from "./EventManger";

export class Inputs {
  private static _instance: Inputs;
  private mousePosition = { x: 0, y: 0 };
  private eventManager = EventManager.Instance;

  private constructor() {
    // TODO: unsubscribe
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("touchmove", this.handleTouchMove.bind(this));
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private handleMouseMove(event: MouseEvent) {
    this.handleCursorMovement(event.clientX, event.clientY);
  }

  private handleTouchMove(event: TouchEvent) {
    this.handleCursorMovement(event.touches[0].clientX, event.touches[0].clientY);
  }

  private handleCursorMovement(clientX: number, clientY: number) {
    this.mousePosition.x = (clientX / window.innerWidth) * 2 - 1;
    this.mousePosition.y = -(clientY / window.innerHeight) * 2 + 1;

    this.eventManager.publish("updateMousePos", {
      x: this.mousePosition.x,
      y: this.mousePosition.y,
    });
  }
}
