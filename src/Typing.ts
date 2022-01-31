import { GraphError } from "./Error";
import { Edge } from "./Edge";
import { Vertex } from "./Vertex"

 type BuildTuple<
  Current extends [...T[]],
  T,
  Count extends number
> = Current["length"] extends Count
  ? Current
  : BuildTuple<[T, ...Current], T, Count>;
export type Tuple<T, Count extends number> = BuildTuple<[], T, Count>;

export type GraphCell = Vertex | Edge;
export type GraphOpResult = [GraphError?, GraphCell?]