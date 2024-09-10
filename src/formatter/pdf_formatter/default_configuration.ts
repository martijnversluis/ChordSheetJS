import { PDFConfiguration } from './types';

const defaultConfiguration: PDFConfiguration = {
  // Font settings for various elements
  fonts: {
    title: {
      name: 'helvetica', style: 'bold', size: 24, color: 'black',
    },
    subtitle: {
      name: 'helvetica', style: 'normal', size: 10, color: 100,
    },
    metadata: {
      name: 'helvetica', style: 'normal', size: 10, color: 100,
    },
    text: {
      name: 'helvetica', style: 'normal', size: 10, color: 'black',
    },
    chord: {
      name: 'helvetica', style: 'bold', size: 10, color: 'black',
    },
    comment: {
      name: 'helvetica', style: 'bold', size: 10, color: 'black',
    },
    annotation: {
      name: 'helvetica', style: 'normal', size: 10, color: 'black',
    },
  },
  // Layout settings
  margintop: 25,
  marginbottom: 10,
  marginleft: 25,
  marginright: 25,
  lineHeight: 5,
  chordLyricSpacing: 0,
  linePadding: 8,
  numberOfSpacesToAdd: 2,
  columnCount: 2,
  columnWidth: 0,
  columnSpacing: 25,
  layout: {
    header: {
      height: 60,
      content: [
        {
          type: 'text',
          template: '%{title}',
          style: {
            name: 'helvetica', style: 'bold', size: 24, color: 'black',
          },
          position: { x: 'left', y: 15 },
        },
        {
          type: 'text',
          template: 'Key of %{key} - BPM %{tempo} - Time %{time}',
          style: {
            name: 'helvetica', style: 'normal', size: 12, color: 100,
          },
          position: { x: 'left', y: 28 },
        },
        {
          type: 'text',
          template: 'By %{artist} %{subtitle}',
          style: {
            name: 'helvetica', style: 'normal', size: 10, color: 100,
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
            name: 'helvetica', style: 'normal', size: 10, color: 'black',
          },
          position: { x: 'left', y: 0 },
        },
      ],
    },
  },
};

export default defaultConfiguration;
