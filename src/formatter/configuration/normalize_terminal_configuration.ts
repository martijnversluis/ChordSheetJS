import { type DeepPartial, mergeConfigs } from '../../utilities';
import type { TerminalConfigurationInput, TerminalFormatterConfiguration } from './terminal_configuration';

const paths: Record<string, string[]> = {
  margins: ['global', 'margins'],
  pageSpacing: ['global', 'pageSpacing'],
  header: ['header'],
  footer: ['footer'],
  ...Object.fromEntries(
    [
      'columnCount',
      'columnSpacing',
      'minColumnWidth',
      'maxColumnWidth',
      'chordSpacing',
      'chordLyricSpacing',
      'linePadding',
      'paragraphSpacing',
    ].map((key) => [key, ['sections', 'global', key]]),
  ),
  lyricsOnly: ['sections', 'base', 'display', 'lyricsOnly'],
  showLabels: ['sections', 'base', 'display', 'showLabel'],
  uppercaseLabels: ['sections', 'base', 'display', 'labelStyle'],
  repeatedSections: ['sections', 'base', 'display', 'repeatedSections'],
};

function aliasValue(key: string, value: unknown): unknown {
  if (key === 'uppercaseLabels') return value ? 'uppercase' : undefined;
  if (key === 'repeatedSections' && typeof value === 'string') {
    return value === 'preserve' ? 'full' : value.replace('-', '_');
  }
  return value;
}

/** Normalize each incoming patch before merging; nested leaves win within that patch. */
export function normalizeTerminalConfiguration(
  input: TerminalConfigurationInput,
): DeepPartial<TerminalFormatterConfiguration> {
  let aliases = {};
  const rest: Record<string, unknown> = {};
  Object.entries(input).forEach(([key, value]) => {
    const path = paths[key];
    if (!path) {
      rest[key] = value;
      return;
    }
    const branch = path.reduceRight((child, segment) => ({ [segment]: child }), aliasValue(key, value));
    aliases = mergeConfigs(aliases, branch as object);
  });
  return {
    ...rest,
    layout: mergeConfigs(aliases, input.layout ?? {}),
  } as DeepPartial<TerminalFormatterConfiguration>;
}
