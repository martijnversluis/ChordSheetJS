(function() {
  var CHORD_BASS_SEPARATOR, CHORD_KEY, CHORD_MODIFIER, COLON, CURLY_END, CURLY_START, ChordProJS, ELSE, Formatter, HtmlFormatter, Item, LYRICS, Line, NEW_LINE, Parser, ParserBase, ParserCondition, ParserState, SQUARE_END, SQUARE_START, Song, TAG_NAME, TAG_VALUE, TextFormatter, WHITESPACE,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ELSE = 'else';

  ParserState = (function() {
    function ParserState(name1, callback) {
      this.name = name1;
      this.conditions = [];
      this.conditionCount = 0;
      callback.call(this);
    }

    ParserState.prototype["on"] = function(condition, callback) {
      return this.conditions[this.conditionCount++] = new ParserCondition(condition, callback);
    };

    ParserState.prototype["else"] = function(callback) {
      return this.on(ELSE, callback);
    };

    return ParserState;

  })();

  ParserCondition = (function() {
    function ParserCondition(condition1, callback1) {
      this.condition = condition1;
      this.callback = callback1;
    }

    return ParserCondition;

  })();

  ParserBase = (function() {
    ParserBase.prototype.debugging = false;

    function ParserBase() {
      this.waitForExpr = null;
      this.states = {};
      this.namelessConditionIndex = 0;
      this.currentState = null;
    }

    ParserBase.prototype.waitFor = function(waitForExpr) {
      this.waitForExpr = waitForExpr;
    };

    ParserBase.prototype.error = function(message) {
      return console.error(message);
    };

    ParserBase.prototype.debug = function(message, level) {
      var l;
      l = 0;
      while (l++ < level) {
        message = "    " + message;
      }
      if (this.debugging) {
        return console.log(message);
      }
    };

    ParserBase.prototype.handleWaitForExpr = function(chr) {
      if (this.testCondition(this.waitForExpr, chr)) {
        this.debug("was waiting for " + this.waitForExpr + ", now found", 1);
        return this.waitForExpr = null;
      } else {
        return this.debug("still waiting for " + this.waitForExpr, 1);
      }
    };

    ParserBase.prototype.char = function(chr) {
      if (chr === '\n') {
        return '<NEW LINE>';
      }
      if (chr === ' ') {
        return '<SPACE>';
      }
      return chr;
    };

    ParserBase.prototype.parse = function(contents) {
      var chr, i, len;
      for (i = 0, len = contents.length; i < len; i++) {
        chr = contents[i];
        this.debug((this.char(chr)) + " #####");
        if (this.waitForExpr) {
          this.handleWaitForExpr(chr);
          continue;
        }
        this.debug("No expression to wait for, testing conditions", 1);
        this.testConditions(chr);
      }
    };

    ParserBase.prototype.getNewState = function(chr, callback) {
      var newState;
      if ((newState = callback.call(this, chr))) {
        if (newState && newState !== this.currentState && newState instanceof ParserState) {
          return this.currentState = newState;
        }
      }
      return null;
    };

    ParserBase.prototype.transitionTo = function(name) {
      return this.states[name];
    };

    ParserBase.prototype.testConditions = function(chr) {
      var condition, i, len, newState, ref;
      ref = this.currentState.conditions;
      for (i = 0, len = ref.length; i < len; i++) {
        condition = ref[i];
        this.debug("condition " + condition.condition, 1);
        if (this.testCondition(condition.condition, chr)) {
          this.debug("matches condition, calling callback " + condition.callback, 2);
          if ((newState = this.getNewState(chr, condition.callback))) {
            this.debug("new state: " + newState.name, 1);
          } else {
            this.debug("state remains " + this.currentState.name, 1);
          }
          return;
        }
      }
      return this.debug("did not match any condition. State remains " + this.currentState.name, 1);
    };

    ParserBase.prototype.testCondition = function(condition, chr) {
      if (condition === ELSE) {
        this.debug("Condition is ELSE conditions, so condition matches", 3);
        return true;
      } else if (condition instanceof RegExp) {
        if (condition.test(chr)) {
          this.debug(chr + " matches regex " + condition, 3);
          return true;
        } else {

        }
      } else if (typeof condition === 'string') {
        if (condition === chr) {
          this.debug(chr + " equals string " + (this.char(condition)), 3);
          return true;
        } else {

        }
      } else {
        this.debug("Unrecognized condition " + condition, 3);
      }
      return false;
    };

    ParserBase.prototype.state = function(name, callback) {
      var conditions;
      if (typeof conditions === void 0 && typeof name === 'object') {
        conditions = name;
        name = null;
      }
      return this.states[name] = new ParserState(name, callback);
    };

    return ParserBase;

  })();

  NEW_LINE = '\n';

  WHITESPACE = /\s/;

  TAG_NAME = /[a-z]/i;

  TAG_VALUE = /[^\}]/;

  CHORD_KEY = /[a-g]/i;

  CHORD_MODIFIER = /#|b/;

  CHORD_BASS_SEPARATOR = '/';

  SQUARE_START = '[';

  SQUARE_END = ']';

  CURLY_START = '{';

  CURLY_END = '}';

  COLON = ':';

  LYRICS = /[^\n\{\}\[\]]/;

  ChordProJS = window.ChordProJS = {};

  Item = (function() {
    function Item() {
      this.chords = '';
      this.lyrics = '';
    }

    return Item;

  })();

  Line = (function() {
    function Line() {
      this.items = [];
      this.currentItem = null;
    }

    Line.prototype.addItem = function() {
      var item;
      item = new Item;
      this.items.push(item);
      return this.currentItem = item;
    };

    return Line;

  })();

  Song = (function() {
    function Song() {
      this.lines = [];
      this.currentLine = null;
    }

    Song.prototype.chords = function(chr) {
      return this.currentLine.currentItem.chords += chr;
    };

    Song.prototype.lyrics = function(chr) {
      this.currentLine || this.addLine();
      return this.currentLine.currentItem.lyrics += chr;
    };

    Song.prototype.addLine = function() {
      var line;
      line = new Line;
      this.lines.push(line);
      this.currentLine = line;
      return line.addItem();
    };

    Song.prototype.addItem = function() {
      if (this.currentLine) {
        return this.currentLine.addItem();
      } else {
        return this.addLine();
      }
    };

    return Song;

  })();

  Parser = (function(superClass) {
    extend(Parser, superClass);

    function Parser() {
      Parser.__super__.constructor.call(this);
      this.song = new Song;
      this.tagName = '';
      this.tagValue = '';
      this.currentState = this.state('readLyrics', function() {
        this.on(NEW_LINE, function() {
          return this.song.addLine();
        });
        this.on(SQUARE_START, function() {
          this.song.addItem();
          return this.transitionTo('readChords');
        });
        this.on(CURLY_START, function() {
          return this.transitionTo('readTagName');
        });
        return this["else"](function(chr) {
          return this.song.lyrics(chr);
        });
      });
      this.state('readChords', function() {
        this.on(NEW_LINE, function() {});
        this.on(SQUARE_START, function() {});
        this.on(SQUARE_END, function() {
          return this.transitionTo('readLyrics');
        });
        return this["else"](function(chr) {
          return this.song.chords(chr);
        });
      });
      this.state('readTagName', function() {
        this.on(COLON, function() {
          return this.transitionTo('readTagValue');
        });
        this.on(CURLY_END, function() {
          this.finishTag();
          return this.transitionTo('readLyrics');
        });
        return this["else"](function(chr) {
          return this.tagName += chr;
        });
      });
      this.state('readTagValue', function() {
        this.on(CURLY_END, function() {
          this.finishTag();
          return this.transitionTo('readLyrics');
        });
        return this["else"](function(chr) {
          return this.tagValue += chr;
        });
      });
    }

    Parser.prototype.finishTag = function() {
      this.debug("TAG: " + this.tagName + " = " + this.tagValue);
      return this.tagName = this.tagValue = '';
    };

    Parser.prototype.parse = function(document) {
      Parser.__super__.parse.call(this, document);
      return this.song;
    };

    return Parser;

  })(ParserBase);

  Formatter = (function() {
    function Formatter() {
      this.stringOutput = '';
    }

    Formatter.prototype.output = function(str) {
      return this.stringOutput += str;
    };

    Formatter.prototype.format = function(song) {
      var i, item, j, len, len1, line, ref, ref1;
      ref = song.lines;
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        this.newLine();
        ref1 = line.items;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          item = ref1[j];
          this.formatItem(item);
        }
      }
      this.endOfSong();
      return this.stringOutput;
    };

    return Formatter;

  })();

  TextFormatter = (function(superClass) {
    extend(TextFormatter, superClass);

    function TextFormatter() {
      TextFormatter.__super__.constructor.call(this);
      this.dirtyLine = false;
      this.chordsLine = '';
      this.lyricsLine = '';
    }

    TextFormatter.prototype.finishLine = function() {
      var output;
      output = '';
      if (this.chordsLine.trim().length) {
        output += this.chordsLine + NEW_LINE;
      }
      output += this.lyricsLine + NEW_LINE;
      this.output(output);
      this.chordsLine = '';
      return this.lyricsLine = '';
    };

    TextFormatter.prototype.endOfSong = function() {
      if (this.dirtyLine) {
        return this.finishLine();
      } else {
        return this.output(NEW_LINE);
      }
    };

    TextFormatter.prototype.newLine = function() {
      if (this.dirtyLine) {
        return this.finishLine();
      }
    };

    TextFormatter.prototype.padString = function(str, length) {
      while (str.length < length) {
        str += ' ';
      }
      return str;
    };

    TextFormatter.prototype.formatItem = function(item) {
      var chordsLength, length;
      chordsLength = item.chords.length;
      if (chordsLength) {
        chordsLength++;
      }
      length = Math.max(chordsLength, item.lyrics.length);
      this.chordsLine += this.padString(item.chords, length);
      this.lyricsLine += this.padString(item.lyrics, length);
      return this.dirtyLine = true;
    };

    return TextFormatter;

  })(Formatter);

  HtmlFormatter = (function(superClass) {
    var SPACE;

    extend(HtmlFormatter, superClass);

    SPACE = '&nbsp;';

    function HtmlFormatter() {
      HtmlFormatter.__super__.constructor.call(this);
      this.dirtyLine = false;
      this.lineEmpty = true;
      this.chordsLine = '';
      this.lyricsLine = '';
    }

    HtmlFormatter.prototype.formatItem = function(item) {
      var chords, lyrics;
      chords = item.chords.trim();
      lyrics = item.lyrics.trim();
      if (chords.length || lyrics.length) {
        if (chords.length > lyrics.length) {
          chords += SPACE;
        } else if (lyrics.length > chords.length) {
          lyrics += SPACE;
        }
        this.chordsLine += this.cell('chord', chords);
        this.lyricsLine += this.cell('lyrics', lyrics);
      }
      return this.dirtyLine = true;
    };

    HtmlFormatter.prototype.finishLine = function() {
      var contents;
      contents = this.row(this.chordsLine) + this.row(this.lyricsLine);
      this.output(this.table(contents));
      this.chordsLine = '';
      return this.lyricsLine = '';
    };

    HtmlFormatter.prototype.newLine = function() {
      if (this.dirtyLine) {
        return this.finishLine();
      }
    };

    HtmlFormatter.prototype.endOfSong = function() {
      if (this.dirtyLine) {
        return this.finishLine();
      }
    };

    HtmlFormatter.prototype.cell = function(cssClass, value) {
      return "<td class=\"" + cssClass + "\">" + value + "</td>";
    };

    HtmlFormatter.prototype.row = function(contents) {
      var attr;
      attr = contents ? '' : ' class="empty-line"';
      return "<tr" + attr + ">" + contents + "</tr>";
    };

    HtmlFormatter.prototype.table = function(contents) {
      return "<table>" + contents + "</table>";
    };

    return HtmlFormatter;

  })(Formatter);

  this.ChordProJS = {
    Parser: Parser,
    Song: Song,
    TextFormatter: TextFormatter,
    HtmlFormatter: HtmlFormatter
  };

}).call(this);

//# sourceMappingURL=ChordProJS.js.map
