import { LinkId, NodeId } from "./Identity";

export class Link {
  private _id: LinkId;
  private _fromNodeId: NodeId;
  private _toNodeId: NodeId;
  private _data: any;

  constructor(id: string, fromNodeId: NodeId, toNodeId: NodeId, data?: any) {
    this._fromNodeId = fromNodeId;
    this._toNodeId = toNodeId;
    this._id = id;
    this._data = data;
  }
  public get id(): string {
    return this._id;
  }
  public get data(): any {
    return this._data;
  }
  public set data(data: any) {
    this._data = data;
  }
  public get from(): NodeId {
    return this._fromNodeId;
  }
  public get to(): NodeId {
    return this._toNodeId;
  }
}
