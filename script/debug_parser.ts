import process from 'process';
import PeggyOnline from './helpers/peggy_online';
import ParserBuilder from './helpers/parser_builder';

const parserSource = new ParserBuilder(process.argv[2]).build();

PeggyOnline
  .open(parserSource)
  .then(() => console.log('Done'))
  .catch((e) => console.error(e));
