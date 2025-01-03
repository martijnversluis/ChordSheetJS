import { HtmlTemplateArgs } from '../html_formatter';
import { renderChord } from '../../helpers';

import {
  each,
  evaluate,
  fontStyleTag,
  isChordLyricsPair,
  isComment,
  isEvaluatable,
  isTag,
  lineClasses,
  lineHasContents, newlinesToBreaks,
  paragraphClasses, renderSection,
  stripHTML,
  when,
} from '../../template_helpers';
import { isPresent } from '../../utilities';

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
        ${ when(paragraph.isLiteral(), () => `
          ${ when(isPresent(paragraph.label), () => `
            <div class="row">
              <h3 class="label">${ paragraph.label }</h3>
            </div>
          `) }

          <div class="row">
            <div class="literal">${ newlinesToBreaks(renderSection(paragraph, configuration)) }</div>
          </div>
        `).else(() => `
          ${ each(paragraph.lines, (line) => `
            ${ when(renderBlankLines || lineHasContents(line), () => `
              <div class="${ lineClasses(line) }">
                ${ each(line.items, (item) => `
                  ${ when(isChordLyricsPair(item), () => `
                    <div class="column">
                     ${ when(item.annotation).then(() => `
                       <div class="annotation"${ fontStyleTag(line.chordFont) }>${ item.annotation }</div>
                     `).else(() => `
                        <div class="chord"${ fontStyleTag(line.chordFont) }>
                          ${ renderChord(
                            item.chords,
                            line,
                            song,
                            {
                              renderKey: key,
                              useUnicodeModifier: configuration.useUnicodeModifiers,
                              normalizeChords: configuration.normalizeChords,
                              decapo: configuration.decapo,
                            },
                          ) }
                        </div>
                     `) }
                      <div class="lyrics"${ fontStyleTag(line.textFont) }>${ item.lyrics }</div>
                    </div>
                  `).elseWhen(isTag(item), () => `
                    ${ when(isComment(item), () => `
                      <div class="comment">${ item.value }</div>
                    `) }

                    ${ when(item.hasRenderableLabel(), () => `
                      <h3 class="label">${ item.label }</h3>
                    `) }
                  `).elseWhen(isEvaluatable(item), () => `
                    <div class="column">
                      <div class="chord"></div>
                      <div class="lyrics"${ fontStyleTag(line.textFont) }>
                        ${ evaluate(item, metadata, configuration) }
                      </div>
                    </div>
                  `) }
                `) }
              </div>
            `) }
          `) }
        `) }
      </div>
    `) }
  </div>
`);
