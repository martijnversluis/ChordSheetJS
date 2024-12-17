import { SerializedSong } from '../../src/serialized_types';

export const changedSongSymbol: SerializedSong = {
  type: 'chordSheet',
  lines: [
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'title',
          value: 'Let it be changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'subtitle',
          value: 'ChordSheetJS example version changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'key',
          value: 'C changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'x_some_setting',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'composer',
          value: 'John Lennon changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'composer',
          value: 'Paul McCartney changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'comment',
          comment: 'This is my favorite song',
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'WRITTEN BY: ',
          chord: null,
          annotation: '',
        },
        {
          type: 'ternary',
          variable: 'composer',
          valueTest: null,
          trueExpression: [
            {
              type: 'ternary',
              variable: null,
              valueTest: null,
              trueExpression: [],
              falseExpression: [],
            },
          ],
          falseExpression: [
            'No composer defined for ',
            {
              type: 'ternary',
              variable: 'title',
              valueTest: null,
              trueExpression: [
                {
                  type: 'ternary',
                  variable: null,
                  valueTest: null,
                  trueExpression: [],
                  falseExpression: [],
                },
              ],
              falseExpression: [
                'Untitled song',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_verse',
          value: 'Verse 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Bm',
          lyrics: 'BE, ',
          chord: null,
          annotation: '',
        },
        {
          type: 'softLineBreak',
        },
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'D/A',
          lyrics: 'BE, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'BE, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: 'BE',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'transpose',
          value: '2 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: 'WHISPER ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'WORDS OF ',
          chord: null,
          annotation: 'STRONG',
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'WIS',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'A',
          lyrics: 'DOM, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'BE ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'D/F#',
          lyrics: ' ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Em',
          lyrics: ' ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: '',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_verse',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_chorus',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'comment',
          value: 'Breakdown changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'transpose',
          value: 'G changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'Bm',
          lyrics: 'WHISPER WORDS OF ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'C',
          lyrics: 'WISDOM, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'BE ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: '',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_chorus',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_chorus',
          value: 'changed',
          attributes: { label: 'Chorus 2 changed' },
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: 'WHISPER WORDS OF ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'C',
          lyrics: 'WISDOM, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'BE ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: '',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_chorus',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_solo',
          value: 'Solo 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: 'SOLO LINE 1',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'SOLO LINE 2',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_solo',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_tab',
          value: 'changed',
          attributes: {
            label: 'Tab 1 changed',
          },
        },
      ],
    },
    {
      type: 'line',
      items: [
        'Tab line 1',
      ],
    },
    {
      type: 'line',
      items: [
        'Tab line 2',
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_tab',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_abc',
          value: 'ABC 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        'ABC line 1',
      ],
    },
    {
      type: 'line',
      items: [
        'ABC line 2',
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_abc',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_ly',
          value: 'LY 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        'LY line 1',
      ],
    },
    {
      type: 'line',
      items: [
        'LY line 2',
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_ly',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_bridge',
          value: 'Bridge 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'BRIDGE LINE',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_bridge',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_grid',
          value: 'Grid 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        'Grid line 1',
      ],
    },
    {
      type: 'line',
      items: [
        'Grid line 2',
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_grid',
          value: 'changed',
          attributes: {},
        },
      ],
    },
  ],
};

export const changedSongSolfege: SerializedSong = {
  type: 'chordSheet',
  lines: [
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'title',
          value: 'Let it be changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'subtitle',
          value: 'ChordSheetJS example version changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'key',
          value: 'Do changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'x_some_setting',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'composer',
          value: 'John Lennon changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'composer',
          value: 'Paul McCartney changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'comment',
          comment: 'This is my favorite song',
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'WRITTEN BY: ',
          chord: null,
          annotation: '',
        },
        {
          type: 'ternary',
          variable: 'composer',
          valueTest: null,
          trueExpression: [
            {
              type: 'ternary',
              variable: null,
              valueTest: null,
              trueExpression: [],
              falseExpression: [],
            },
          ],
          falseExpression: [
            'No composer defined for ',
            {
              type: 'ternary',
              variable: 'title',
              valueTest: null,
              trueExpression: [
                {
                  type: 'ternary',
                  variable: null,
                  valueTest: null,
                  trueExpression: [],
                  falseExpression: [],
                },
              ],
              falseExpression: [
                'Untitled song',
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_verse',
          value: 'Verse 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Sim',
          lyrics: 'BE, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Re/La',
          lyrics: 'BE, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Sol',
          lyrics: 'BE, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Re',
          lyrics: 'BE',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'transpose',
          value: '2 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'Re',
          lyrics: 'WHISPER ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'WORDS OF ',
          chord: null,
          annotation: 'STRONG',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Sol',
          lyrics: 'WIS',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'La',
          lyrics: 'DOM, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Sol',
          lyrics: 'BE ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Re/Fa#',
          lyrics: ' ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Mim',
          lyrics: ' ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Re',
          lyrics: '',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_verse',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_chorus',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'comment',
          value: 'Breakdown changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'transpose',
          value: 'Sol changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'Sim',
          lyrics: 'WHISPER WORDS OF ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Do',
          lyrics: 'WISDOM, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Sol',
          lyrics: 'BE ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Re',
          lyrics: '',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_chorus',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_chorus',
          value: 'changed',
          attributes: { label: 'Chorus 2' },
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'Sim',
          lyrics: 'WHISPER WORDS OF ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Do',
          lyrics: 'WISDOM, LET IT ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Sol',
          lyrics: 'BE ',
          chord: null,
          annotation: '',
        },
        {
          type: 'chordLyricsPair',
          chords: 'Re',
          lyrics: '',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_chorus',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_solo',
          value: 'Solo 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'Re',
          lyrics: 'SOLO LINE 1',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'Sol',
          lyrics: 'SOLO LINE 2',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_solo',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_tab',
          value: 'Tab 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        'Tab line 1',
      ],
    },
    {
      type: 'line',
      items: [
        'Tab line 2',
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_tab',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_abc',
          value: 'ABC 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        'ABC line 1',
      ],
    },
    {
      type: 'line',
      items: [
        'ABC line 2',
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_abc',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_ly',
          value: 'LY 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        'LY line 1',
      ],
    },
    {
      type: 'line',
      items: [
        'LY line 2',
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_ly',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_bridge',
          value: 'Bridge 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'BRIDGE LINE',
          chord: null,
          annotation: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_bridge',
          value: 'changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'start_of_grid',
          value: 'Grid 1 changed',
          attributes: {},
        },
      ],
    },
    {
      type: 'line',
      items: [
        'Grid line 1',
      ],
    },
    {
      type: 'line',
      items: [
        'Grid line 2',
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_grid',
          value: 'changed',
          attributes: {},
        },
      ],
    },
  ],
};
