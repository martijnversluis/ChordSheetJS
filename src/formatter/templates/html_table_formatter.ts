import { hasChordContents, isEvaluatable } from '../../utilities';
import { renderChord } from '../../helpers';
import { HtmlTemplateArgs } from '../html_formatter';

import {
  each,
  evaluate,
  hasTextContents,
  isChordLyricsPair,
  isComment,
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
    song,
    renderBlankLines = false,
    song: {
      title,
      subtitle,
      bodyParagraphs,
      bodyLines,
      metadata,
    },
  }: HtmlTemplateArgs,
): string => stripHTML(`
  ${ when(title, () => `<h1>${ title}</h1>`) }
  ${ when(subtitle, () => `<h2>${ subtitle}</h2>`) }

  ${ when(bodyLines.length > 0, () => `
    <div class="chord-sheet">
      ${ each(bodyParagraphs, (paragraph) => `
        <div class="${ paragraphClasses(paragraph)}">
          ${ each(paragraph.lines, (line) => `
            ${ when(renderBlankLines || lineHasContents(line), () => `
              <table class="${ lineClasses(line)}">
                ${ when(hasChordContents(line), () => `
                  <tr>
                    ${ each(line.items, (item) => `
                      ${ when(isChordLyricsPair(item), () => `
                        <td class="chord">${ 
                          renderChord(item.chords, line.key, line.transposeKey, song)
                        }</td>
                      `)}
                    `)}
                  </tr>
                `)}
                
                ${ when(hasTextContents(line), () => `
                  <tr>
                    ${ each(line.items, (item) => `
                      ${ when(isChordLyricsPair(item), () => `
                        <td class="lyrics">${ item.lyrics}</td>
                      `)}
                      
                      ${ when(isTag(item), () => `
                        ${ when(isComment(item), () => `
                          <td class="comment">${ item.value }</td>
                        `) }
                        
                        ${ when(item.hasRenderableLabel(), () => `
                          <td><h3 class="label">${ item.value }</h3></td>
                        `) }
                      `) }
                      
                      ${ when(isEvaluatable(item), () => `
                        <td class="lyrics">${ evaluate(item, metadata, configuration) }</td>
                      `) }
                    `)}
                  </tr>
                `)}
              </table>
            `)}
          `)}
        </div>
      `)}
    </div>
  `)}
`);
