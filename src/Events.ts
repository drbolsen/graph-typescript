import { Subscriber, EventHandler } from "./Subscriber";
import { uniqueId } from "./Utils/UniqueId";

export interface SubscriberRemoveHandler {
  token: string;
  remove: () => void;
}

export interface EventsApi {
  on: (
    eventName: string,
    eventHandler: EventHandler,
    ctx?: any
  ) => SubscriberRemoveHandler;
  once: (
    eventName: string,
    eventHandler: EventHandler,
    ctx?: any
  ) => SubscriberRemoveHandler;
  exactly: (
    eventName: string,
    eventHandler: EventHandler,
    limit: number,
    ctx?: any
  ) => SubscriberRemoveHandler;
  off: (eventName: string, token: string) => void;
  clear: (eventName: string) => void;
  emit: (eventName: string, ...args: any[]) => void;
}

export class Events implements EventsApi {
  private _subscribers: Map<string, Map<string, Subscriber>>;
  constructor() {
    this._subscribers = new Map();
  }
  protected generateEventToken(): string {
    return uniqueId();
  }
  protected register(
    eventName: string,
    eventHandler: EventHandler,
    limit = Infinity,
    ctx?: any
  ): SubscriberRemoveHandler {
    if (!this._subscribers.has(eventName)) {
      this._subscribers.set(eventName, new Map([]));
    }

    const token = this.generateEventToken();

    const subscriber: Subscriber = {
      token: token,
      counter: 0,
      hanlder: eventHandler,
      ctx: ctx,
      limit: limit,
    };

    this._subscribers.get(eventName)?.set(token, subscriber);

    return {
      token: token,
      remove: () => {
        this.unsubscribe(eventName, token);
      },
    } as SubscriberRemoveHandler;
  }
  public on(
    eventName: string,
    eventHandler: EventHandler,
    ctx?: any
  ): SubscriberRemoveHandler {
    return this.register(eventName, eventHandler, Infinity, ctx);
  }
  public once(
    eventName: string,
    eventHandler: EventHandler,
    ctx?: any
  ): SubscriberRemoveHandler {
    return this.register(eventName, eventHandler, 1, ctx);
  }
  public exactly(
    eventName: string,
    eventHandler: EventHandler,
    limit = 1,
    ctx?: any
  ): SubscriberRemoveHandler {
    return this.register(eventName, eventHandler, limit, ctx);
  }
  protected unsubscribe(eventName: string, token: string): void {
    if (
      !this._subscribers.has(eventName) ||
      !this._subscribers.get(eventName)?.has(token)
    ) {
      return;
    }
    this._subscribers.get(eventName)?.delete(token);
    if (this._subscribers.get(eventName)?.size === 0) {
      this._subscribers.delete(eventName);
    }
  }
  public off(eventName: string, token: string): void {
    this.unsubscribe(eventName, token);
  }
  protected unregister(eventName: string): void {
    this._subscribers.delete(eventName);
  }
  public clear(eventName: string): void {
    this.unregister(eventName);
  }
  public clearAll(): void {
    this._subscribers.clear();
  }
  public emit(eventName: string, ...args: any[]): void {
    if (
      !this._subscribers.has(eventName) ||
      this._subscribers.get(eventName)?.size === 0
    ) {
      return;
    }
    let hanldersToRemove: string[] = [];
    this._subscribers.get(eventName)?.forEach((s, key) => {
      s.hanlder.apply(s.ctx, args);

      s.counter++;
      if (s.counter >= s.limit) {
        hanldersToRemove.push(key);
      }
    });
    if (hanldersToRemove.length > 0) {
      hanldersToRemove.forEach((key) =>
        this._subscribers.get(eventName)?.delete(key)
      );
    }
    if (this._subscribers.get(eventName)?.size === 0) {
      this._subscribers.delete(eventName);
    }
  }
  public listRegisteredEvents(): any[] {
    return [...this._subscribers.entries()];
  }
  public listSubscribersForEvent(eventName: string): any[] {
    return [...(this._subscribers.get(eventName)?.entries() || [])];
  }
}
