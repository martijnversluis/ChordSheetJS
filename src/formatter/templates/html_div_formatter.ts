import { HtmlTemplateArgs } from "../html_formatter";
import { renderChord } from '../../helpers';

import {
  each,
  evaluate, fontStyleTag,
  isChordLyricsPair,
  isComment,
  isEvaluatable,
  isTag, keep,
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
      bodyParagraphs,
      metadata,
    },
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
                    ${ keep([renderChord(item.chords, line, song, key)], ([renderedChord]) => `
                      <div class="chord"${ fontStyleTag(line.chordFont) }>${ renderedChord }</div>
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
                    
                    ${ keep([evaluate(item, metadata, configuration)], ([evaluated]) => `
                      <div class="lyrics"${ fontStyleTag(line.textFont) }>${ evaluated }</div>
                    `) }
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
