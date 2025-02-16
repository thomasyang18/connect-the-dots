import { globalState } from "./global_state";

/* returns a pair [x, y], or None */

function globalRec(state) {
    /*
        If, within a certain sub poylgon node (i) is the ONLY color in that polygon, reccomend (i, any other node in system not already adjacent to i).
        Else return null.
    */
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
