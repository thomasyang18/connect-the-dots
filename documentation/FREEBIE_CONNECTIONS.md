# WHAT ARE FREEBIE EDGES?

First of all, recall the original problem statement. We can actually treat this as a circular polygon; now, edges between adjacent nodes (including 0 and n-1) are "freebies", only if they have different colors.

If they have the same color, add a dashed line between two nodes; otherwise add a solid line. Note that the mechanism for drawing the dashed and solid lines should use the same underlying drawing library, however; REAL USER EDGES have much different semantics so you should not treat them the same (e.g. real user edges are deletable with that red circle thing in the middle). 

