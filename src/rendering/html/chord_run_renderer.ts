import HtmlElementStyler from './html_element_styler';
import { MeasuredHtmlFormatterConfiguration } from '../../formatter/configuration';
import { PositionedElement } from '../renderer';
import { ChordTextRun, buildChordRuns } from '../chord_shaper';

function appendRun(htmlElement: HTMLElement, run: ChordTextRun, styler: HtmlElementStyler) {
  const span = document.createElement('span');
  span.className = styler.createClassName(
    `${styler.prefix}chord-run`,
    run.superscript ? `${styler.prefix}chord-extension` : undefined,
  );
  span.textContent = run.text;
  if (run.superscript) {
    span.style.fontSize = `${run.font.size}px`;
    span.style.position = 'relative';
    span.style.top = `${run.yOffset}px`;
  }
  htmlElement.appendChild(span);
}

export default function renderChordRuns(
  htmlElement: HTMLElement,
  element: PositionedElement,
  configuration: MeasuredHtmlFormatterConfiguration,
  styler: HtmlElementStyler,
  useUnicodeModifiers: boolean,
): void {
  if (element.type !== 'chord' || !element.style) return;

  const superscript = configuration.chordSuperscript;
  if (!superscript?.enabled) return;

  const runs = buildChordRuns(element.content, useUnicodeModifiers, superscript, element.style);
  if (!runs) return;

  const target = htmlElement;
  target.textContent = '';
  runs.forEach((run) => appendRun(target, run, styler));
}
