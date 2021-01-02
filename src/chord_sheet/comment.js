/**
 * Represents a comment. See https://www.chordpro.org/chordpro/chordpro-file-format-specification/#overview
 */
class Comment {
  constructor(content) {
    this.content = content;
  }

  /**
   * Indicates whether a Comment should be visible in a formatted chord sheet (except for ChordPro sheets)
   * @returns {boolean}
   */
  isRenderable() {
    return false;
  }

  /**
   * Returns a deep copy of the Comment, useful when programmatically transforming a song
   * @returns {Comment}
   */
  clone() {
    return new Comment(this.content);
  }

  toString() {
    return `Comment(content=${this.content})`;
  }
}

export default Comment;
