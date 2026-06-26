import type Line from './line';
import { COMMENT_BRAND, brandPrototype, hasBrand } from './object_brand';

/**
 * Represents a comment. See https://www.chordpro.org/chordpro/chordpro-file-format-specification/#overview
 */
class Comment {
  static [Symbol.hasInstance](instance: unknown): boolean {
    return hasBrand(instance, COMMENT_BRAND);
  }

  content: string;

  parentLine: Line | null = null;

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

brandPrototype(Comment.prototype, COMMENT_BRAND);

export default Comment;
