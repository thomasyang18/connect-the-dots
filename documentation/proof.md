# Proof 

Notice that if you operate only on consecutive triplet of nodes, you can think about the problem as "shrinking" the polygon by 1! 

In particular, if you have nodes [a, b, c], if color[a] != color[c], you can delete node b. 

We're going to make operations on the polygon that only contracts triplets of nodes, so you can iteratively make a smaller polygon. 

My argument is basically that, for N > 4, as long as you have >= 3 distinct colors, there will always be a triplet of nodes such that, after contracting this node, you retain >= 3 colors in the original graph. 

For N = 4, you can verify that in all combinations of nodes with 3 distinct colors among them, you can add an edge there. 

For N > 4, let's first notice that, if we assume that two nodes are effectively the same color, that only *restricts* the set of operations we can do. So let's just pick 3 important colors, and then make everything else the 3rd color, so we're effectively dealing with 3 colors now. (Remember, saying that two nodes are teh same color, even when they aren't only *restricts* our set of moves.)

we notice that if the pattern

[a, a, b] appears (recall that this is a circular array as well), we can delete [a, _, b] and we don't erase a color. 

[a, b, c] appears, we can delete [a, _, c]

But what if neither doesn't appear? This is impossible; the only possible array would be 

[a b a b a b a b a b a b]... but WE HAVE A THIRD COLOR!

This means at some ponit, we will run out of colors, and we either need to make duplicate colors appear, OR make [a, b, c], so contradiction.

