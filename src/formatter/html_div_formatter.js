import hbs from 'handlebars-inline-precompile';
import HandleBars from 'handlebars/runtime';

import HtmlFormatter from './html_formatter';
import htmlEntitiesEncode from './html_entities_encode';
import ChordLyricsPair from '../chord_sheet/chord_lyrics_pair';
import Tag from '../chord_sheet/tag';

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

const template = hbs`
{{~#with song~}}
  {{~#if title~}}
    <h1>{{~title~}}</h1>
  {{~/if~}}

  {{~#if subtitle~}}
    <h2>{{~subtitle~}}</h2>
  {{~/if~}}

  <div class="chord-sheet">
    {{~#each bodyLines as |line|~}}
      {{~#if (shouldRenderLine line)~}}
        <div class="{{lineClasses line}}">
          {{~#each items as |item|~}}
            {{~#if (isChordLyricsPair item)~}}
              <div class="column"><div class="chord">{{chords}}</div><div class="lyrics">{{lyrics}}</div></div>
            {{~/if~}}
    
            {{~#if (isTag item)~}}
              {{~#if (isComment item)~}}
                <div class="comment">{{value}}</div>
              {{~/if~}}
            {{~/if~}}
          {{~/each~}}
        </div>
      {{~/if~}}
    {{~/each~}}
  </div>
{{~/with~}}`;

export default class HtmlDivFormatter extends HtmlFormatter {
  constructor({ renderBlankLines = true } = {}) {
    super();
    this.renderBlankLines = renderBlankLines;
  }

  format(song) {
    return template({
      song,
      renderBlankLines: this.renderBlankLines
    });
  }
}
