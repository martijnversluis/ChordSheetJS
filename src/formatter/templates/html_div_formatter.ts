import { HtmlTemplateArgs } from "../html_formatter";
import { renderChord } from '../../helpers';

import {
  each, evaluate,
  isChordLyricsPair,
  isComment,
  isEvaluatable,
  isTag,
  lineClasses,
  lineHasContents,
  paragraphClasses,
  stripHTML, when,
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
                    <div class="chord">${ renderChord(item.chords, line.key, line.transposeKey, song) }</div>
                    <div class="lyrics">${ item.lyrics }</div>
                  </div>
                `) }
                
                ${ when(isTag(item) && isComment(item), () => `<div class="comment">${ item.value }</div>`) }
                
                ${ when(isEvaluatable(item), () => `
                  <div class="column">
                    <div class="chord"></div>
                    <div class="lyrics">${ evaluate(item, metadata, configuration) }</div>
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
