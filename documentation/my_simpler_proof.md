Okay, I'm going to guide you to the correct layman's proof structure.

[ I have simplified the problem statement to always use 3 colors; you dont need to mention this.]

Look at the nodes as a polygon (or in this case, since the user has visual access to the polygon, the polygon as a sequence of colored nodes). 

We will only think about operations that draw an edge between three consecutive nodes; this corresponds to 'deleting' the middle node. 

Notice that there are two configurations of colors that we know will always be good:

[r, g, b] -> [r, _, b] Three distinct colors in a row is good. However, we will have to be careful in not deleting b, if b is the *only* color of its type remaining; fortunately, if it is, we know we can connect b with every other node, so this is moot. 

[r, g, g] -> [r, _, g] More generally, if there's any two adjacent nodes that are the same color, we know we can find this type of connection.

So if we think about the types of nodes that can satisfiy this.... well, you can try.

Put 'r'. 

We can't have two consecutive nodes the same, so put 'g'; 'r', 'g'.

We know 'r', 'g', 'g', can't exist, and 'r', 'g', 'b' neither.... so 'r', 'g', 'r'.

And so on.

But you cannot continue this process ad infinitum, because we assume that there is one of every color; at *some* point you will run into 

'r' 'g' 'b'

or

'g' 'r' 'b'

and thus, we know that we must always have one of the two cases listed, until we get to N = 4. But for N = 4, you can verify for yourself that, while you may not preserve the invariant that all 3 colors show up, you can always draw an edge.

Therefore, you can always fix the graph in N-3 moves.

This is what logical deduction is like!
