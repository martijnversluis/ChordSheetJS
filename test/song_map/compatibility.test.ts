import fs from 'fs';
import {
  ChordProParser, ChordsOverWordsFormatter, ChordsOverWordsParser, Formatter, HtmlDivFormatter,
  HtmlTableFormatter, Song, TextFormatter, UltimateGuitarParser,
} from '../../src';

import PdfFormatter from '../../src/formatter/pdf_formatter';
import StubbedPdfDoc from '../util/stubbed_pdf_doc';

import { RenderOrder } from '../../src/song_map/presentation';
import { chordProSheetSymbol } from '../fixtures/chord_pro_sheet';
import { exampleSongSymbol } from '../fixtures/song';

type DisplayFormatter = new (configuration?: any) => Formatter & { format: (song: Song) => string };

function read(name: string): string {
  return fs.readFileSync(`./test/fixtures/${name}`, 'utf8');
}

/**
 * The text that a PDF render puts on the page, with its horizontal position. Vertical positions are left out
 * because the empty paragraphs that source order renders take up vertical space.
 */
function renderedText(song: Song, renderOrder: RenderOrder): string[] {
  const formatter = new PdfFormatter({ renderOrder });
  formatter.format(song, StubbedPdfDoc);

  return (formatter.getDocumentWrapper().doc as StubbedPdfDoc).renderedItems
    .filter((item) => item.type === 'text')
    .map((item) => `${(item as { text: string }).text}@${Math.round((item as { x: number }).x)}`);
}

/** Source order output emits a paragraph element for an empty paragraph, mapped order leaves it out */
function withoutEmptyParagraphs(html: string): string {
  return html.replace(/<div class="paragraph"><\/div>/g, '');
}

const songs: [string, Song][] = [
  ['a ChordPro chart with comment headers', new ChordProParser().parse(read('kingdom_chordpro.txt'))],
  ['a chords over words chart', new ChordsOverWordsParser().parse(read('kingdom_chords_over_words.txt'))],
  ['a chart with a written out repeat', new UltimateGuitarParser().parse(read('ultimate_guitar_chordsheet.txt'))],
  ['a chart with every section type', new ChordProParser().parse(chordProSheetSymbol)],
  ['the example song', exampleSongSymbol],
];

const textFormatters: [string, DisplayFormatter][] = [
  ['TextFormatter', TextFormatter],
  ['ChordsOverWordsFormatter', ChordsOverWordsFormatter],
];

const htmlFormatters: [string, DisplayFormatter][] = [
  ['HtmlDivFormatter', HtmlDivFormatter],
  ['HtmlTableFormatter', HtmlTableFormatter],
];

describe('song map compatibility', () => {
  describe.each(songs)('%s', (_name, song) => {
    describe.each([...textFormatters, ...htmlFormatters])('%s', (_formatterName, FormatterClass) => {
      it('renders source order by default', () => {
        const formatter = new FormatterClass();

        expect(formatter.format(song)).toEqual(new FormatterClass({ renderOrder: 'source' }).format(song));
        expect(formatter.diagnostics).toEqual([]);
        expect(formatter.songMapEntries).toEqual([]);
      });
    });

    describe.each(textFormatters)('%s', (_formatterName, FormatterClass) => {
      it('renders mapped order like source order', () => {
        const mapped = new FormatterClass({ renderOrder: 'mapped' }).format(song);

        expect(mapped).toEqual(new FormatterClass().format(song));
      });
    });

    describe.each(htmlFormatters)('%s', (_formatterName, FormatterClass) => {
      it('renders mapped order like source order, without its empty paragraphs', () => {
        const mapped = new FormatterClass({ renderOrder: 'mapped' }).format(song);

        expect(mapped).toEqual(withoutEmptyParagraphs(new FormatterClass().format(song)));
      });
    });

    describe('PdfFormatter', () => {
      it('renders the same text in mapped order as in source order', () => {
        expect(renderedText(song, 'mapped')).toEqual(renderedText(song, 'source'));
      });
    });
  });
});
