# Graph implementation with Typescript support.

I needed a graph library with Typescript support, as it often happens I could not find an exact match and decided to create my own.

The library implements an extended adjacent list algorithm. It might use a bit more memory in order to keep the additional information as trade off for more simplified graph operations.

The core graph class also implements a simple event emitter. This allows a simple notification in graph changes. It is a useful feature for integrating the library with other modules. For example I used this library in Vue-based flow-editor for updating reactive states: 

```js
const graph = new Graph({ opEvents: true });
const vertices = shallowRef(graph.vertices);
const edges = shallowRef(graph.nodes);

graph.on('changed', () => {
  vertices.value = graph.vertices;
  edges.value = graph.edges;
});

```

## Installation
Add the library to your project either as a **Commonjs** module

```html
<script src=""></script> 
```

Or as an ES module. Install first, using **npm**

```sh
npm install graph-typescript
```

using **yarn**
```sh
yarn add graph-typescript
```

Then import the module
```js
import { Graph } from 'graph-typescript'

...

const Graph = require('graph-typescript')
```

## Usage

The library exposed three classes **Graph**, **Vertex(node)**, and **Edge(link)**

**Graph** class exposes all necessary methods for creating, updating or removing edges/vertices directly on the graph.

Altertantively, **Vertex** and **Edge** classes can be used to instanciate new vertices or edges separetly however new instances must be added to the graph using either **addVertex** or **addEdge** methpds.
It might be handy when you need to provision a temporally instance, e.g. a temporary edge between two vertices. Once the new instance is validated and confirmed it can be added to the graph. 

## More exemples

