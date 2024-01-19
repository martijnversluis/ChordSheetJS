import { SerializedSong } from '../../src/chord_sheet_serializer';

const changedSong: SerializedSong = {
  type: 'chordSheet',
  lines: [
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'title',
          value: 'Let it be changed',
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
        },
        {
          type: 'chordLyricsPair',
          chords: 'Bm',
          lyrics: 'BE, LET IT ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'D/A',
          lyrics: 'BE, LET IT ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'BE, LET IT ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: 'BE',
          chord: null,
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
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'WIS',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'A',
          lyrics: 'DOM, LET IT ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'BE ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'D/F#',
          lyrics: ' ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'Em',
          lyrics: ' ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: '',
          chord: null,
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
        },
        {
          type: 'chordLyricsPair',
          chords: 'C',
          lyrics: 'WISDOM, LET IT ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'BE ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'D',
          lyrics: '',
          chord: null,
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
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'GRID LINE',
          chord: null,
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_grid',
          value: 'changed',
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
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'TAB LINE',
          chord: null,
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'end_of_tab',
          value: 'changed',
        },
      ],
    },
  ],
};

export default changedSong;
