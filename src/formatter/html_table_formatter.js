import hbs from 'handlebars-inline-precompile';

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
      {{~#each paragraphs as |paragraph|~}}
        <div class="{{paragraphClasses paragraph}}">
          {{~#each lines as |line|~}}
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
      {{~/each~}}
    </div>
  {{~/if~}}
{{~/with~}}
`;

/**
 * Formats a song into HTML. It uses TABLEs to align lyrics with chords, which makes the HTML for things like
 * PDF conversion.
 */
class HtmlTableFormatter {
  /**
   * Formats a song into HTML.
   * @param {Song} song The song to be formatted
   * @returns {string} The HTML string
   */
  format(song) {
    return template({ song });
  }
}

export default HtmlTableFormatter;
