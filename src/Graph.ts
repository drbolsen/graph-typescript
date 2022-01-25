import { Events } from "./Events";
import { LinkId, NodeId } from "./Identity";
import { Link } from "./Link";
import { Node } from "./Node";
import { uniqueId } from "./Utils/UniqueId";

export type MaybeNode = Node | undefined;
export type MaybeLink = Link | undefined;

export class Graph extends Events {
  private _nodes: Map<NodeId, Node> = new Map();
  private _links: Map<LinkId, Link> = new Map();
  private _multiEdge: Map<LinkId, Set<number>> = new Map();
  private _suspendEvents = 0;
  private _multiGraph: boolean;

  constructor(options: any = {}) {
    super();
    const { multiGraph = false } = options;

    this._multiGraph = multiGraph;
  }
  private disableChanges() {
    this._suspendEvents += 1;
  }
  private enableChanges() {
    this._suspendEvents -= 1;
  }

  public hasNode(nodeId?: NodeId): boolean {
    return !nodeId ? false : this._nodes.has(nodeId);
  }
  public getNode(nodeId: NodeId): MaybeNode {
    return this._nodes.get(nodeId);
  }
  public getNodeCount(): number {
    return this._nodes.size;
  }
  public getNodeLinks(nodeId: NodeId): Link[] {
    return this.hasNode(nodeId) ? (this.getNode(nodeId) as Node).links : [];
  }

  public hasLink(linkId?: string): boolean {
    return !linkId ? false : this._links.has(linkId);
  }
  public getLink(linkId: string): MaybeLink {
    return this._links.get(linkId);
  }
  public getLinkCount(): number {
    return this._links.size;
  }

  public addNode(nodeId?: NodeId, data?: any): Node {
    this.disableChanges();
    const isNodeExist: boolean = this.hasNode(nodeId);

    const node = isNodeExist
      ? (this.getNode(nodeId as string) as Node)
      : new Node(nodeId || uniqueId());

    node.data = data;
    this._nodes.set(node.id, node);

    this.recordNodeEvent(node, isNodeExist ? "update" : "add");

    this.enableChanges();

    return node;
  }
  public addLink(fromNodeId: string, toNodeId: string, data?: any): Link {
    this.enableChanges();

    const fromNode = this.hasNode(fromNodeId)
      ? (this.getNode(fromNodeId) as Node)
      : this.addNode(fromNodeId);
    const toNode = this.hasNode(toNodeId)
      ? (this.getNode(toNodeId) as Node)
      : this.addNode(toNodeId);

    const multiEdgeLinkIdx = Graph.makeLinkId(fromNode.id, toNode.id);
    // No previous multi edge exists
    if (!this._multiEdge.has(multiEdgeLinkIdx)) {
      this._multiEdge.set(multiEdgeLinkIdx, new Set([]));
    }

    const idx = this._multiEdge.get(multiEdgeLinkIdx)?.size as number;
    this._multiEdge.get(multiEdgeLinkIdx)?.add(idx);
    const linkId = Graph.makeLinkId(
      `${fromNode.id}@${idx}`,
      `${toNode.id}@${idx}`
    );

    const isExist = this._links.has(linkId);
    const link = isExist
      ? (this._links.get(linkId) as Link)
      : new Link(linkId, fromNode.id, toNode.id, data);

    link.data = data;

    this._links.set(linkId, link);
    fromNode.addLink(link);
    if (fromNode.id !== toNode.id) {
      toNode.addLink(link);
    }
    this.recordLinkEvent(link, isExist ? "update" : "add");

    this.disableChanges();
    return link;
  }

  removeNode(nodeId?: string): boolean {
    if (!nodeId || !this.hasNode(nodeId)) return false;

    this.enableChanges();

    const links = this.getNode(nodeId)?.links;

    links?.forEach((link) => {});

    this.disableChanges();
    return true;
  }

  removeLink(): void {}

  private removeLinkInstance(): void {}

  getLinks(): void {}
  forEachNode(): void {}
  forEachLinkedNode(): void {}
  forEachLink(): void {}
  startUpdate(): void {}
  finshUpdate(): void {}
  clear(): void {}
  private recordNodeEvent(node: Node, eventName: string) {}
  private recordLinkEvent(link: Link, eventName: string) {}

  private static makeLinkId(fromNodeId: NodeId, toNodeId: NodeId): string {
    return `${fromNodeId}=>${toNodeId}`;
  }
}
