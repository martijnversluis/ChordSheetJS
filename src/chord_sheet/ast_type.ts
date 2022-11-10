import ChordLyricsPair from './chord_lyrics_pair';
import Comment from './comment';
import Tag from './tag';
import Ternary from './chord_pro/ternary';
import Evaluatable from './chord_pro/evaluatable';
import Literal from './chord_pro/literal';

type AstType = ChordLyricsPair | Comment | Tag | Ternary | Evaluatable | Literal;

export default AstType;
