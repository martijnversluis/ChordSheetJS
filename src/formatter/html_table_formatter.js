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

  {{~#if bodyLines~}}
    <div class="chord-sheet">
      {{~#each bodyLines as |line|~}}
        {{~#if (shouldRenderLine line)~}}
          <table class="{{lineClasses line}}">
            {{~#if (hasChordContents line)~}}
              <tr>
                {{~#each items as |item|~}}
                  {{~#if (isChordLyricsPair item)~}}
                    <td class="chord">{{chords}}</td>
                  {{~/if~}}
                {{~/each~}}
              </tr>
            {{~/if~}}
              
            {{~#if (hasTextContents line)~}}
              <tr>
                {{~#each items as |item|~}}
                  {{~#if (isChordLyricsPair item)~}}
                    <td class="lyrics">{{lyrics}}</td>
                  {{~/if~}}
          
                  {{~#if (isTag item)~}}
                    {{~#if (isComment item)~}}
                      <td class="comment">{{value}}</td>
                    {{~/if~}}
                  {{~/if~}}
                {{~/each~}}
              </tr>
            {{~/if~}}
          </table>
        {{~/if~}}
      {{~/each~}}
    </div>
  {{~/if~}}
{{~/with~}}
`;

export default class HtmlTableFormatter extends HtmlFormatter {
  format(song) {
    return template({
      song,
      renderBlankLines: this.renderBlankLines,
    });
  }
}
