//Music Variables/Classes
const wholeNotes = ['A','B','C','D','E','F','G', 'A'];
const sharps = ['A#','C#','D#','F#','G#'];

//Notes
const notesSharps = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'];
const notesFlats = ['A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab'];
const specialMaps = {
    "C": "B#",
    "E": "Fb",
    "F": "E#",
    "B": "Cb"
};
const specialToNorm = {
    "B#": "C",
    "Fb": "E",
    "E#": "F",
    "Cb": "B"
};

//Scale Types and Intervals
const types = {
    "major-(Ionian)": [0,2,2,1,2,2,2],
    "natural-minor-(Aeolian)": [0,2,1,2,2,1,2],
    "harmonic-major": [0,2,2,1,2,1,3],
    "harmonic-minor": [0,2,1,2,2,1,3],
    "pentatonic-major": [0,2,2,3,2],
    "pentatonic-minor": [0,3,2,2,3],
    "melodic-major-(Descending)": [0,2,2,1,2,1,2],
    "melodic-minor-(Ascending)": [0,2,1,2,2,2,2],
    "dorian": [0,2,1,2,2,2,1],
    "phrygian": [0,1,2,2,2,1,2],
    "lydian": [0,2,2,2,1,2,2],
    "mixolydian": [0,2,2,1,2,2,1],
    "locrian": [0,1,2,2,1,2,2],
    "chromatic": [0,1,1,1,1,1,1,1,1,1,1,1]
};

//Find Scale
function getScale(root, intervals) {
    let n = root;
    let ls = wholeNotes.indexOf(notesSharps[root].charAt(0));
    let lf = wholeNotes.indexOf(notesFlats[root].charAt(0));
    let scaleS = [];
    let scaleF = [];

    //Get Scale Sharp + Flat
    for (let i = 0; i < intervals.length; i++) {
        n += intervals[i];
        scaleS.push(notesSharps[n % 12]);
        scaleF.push(notesFlats[n % 12]);
    }

    if (scaleS.length == wholeNotes.length - 1) {
        //Check Sharp VS Flat
        if (
            scaleS.length == wholeNotes.length - 1 &&
            scaleS.map(n => n.charAt(0)).every((value, i) => value == wholeNotes[(i + ls) % (wholeNotes.length - 1)])
        ) {
            return scaleS;
        } else if (
            scaleF.length == wholeNotes.length - 1 &&
            scaleF.map(n => n.charAt(0)).every((value, i) => value == wholeNotes[(i + lf) % (wholeNotes.length - 1)])
        ) {
            return scaleF;
        }

        //Anomalies

        //Change according to standardness
        let su = false;
        for (let i = 0; i < wholeNotes.length - 1; i++) {
            if (scaleS[i].charAt(0) != wholeNotes[(i + ls) % (wholeNotes.length - 1)]) {
                if (specialMaps[scaleS[i]]) {
                    scaleS[i] = specialMaps[scaleS[i]];
                } else {
                    su = true;
                }
            }
        }
        if (!su) return scaleS;

        for (let i = 0; i < wholeNotes.length - 1; i++) {
            if (scaleF[i].charAt(0) != wholeNotes[(i + lf) % (wholeNotes.length - 1)]) {
                if (specialMaps[scaleF[i]]) {
                    scaleF[i] = specialMaps[scaleF[i]];
                } else {
                    scaleF[i] = notesSharps[notesFlats.indexOf(scaleF[i])];
                }
            }
        }

        return scaleF;
    } else {
        return scaleS;
    }
}