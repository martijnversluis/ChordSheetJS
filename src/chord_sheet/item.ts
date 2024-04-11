import ChordLyricsPair from './chord_lyrics_pair';
import Comment from './comment';
import Tag from './tag';
import Ternary from './chord_pro/ternary';
import Literal from './chord_pro/literal';

type Item = ChordLyricsPair | Comment | Tag | Ternary | Literal;

export default Item;
