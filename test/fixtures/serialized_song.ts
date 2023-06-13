import { SerializedSong } from '../../src/chord_sheet_serializer';

const serializedSong: SerializedSong = {
  type: 'chordSheet',
  lines: [
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'title',
          value: 'Let it be',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'subtitle',
          value: 'ChordSheetJS example version',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'key',
          value: 'C',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'x_some_setting',
          value: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'composer',
          value: 'John Lennon',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'composer',
          value: 'Paul McCartney',
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
          lyrics: 'Written by: ',
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
          value: 'Verse 1',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: '',
          lyrics: 'Let it ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'Am',
          lyrics: 'be, let it ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'C/G',
          lyrics: 'be, let it ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'F',
          lyrics: 'be, let it ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'C',
          lyrics: 'be',
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
          value: '2',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'C',
          lyrics: 'Whisper words of ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'F',
          lyrics: 'wis',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'G',
          lyrics: 'dom, let it ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'F',
          lyrics: 'be ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'C/E',
          lyrics: ' ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'Dm',
          lyrics: ' ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'C',
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
          value: '',
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
          value: '',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'comment',
          value: 'Breakdown',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'tag',
          name: 'transpose',
          value: 'G',
        },
      ],
    },
    {
      type: 'line',
      items: [
        {
          type: 'chordLyricsPair',
          chords: 'Am',
          lyrics: 'Whisper words of ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'Bb',
          lyrics: 'wisdom, let it ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'F',
          lyrics: 'be ',
          chord: null,
        },
        {
          type: 'chordLyricsPair',
          chords: 'C',
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
          value: '',
        },
      ],
    },
  ],
};

export default serializedSong;
