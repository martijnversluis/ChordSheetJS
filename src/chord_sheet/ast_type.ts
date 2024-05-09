import ChordLyricsPair from './chord_lyrics_pair';
import Comment from './comment';
import Tag from './tag';
import Ternary from './chord_pro/ternary';
import Evaluatable from './chord_pro/evaluatable';
import Literal from './chord_pro/literal';
import SoftLineBreak from './soft_line_break';

type AstType = ChordLyricsPair | Comment | Tag | Ternary | Evaluatable | Literal | SoftLineBreak;

export default AstType;
