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
}

export {globalRec, localRec};