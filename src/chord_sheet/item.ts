import ChordLyricsPair from './chord_lyrics_pair';
import Comment from './comment';
import Literal from './chord_pro/literal';
import Tag from './tag';
import Ternary from './chord_pro/ternary';

type Item = ChordLyricsPair | Comment | Tag | Ternary | Literal;

export default Item;
