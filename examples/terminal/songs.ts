import { chordproExamples } from '../../playground/fixtures/content/example-chordpro';

export interface TerminalSongExample {
  slug: string;
  name: string;
  content: string;
}

const playgroundSongs = [
  ['fit-columns', 'Fit Content to Columns'],
  ['kingdom', 'Kingdom'],
  ['firm-foundation', 'Firm Foundation (He Won\'t)'],
] as const;

/** Longer Playground fixtures that exercise terminal wrapping, columns, and scrolling. */
export const terminalSongExamples: TerminalSongExample[] = playgroundSongs.map(([slug, name]) => {
  const example = chordproExamples.find((candidate) => candidate.name === name);
  if (!example) throw new Error(`Missing Playground song fixture: ${name}`);
  return { slug, name, content: example.content };
});

export const defaultTerminalSong = 'kingdom';

export function getTerminalSongExample(slug = defaultTerminalSong): TerminalSongExample {
  const example = terminalSongExamples.find((candidate) => candidate.slug === slug);
  if (example) return example;
  const choices = terminalSongExamples.map((candidate) => candidate.slug).join(', ');
  throw new Error(`Unknown terminal song "${slug}". Choose one of: ${choices}`);
}
