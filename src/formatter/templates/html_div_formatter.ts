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
    cssClasses: c,
  }: HtmlTemplateArgs,
): string => stripHTML(`
  ${ when(title, () => `<h1 class="${ c.title }">${ title }</h1>`) }
  ${ when(subtitle, () => `<h2 class="${ c.subtitle }">${ subtitle }</h2>`) }

  <div class="${ c.chordSheet }">
    ${ each(bodyParagraphs, (paragraph) => `
      <div class="${ paragraphClasses(paragraph, c) }">
        ${ when(paragraph.isLiteral(), () => `
          ${ when(isPresent(paragraph.label), () => `
            <div class="${ c.row }">
              <h3 class="${ c.label }">${ paragraph.label }</h3>
            </div>
          `) }

          <div class="${ c.row }">
            <div class="${ c.literal }">${ newlinesToBreaks(renderSection(paragraph, configuration)) }</div>
          </div>
        `).else(() => `
          ${ each(paragraph.lines, (line) => `
            ${ when(renderBlankLines || lineHasContents(line), () => `
              <div class="${ lineClasses(line, c) }">
                ${ each(line.items, (item) => `
                  ${ when(isChordLyricsPair(item), () => `
                    <div class="${ c.column }">
                     ${ when(item.annotation).then(() => `
                       <div class="${ c.annotation }"${ fontStyleTag(line.chordFont) }>${ item.annotation }</div>
                     `).else(() => `
                        <div class="${ c.chord }"${ fontStyleTag(line.chordFont) }>
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
                      <div class="${ c.lyrics }"${ fontStyleTag(line.textFont) }>${ item.lyrics }</div>
                    </div>
                  `).elseWhen(isTag(item), () => `
                    ${ when(isComment(item), () => `
                      <div class="${ c.comment }">${ item.value }</div>
                    `) }

                    ${ when(item.hasRenderableLabel(), () => `
                      <h3 class="${ c.label }">${ item.label }</h3>
                    `) }
                  `).elseWhen(isEvaluatable(item), () => `
                    <div class="${ c.column }">
                      <div class="${ c.chord }"></div>
                      <div class="${ c.lyrics }"${ fontStyleTag(line.textFont) }>
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
