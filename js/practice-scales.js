//Make Tree of all Scales
var scaleMatrix = {};
const typesList = Object.keys(types);

for (let i = 0; i < notesSharps.length; i++) {
    //Add scale Name
    if (wholeNotes.indexOf(notesSharps[i]) != -1) {
        scaleMatrix[notesSharps[i]] = {};
    } else {
        scaleMatrix[`${notesSharps[i]}/${notesFlats[i]}`] = {};
    }

    for (var j = 0; j < typesList.length; j++) {
        //Get Scale
        const scale = getScale(i, types[typesList[j]]);

        //Set Value
        if (wholeNotes.indexOf(notesSharps[i]) != -1) {
            scaleMatrix[notesSharps[i]][typesList[j]] = scale;
        } else {
            scaleMatrix[`${notesSharps[i]}/${notesFlats[i]}`][typesList[j]] = scale;
        }
    }
}

//Find scales with # of accidentals
function findScales(al, t) {
    var scalesPos = [];
    Object.keys(scaleMatrix).forEach((name) => {
        Object.keys(scaleMatrix[name]).forEach((type) => { //ITerate through scales
            if (t.indexOf(type) == -1) {
                return;
            }

            const scale = scaleMatrix[name][type];

            //See how much accidentals is in the scale

            let accidentals = 0;
            for (let i = 0; i < scale.length; i++) {
                if (scale[i].length > 1) {
                    accidentals++;
                }
            }

            if (accidentals <= al) {
                scalesPos.push(`${name} ${type}`);
            }
        });
    });

    return scalesPos
}

console.log(findScales(1, ["major-(Ionian)", "natural-minor-(Aeolian)"]))