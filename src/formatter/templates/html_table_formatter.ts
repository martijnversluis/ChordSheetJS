import { HtmlTemplateArgs } from '../html_formatter';
import { renderChord } from '../../helpers';
import { hasChordContents, isEvaluatable, isPresent } from '../../utilities';

import {
  each,
  evaluate,
  fontStyleTag,
  hasTextContents,
  isChordLyricsPair,
  isComment, isLiteral,
  isTag,
  lineClasses,
  lineHasContents, newlinesToBreaks,
  paragraphClasses, renderSection,
  stripHTML,
  when,
} from '../../template_helpers';

export default (
  {
    configuration,
    configuration: {
      key,
      cssClasses: c,
    },
    song,
    renderBlankLines = false,
    song: {
      title,
      subtitle,
      bodyLines,
      metadata,
    },
    bodyParagraphs,
  }: HtmlTemplateArgs,
): string => stripHTML(`
  ${ when(title, () => `<h1 class="${ c.title }">${ title }</h1>`) }
  ${ when(subtitle, () => `<h2 class="${ c.subtitle }">${ subtitle }</h2>`) }

  ${ when(bodyLines.length > 0, () => `
    <div class="${ c.chordSheet }">
      ${ each(bodyParagraphs, (paragraph) => `
        <div class="${ paragraphClasses(paragraph, c) }">
          ${ when(paragraph.isLiteral(), () => `
            ${ when(isPresent(paragraph.label), () => `
              <table class="${ c.row }">
                <tr>
                  <td class="${ c.labelWrapper }">
                    <h3 class="${ c.label }">${ paragraph.label }</h3>
                  </td>
                </tr>
              </table>
            `) }

            <table class="${ c.literal }">
              <tr>
                <td class="${ c.literalContents }">${ newlinesToBreaks(renderSection(paragraph, configuration)) }</td>
              </tr>
            </table>
          `).else(() => `
            ${ each(paragraph.lines, (line) => `
              ${ when(renderBlankLines || lineHasContents(line), () => `
                <table class="${ lineClasses(line, c) }">
                  ${ when(hasChordContents(line), () => `
                    <tr>
                      ${ each(line.items, (item) => `
                        ${ when(isChordLyricsPair(item), () => `
                          ${ when(item.annotation).then(() => `
                            <td class="${ c.annotation }"${ fontStyleTag(line.chordFont) }>${ item.annotation }</td>
                          `).else(() => `
                            <td class="${ c.chord }"${ fontStyleTag(line.chordFont) }>${
                              renderChord(
                                item.chords,
                                line,
                                song,
                                {
                                  renderKey: key,
                                  useUnicodeModifier: configuration.useUnicodeModifiers,
                                  normalizeChords: configuration.normalizeChords,
                                  decapo: configuration.decapo,
                                },
                              )
                            }</td>
                          `) }
                        `) }
                      `) }
                    </tr>
                  `) }
                  ${ when(hasTextContents(line), () => `
                    <tr>
                      ${ each(line.items, (item) => `
                        ${ when(isChordLyricsPair(item), () => `
                          <td class="${ c.lyrics }"${ fontStyleTag(line.textFont) }>${ item.lyrics }</td>
                        `).elseWhen(isTag(item), () => `
                          ${ when(isComment(item), () => `
                            <td class="${ c.comment }"${ fontStyleTag(line.textFont) }>${ item.value }</td>
                          `) }

                          ${ when(item.hasRenderableLabel(), () => `
                            <td class="${ c.labelWrapper }">
                              <h3 class="${ c.label }"${ fontStyleTag(line.textFont) }>${ item.label }</h3>
                            </td>
                          `) }
                        `).elseWhen(isLiteral(item), () => `
                          <td class="${ c.literal }">${ item.string }</td>
                        `).elseWhen(isEvaluatable(item), () => `
                          <td class="${ c.lyrics }"${ fontStyleTag(line.textFont) }>
                            ${ evaluate(item, metadata, configuration) }
                          </td>
                        `) }
                      `) }
                    </tr>
                  `) }
                </table>
              `) }
            `) }
          `) }
        </div>
      `) }
    </div>
  `) }
`);
