import ChordProParser from './parser/chord_pro_parser';
import ChordSheetParser from './parser/chord_sheet_parser';
import TextFormatter from './formatter/text_formatter';
import HtmlFormatter from './formatter/html_formatter';
import ChordProFormatter from './formatter/chord_pro_formatter';

const ChordSheetJS = {
  ChordProParser,
  ChordSheetParser,
  TextFormatter,
  HtmlFormatter,
  ChordProFormatter
};

if (typeof window == 'object') {
  window.ChordSheetJS = ChordSheetJS;
}

export default ChordSheetJS;
