import {hasChordContents, isEvaluatable} from '../../utilities';
import {renderChord} from '../../helpers';
import {HtmlTemplateArgs} from '../html_formatter';

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
      bodyLines,
      metadata,
    },
    bodyParagraphs,
  }: HtmlTemplateArgs,
): string => stripHTML(`
  ${ when(title, () => `<h1>${ title}</h1>`) }
  ${ when(subtitle, () => `<h2>${ subtitle}</h2>`) }

  ${ when(bodyLines.length > 0, () => `
    <div class="chord-sheet">
      ${ each(bodyParagraphs, (paragraph) => `
        <div class="${ paragraphClasses(paragraph) }">
          ${ when(paragraph.isLiteral(), () => `
            <table class="literal">
              <tr>
                <td class="label">${ paragraph.label }</td>
                <td class="contents">${ newlinesToBreaks(paragraph.contents) }</td>
              </tr>
            </table>
          `).else(() => `
            ${ each(paragraph.lines, (line) => `
              ${ when(renderBlankLines || lineHasContents(line), () => `
                <table class="${ lineClasses(line)}">
                  ${ when(hasChordContents(line), () => `
                    <tr>
                      ${ each(line.items, (item) => `
                        ${ when(isChordLyricsPair(item), () => `
                          ${ when(item.annotation).then(() => `
                            <td class="annotation"${fontStyleTag(line.chordFont)}>${item.annotation}</td>
                          `).else(() => `
                            <td class="chord"${fontStyleTag(line.chordFont)}>${
                              renderChord(
                                item.chords,
                                line,
                                song,
                                {
                                  renderKey: key,
                                  useUnicodeModifier: configuration.useUnicodeModifiers,
                                  normalizeChords: configuration.normalizeChords,
                                },
                              )
                            }</td>
                          `) }
                        `) }
                      `) }
                    </tr>
                  `)}
                  
                  ${ when(hasTextContents(line), () => `
                    <tr>
                      ${ each(line.items, (item) => `
                        ${ when(isChordLyricsPair(item), () => `
                          <td class="lyrics"${fontStyleTag(line.textFont)}>${ item.lyrics}</td>
                        `).elseWhen(isTag(item), () => `
                          ${ when(isComment(item), () => `
                            <td class="comment"${fontStyleTag(line.textFont)}>${ item.value }</td>
                          `) }
                          
                          ${ when(item.hasRenderableLabel(), () => `
                            <td><h3 class="label"${fontStyleTag(line.textFont)}>${ item.value }</h3></td>
                          `) }
                        `).elseWhen(isLiteral(item), () => `
                          <td class="literal">${item.string}</td>
                        `).elseWhen(isEvaluatable(item), () => `
                          <td class="lyrics"${fontStyleTag(line.textFont)}>${ evaluate(item, metadata, configuration) }</td>
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
  `)}
`);
