import process from 'process';

import ParserBuilder from './helpers/parser_builder';
import PeggyOnline from './helpers/peggy_online';

const parserSource = new ParserBuilder(process.argv[2]).build();

PeggyOnline
  .open(parserSource)
  .then(() => console.log('Done'))
  .catch((e) => console.error(e));
