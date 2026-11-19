//HTML5 Elements
const beg = document.getElementById("beg");
const int = document.getElementById("int");
const adv = document.getElementById("adv");
const exp = document.getElementById("exp");

const scaleDisp = document.getElementById("scale");
const reroll = document.getElementById("restart");

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

const begScales = findScales(1, ["major-(Ionian)", "natural-minor-(Aeolian)", "pentatonic-major", "pentatonic-minor"]);
const intScales = findScales(3, ["major-(Ionian)", "natural-minor-(Aeolian)", "pentatonic-major", "pentatonic-minor"]);
const advScales = findScales(6, ["major-(Ionian)", "natural-minor-(Aeolian)", "pentatonic-major", "pentatonic-minor", "harmonic-minor", "harmonic-major"]);
const expScales = findScales(12, Object.keys(types));

function getRandomScale(diff) {
    switch (diff) {
        //No Break becuase of `return` statement
        case "beg":
            return begScales[Math.floor(begScales.length * Math.random())];
        case "int":
            return intScales[Math.floor(intScales.length * Math.random())];
        case "adv":
            return advScales[Math.floor(advScales.length * Math.random())];
        case "exp":
            return expScales[Math.floor(expScales.length * Math.random())];
    }
}

var scaleDiff = null;

reroll.addEventListener("click", (e) => {
    if (scaleDiff) {
        scaleDisp.textContent = getRandomScale(scaleDiff)
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
});

beg.addEventListener("click", (e) => {
    if (scaleDiff == "beg") return;
    
    scaleDiff = "beg";
    scaleDisp.textContent = getRandomScale(scaleDiff);
});

int.addEventListener("click", (e) => {
    if (scaleDiff == "int") return;
    
    scaleDiff = "int";
    scaleDisp.textContent = getRandomScale(scaleDiff)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
});

adv.addEventListener("click", (e) => {
    if (scaleDiff == "adv") return;
    
    scaleDiff = "adv";
    scaleDisp.textContent = getRandomScale(scaleDiff)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
});

exp.addEventListener("click", (e) => {
    if (scaleDiff == "exp") return;
    
    scaleDiff = "exp";
    scaleDisp.textContent = getRandomScale(scaleDiff)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
});