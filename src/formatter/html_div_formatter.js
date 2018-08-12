import hbs from 'handlebars-inline-precompile';

import HtmlFormatter from './html_formatter';
import '../handlebars_helpers';

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
