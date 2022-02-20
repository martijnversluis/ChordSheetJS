import * as peggy from 'peggy';
import '../matchers';
import { readFileSync } from 'fs';
import { annotate } from 'annotate-code';
import Tracer from 'pegjs-backtrace';

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
      '{title: ChordPro}': [
        { type: 'metatag', name: 'title', value: 'ChordPro' },
      ],
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

      'Intro:\n{sot}\ntab\n{eot}': {
        type: 'section',
        name: 'Intro',
        items: [
          { type: 'tab', content: 'tab\n' },
        ],
      },
      '{start_of_verse}\nLyrics\n{end_of_verse}': 'todo',
      '{start_of_verse: Verse 1}\nLyrics\n{end_of_verse}': 'todo',
      '{start_of_chorus}\nLyrics\n{end_of_chorus}': 'todo',
      '{start_of_verse}\nLyrics\n{start_of_chorus}': 'todo',
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
      '[G]Line (2x)': {
        type: 'line',
        parts: [
          { type: 'ChordLyricsPair', chords: 'G', lyrics: 'Line ' },
          { type: 'instruction', content: '2x' },
        ],
      }
    },

    Chord: {
      '[G]': 'G',
      '[D/F#]': 'D/F#',
      '[Bsus2]': 'Bsus2',
      '\\[notachord]': Error,
    },

    Tab: {
      '{sot}\nthe tab\nis here\n{eot}': {
        type: 'tab',
        content: 'the tab\nis here\n',
      },
      '{start_of_tab}\ntab here\n{end_of_tab}': {
        type: 'tab',
        content: 'tab here\n',
      },
      '{sot}\npart1\n\npart2\n{eot}': {
        type: 'tab',
        content: 'part1\n\npart2\n',
      },
      '{sot}\ntab\n{end_of_tab}': Error,
      '{start_of_tab}\ntab\n{eot}': Error,
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
      'Title\nFlow: V1 C v1\n\nVerse 1:\nVerse\n\nChorus:\nChorus': 'todo',
      'Title\n\nVerse:\n[G]Hello\n\n{transpose: 2}\n\nVerse': 'todo',
    },
  };

  const grammar = readFileSync('src/parser/on_song_grammar.pegjs', { encoding: 'utf-8' });
  const { parse, SyntaxError } = peggy.generate(grammar, {
    // Allow starting with these in tests
    allowedStartRules: Object.keys(examples),
    trace: true,
  });

  Object.entries(examples).forEach(([startRule, ruleExamples]) => {
    describe(startRule, () => {
      Object.entries(ruleExamples).forEach(([input, expected]) => {
        if (expected === 'todo') {
          test.todo(input);
        } else {
          test(input, () => {
            const tracer = new Tracer(input);

            try {
              const actual = parse(input, { startRule, tracer });
              expect(actual).toEqual(expected);
            } catch (e) {
              if (expected === Error) {
                // expected, do nothing
              } else if (e instanceof SyntaxError) {
                const opts = {
                  message: e.message,
                  index: e.location.start.offset,
                  size: e.location.end.offset - e.location.start.offset,
                  input,
                };
                throw new Error([annotate(opts).message, tracer.getBacktraceString()].join('\n\n'));
              } else {
                throw e;
              }
            }
          });
        }
      });
    });
  });
});
