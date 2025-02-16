import { globalState } from "./global_state.js";

const hints = new Map([
    [3, // setting this to three... i want it to be four tho. popup! but whatever
        [
            `3. Hey! Didn't see you there. Welcome to my game!`,
            `The rules are simple. Click two nodes to connect them. Don't connect two nodes of the same color, and don't make any line intersect. 
            Try to make as many lines as possible. Capiche? :)`
        ]
    ],
    [6,
        [
            `6. I've noticed something that might help! The polygon is split into shapes; but the triangles are kind of useless, aren't they?
            Like, you can't even fit any more lines in the triangles.`,
            `Keep on playing, I'll highlight the triangles for you...`
        ]
    ],
    [8,
        [
            `8. Hm. One thing I'm seeing is that, if there's just one color in your sub-polygon, you can connect up all the dots, for free.
            I mean, it sounds so obvious that it doesn't even seem useful - how often does that even happen??
            `,
            `But I'll suggest that connection for you in red if I see it - I'm the computer after all, I'm good at these simple automatic rules. 
            Feel free to do play as normal! I'm only giving suggestions.`
        ]
    ],
    [10,
        [
            `10. I think I have an observation!.`,
            `So, within each sub-polygon, if I see three consecutive nodes (a, b, c): 
            We know that the lines (a, b) and (b, c) exist. If I add (a, c), this forms a triangle. 
            If they're not the same color, I can connect them!`,
            `I'll start reccomending those moves now - hopefully it makes it clear what I'm thinking about. Hopefully I didn't miss anything...`
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
            `14. Whew, glad that was over. I realized that, I have to check for observation 8 *first*, THEN observation 10.`,
            `Well... that's my hope, anyways. I haven't proved it. I'm just messing around.`,
        ]
    ],

    [16,
        [
            `16. Congrats! You beat the game, but feel free to continue playing. You can toggle the dev notes by clicking the green message.`,
            `The final algorithm is indeed correct, which might seem surprising! The high level details are in the dev notes :)`
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
            let number = 0;
            for (const str of hints.get(i)) {
                const hintElement = document.createElement('div');
                hintElement.classList.add('hint');

                if (number == 0) {
                    hintElement.style.backgroundColor = 'yellow';
                }
                number += 1;

                hintElement.textContent = str;

                // console.log(" WTF " + length + " " + number + " " + hints.get(i).length);

                if (length === 0 && number === hints.get(i).length) {
                    hintElement.style.cursor = 'pointer';
                    hintElement.addEventListener('click', () => {
                        console.log("WAT");
                        globalState.win = true;
                        document.getElementById('dev-message-div').style.display = 'block';
                        document.getElementById('hints-div').style.display = 'none';
                    });
                    hintElement.style.backgroundColor = "lightgreen";
                }
                hintsDiv.appendChild(hintElement);
            }   
        }
    } 
}

export { loadHint, hints }
