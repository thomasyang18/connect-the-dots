# Edges left

Recall the original problem statement; 

For M=3 colors, we can prove that the number of "inner edges" can alwways achieve N - 3. So, the number of inner edges max threshhold should be N-3, and then we should decrement from there.

For M=2 colors, This is a quote from the editorial.

```
When only 2 colors were used, then the graph is a bipartite graph so there is no odd cycle and the possible
shortest length of the cycle is 4. Let the number of the blocks C. Then, the upper bound of number of the
chords (including chords between adjacent points) is N − 2 + C/2. This is because if the colors of the points
are alternating, then C = N and the maximum number of chords is 3N/2 − 2 by Euler’s formula. And it is
not difficult to find way to construct N − 2 + C/2 chords.
```

For this, you need to count the number of solid border freebie edges; these are considered in the upper bound. Then, you need to subtract off, in this case:

N - 2 + floor(C)/2 - (freebie_edges) - (# real user edges made.)