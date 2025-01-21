import { PDFConfiguration } from './types';

const defaultConfiguration: PDFConfiguration = {
  // Font settings for various elements
  fonts: {
    title: {
      name: 'NimbusSansL-Bol', style: 'bold', size: 24, color: 'black',
    },
    subtitle: {
      name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 100,
    },
    metadata: {
      name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 100,
    },
    text: {
      name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 'black',
    },
    chord: {
      name: 'NimbusSansL-Bol', style: 'bold', size: 9, color: 'black',
    },
    comment: {
      name: 'NimbusSansL-Bol', style: 'bold', size: 10, color: 'black',
    },
    sectionLabel: {
      name: 'NimbusSansL-Bol', style: 'bold', size: 10, color: 'black',
    },
    annotation: {
      name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 'black',
    },
  },
  layout: {
    global: {
      margins: {
        top: 35,
        bottom: 10,
        left: 45,
        right: 45,
      },
    },
    header: {
      height: 60,
      content: [
        {
          type: 'text',
          template: '%{title}',
          style: {
            name: 'NimbusSansL-Bol', style: 'bold', size: 24, color: 'black',
          },
          position: { x: 'left', y: 15 },
        },
        {
          type: 'text',
          template: 'Key of %{key} - BPM %{tempo} - Time %{time}',
          style: {
            name: 'NimbusSansL-Reg', style: 'normal', size: 12, color: 100,
          },
          position: { x: 'left', y: 28 },
        },
        {
          type: 'text',
          template: 'By %{artist} %{subtitle}',
          style: {
            name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 100,
          },
          position: { x: 'left', y: 38 },
        },
      ],
    },
    footer: {
      height: 30,
      content: [
        {
          type: 'text',
          value: '©2024 My Music Publishing',
          style: {
            name: 'NimbusSansL-Reg', style: 'normal', size: 10, color: 'black',
          },
          position: { x: 'left', y: 0 },
        },
      ],
    },
    sections: {
      global: {
        paragraphSpacing: 10,
        linePadding: 4,
        chordLyricSpacing: 2,
        chordSpacing: 2,
        columnCount: 2,
        columnWidth: 0,
        columnSpacing: 25,
      },
      base: {
        display: {
          lyricsOnly: false,
        },
      },
    },
  },
};

export default defaultConfiguration;
