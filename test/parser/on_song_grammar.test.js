import * as peggy from 'peggy';
import '../matchers';
import { readFileSync } from 'fs';

describe('OnSongGrammar', () => {
  const examples = {
    Metadata: {
      // First and second lines are assumed to be title / artist
      'Song Title\nArtist Name': [
        { type: 'metatag', name: 'title', value: 'Song Title' },
        { type: 'metatag', name: 'artist', value: 'Artist Name' },
      ],
      'Song Title\nArtist:Artist Name': [
        { type: 'metatag', name: 'title', value: 'Song Title' },
        { type: 'metatag', name: 'artist', value: 'Artist Name' },
      ],
      'Song Title\nTime:3/4': [
        { type: 'metatag', name: 'title', value: 'Song Title' },
        { type: 'metatag', name: 'time', value: '3/4' },
      ],
      'title: Song Title\nArtist: Artist Name': [
        { type: 'metatag', name: 'title', value: 'Song Title' },
        { type: 'metatag', name: 'artist', value: 'Artist Name' },
      ],
      // "before the first blank line or until no more metatags are encountered"
      'A: 1\n\nB:2\n\n': [
        { type: 'metatag', name: 'a', value: '1' },
        { type: 'metatag', name: 'b', value: '2' },
      ],
      // TODO:
      // "{title: ChordPro}": [
      //   { type: 'metatag', name: 'title', value: 'ChordPro' },
      // ]
      // "Notes:" : { // Known metatag without a value
      //   { type: 'metatag', name: 'Notes', value: '' },
      // }
      'Unknown Tag:': Error, // Unknown metatag without a value
    },

    // Inline Tags - https://www.onsongapp.com/docs/features/formats/onsong/metadata/?#inline-tags

    SectionName: {
      'Chorus:': 'Chorus',
      'Verse 1:\n': 'Verse 1',
      'Intro :': 'Intro',
      'Intro: ': 'Intro',
    },

    Section: {
      'Chorus:\nThis is a stanza\n\nThis is another stanza': {
        type: 'section',
        name: 'Chorus',
        items: [
          {
            type: 'stanza',
            lines: [
              { type: 'line', parts: [{ type: 'ChordLyricsPair', chords: '', lyrics: 'This is a stanza' }] },
            ],
          },
          {
            type: 'stanza',
            lines: [
              { type: 'line', parts: [{ type: 'ChordLyricsPair', chords: '', lyrics: 'This is another stanza' }] },
            ],
          },
        ],
      },

      'Intro:\n\n': {
        type: 'section',
        name: 'Intro',
        items: [],
      },

      'Intro:\n\n\n[G]': {
        type: 'section',
        name: 'Intro',
        items: [
          {
            type: 'stanza',
            lines: [{ type: 'line', parts: [{ type: 'ChordLyricsPair', chords: 'G', lyrics: '' }] }],
          },
        ],
      },

      'Chord and lyrics': {
        type: 'section',
        name: null,
        items: [
          {
            type: 'stanza',
            lines: [
              { type: 'line', parts: [{ type: 'ChordLyricsPair', chords: '', lyrics: 'Chord and lyrics' }] },
            ],
          },
        ],
      },
    },

    Line: {
      'This [D]is a s[G]ong,': {
        type: 'line',
        parts: [
          { type: 'ChordLyricsPair', chords: '', lyrics: 'This ' },
          { type: 'ChordLyricsPair', chords: 'D', lyrics: 'is a s' },
          { type: 'ChordLyricsPair', chords: 'G', lyrics: 'ong,' },
        ],
      },
      'Ends with a chord [D]': {
        type: 'line',
        parts: [
          { type: 'ChordLyricsPair', chords: '', lyrics: 'Ends with a chord ' },
          { type: 'ChordLyricsPair', chords: 'D', lyrics: '' },
        ],
      },
      '[D]Starts with a chord': {
        type: 'line',
        parts: [
          { type: 'ChordLyricsPair', chords: 'D', lyrics: 'Starts with a chord' },
        ],
      },
      'Just lyrics': {
        type: 'line',
        parts: [
          { type: 'ChordLyricsPair', chords: '', lyrics: 'Just lyrics' },
        ],
      },

      '[G]': {
        type: 'line',
        parts: [{ type: 'ChordLyricsPair', chords: 'G', lyrics: '' }],
      },
    },

    Chord: {
      '[G]': 'G',
      '[D/F#]': 'D/F#',
      '[Bsus2]': 'Bsus2',
      '\\[notachord]': Error,
    },

    ChordSheet: {
      'Title\n\nChord and lyrics': {
        type: 'chordsheet',
        metadata: [{ type: 'metatag', name: 'title', value: 'Title' }],
        sections: [
          {
            type: 'section',
            items: [
              {
                lines: [
                  { parts: [{ chords: '', lyrics: 'Chord and lyrics', type: 'ChordLyricsPair' }], type: 'line' },
                ],
                type: 'stanza',
              },
            ],
            name: null,
          },
        ],
      },
      'Title\n\nIntro:\n': {
        type: 'chordsheet',
        metadata: [{ type: 'metatag', name: 'title', value: 'Title' }],
        sections: [
          {
            type: 'section',
            name: 'Intro',
            items: [],
          },
        ],
      },
      'Tempo: 73\nUnknown(s): Value:with@various:characters1-5\n\nChorus:': {
        type: 'chordsheet',
        metadata: [
          { name: 'tempo', type: 'metatag', value: '73' },
          { name: 'unknown(s)', type: 'metatag', value: 'Value:with@various:characters1-5' },
        ],
        sections: [
          { items: [], name: 'Chorus', type: 'section' },
        ],
      },
    },
  };

  const grammar = readFileSync('src/parser/on_song_grammar.pegjs', { encoding: 'utf-8' });
  const { parse } = peggy.generate(grammar, {
    // Allow starting with these in tests
    allowedStartRules: Object.keys(examples),
  });

  Object.entries(examples).forEach(([startRule, ruleExamples]) => {
    describe(startRule, () => {
      Object.entries(ruleExamples).forEach(([input, expected]) => {
        test(JSON.stringify(input), () => {
          try {
            const actual = parse(input, { startRule });
            expect(actual).toEqual(expected);
          } catch (e) {
            if (expected !== Error) {
              throw e;
            }
          }
        });
      });
    });
  });
});
