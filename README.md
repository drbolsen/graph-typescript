# Graph implementation with Typescript support.

I needed a graph library with Typescript support, as it often happens I could not find an exact match and decided to create my own.

The library implements an extended adjacent list algorithm. It might use a bit more memory in order to keep the additional information as trade off for more simplified graph operations.

The core graph class also implements a simple event emitter. This allows a simple notification in graph changes. It is a useful feature for integrating the library with other modules. For example I used this library in Vue-based flow-editor <link>
`code`
const graph = new Graph({ opEvents: true })

graph.on('changed', (graph) => {
  graphState.value = graph;
})
`code`

## Installation

## Usage

## More exemples

