import { MaybeLink } from "./Graph";
import { LinkId, NodeId } from "./Identity";
import { Link } from "./Link";
import { setPropEnumerable } from "./Utils/ClassUtils";
import { uniqueId } from "./Utils/UniqueId";

export class Node {
  private _id: NodeId;
  private _data: any;
  private _links: Map<LinkId, Link> = new Map([]);

  constructor(id: NodeId, data?: any) {
    ["id", "data", "links"].forEach((prop) => setPropEnumerable(this, prop));
    this._id = id;
    this._data = data;
  }
  public get id(): NodeId {
    return this._id;
  }
  public get data(): any {
    return this._data;
  }
  public set data(data: any) {
    this._data = { ...this.data, ...data };
  }
  public get links(): Link[] {
    return [...this._links.values()];
  }
  public addLink(link: Link): void {
    this._links.set(link.id, link);
  }
  public getLink(linkId: LinkId): MaybeLink {
    return this._links.get(linkId)
  }
}
