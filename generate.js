const generateBaseTemplate = ({
    chords,
    melody,
    bass
}) => {
const baseTemplate = `
// John Coltrane - Giant Steps
setVoicingRange('lefthand', ['E3', 'G4']);

stack(
    // melody
    seq("${melody}")
    // chords
    seq("${chords}")
    .voicings('lefthand')
    // bass
    seq("${bass}")
)
.slow(20)
.note()
`;
return baseTemplate;    
};

const note = {
    Cb : "Cb",
    C  : "C",
    C$ : "C#",
    Db : "Db",
    D  : "D",
    D$ : "D#",
    Eb : "Eb",
    E  : "E",
    E$ : "E#",
    Fb : "Fb",
    F  : "F",
    F$ : "F#",
    Gb : "Gb",
    G  : "G",
    G$ : "G#",
    Ab : "Ab",
    A  : "A",
    A$ : "A#",
    Bb : "Bb",
    B  : "B",
    B$ : "B#"
}

const noteToMidiNumber = {
    [note.C]  : 0,
    [note.C$] : 1,
    [note.Db] : 1,
    [note.D]  : 2,
    [note.D$] : 3,
    [note.Eb] : 3,
    [note.E]  : 4,
    [note.E$] : 5,
    [note.Fb] : 4,
    [note.F]  : 5,
    [note.F$] : 6,
    [note.Gb] : 6,
    [note.G]  : 7,
    [note.G$] : 8,
    [note.Ab] : 8,
    [note.A]  : 9,
    [note.A$] : 10,
    [note.Bb] : 10,
    [note.B]  : 11,
    [note.B$] : 12,
    [note.Cb] : 11
};

function noteToMidi(noteName, octave) {
    // hardcoding all octaves to 1 for now
    // not yet ready to deal with this complexity
    return noteToMidiNumber[noteName] + 12 * (octave + 1);
}
  
function midiToNote(midiNoteNumber) {
    // console.log('nid', midiNoteNumber)
    const numberToNote = [
        note.C,
        note.Db,
        note.D,
        note.Eb,
        note.E,
        note.F,
        note.Gb,
        note.G,
        note.Ab,
        note.A,
        note.Bb,
        note.B
    ];
    const octave = Math.floor(midiNoteNumber / 12) - 1;

    const noteName = numberToNote[midiNoteNumber % 12];

    return noteName + octave;
}

const romanNumeralMap = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7
}

const melodyScaleDegreeMap = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7
}

const bassScaleDegreeMap = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7
}

const romanNumeralToInterval = {
    1: 0,
    2: 2,
    3: 4,
    4: 5,
    5: 7,
    6: 9,
    7: 11
};

const chordType = {
    minorSeventh    : '-',
    majorSeventh    : '^',
    dominantSeventh : '7',
    minSevenFlat5   : "ø"
}

const chordQualityMapping = {
    [chordType.majorSeventh]    : "^7",
    [chordType.minorSeventh]    : "m7",
    [chordType.minSevenFlat5]   : "m7b5",
    [chordType.dominantSeventh] : "7"
};

const generateChord = ({ tonalCenter, romanNumeral, chordType }) => {

    // extract midi note from note string
    const rootMidiNote = noteToMidi(tonalCenter, 1);
    
    // modify root midi note by it's roman numeral interval offset
    const newRootMidiNumber = rootMidiNote + romanNumeralToInterval[romanNumeral];

    const newRootNoteName = midiToNote(newRootMidiNumber, 1)
    // console.log('new root note name', newRootNoteName)
    // now append the chord type information to this string
    const fullChordDefinition = newRootNoteName + chordQualityMapping[chordType]

    // return fullChordDefinition;
    return fullChordDefinition;
}

const recursiveGiantStepsChordParser = (data) => {
    if(Array.isArray(data)) {
        const result = [];

        // add opening bracket
        result.push('[')
        
        // loop over each item and recurse if it's not a string
        data.forEach((eachElem) => {
            result.push(recursiveGiantStepsChordParser(eachElem));
        })

        // add closing bracket
        result.push(']')
        
        // join with a space so it's readable
        return result.join(' ');
    } else {
        // Assuming we don't have anything but arrays and chord param objects here
        return generateChord({
            tonalCenter: data.tonalCenter,
            romanNumeral: data.romanNumeral,
            chordType: data.chordType
        });
    }
}

const generateMelodyNote = ({
    tonalCenter,
    scaleDegree,
    octave
}) => {
    console.log('tonal', tonalCenter, scaleDegree, octave)
    // extract midi note from note string
    const rootMidiNote = noteToMidi(tonalCenter, octave);
    console.log(rootMidiNote)

    // modify root midi note by it's roman numeral interval offset
    const newRootMidiNumber = rootMidiNote + scaleDegree;

    const newRootNoteName = midiToNote(newRootMidiNumber);

    return newRootNoteName
}

const recursiveGiantStepsSingleNoteParser = (data) => {
    console.log('= data', data);

    if(Array.isArray(data)) {
        const result = [];

        // add opening bracket
        result.push('[')
        
        // loop over each item and recurse if it's not a string
        data.forEach((eachElem) => {
            result.push(recursiveGiantStepsSingleNoteParser(eachElem));
        })

        // add closing bracket
        result.push(']')
        
        // join with a space so it's readable
        return result.join(' ');
    } else {
        // Assuming we don't have anything but arrays and chord param objects here
        return generateMelodyNote({
            tonalCenter: data.tonalCenter,
            scaleDegree: data.scaleDegree,
            octave: data.octave
        });
    }
}

const chordConfig = [
    // ['B^7', 'D7'],
    [{
        tonalCenter:  note.B,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    }, {
        tonalCenter:  note.G,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],

    // ['G^7', 'Bb7'],
    [{
        tonalCenter:  note.G,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    }, {
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],

    // 'Eb^7',
    {
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    },

    // ['Am7', 'D7'],
    [{
        tonalCenter:  note.G,
        romanNumeral: romanNumeralMap[2],
        chordType:    chordType.minorSeventh
    }, {
        tonalCenter:  note.G,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],

    // ['G^7', 'Bb7'],
    [{
        tonalCenter:  note.G,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    }, {
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],

    // ['Eb^7', 'F#7'],
    [{
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    }, {
        tonalCenter:  note.B,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],

    // 'B^7',
    {
        tonalCenter:  note.B,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    },

    // ['Fm7', 'Bb7'],
    [{
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[2],
        chordType:    chordType.minorSeventh
    }, {
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],

    // 'Eb^7',
    {
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    },

    // ['Am7', 'D7'],
    [{
        tonalCenter:  note.G,
        romanNumeral: romanNumeralMap[2],
        chordType:    chordType.minorSeventh
    }, {
        tonalCenter:  note.G,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],


    // 'G^7',
    {
        tonalCenter:  note.G,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    },

    // ['C#m7', 'F#7'],
    [{
        tonalCenter:  note.B,
        romanNumeral: romanNumeralMap[2],
        chordType:    chordType.minorSeventh
    }, {
        tonalCenter:  note.B,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],


    // 'B^7',
    {
        tonalCenter:  note.B,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.majorSeventh
    },

    // ['Fm7', 'Bb7'],
    [{
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[2],
        chordType:    chordType.minorSeventh
    }, {
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }],

    // 'Eb^7',
    {
        tonalCenter:  note.Eb,
        romanNumeral: romanNumeralMap[1],
        chordType:    chordType.dominantSeventh
    },

    // ['C#m7', 'F#7'],
    [{
        tonalCenter:  note.B,
        romanNumeral: romanNumeralMap[2],
        chordType:    chordType.minorSeventh
    }, {
        tonalCenter:  note.B,
        romanNumeral: romanNumeralMap[5],
        chordType:    chordType.dominantSeventh
    }]
];

const melodyConfig = [
    // [F#5 D5],
    [{
        tonalCenter: note.B,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 5
    }, {
        tonalCenter: note.G,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 5
    }],
    // [B4 G4],
    [{
        tonalCenter: note.G,
        scaleDegree: melodyScaleDegreeMap[2],
        octave: 4
    }, {
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[1],
        octave: 4
    }],
    // Bb4,
    {
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 4
    },
    // [B4 A4],
    [{
        tonalCenter: note.G,
        scaleDegree: melodyScaleDegreeMap[3],
        octave: 4
    }, {
        tonalCenter: note.G,
        scaleDegree: melodyScaleDegreeMap[2],
        octave: 4
    }],
    // [D5 Bb4],
    [{
        tonalCenter: note.G,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 5
    }, {
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 4
    }],
    // [G4 Eb4],
    [{
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[3],
        octave: 4
    }, {
        tonalCenter: note.B,
        scaleDegree: melodyScaleDegreeMap[1],
        octave: 4
    }],
    // F#4,
    {
        tonalCenter: note.B,
        scaleDegree: melodyScaleDegreeMap[5],
        // TODO: is this scale degree right?
        octave: 4
    },
    // [G4 F4],
    [{
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[3],
        octave: 4
    }, {
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[2],
        octave: 4
    }],
    // Bb4,
    {
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 4
    },
    // [B4 A4],
    [{
        tonalCenter: note.G,
        scaleDegree: melodyScaleDegreeMap[3],
        octave: 4
    }, {
        tonalCenter: note.G,
        scaleDegree: melodyScaleDegreeMap[2],
        octave: 4
    }],
    // D5,
    {
        tonalCenter: note.G,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 5
    },
    // [D#5 C#5],
    [{
        tonalCenter: note.B,
        scaleDegree: melodyScaleDegreeMap[3],
        // TODO: is this scale degree right?
        octave: 5
    }, {
        tonalCenter: note.B,
        scaleDegree: melodyScaleDegreeMap[2],
        // TODO: is this scale degree right?
        octave: 5
    }],
    // F#5,
    {
        tonalCenter: note.B,
        scaleDegree: melodyScaleDegreeMap[5],
        // TODO: is this scale degree right?
        octave: 5
    },
    // [G5 F5],
    [{
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[3],
        octave: 5
    }, {
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[2],
        octave: 5
    }],
    // Bb5,
    {
        tonalCenter: note.Eb,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 5
    },
    // [F#5 F#5]
    [{
        tonalCenter: note.B,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 5
    }, {
        tonalCenter: note.B,
        scaleDegree: melodyScaleDegreeMap[5],
        octave: 5
    }]
]

const bassConfig = [
    // B2 D2
    [
        {
            tonalCenter: note.B,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter: note.G,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        }
    ],
    
    // G2 Bb2
    [
        {
            tonalCenter:  note.G,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // Eb2 Bb3
    [
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 3
        },
    ],
    
    // A2 D2
    [
        {
            tonalCenter:  note.G,
            scaleDegree: bassScaleDegreeMap[2],
            octave: 2
        },
        {
            tonalCenter:  note.G,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // G2 Bb2
    [
        {
            tonalCenter:  note.G,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // Eb2 F#2
    [
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[4],
            octave: 2
        },
    ],
    
    // B2 F#2
    [
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[4],
            octave: 2
        },
    ],
    
    // F2 Bb2
    [
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[2],
            octave: 2
        },
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // Eb2 Bb2
    [
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
    ],
    
    // A2 D2
    [
        {
            tonalCenter:  note.G,
            scaleDegree: bassScaleDegreeMap[2],
            octave: 2
        },
        {
            tonalCenter:  note.G,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // G2 D2
    [
        {
            tonalCenter:  note.G,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter:  note.G,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // C#2 F#2
    [
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[2],
            octave: 2
        },
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // B2 F#2
    [
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // F2 Bb2
    [
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[2],
            octave: 2
        },
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ],
    
    // Eb2 Bb3
    [
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[1],
            octave: 2
        },
        {
            tonalCenter:  note.Eb,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 3
        },
    ],
    
    // C#2 F#2
    [
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[2],
            octave: 2
        },
        {
            tonalCenter:  note.B,
            scaleDegree: bassScaleDegreeMap[5],
            octave: 2
        },
    ]
]

console.log(generateBaseTemplate({
    chords: recursiveGiantStepsChordParser(chordConfig),
    melody: recursiveGiantStepsSingleNoteParser(melodyConfig),
    bass  : recursiveGiantStepsSingleNoteParser(bassConfig)
}))
