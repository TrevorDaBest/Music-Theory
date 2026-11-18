//Scale Data
let root = "A";
let type = "major-(Ionian)";

let visualize = false;

//Get HTML5 Elements
const pianoView = document.getElementById("piano-view");
const chooseType = document.getElementById("choose-type");
const scaleLabel = document.getElementById("scale");
const findScale = document.getElementById("find-scale");
const scaleNL = document.getElementById("scale-notes");
const visualizeAs = document.getElementById("vis");

//Get Piano View Context
const ctx = pianoView.getContext('2d');

//Play Note
const audioCtx = new (window.AudioContext || window.webKitAudioContext)();

function playTone(f) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(f, audioCtx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

//Piano Dimensions
const pianoW = pianoView.width;
const pianoH = pianoView.height;

//Mouse Position
let mx = -1;
let my = -1;

document.addEventListener('mousemove', (e) => {
    const pianoRect = pianoView.getBoundingClientRect();

    mx = e.clientX - pianoRect.left;
    my = e.clientY - pianoRect.top;
});

let hovering = "-";
let selected = "A";

let hoveringBK = false;
let oldHovering = "-";

var scale = [];

//Scale Options
Object.keys(types).forEach((name) => {
    const o = document.createElement("option");

    o.value = name;
    o.textContent = name.replaceAll('-', ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

    chooseType.appendChild(o);
});

function whiteKeyAt(i) {
    //White Keys
    ctx.fillRect(pianoW * i / wholeNotes.length, 0, pianoW / wholeNotes.length, pianoH);

    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.moveTo(pianoW * (i + 1) / wholeNotes.length, 0);
    ctx.lineTo(pianoW * (i + 1) / wholeNotes.length, pianoH);
    ctx.stroke();

    //White Key Label
    ctx.fillStyle = "black";
    ctx.font = "25px monospace";

    ctx.fillText(wholeNotes[i], pianoW * (i + 0.5) / wholeNotes.length, pianoH * 0.9);
}

function blackKeyAt(i) {
    //Black Keys
    ctx.fillRect(pianoW * (i + 0.75) / wholeNotes.length, 0, 0.5 * pianoW / wholeNotes.length, pianoH * 0.5);

    //Black Key Label
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";

    ctx.fillText(`${wholeNotes[i]}#`, pianoW * (i + 1) / wholeNotes.length, pianoH * 0.4);
    ctx.fillText(`${wholeNotes[(i + 1) % wholeNotes.length]}b`, pianoW * (i + 1) / wholeNotes.length, pianoH * 0.3);
}

function generateSM(clef, key, notes) {  
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000ff";

    for (let i = 0; i < 5; i++) {
        ctx.beginPath();

        ctx.moveTo(0, pianoH / 10 + (pianoH * i) / 5)
        ctx.lineTo(pianoW, pianoH / 10 + (pianoH * i) / 5);
        ctx.stroke();
    }

    var b;
    switch (clef) {
        case "&":
            b = 'E';
            break;
        case "?":
            b = 'G';
            break;
    }

    for (let i = 0; i < Object.keys(key).length; i++) {
        ctx.font = "50px monospace";
        const note = Object.keys(key)[i].charAt(0);
        let staffPosition =
            (wholeNotes.indexOf(note) - wholeNotes.indexOf(b) + wholeNotes.length - 1) % (wholeNotes.length - 1);

        if (staffPosition == 0 | staffPosition == 1) {
            staffPosition += wholeNotes.length - 1;
        }

        const y = pianoH * 0.9 - staffPosition * (pianoH / 10);

        ctx.fillText(key[Object.keys(key)[i]], pianoW * (0.3 + 0.03 * (i % 3)), y);
    }

    // Draw scale notes and their individual accidentals
    const noteCount = notes.length;
    const notesStartX = pianoW * 0.4;
    const notesEndX = pianoW * 0.96;
    const noteSpacing = noteCount > 1
        ? (notesEndX - notesStartX) / (noteCount - 1)
        : 0;

    for (let i = 0; i < noteCount; i++) {
        const note = notes[i];
        const letter = note.charAt(0);
        const accidental = note.charAt(1);

        let staffPosition = (wholeNotes.indexOf(note.charAt(0)) - wholeNotes.indexOf(b) + wholeNotes.length - 1) % (wholeNotes.length - 1);

        const y = pianoH * 0.9 - staffPosition * (pianoH / 10);
        const x = noteCount === 1
            ? (notesStartX + notesEndX) / 2
            : notesStartX + noteSpacing * i;

        // Draw the accidental immediately before its note
        ctx.font = "25px monospace";

        if (accidental != key[letter] && !(accidental == "" && !key[letter])) {
            key[letter] = accidental;

            if (accidental == "") {
                ctx.fillText("♮", x - 17, y);
            } else {
                ctx.fillText(accidental, x - 22, y);
            }
        }

        // Draw the notehead
        ctx.font = "50px monospace";
        ctx.fillText("O", x, y);
    }

    ctx.font = "200px monospace";
    ctx.fillText(clef, pianoW * 0.15, pianoH / 2);
}

function tablautre(scale, render) {
    //Render TAB lines
    if (render) {
        ctx.fillStyle = "#000000ff";

        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(0, pianoH * (0.9 - 0.8 * i/5));
            ctx.lineTo(pianoW, pianoH * (0.9 - 0.8 * i/5));
            ctx.stroke();
        }

        ctx.font = "80px monospace";
        ctx.fillText("T", pianoW * 0.1, pianoH * 0.2);
        ctx.fillText("A", pianoW * 0.1, pianoH * 0.5);
        ctx.fillText("B", pianoW * 0.1, pianoH * 0.8);
    }

    //Get Strings
    const strings = ['E','A','D','G','B','E'];

    let str = 0;

    // 1. Get the index first (and handle if it's not found)
    let idx = notesSharps.indexOf(scale[0]);
    if (idx === -1) {
        idx = notesFlats.indexOf(scale[0]);
    }

    // 2. Run clean, predictable range checks
    if (idx >= 7 && idx <= 11) {
        str = 0;
    } else if (idx >= 0 && idx <= 4) {
        str = 1;
    } else {
        str = 2;
    }

    var stringFrets = [];
    for (let k = 0; k < 2; k++) {
        if (k == 1) {
            scale.push(scale[0]);
        }
        
        for (let i = 0; i < scale.length; i++) {
            var fret;

            if (notesSharps.indexOf(scale[i]) != -1) {
                fret = notesSharps.indexOf(scale[i]) - notesSharps.indexOf(strings[str]);
            } else if (notesFlats.indexOf(scale[i]) != -1) {
                fret = notesFlats.indexOf(scale[i]) - notesFlats.indexOf(strings[str]);
            } else {
                fret = notesSharps.indexOf(specialToNorm[scale[i]]) - notesSharps.indexOf(strings[str]);
            }

            //String
            if (fret < 0) {
                fret += notesSharps.length;
            }

            if (fret >= 5 && str != 3 && str != 5) {
                str++;
                fret -= 5;
            } else if (fret >= 4 && str == 3) {
                str++;
                fret -= 4;
            }

            stringFret = [str, fret];

            ctx.font = "30px monospace";

            if (render) {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(stringFret[1], pianoW * (0.3 + (i + k * scale.length) * 0.6 / (2 * scale.length)), pianoH * (0.9 - 0.8/5 * stringFret[0]));
            }

            stringFrets.push(stringFret);
        }
    }
    scale.pop();

    if (!render) return stringFrets;
}

//Render Piano
function renderPiano() {
    ctx.clearRect(0,0,pianoW,pianoH);

    ctx.textAlign = "center";
    oldHovering = hovering;

    pianoView.style.background = "#ffffffff";

    for (let i = 0; i < wholeNotes.length; i++) {
        //White Key AABB Hover Check
        ctx.fillStyle = "#ffffffff";
        if (!visualize) {
            if (
                mx >= i * pianoW / wholeNotes.length &&
                mx <= (i + 1) * pianoW / wholeNotes.length &&
                my >= 0 &&
                my <= pianoH &&
                !hoveringBK
            ) {
                hovering = wholeNotes[i];
                ctx.fillStyle = "#888888ff";
            } else {
                ctx.fillStyle = "#ffffffff";
            }

            //Selected
            if (selected == wholeNotes[i]) {
                ctx.fillStyle = "#777777ff";
            }

            //White Keys
            whiteKeyAt(i);
        }
    }

    //Black Keys
    for (let i = 0; i < wholeNotes.length; i++) {
        if (sharps.indexOf(`${wholeNotes[i]}#`) !== -1 && i != wholeNotes.length - 1) {
            // Black Key AABB Hover Check
            ctx.fillStyle = "#000000ff";
            if (!visualize) {
                if (
                    mx >= pianoW * (i + 1) / wholeNotes.length &&
                    mx <= pianoW * (i + 1.5) / wholeNotes.length &&
                    my >= 0 &&
                    my <= pianoH * 0.5
                ) {
                    ctx.fillStyle = "#777777ff";
                    hoveringBK = true;
                    hovering = `${wholeNotes[i]}#`;
                } else {
                    ctx.fillStyle = "#000000ff";

                    if (`${wholeNotes[i]}#` == oldHovering) {
                        hoveringBK = false;
                    }
                }

                //Selected
                if (selected == `${wholeNotes[i]}#`) {
                    ctx.fillStyle = "#666666ff";
                }

                //Black Keys
                blackKeyAt(i);
            }
        }
    }

    if (visualize) {
        const key = scale.reduce((acc, note) => {
                            const accidental = note.charAt(1);
                            if (accidental === "#" || accidental === "b") {
                                acc[note.charAt(0)] = accidental; // Fixed: Use bracket notation
                            }
                            return acc;
                        }, {});

        switch (visualizeAs.value) {
            case "treble": {
                generateSM("&", key, scale);
                break;
            }

            case "bass": {
                generateSM("?", key, scale);
                break;
            }

            case "tabs": {
                tablautre(scale, true);
                break;
            }

            case "piano": {
                for (let i = 0; i < wholeNotes.length; i++) {
                    ctx.fillStyle = "#ffffffff";

                    //White Keys
                    whiteKeyAt(i);

                    //Get Interval
                    ctx.fillStyle = "red";
                    if (scale.indexOf(wholeNotes[i]) != -1) {
                        ctx.fillText(scale.indexOf(wholeNotes[i]) + 1, pianoW * (i + 0.5) / wholeNotes.length, pianoH * 0.7);
                    } else if (specialMaps[wholeNotes[i]]) {
                        if (scale.indexOf(specialMaps[wholeNotes[i]]) != -1) {
                            ctx.fillText(scale.indexOf(specialMaps[wholeNotes[i]]) + 1, pianoW * (i + 0.5) / wholeNotes.length, pianoH * 0.7);
                        }
                    }
                }

                for (let i = 0; i < wholeNotes.length; i++) {
                    ctx.fillStyle = "#000000ff";

                    //White Keys
                    if (sharps.indexOf(`${wholeNotes[i]}#`) !== -1 && i != wholeNotes.length - 1) {
                        blackKeyAt(i);

                        //Get Interval
                        ctx.fillStyle = "rgb(255, 142, 142)";
                        if (scale.indexOf(`${wholeNotes[i]}#`) != -1) {
                            ctx.fillText(scale.indexOf(`${wholeNotes[i]}#`) + 1, pianoW * (i + 1) / wholeNotes.length, pianoH * 0.2);
                        } else if (scale.indexOf(`${wholeNotes[(i + 1) % 12]}b`) != -1) {
                            ctx.fillText(scale.indexOf(`${wholeNotes[(i + 1) % 12]}b`) + 1, pianoW * (i + 1) / wholeNotes.length, pianoH * 0.2);
                        }
                    }
                }

                break;
            }

            case "guitar": {
                pianoView.style.background = "#634319ff";

                //Render Frets
                ctx.fillStyle = "brown";
                ctx.fillRect(0.05 * pianoW, 0, 0.05 * pianoW, pianoH);
                ctx.strokeStyle = "#6a6a6aff";
                for (let i = 0; i < 4; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0.2 * (1 + i) * pianoW, 0);
                    ctx.lineTo(0.2 * (1 + i) * pianoW, pianoH);
                    ctx.stroke();
                }


                //Render Strings
                ctx.strokeStyle = "#aaaaaaff";

                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, pianoH * (0.9 - 0.8 * i/5));
                    ctx.lineTo(pianoW, pianoH * (0.9 - 0.8 * i/5));
                    ctx.stroke();
                }

                //Get the strings and frets
                const stringFret = tablautre(scale, false);
                
                ctx.font = "40px monospace";
                ctx.fillStyle = "#331100ff";

                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                for (let i = 0; i < stringFret.length; i++) {
                    let x = 0.2 * stringFret[i][1] * pianoW
                    if (stringFret[i][1] == 0) {
                        x = 0.07 * pianoW
                    }

                    ctx.fillText(i % (scale.length) + 1, 
                    x, pianoH * (0.9 - 0.8 * stringFret[i][0]/5));
                }

                break;
            }
        }
    }

    //Loop Render
    window.requestAnimationFrame(renderPiano);
}

//Select Root Note
document.addEventListener('click', (e) => {
    if (
        mx >= 0 &&
        mx <= pianoW &&
        my >= 0 &&
        my <= pianoH &&
        !visualize
    ) {
        selected = hovering;

        //Set Root
        switch (hovering) {
            case "D#":
                root = "Eb";
                break;
            case "G#":
                root = "Ab";
                break;
            case "A#":
                root = "Bb";
                break;
            default:
                root = hovering;
                break;
        }

        scaleLabel.textContent = `Finding: ${root} ${type
            .replaceAll('-', ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}`;
        playTone(440 * Math.pow(2, notesSharps.indexOf(selected) / 12));
    }
});

//Select Type
chooseType.addEventListener('change', (e) => {
    type = e.target.value;
    scaleLabel.textContent = `Finding: ${root} ${type
    .replaceAll('-', ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')}`
});

//Find Scale
findScale.addEventListener('click', (e) => {
    if (!visualize) {
        const rootInt = notesSharps.indexOf(selected);
        const intervals = types[type];
        scale = getScale(rootInt, intervals);

        scaleNL.textContent = "";
        for (let i = 0; i < scale.length; i++) {
            if (i < scale.length - 1) {
                scaleNL.textContent += `${scale[i]} - `;
            } else {
                scaleNL.textContent += scale[i];
            }
        }

        findScale.textContent = "Choose Scale";
    } else {
        scaleNL.textContent = "";
        findScale.textContent = "Find Scale";
    }

    visualize = !visualize
});

renderPiano();