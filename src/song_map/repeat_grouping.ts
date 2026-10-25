import RepeatInstruction from './repeat_instruction';
import SongMapOccurrence from './song_map_occurrence';

import { RepeatPresentation } from './presentation';

/**
 * Groups the consecutive occurrences of one section, the runs that condensed presentation can combine into
 * one visible section.
 */
function occurrenceRuns(occurrences: SongMapOccurrence[]): SongMapOccurrence[][] {
  return occurrences.reduce((runs: SongMapOccurrence[][], occurrence) => {
    const current = runs[runs.length - 1];

    if (current && current[0].section === occurrence.section) {
      current.push(occurrence);
    } else {
      runs.push([occurrence]);
    }

    return runs;
  }, []);
}

/**
 * Whether the presentation combines the occurrences of a run into one visible section. A section without a
 * delimiter has no label to carry the repeat count, so its occurrences stay expanded.
 */
function isCondensed(run: SongMapOccurrence[], presentation: RepeatPresentation): boolean {
  return presentation === 'condensed' && run.length > 1 && run[0].section.hasDelimiter;
}

/** The label of a section that is performed `count` times in a row, for example `Chorus (2x)` */
function repeatLabel(label: string, count: number): string {
  return [RepeatInstruction.strip(label), `(${count}x)`].filter((part) => part.length > 0).join(' ');
}

export { isCondensed, occurrenceRuns, repeatLabel };
