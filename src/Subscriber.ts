export type EventHandler = (...args: any[]) => void;

export interface Subscriber {
  token: string;
  counter: number;
  limit: number;
  hanlder: EventHandler;
  ctx?: any;
}