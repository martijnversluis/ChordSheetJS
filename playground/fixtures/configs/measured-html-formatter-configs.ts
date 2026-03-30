export const measuredHtmlConfigs = [
  {
    name: 'Html Config',
    content: {
      fonts: {
        title: {
          name: 'Arial',
          style: 'bold',
          weight: 700,
          size: 19,
          color: '#151515',
        },
        subtitle: {
          name: 'Arial',
          style: 'normal',
          size: 11,
          color: '#6f6f6f',
        },
        metadata: {
          name: 'Arial',
          style: 'normal',
          size: 11,
          color: '#6f6f6f',
        },
        text: {
          name: 'Arial',
          style: 'normal',
          size: 18,
          color: '#232323',
        },
        chord: {
          name: 'Arial',
          style: 'bold',
          weight: 700,
          size: 16,
          color: '#2f2f2f',
        },
        sectionLabel: {
          name: 'Arial',
          weight: 700,
          size: 15,
          color: '#a1312d',
          lineHeight: 1.2,
        },
        comment: {
          name: 'Arial',
          weight: 700,
          size: 15,
          color: '#232323',
          underline: true,
          lineHeight: 1.2,
        },
        annotation: {
          name: 'Arial',
          style: 'normal',
          size: 10,
          color: '#232323',
        },
      },
      layout: {
        global: {
          margins: {
            top: 12,
            bottom: 10,
            left: 15,
            right: 15,
          },
        },
        header: {
          height: 72,
          content: [
            {
              type: 'text',
              template: '%{title}',
              style: {
                name: 'Arial', style: 'bold', size: 19, color: '#151515', weight: 700,
              },
              position: {
                x: 'left', y: 0, width: 'auto', clip: true, ellipsis: true,
              },
              condition: {
                page: { first: true },
              },
            },
            {
              type: 'text',
              template: '%{artist}',
              style: {
                name: 'Arial', style: 'normal', size: 11, color: '#6f6f6f',
              },
              position: {
                x: 'left', y: 25, width: 'auto', clip: true, ellipsis: true,
              },
              condition: {
                page: { first: true },
              },
            },
            {
              type: 'text',
              template: '%{tempo|%{} BPM}%{time| \u00b7 %{}}%{capo| \u00b7 Capo %{}}',
              style: {
                name: 'Arial', style: 'normal', size: 11, color: '#6f6f6f',
              },
              position: {
                x: 'left', y: 40, width: 240, clip: true, ellipsis: true,
              },
              condition: {
                page: { first: true },
              },
            },
            {
              type: 'line',
              style: { width: 1, color: '#d7d7d7' },
              position: {
                x: 0, y: 60, width: 'auto', height: 0,
              },
              condition: {
                page: { first: true },
              },
            },
            {
              type: 'text',
              template: '%{key}',
              cssClass: 'measured-html-key-badge',
              elementStyle: {
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '999px',
                backgroundColor: '#a1312d',
                textAlign: 'center',
                boxSizing: 'border-box',
              },
              style: {
                name: 'Arial', style: 'bold', size: 12, color: '#ffffff', weight: 700,
              },
              position: {
                x: 'right', y: 12, width: 28, offsetX: -2,
              },
              condition: {
                and: [
                  { page: { first: true } },
                  { key: { exists: true } },
                ],
              },
            },
            {
              type: 'text',
              template: '%{title}',
              style: {
                name: 'Arial', style: 'bold', size: 12, color: '#151515', weight: 700,
              },
              position: {
                x: 'left', y: 0, width: 'auto', clip: true, ellipsis: true,
              },
              condition: {
                page: { greater_than: 1 },
              },
            },
            {
              type: 'text',
              template: '%{page}/%{pages}',
              style: {
                name: 'Arial', style: 'normal', size: 10, color: '#9a9a9a',
              },
              position: { x: 'right', y: 4, offsetX: -38 },
              condition: {
                page: { greater_than: 1 },
              },
            },
            {
              type: 'text',
              template: '%{key}',
              cssClass: 'measured-html-key-badge',
              elementStyle: {
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '999px',
                backgroundColor: '#a1312d',
                textAlign: 'center',
                boxSizing: 'border-box',
              },
              style: {
                name: 'Arial', style: 'bold', size: 12, color: '#ffffff', weight: 700,
              },
              position: {
                x: 'right', y: 2, width: 28, offsetX: -2,
              },
              condition: {
                and: [
                  { page: { greater_than: 1 } },
                  { key: { exists: true } },
                ],
              },
            },
            {
              type: 'line',
              style: { width: 1, color: '#d7d7d7' },
              position: {
                x: 0, y: 32, width: 'auto', height: 0,
              },
              condition: {
                page: { greater_than: 1 },
              },
            },
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
              name: 'Arial', style: 'bold', size: 9, color: '#232323',
            },
            fingerings: {
              name: 'Arial', style: 'bold', size: 6, color: '#232323',
            },
            baseFret: {
              name: 'Arial', style: 'bold', size: 6, color: '#232323',
            },
          },
        },
      },
    },
  },
];

export default measuredHtmlConfigs;
