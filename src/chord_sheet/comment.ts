/**
 * Represents a comment. See https://www.chordpro.org/chordpro/chordpro-file-format-specification/#overview
 */
class Comment {
  content: string;

  constructor(content: string) {
    this.content = content;
  }

  /**
   * Indicates whether a Comment should be visible in a formatted chord sheet (except for ChordPro sheets)
   * @returns {boolean}
   */
  isRenderable(): boolean {
    return false;
  }

  /**
   * Returns a deep copy of the Comment, useful when programmatically transforming a song
   * @returns {Comment}
   */
  clone(): Comment {
    return new Comment(this.content);
  }

  toString(): string {
    return `Comment(content=${this.content})`;
  }
}

export default Comment;
