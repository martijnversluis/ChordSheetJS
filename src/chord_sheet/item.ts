import ChordLyricsPair from './chord_lyrics_pair';
import Comment from './comment';
import Tag from './tag';
import Ternary from './chord_pro/ternary';

type Item = ChordLyricsPair | Comment | Tag | Ternary;

export default Item;
