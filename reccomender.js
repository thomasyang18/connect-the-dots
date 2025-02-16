import { globalState } from "./global_state.js";
import { doIntersect } from "./utils.js";

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
      Loop over all triplets (i, j, k).
      For each triplet, if exactly two of the three edges are present
      (either as user or freebie connection), then check if the missing edge can be connected.
      The connection is allowed only if the colors of the two endpoints differ.
      If so, return that missing edge (with endpoints in sorted order).
      If no such edge is found, return null.
    */

  
    // Helper function to check if an edge exists (ignoring order)
    function edgeExists(u, v) {
      const a = Math.min(u, v);
      const b = Math.max(u, v);

      // okay i think this freebie shit is my bad, the ai stores freebie connections that actually eixst
      // but like in the actual graph u can just treat it as if all exist
      let n =state.n;

      let freebie = (a + 1) % n == b || (b + 1) % n == a;
      return state.userConnections.some(
        ([x, y]) => x === a && y === b
      ) || freebie;
    }

    console.log(edgeExists(0, 1));
  
    // Loop over all unique triplets (i, j, k) with i < j < k
    for (let i = 0; i < state.n; i++) {
      for (let j = i + 1; j < state.n; j++) {
        for (let k = j + 1; k < state.n; k++) {
          // Check existence of the three edges in the triplet.
          // Note: since i < j < k, the sorted order for each edge is:
          //  [i, j], [j, k], and [i, k].
          const exists_ij = edgeExists(i, j);
          const exists_jk = edgeExists(j, k);
          const exists_ik = edgeExists(i, k);
  
          // Count how many edges already exist.
          const count =
            (exists_ij ? 1 : 0) +
            (exists_jk ? 1 : 0) +
            (exists_ik ? 1 : 0);
  
          // If exactly two edges exist, then the missing edge is our candidate.
          if (count === 2) {
            // Determine which edge is missing and check color constraint.
            if (!exists_ij) {
              if (state.colors[i] !== state.colors[j]) {
                return [i, j]; // i < j already holds.
              }
            } else if (!exists_jk) {
              if (state.colors[j] !== state.colors[k]) {
                return [j, k]; // j < k already holds.
              }
            } else if (!exists_ik) {
              if (state.colors[i] !== state.colors[k]) {
                return [i, k]; // i < k already holds.
              }
            }
          }
        }
      }
    }
  
    // No valid edge found.
    return null;
  }
  
  
export {globalRec, localRec};
