import HandleBars from 'handlebars/runtime';

import ChordLyricsPair from './chord_sheet/chord_lyrics_pair';
import Tag from './chord_sheet/tag';

const lineHasContents = (line) => {
  return line.items.some((item) => {
    return item instanceof ChordLyricsPair || (item instanceof Tag && item.isRenderable());
  });
};

HandleBars.registerHelper('isChordLyricsPair', (item) => {
  return item instanceof ChordLyricsPair;
});

HandleBars.registerHelper('isTag', (item) => {
  return item instanceof Tag;
});

HandleBars.registerHelper('isComment', (item) => {
  return item.name === 'comment';
});

HandleBars.registerHelper('shouldRenderLine', (line, options) => {
  if (options.data.root.renderBlankLines) {
    return true;
  }

  return lineHasContents(line);
});

HandleBars.registerHelper('lineHasContents', lineHasContents);

HandleBars.registerHelper('lineClasses', (line) => {
  const classes = ['row'];

  if (!lineHasContents(line)) {
    classes.push('empty-line');
  }

  return classes.join(' ');
});
