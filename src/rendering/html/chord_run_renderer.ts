import HtmlElementStyler from './html_element_styler';
import { MeasuredHtmlFormatterConfiguration } from '../../formatter/configuration';
import { PositionedElement } from '../renderer';
import { ChordTextPart, ChordTextRun, buildChordRuns } from '../chord_shaper';

function partClassNames(part: ChordTextPart, styler: HtmlElementStyler): string[] {
  const classes = [`${styler.prefix}chord-${part}`];
  if (part === 'extensions') classes.push(`${styler.prefix}chord-extension`);
  return classes;
}

function appendRun(htmlElement: HTMLElement, run: ChordTextRun, styler: HtmlElementStyler) {
  const span = document.createElement('span');
  span.className = styler.createClassName(
    `${styler.prefix}chord-run`,
    ...partClassNames(run.part, styler),
  );
  span.textContent = run.text;
  styler.applyFontStyle(span, run.font);
  if (run.yOffset !== 0) {
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

  const runs = buildChordRuns(element.content, {
    chordFont: element.style,
    chordRendering: configuration.chordRendering,
    chordSuperscript: configuration.chordSuperscript,
    useUnicodeModifiers,
  });
  if (!runs) return;

  const target = htmlElement;
  target.textContent = '';
  runs.forEach((run) => appendRun(target, run, styler));
}
