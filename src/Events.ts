import { Subscriber, EventHandler } from "./Subscriber";
import { uniqueId } from "./Utils/UniqueId";

export interface UnsubscribeHandler {
  token: string;
  remove: () => void;
}

export interface EventsApiCore {
  on: (
    eventName: string,
    eventHandler: EventHandler,
    ctx?: any
  ) => UnsubscribeHandler;
  off: (eventName: string, token: string) => void;
  fire: (eventName: string, ...args: any[]) => void;
}

export interface EventsApiExtended {
  once: (
    eventName: string,
    eventHandler: EventHandler,
    ctx?: any
  ) => UnsubscribeHandler;
  exactly: (
    eventName: string,
    eventHandler: EventHandler,
    limit: number,
    ctx?: any
  ) => UnsubscribeHandler;
}

export interface EventsApiHelpers {
  clear: (eventName: string) => void;
  clearAll: () => void;
  listEvents: () => any[];
  listEventSubscribers: (eventName: string) => any[];
}

export type Subscribers = Map<string, Map<string, Subscriber>>;

export class Events
  implements EventsApiCore, EventsApiExtended, EventsApiHelpers
{
  private _subscribers: Subscribers = new Map();

  constructor() {
  }

  // Private/Protected methods
  protected genEvtToken(): string {
    return uniqueId();
  }

  protected subscribe(
    eventName: string,
    handler: EventHandler,
    limit = Infinity,
    ctx?: any
  ): UnsubscribeHandler {
    if (!this._subscribers.has(eventName)) {
      this._subscribers.set(eventName, new Map([]));
    }
    const token = this.genEvtToken();
    const subscriber: Subscriber = {
      token: token,
      counter: 0,
      limit: limit,
      hanlder: handler,
      ctx: ctx,
    };

    this._subscribers.get(eventName)?.set(token, subscriber);

    return {
      token: token,
      remove: () => {
        this.unsubscribe(eventName, token);
      },
    } as UnsubscribeHandler;
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

  protected publish(eventName: string, ...args: any[]): void {
    // Check first if there is any subscriber
    if (
      !this._subscribers.has(eventName) ||
      this._subscribers.get(eventName)?.size === 0
    ) {
      return;
    }

    let hanldersToRemove: string[] = [];
    // Process all event handlers and add any handler with
    // execution limit for deletion
    this._subscribers.get(eventName)?.forEach((subscriber, key) => {
      subscriber.hanlder.apply(subscriber.ctx, args);

      subscriber.counter++;
      if (subscriber.counter >= subscriber.limit) {
        hanldersToRemove.push(key);
      }
    });

    // Remove all marked event handlers that reached execution limit
    if (hanldersToRemove.length > 0) {
      hanldersToRemove.forEach((key) =>
        this._subscribers.get(eventName)?.delete(key)
      );
    }

    // Remove the subscribers object if no any subscriber left
    if (this._subscribers.get(eventName)?.size === 0) {
      this._subscribers.delete(eventName);
    }
  }

  protected unpublish(eventName: string): void {
    this._subscribers.delete(eventName);
  }

  // Public interface - core
  public on(
    eventName: string,
    eventHandler: EventHandler,
    ctx?: any
  ): UnsubscribeHandler {
    return this.subscribe(eventName, eventHandler, Infinity, ctx);
  }
  public off(eventName: string, token: string): void {
    this.unsubscribe(eventName, token);
  }
  public fire(eventName: string, ...args: any[]): void {
    this.publish(eventName, args);
  }

  // Public interface - extended
  public once(
    eventName: string,
    eventHandler: EventHandler,
    ctx?: any
  ): UnsubscribeHandler {
    return this.subscribe(eventName, eventHandler, 1, ctx);
  }
  public exactly(
    eventName: string,
    eventHandler: EventHandler,
    limit = 1,
    ctx?: any
  ): UnsubscribeHandler {
    return this.subscribe(eventName, eventHandler, limit, ctx);
  }

  // Public interface - helpers
  public clear(eventName: string): void {
    this.unpublish(eventName);
  }
  public clearAll(): void {
    this._subscribers.clear();
  }
  public listEvents(): any[] {
    return [...this._subscribers.entries()];
  }
  public listEventSubscribers(eventName: string): any[] {
    return [...(this._subscribers.get(eventName)?.entries() || [])];
  }
}
