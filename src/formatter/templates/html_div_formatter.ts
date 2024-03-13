import {HtmlTemplateArgs} from "../html_formatter";
import {renderChord} from '../../helpers';

import {
  each,
  evaluate,
  fontStyleTag,
  isChordLyricsPair,
  isComment,
  isEvaluatable,
  isTag,
  lineClasses,
  lineHasContents,
  paragraphClasses,
  stripHTML,
  when,
} from '../../template_helpers';

export default (
  {
    configuration,
    configuration: {
      key,
    },
    song,
    renderBlankLines = false,
    song: {
      title,
      subtitle,
      metadata,
    },
    bodyParagraphs,
  }: HtmlTemplateArgs,
): string => stripHTML(`
  ${ when(title, () => `<h1>${ title }</h1>`) }
  ${ when(subtitle, () => `<h2>${ subtitle }</h2>`) }
  
  <div class="chord-sheet">
    ${ each(bodyParagraphs, (paragraph) => `
      <div class="${ paragraphClasses(paragraph) }">
        ${ each(paragraph.lines, (line) => `
          ${ when(renderBlankLines || lineHasContents(line), () => `
            <div class="${ lineClasses(line) }">
              ${ each(line.items, (item) => `
                ${ when(isChordLyricsPair(item), () => `
                  <div class="column">
                   ${ when(item.annotation).then(() => `
                     <div class="annotation"${ fontStyleTag(line.chordFont) }>${item.annotation}</div>
                   `).else(() => `
                      <div class="chord"${ fontStyleTag(line.chordFont) }>${
                        renderChord(
                          item.chords,
                          line,
                          song,
                          {
                            renderKey: key,
                            useUnicodeModifier: configuration.useUnicodeModifiers,
                            normalizeChords: configuration.normalizeChords,
                          }
                        )
                      }</div>
                   `) }
                    <div class="lyrics"${ fontStyleTag(line.textFont) }>${ item.lyrics }</div>
                  </div>
                `) }
                
                ${ when(isTag(item), () => `
                  ${ when(isComment(item), () => `
                    <div class="comment">${ item.value }</div>
                  `) }
                  
                  ${ when(item.hasRenderableLabel(), () => `
                    <h3 class="label">${ item.value }</h3>
                  `) }
                `) }
                
                ${ when(isEvaluatable(item), () => `
                  <div class="column">
                    <div class="chord"></div>
                    <div class="lyrics"${ fontStyleTag(line.textFont) }>${ evaluate(item, metadata, configuration) }</div>
                  </div>
                `) }
              `) }
            </div>
          `) }
        `) }
      </div>
    `) }
  </div>
`);
