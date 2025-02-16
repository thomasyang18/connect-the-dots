import { globalState } from "./global_state.js";
import { doIntersect } from "./utils.js";

/* returns a pair [x, y], or None */

/**
 * Returns a recommended edge [a, b] (with a < b) according to the simplified strategy:
 *
 * For each node i, consider all nodes j (j ≠ i) that:
 *   - Are not already connected by a user connection.
 *   - Do not create an edge (i, j) that directly intersects any user connection edge.
 *   - Have a color different from node i.
 *
 * If such a set for node i is nonempty, return an edge (i, j) from that set.
 * If no such recommendation exists, return null.
 *
 * @param {object} state - The state object containing:
 *    - n: number of nodes
 *    - colors: an array of colors for each node
 *    - userConnections: an array of user-drawn edges, each as [u, v] (with u < v)
 * @returns {[number, number] | null} - A recommended edge as [a, b] with a < b, or null if none found.
 */
function globalRec(state) {
    const n = state.n;
  
    // Loop over every node i.
    for (let i = 0; i < n; i++) {
      let potentialSet = [];
        let bad = false;
      // Consider every other node j.
      for (let j = 0; j < n; j++) {
        if (j === i) continue;
  
        // Ensure the edge is represented in sorted order.
        const a = Math.min(i, j);
        const b = Math.max(i, j);
  
        // 1. Check that (a, b) is not already a user connection.
        const exists = state.userConnections.some(
          ([u, v]) => u === a && v === b
        );
        if (exists) continue;
  
        // 2. Check that (i, j) does not directly intersect any user connection.
        let intersects = false;
        for (const [u, v] of state.userConnections) {
          if (doIntersect(i, j, u, v, n)) {
            intersects = true;
            break;
          }
        }
        if (intersects) continue;
  
        // 3. Check that node j's color is different from node i's color.
        if (state.colors[i] === state.colors[j]) bad = true;
  
        // j is a valid candidate.
        potentialSet.push(j);
      }

      if (bad) continue;
  
      // If there is at least one candidate for node i, return the edge.
      if (potentialSet.length > 0) {
        const chosen = potentialSet[0];
        return [Math.min(i, chosen), Math.max(i, chosen)];
      }
    }
  
    // No valid recommendation was found.
    return null;
  }
  
  
  function localRec(state) {
    /*
        Loop over all triplets (i, j, k).
        For each triplet, if exactly two of the three edges are present (either as user or freebie connection),
        then check if the missing edge can be connected.
        The connection is allowed only if the colors of the two endpoints differ.
        If so, return that missing edge (with endpoints in sorted order).
        If no such edge is found, return null.
    */
    for (let i = 0; i < state.n; i++) {
      for (let j = i + 1; j < state.n; j++) {
        for (let k = j + 1; k < state.n; k++) {
          // Define the three edges for the triplet.
          const edges = [
            { vertices: [i, j], exists: false },
            { vertices: [j, k], exists: false },
            { vertices: [k, i], exists: false }
          ];
          
          // Count how many edges are present.
          let count = 0;
          for (let edge of edges) {
            const [a, b] = edge.vertices;
            const sortedA = Math.min(a, b);
            const sortedB = Math.max(a, b);
            const existsInUser = state.userConnections.some(
              ([u, v]) => u === sortedA && v === sortedB
            );
            const existsInFreebie = state.freebieConnections.some(
              ([u, v]) => u === sortedA && v === sortedB
            );
            if (existsInUser || existsInFreebie) {
              edge.exists = true;
              count++;
            }
          }
          
          // If exactly two edges exist, the missing edge is our candidate.
          if (count === 2) {
            const missingEdgeObj = edges.find(edge => !edge.exists);
            if (missingEdgeObj) {
              const [a, b] = missingEdgeObj.vertices;
              // Check that the colors of the endpoints differ.
              if (state.colors[a] !== state.colors[b]) {
                return [Math.min(a, b), Math.max(a, b)];
              }
            }
          }
        }
      }
    }
    return null;
  }
  
export {globalRec, localRec};
