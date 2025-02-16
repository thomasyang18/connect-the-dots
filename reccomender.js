import { globalState } from "./global_state";

/* returns a pair [x, y], or None */

/**
 * Given the current state (with fields n, colors, userConnections, freebieConnections, etc.)
 * returns a recommended edge [a, b] (with a < b) if there is a subpolygon in which a vertex
 * has a unique color, connecting that vertex to some nonadjacent vertex in that face.
 * Otherwise returns null.
 */
function globalRec(state) {
    const n = state.n;
  
    // Compute positions for vertices on a unit circle.
    const positions = [];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n;
      positions.push({ x: Math.cos(angle), y: Math.sin(angle) });
    }
  
    // Build an adjacency list from freebie and user connections.
    // (Note: freebieConnections may not always be stored with smaller index first.)
    const adj = Array.from({ length: n }, () => new Set());
    const addEdge = (u, v) => {
      adj[u].add(v);
      adj[v].add(u);
    };
    for (const [u, v] of state.freebieConnections) {
      addEdge(u, v);
    }
    for (const [u, v] of state.userConnections) {
      addEdge(u, v);
    }
  
    // For each vertex, sort its neighbors in clockwise order based on the vertex's position.
    const sortedAdj = [];
    for (let i = 0; i < n; i++) {
      let neighbors = Array.from(adj[i]);
      neighbors.sort((a, b) => {
        // Compute angle from vertex i to neighbor.
        const angleA = Math.atan2(positions[a].y - positions[i].y, positions[a].x - positions[i].x);
        const angleB = Math.atan2(positions[b].y - positions[i].y, positions[b].x - positions[i].x);
        return angleA - angleB;
      });
      sortedAdj[i] = neighbors;
    }
  
    // Use the face traversal algorithm to extract all faces.
    // We keep track of visited directed edges so that each face is found once.
    const faces = [];
    const visitedEdges = new Set();
    for (let u = 0; u < n; u++) {
      for (const v of sortedAdj[u]) {
        const edgeKey = `${u},${v}`;
        if (visitedEdges.has(edgeKey)) continue;
  
        const face = [];
        let cur = u;
        let nxt = v;
        // Walk around the face.
        while (true) {
          visitedEdges.add(`${cur},${nxt}`);
          face.push(cur);
  
          // At vertex 'nxt', find the neighbor just *before* 'cur' in the sorted order.
          const neighbors = sortedAdj[nxt];
          const idx = neighbors.indexOf(cur);
          const prevIdx = (idx - 1 + neighbors.length) % neighbors.length;
          const nextVertex = neighbors[prevIdx];
  
          cur = nxt;
          nxt = nextVertex;
          if (cur === u && nxt === v) break;
        }
        faces.push(face);
      }
    }
  
    // Helper to check if an edge already exists (either as a freebie or a user edge).
    function edgeExists(u, v) {
      const a = Math.min(u, v);
      const b = Math.max(u, v);
      for (const [x, y] of state.freebieConnections) {
        if (Math.min(x, y) === a && Math.max(x, y) === b) return true;
      }
      for (const [x, y] of state.userConnections) {
        if (Math.min(x, y) === a && Math.max(x, y) === b) return true;
      }
      return false;
    }
  
    // Iterate over all faces (subpolygons). We ignore triangles because every vertex there is adjacent.
    for (const face of faces) {
      if (face.length < 4) continue;
  
      // Count the occurrence of each color within this face.
      const freq = {};
      for (const v of face) {
        const col = state.colors[v];
        freq[col] = (freq[col] || 0) + 1;
      }
  
      // For each vertex in the face, check if its color is unique.
      for (let i = 0; i < face.length; i++) {
        const v = face[i];
        if (freq[state.colors[v]] !== 1) continue; // not unique in this face
  
        // In the face's cyclic order, the two neighbors of v (the ones immediately before and after)
        // are already connected (either by freebie or a user connection). So, we try to connect v
        // to some other vertex in the face.
        const len = face.length;
        const prev = face[(i - 1 + len) % len];
        const next = face[(i + 1) % len];
  
        // Try all other vertices in the face.
        for (const candidate of face) {
          if (candidate === v || candidate === prev || candidate === next) continue;
          if (!edgeExists(v, candidate)) {
            // Return the edge in sorted order.
            return [Math.min(v, candidate), Math.max(v, candidate)];
          }
        }
      }
    }
    // No valid recommendation was found.
    return null;
  }
  

function localRec(state) {
    /*
        So again, we need to compute sub-polygons, but here we can be a little bit cheeky and simply say,

        "Loop over all triplets (i, j, k). If two of the three are connected, check if the third remaining edge cna beconnected (subject to color constraints and everything ofc.) "
        Which basically amounts ot checking if that third edge's 2 colors are different.

        if so, return that edge.

        Else if couldnt find an edge return none.
    */
    for (let i = 0; i < state.n; i++) {
        for (let j = i + 1; j < state.n; j++) {
            for (let k = j + 1; k < state.n; k++) {
                const edges = [
                    [i, j],
                    [j, k],
                    [k, i]
                ];
                const hasTwoEdges = edges.some(([a, b]) =>
                    state.userConnections.some(conn => (conn[0] === a && conn[1] === b) || (conn[0] === b && conn[1] === a)) ||
                    state.freebieConnections.some(conn => (conn[0] === a && conn[1] === b) || (conn[0] === b && conn[1] === a))
                );
                if (hasTwoEdges) {
                    const thirdEdge = edges.find(([a, b]) =>
                        !state.userConnections.some(conn => (conn[0] === a && conn[1] === b) || (conn[0] === b && conn[1] === a)) &&
                        !state.freebieConnections.some(conn => (conn[0] === a && conn[1] === b) || (conn[0] === b && conn[1] === a))
                    );
                    if (thirdEdge && state.colors[thirdEdge[0]] !== state.colors[thirdEdge[1]]) {
                        return thirdEdge;
                    }
                }
            }
        }
    }
    return null;
}

export {globalRec, localRec};
