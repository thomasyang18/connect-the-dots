import { globalState } from "./global_state.js";

const hints = new Map([
    [3, // setting this to three... i want it to be four tho. popup! but whatever
        [
            `3. Hey! Didn't see you there.`,
            `The rules are simple. Don't connect two nodes of the same color, and don't make any line intersect. Capiche? :)`
        ]
    ],
    [6,
        [
            `6. I've noticed something!`,
            `We can keep on cutting off triangles at the 'edges' of the original shape. This way, we can cleanly think about the smaller shapes.`,
            `It's hard to visualize until you see it. Keep on playing, I'll highlight the 'cut off' triangles for you...`
        ]
    ],
    [8,
        [
            `8. Hm. One thing I'm seeing is that, if there's just one color in your sub-polygon(s), you can connect up all the other nodes to that node, for free`,
            `I'll suggest that connection for you if I see it - feel free to do play as normal!`
        ]
    ],
    [10,
        [
            `10. I think I have an observation!.`,
            `So, within each 'sub-polygon', if I see three consecutive nodes (a, b, c), they will form a triangle. And if (color[a] != color[c]), I can connect them!`,
            `I'll start reccomending those moves now.`
        ] /* From here  *disable the reccomender that connects up one node to all other nodes.* Or make this observation higher. */
    ],

    /*
        Unspecified logic here:

        On polygon 13, DO NOT RANDOMLY GENERATE A GRAPH.

        *always give* R, G, R G, R, G .. B And greedily have the algorithm select the (R, B, G) pair, which is *wrong*.

        After this, we want to compose the reccomenders such that, we first will reccomend the single-color 1 shotter,
        and then greedily reccomend (this always works since there exists >=2 copies of every color).

        The text should say something like,

        "Hm. I think we're going to fail this iteration. The rest of the polygon only has two colors; there's not enough room."
        "I think we gotta connect up that one blue node to everything."

        [TODO: what if they're a giganticbrainosity and recognize this? Fine, we can have casework here :)]

        I guess this can't be a const map anymore, we should be able to dynamically change this. (horrible swe practices :D )

        This should be 12, and dynamically allocated.

        ah, never mind. this is too complicated. let's just make it static.
    */
    [13, 
        [
            `13. Hm. I think we're going to fail this iteration, if we take the (Blue, Red, Green) pair I'm suggesting.`,
            `It seems very suboptimal. Maybe my algorithm is wrong?` 
        ]
    ],

    [14,
        [
            `14. Whew, glad that was over. I realized that my algorithm only works if we assume that we don't accidentally kill off a color!`,
            `Thankfully, if there were only 1 color remaining, we could just hook it up to the rest of the nodes.`,
            `I'll add that to my algorithm now - *now* my reccomended edges should always be correct!`
        ]
    ],

    [16,
        [
            `16. Congrats! You beat the game, but feel free to continue playing. You can toggle the dev notes by clicking this message.`
        ]
    ]

    // Add more hints here
]);

function loadHint() {
    // if (globalState.numbersSolved.size == 1) { // only has 3. yes, magic numbers are bad, yes idc. we're already passing around global state anyways lol
    //     return;
    // }

    const hintsDiv = document.getElementById('hints-div');
    hintsDiv.innerHTML = ''; // Clear previous hints

    // Sort the keys and iterate over the map

    let length = hints.size;
    for (let i = 3; i <= Math.max(...globalState.numbersSolved) + 1; i += 1) {
        if (hints.has(i)) {
            length -= 1;
            // console.log(length);
            for (const str of hints.get(i)) {
                const hintElement = document.createElement('div');
                hintElement.classList.add('hint');
                hintElement.textContent = str;
                if (length === 0) {
                    hintElement.style.cursor = 'pointer';
                    hintElement.addEventListener('click', () => {
                        console.log("WAT");
                        globalState.win = true;
                        document.getElementById('dev-message-div').style.display = 'block';
                        document.getElementById('hints-div').style.display = 'none';
                    });
                }
                hintsDiv.appendChild(hintElement);
            }   
        }
    } 
}

export { loadHint, hints }
