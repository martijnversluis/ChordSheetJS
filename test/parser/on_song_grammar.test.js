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

    SectionHeader: {
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
              { type: 'line', parts: [{ type: 'annotation', annotation: null, lyrics: 'This is a stanza' }] },
            ],
          },
          {
            type: 'stanza',
            lines: [
              { type: 'line', parts: [{ type: 'annotation', annotation: null, lyrics: 'This is another stanza' }] },
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
            lines: [
              {
                type: 'line',
                parts: [
                  { type: 'annotation', annotation: { type: 'chord', value: 'G' }, lyrics: '' },
                ],
              },
            ],
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

      'Intro:\n| [B] / / / | / / [C#m7] / | [E] / / / | / / [F#sus] / / |': 'todo',
      'Intro:\n[| [D] /// | //// | [F#m] /// | [E] //// |]¬': 'todo',
      '{start_of_verse}\nLyrics\n{end_of_verse}': {
        type: 'section',
        name: 'verse',
        items: [
          {
            type: 'stanza',
            lines: [{ type: 'line', parts: [{ type: 'annotation', annotation: null, lyrics: 'Lyrics' }] }],
          },
        ],
      },
      '{start_of_verse: Verse 1}\n{end_of_verse}': { type: 'section', name: 'Verse 1', items: [] },
      '{sov}\n{eov}': { type: 'section', name: 'verse', items: [] },
      '{start_of_chorus}\nLyrics\n{end_of_chorus}': {
        type: 'section',
        name: 'chorus',
        items: [
          {
            type: 'stanza',
            lines: [{ type: 'line', parts: [{ type: 'annotation', annotation: null, lyrics: 'Lyrics' }] }],
          },
        ],
      },
      '{start_of_verse}\nLyrics\n{start_of_chorus}': 'todo',
      'Chord and lyrics': {
        type: 'section',
        name: null,
        items: [
          {
            type: 'stanza',
            lines: [
              { type: 'line', parts: [{ type: 'annotation', annotation: null, lyrics: 'Chord and lyrics' }] },
            ],
          },
        ],
      },
    },

    SectionBody: {
      [[
        '        D           G        D',
        'Amazing Grace, how sweet the sound',
        '                         A7',
        'That saved a wretch like me.',
      ].join('\n')]: {
        type: 'stanza',
        lines: [
          {
            type: 'line',
            parts: [
              { type: 'annotation', annotation: null, lyrics: 'Amazing ' },
              { type: 'annotation', annotation: { type: 'chord', value: 'D' }, lyrics: 'Grace, how s' },
              { type: 'annotation', annotation: { type: 'chord', value: 'G' }, lyrics: 'weet the ' },
              { type: 'annotation', annotation: { type: 'chord', value: 'D' }, lyrics: 'sound' },
            ],
          },
          {
            type: 'line',
            parts: [
              { type: 'annotation', annotation: null, lyrics: 'That saved a wretch like ' },
              { type: 'annotation', annotation: { type: 'chord', value: 'A7' }, lyrics: 'me.' },
            ],
          },
        ],
      },

      'Am    F': {
        type: 'stanza',
        lines: [
          {
            type: 'line',
            parts: [
              { type: 'annotation', annotation: { type: 'chord', value: 'Am' }, lyrics: '      ' },
              { type: 'annotation', annotation: { type: 'chord', value: 'F' }, lyrics: '' },
            ],
          },
        ],
      },

      [[
        'G      D',
        'Lyric',
      ].join('\n')]: {
        type: 'stanza',
        lines: [
          {
            type: 'line',
            parts: [
              { type: 'annotation', annotation: { type: 'chord', value: 'G' }, lyrics: 'Lyric  ' },
              { type: 'annotation', annotation: { type: 'chord', value: 'D' }, lyrics: '' },
            ],
          },
        ],
      },

      'G (strum once)\nLyrics': {
        type: 'stanza',
        lines: [
          {
            type: 'line',
            parts: [
              { type: 'annotation', annotation: { type: 'chord', value: 'G' }, lyrics: 'Ly' },
              { type: 'annotation', annotation: { type: 'instruction', content: 'strum once' }, lyrics: 'rics' },
            ],
          },
        ],
      },

      '[G] (strum once) Lyrics': {
        type: 'stanza',
        lines: [
          {
            type: 'line',
            parts: [
              { type: 'annotation', annotation: { type: 'chord', value: 'G' }, lyrics: ' ' },
              { type: 'annotation', annotation: { type: 'instruction', content: 'strum once' }, lyrics: ' Lyrics' },
            ],
          },
        ],
      },

      // TODO: "You can also start the line with a period or a back tick character
      //       to force the line to be detected as chords"
      // '.I am chords\nI am lyrics': {
      //   type: 'stanza',
      //   lines: [
      //     {
      //       type: 'line',
      //       parts: [
      //         { type: 'annotation', annotation: { type: 'text', value: 'I am chords' }, lyrics: 'I am lyrics' },
      //       ],
      //     },
      //   ],
      // },
      // '`I am chords\nI am lyrics': {
      //   type: 'stanza',
      //   lines: [
      //     {
      //       type: 'line',
      //       parts: [
      //         { type: 'annotation', chords: 'I am chords', lyrics: 'I am lyrics' },
      //       ],
      //     },
      //   ],
      // },
    },

    Line: {
      'This [D]is a s[G]ong,': {
        type: 'line',
        parts: [
          { type: 'annotation', annotation: null, lyrics: 'This ' },
          { type: 'annotation', annotation: { type: 'chord', value: 'D' }, lyrics: 'is a s' },
          { type: 'annotation', annotation: { type: 'chord', value: 'G' }, lyrics: 'ong,' },
        ],
      },
      'Ends with a chord [D]': {
        type: 'line',
        parts: [
          { type: 'annotation', annotation: null, lyrics: 'Ends with a chord ' },
          { type: 'annotation', annotation: { type: 'chord', value: 'D' }, lyrics: '' },
        ],
      },
      '[D]Starts with a chord': {
        type: 'line',
        parts: [
          { type: 'annotation', annotation: { type: 'chord', value: 'D' }, lyrics: 'Starts with a chord' },
        ],
      },
      'Just lyrics': {
        type: 'line',
        parts: [
          { type: 'annotation', annotation: null, lyrics: 'Just lyrics' },
        ],
      },
      '[G]': {
        type: 'line',
        parts: [{ type: 'annotation', annotation: { type: 'chord', value: 'G' }, lyrics: '' }],
      },
      '[G]Line (2x)': {
        type: 'line',
        parts: [
          { type: 'annotation', annotation: { type: 'chord', value: 'G' }, lyrics: 'Line ' },
          { type: 'annotation', annotation: { type: 'instruction', content: '2x' }, lyrics: '' },
        ],
      },

      // {define: ...} is used to define custom chord diagrams. See Defining Chords for more information.
      // {comment: ...} or {c: ...} Defines a comment and appears as a musical instruction.
      // {comment_bold: ...} or {cb: ...} Defines text to appear in bold.
      // {comment_italic: ...} or {ci: ...} Defines text to appear as italic.
      // {guitar_comment: ...} or {gc: ...} Defines a comment that appears as a musical instruction.
      // {new_page} or {np} This is used to declare a new page.
      // {new_physical_page} or {npp} This is used to declare a new page.

      // Formatting Tags
      // {textsize: ...} Defines the size of the lyrics as a numeric value in points.
      // {textfont: ...} Defines the name of the font to use for lyrics. Must be supported on the platform.
      // {chordsize: ...} Defines the size of the chords as a numeric value in points.
      // {chordfont: ...} Defines the name of the font to use for chords. Must be supported on the platform.

      // *This line will be bold
      // /This line will be italicized
      // !This line will be bold and italicized
      // _This line will eventually be underlined
      // &red:This text will be red
      // &#123456:This text will be a custom color using HTML color codes
      // >yellow:This line will be highlighted in yellow

      // Poor formatting found in the wild. These should produce warnings but not raise errors
      'Rogue [C#m]#pound sign': 'todo',
      'Rogue C] square bracket': {
        type: 'line',
        parts: [{ annotation: null, lyrics: 'Rogue C] square bracket', type: 'annotation' }],
      },
      'Empty []chord': 'todo',
      'F#m Whoops forgot the brackets': 'todo',
    },

    Chord: {
      A: { type: 'chord', value: 'A' },
      'C/G': { type: 'chord', value: 'C/G' },
      'F#m': { type: 'chord', value: 'F#m' },
      'C♯': { type: 'chord', value: 'C♯' },
      Asus4: { type: 'chord', value: 'Asus4' },
      E7: { type: 'chord', value: 'E7' },
      'B♭': { type: 'chord', value: 'B♭' },
      'Eb/Bb': { type: 'chord', value: 'Eb/Bb' },
      'Abm7/Eb': { type: 'chord', value: 'Abm7/Eb' },
      'F / A': { type: 'chord', value: 'F / A' },
      'Dm7(b5)': { type: 'chord', value: 'Dm7(b5)' },
      E7b13: { type: 'chord', value: 'E7b13' },
      B7b5: { type: 'chord', value: 'B7b5' },
      CM7: { type: 'chord', value: 'CM7' },
      Cmaj7: { type: 'chord', value: 'Cmaj7' },
      AbMaj7: { type: 'chord', value: 'AbMaj7' },
      'C9(11)': { type: 'chord', value: 'C9(11)' },
      'Dm7(9)': { type: 'chord', value: 'Dm7(9)' },
      D6: { type: 'chord', value: 'D6' },
      'B(add4)': { type: 'chord', value: 'B(add4)' },
      AMaj: Error,
      X: Error,
    },

    BracketedChord: {
      '[G]': { type: 'chord', value: 'G' },
      '[D/F#]': { type: 'chord', value: 'D/F#' },
      '[Bsus2]': { type: 'chord', value: 'Bsus2' },
      '\\[notachord]': Error,
      // '[unknown]': ExpectWarning, // FIXME
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
                  { parts: [{ annotation: null, lyrics: 'Chord and lyrics', type: 'annotation' }], type: 'line' },
                ],
                type: 'stanza',
              },
            ],
            name: null,
          },
        ],
        warnings: [],
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
        warnings: [],
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
        warnings: [],
      },
      'Title\nFlow: V1 C v1\n\nVerse 1:\nVerse\n\nChorus:\nChorus': {
        metadata: [
          { name: 'title', type: 'metatag', value: 'Title' },
          { name: 'flow', type: 'metatag', value: ['V1', 'C', 'V1'] },
        ],
        sections: [
          {
            type: 'section',
            name: 'Verse 1',
            items: [
              {
                type: 'stanza',
                lines: [
                  {
                    type: 'line',
                    parts: [{ annotation: null, lyrics: 'Verse', type: 'annotation' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'section',
            name: 'Chorus',
            items: [
              {
                type: 'stanza',
                lines: [
                  {
                    type: 'line',
                    parts: [{ annotation: null, lyrics: 'Chorus', type: 'annotation' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'section',
            name: 'Verse 1',
            items: [
              {
                type: 'stanza',
                lines: [
                  {
                    type: 'line',
                    parts: [{ annotation: null, lyrics: 'Verse', type: 'annotation' }],
                  },
                ],
              },
            ],
          },
        ],
        type: 'chordsheet',
        warnings: [],
      },
      'Title\nFlow: Verse 1, Chorus, Verse 1\n\nVerse 1:\nVerse\n\nChorus:\nChorus': {
        metadata: [
          { name: 'title', type: 'metatag', value: 'Title' },
          { name: 'flow', type: 'metatag', value: ['Verse 1', 'Chorus', 'Verse 1'] },
        ],
        sections: [
          {
            type: 'section',
            name: 'Verse 1',
            items: [
              {
                type: 'stanza',
                lines: [
                  {
                    type: 'line',
                    parts: [{ annotation: null, lyrics: 'Verse', type: 'annotation' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'section',
            name: 'Chorus',
            items: [
              {
                type: 'stanza',
                lines: [
                  {
                    type: 'line',
                    parts: [{ annotation: null, lyrics: 'Chorus', type: 'annotation' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'section',
            name: 'Verse 1',
            items: [
              {
                type: 'stanza',
                lines: [
                  {
                    type: 'line',
                    parts: [{ annotation: null, lyrics: 'Verse', type: 'annotation' }],
                  },
                ],
              },
            ],
          },
        ],
        type: 'chordsheet',
        warnings: [],
      },
      'Title\nFlow: Chorus, (Repeat 2x)\n\nChorus:\nLyrics': {
        metadata: [
          { name: 'title', type: 'metatag', value: 'Title' },
          { name: 'flow', type: 'metatag', value: ['Chorus', { type: 'instruction', content: 'Repeat 2x' }] },
        ],
        sections: [
          {
            type: 'section',
            name: 'Chorus',
            items: [
              {
                type: 'stanza',
                lines: [
                  {
                    type: 'line',
                    parts: [{ annotation: null, lyrics: 'Lyrics', type: 'annotation' }],
                  },
                ],
              },
            ],
          },
          {
            type: 'instruction',
            content: 'Repeat 2x',
          },
        ],
        type: 'chordsheet',
        warnings: [],
      },
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
            const warnings = [];

            try {
              const actual = parse(input, { startRule, tracer, warnings });
              expect(actual).toEqual(expected);
              expect(warnings).toEqual([]);
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
