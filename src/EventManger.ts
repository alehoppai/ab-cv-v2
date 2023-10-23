type Events = "updateMousePos" | "animUpdate";
type EventListener<T> = (message: T) => void;

export class EventManager {
  private static _instance: EventManager;
  private constructor() {}

  private eventListeners: Map<Events, EventListener<unknown>[]> = new Map();

  public static getInstance(): EventManager {
    if (!EventManager._instance) {
      EventManager._instance = new EventManager();
    }

    return EventManager._instance;
  }

  public subscribe<T>(type: Events, listener: EventListener<T>): void {
    if (this.eventListeners.has(type)) {
      this.eventListeners.get(type).push(listener);
      return;
    }

    this.eventListeners.set(type, [listener]);
  }

  public publish<T>(type: Events, message: T): void {
    if (!this.eventListeners.has(type)) return;

    this.eventListeners.get(type).forEach((fn: EventListener<T>) => fn(message));
  }
}
