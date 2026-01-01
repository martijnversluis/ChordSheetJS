export const measuredHtmlConfigs = [
  {
    name: 'Html Config',
    content: {
      fonts: {
        title: {
          name: '"Atkinson Hyperlegible Next"',
          style: 'bold',
          weight: 900,
          size: 28,
          color: 'black',
        },
        subtitle: {
          name: '"Atkinson Hyperlegible Next"',
          style: 'normal',
          size: 10,
          color: 100,
        },
        metadata: {
          name: '"Atkinson Hyperlegible Next"',
          style: 'normal',
          size: 10,
          color: 100,
        },
        text: {
          name: '"Atkinson Hyperlegible Next"',
          style: 'normal',
          size: 18,
          color: 'black',
        },
        chord: {
          name: '"Atkinson Hyperlegible Next"',
          style: 'bold',
          weight: 500,
          size: 16,
          color: '#ed6e6e',
        },
        sectionLabel: {
          name: '"Atkinson Hyperlegible Next"',
          weight: 700,
          size: 19,
          color: 'black',
          lineHeight: 1.2,
        },
        comment: {
          name: '"Atkinson Hyperlegible Next"',
          weight: 700,
          size: 19,
          color: 'black',
          underline: true,
          lineHeight: 1.2,
        },
        annotation: {
          name: '"Atkinson Hyperlegible Next"',
          style: 'normal',
          size: 10,
          color: 'black',
        },
      },
      layout: {
        global: {
          margins: {
            top: 5,
            bottom: 10,
            left: 15,
            right: 15,
          },
        },
        header: {
          height: 0,
          content: [
          ],
        },
        footer: {
          height: 0,
          content: [
          ],
        },
        sections: {
          global: {
            paragraphSpacing: 25,
            linePadding: 8,
            chordLyricSpacing: 2,
            chordSpacing: 2,
            columnCount: 1,
            columnWidth: 0,
            columnSpacing: 25,
          },
          base: {
            display: {
              lyricsOnly: false,
            },
          },
        },
        chordDiagrams: {
          enabled: true,
          renderingConfig: {
            titleY: 16,
            neckWidth: 120,
            neckHeight: 160,
            nutThickness: 10,
            fretThickness: 4,
            nutColor: 0,
            fretColor: '#AAAAAA',
            stringIndicatorSize: 14,
            fingerIndicatorSize: 16,
            stringColor: 0,
            fingerIndicatorOffset: 0,
            stringThickness: 3,
            fretLineThickness: 4,
            openStringIndicatorThickness: 2,
            unusedStringIndicatorThickness: 2,
            markerThickness: 2,
            barreThickness: 2,
            titleFontSize: 40,
            baseFretFontSize: 8,
            fingerNumberFontSize: 28,
            showFingerNumbers: false,
            diagramSpacing: 7,
          },
          overrides: {
            global: {
              'G': {
                hide: true,
              },
            },
            byKey: {
              'B': {
                'G': {
                  definition: 'G base-fret 3 frets 1 3 3 2 1 1 fingers 1 3 4 2 1 1',
                },
              },
            },
          },
          fonts: {
            title: {
              name: 'NimbusSansL-Bol', style: 'bold', size: 9, color: 'black',
            },
            fingerings: {
              name: 'NimbusSansL-Bol', style: 'bold', size: 6, color: 'black',
            },
            baseFret: {
              name: 'NimbusSansL-Bol', style: 'bold', size: 6, color: 'black',
            },
          },
        },
      },
    },
  },
];

export default measuredHtmlConfigs;
