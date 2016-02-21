(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Item = function Item() {
  _classCallCheck(this, Item);

  this.chords = '';
  this.lyrics = '';
};

exports.default = Item;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Line = function () {
  function Line() {
    _classCallCheck(this, Line);

    this.items = [];
    this.currentItem = null;
  }

  _createClass(Line, [{
    key: 'addItem',
    value: function addItem() {
      var item = new _item2.default();
      this.items.push(item);
      this.currentItem = item;
      return item;
    }
  }]);

  return Line;
}();

exports.default = Line;

},{"./item":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _line = require('./line');

var _line2 = _interopRequireDefault(_line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Song = function () {
  function Song() {
    _classCallCheck(this, Song);

    this.lines = [];
    this.currentLine = null;
  }

  _createClass(Song, [{
    key: 'chords',
    value: function chords(chr) {
      this.currentLine.currentItem.chords += chr;
    }
  }, {
    key: 'lyrics',
    value: function lyrics(chr) {
      this.currentLine || this.addLine();
      this.currentLine.currentItem.lyrics += chr;
    }
  }, {
    key: 'addLine',
    value: function addLine() {
      var line = new _line2.default();
      this.lines.push(line);
      this.currentLine = line;
      return line;
    }
  }, {
    key: 'addItem',
    value: function addItem() {
      if (!this.currentLine) {
        this.addLine();
      }

      return this.currentLine.addItem();
    }
  }]);

  return Song;
}();

exports.default = Song;

},{"./line":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _chord_pro_parser = require('./parser/chord_pro_parser');

var _chord_pro_parser2 = _interopRequireDefault(_chord_pro_parser);

var _chord_sheet_parser = require('./parser/chord_sheet_parser');

var _chord_sheet_parser2 = _interopRequireDefault(_chord_sheet_parser);

var _text_formatter = require('./formatter/text_formatter');

var _text_formatter2 = _interopRequireDefault(_text_formatter);

var _html_formatter = require('./formatter/html_formatter');

var _html_formatter2 = _interopRequireDefault(_html_formatter);

var _chord_pro_formatter = require('./formatter/chord_pro_formatter');

var _chord_pro_formatter2 = _interopRequireDefault(_chord_pro_formatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChordSheetJS = {
  ChordProParser: _chord_pro_parser2.default,
  ChordSheetParser: _chord_sheet_parser2.default,
  TextFormatter: _text_formatter2.default,
  HtmlFormatter: _html_formatter2.default,
  ChordProFormatter: _chord_pro_formatter2.default
};

if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object') {
  window.ChordSheetJS = ChordSheetJS;
}

exports.default = ChordSheetJS;

},{"./formatter/chord_pro_formatter":5,"./formatter/html_formatter":7,"./formatter/text_formatter":8,"./parser/chord_pro_parser":9,"./parser/chord_sheet_parser":10}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _formatter_base = require('./formatter_base');

var _formatter_base2 = _interopRequireDefault(_formatter_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NEW_LINE = '\n';

var ChordProFormatter = function (_FormatterBase) {
  _inherits(ChordProFormatter, _FormatterBase);

  function ChordProFormatter() {
    _classCallCheck(this, ChordProFormatter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChordProFormatter).call(this));

    _this.dirtyLine = false;
    return _this;
  }

  _createClass(ChordProFormatter, [{
    key: 'formatItem',
    value: function formatItem(item) {
      if (item.chords) {
        this.output('[' + item.chords + ']');
      }

      this.output(item.lyrics);
      this.dirtyLine = true;
    }
  }, {
    key: 'endOfSong',
    value: function endOfSong() {
      this.newLine();
    }
  }, {
    key: 'newLine',
    value: function newLine() {
      this.output(NEW_LINE);
    }
  }]);

  return ChordProFormatter;
}(_formatter_base2.default);

exports.default = ChordProFormatter;

},{"./formatter_base":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormatterBase = function () {
  function FormatterBase() {
    _classCallCheck(this, FormatterBase);

    this.stringOutput = '';
  }

  _createClass(FormatterBase, [{
    key: 'output',
    value: function output(str) {
      this.stringOutput += str;
    }
  }, {
    key: 'format',
    value: function format(song) {
      var _this = this;

      song.lines.forEach(function (line) {
        _this.newLine();

        line.items.forEach(function (item) {
          _this.formatItem(item);
        });
      });

      this.endOfSong();
      return this.stringOutput;
    }
  }]);

  return FormatterBase;
}();

exports.default = FormatterBase;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _formatter_base = require('./formatter_base');

var _formatter_base2 = _interopRequireDefault(_formatter_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SPACE = '&nbsp;';

var HtmlFormatter = function (_FormatterBase) {
  _inherits(HtmlFormatter, _FormatterBase);

  function HtmlFormatter() {
    _classCallCheck(this, HtmlFormatter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HtmlFormatter).call(this));

    _this.dirtyLine = false;
    _this.lineEmpty = true;
    _this.chordsLine = '';
    _this.lyricsLine = '';
    return _this;
  }

  _createClass(HtmlFormatter, [{
    key: 'formatItem',
    value: function formatItem(item) {
      var chords = item.chords.trim();
      var lyrics = item.lyrics.trim();

      if (chords.length || lyrics.length) {
        if (chords.length > lyrics.length) {
          chords += SPACE;
        } else if (lyrics.length > chords.length) {
          lyrics += SPACE;
        }

        this.chordsLine += this.cell('chord', chords);
        this.lyricsLine += this.cell('lyrics', lyrics);
      }

      this.dirtyLine = true;
    }
  }, {
    key: 'finishLine',
    value: function finishLine() {
      var rows = this.row(this.chordsLine) + this.row(this.lyricsLine);
      this.output(this.table(rows));
      this.chordsLine = '';
      this.lyricsLine = '';
    }
  }, {
    key: 'newLine',
    value: function newLine() {
      if (this.dirtyLine) {
        this.finishLine();
      }
    }
  }, {
    key: 'endOfSong',
    value: function endOfSong() {
      if (this.dirtyLine) {
        this.finishLine();
      }
    }
  }, {
    key: 'cell',
    value: function cell(cssClass, value) {
      return '<td class="' + cssClass + '">' + value + '</td>';
    }
  }, {
    key: 'row',
    value: function row(contents) {
      var attr = contents ? '' : ' class="empty-line"';
      return '<tr' + attr + '>' + contents + '</tr>';
    }
  }, {
    key: 'table',
    value: function table(contents) {
      return '<table>' + contents + '</table>';
    }
  }]);

  return HtmlFormatter;
}(_formatter_base2.default);

exports.default = HtmlFormatter;

},{"./formatter_base":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _formatter_base = require('./formatter_base');

var _formatter_base2 = _interopRequireDefault(_formatter_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NEW_LINE = '\n';

var TextFormatter = function (_FormatterBase) {
  _inherits(TextFormatter, _FormatterBase);

  function TextFormatter() {
    _classCallCheck(this, TextFormatter);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextFormatter).call(this));

    _this.dirtyLine = false;
    _this.chordsLine = '';
    _this.lyricsLine = '';
    return _this;
  }

  _createClass(TextFormatter, [{
    key: 'finishLine',
    value: function finishLine() {
      var output = '';

      if (this.chordsLine.trim().length) {
        output += this.chordsLine + NEW_LINE;
      }

      output += this.lyricsLine + NEW_LINE;
      this.output(output);
      this.chordsLine = '';
      this.lyricsLine = '';
    }
  }, {
    key: 'endOfSong',
    value: function endOfSong() {
      this.dirtyLine ? this.finishLine() : this.output(NEW_LINE);
    }
  }, {
    key: 'newLine',
    value: function newLine() {
      if (this.dirtyLine) {
        this.finishLine();
      }
    }
  }, {
    key: 'padString',
    value: function padString(str, length) {
      for (var l = str.length; l < length; l++, str += ' ') {}
      return str;
    }
  }, {
    key: 'formatItem',
    value: function formatItem(item) {
      var chordsLength = item.chords.length;

      if (chordsLength) {
        chordsLength++;
      }

      var length = Math.max(chordsLength, item.lyrics.length);
      this.chordsLine += this.padString(item.chords, length);
      this.lyricsLine += this.padString(item.lyrics, length);
      this.dirtyLine = true;
    }
  }]);

  return TextFormatter;
}(_formatter_base2.default);

exports.default = TextFormatter;

},{"./formatter_base":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _parser_base = require('./parser_base');

var _parser_base2 = _interopRequireDefault(_parser_base);

var _song = require('../chord_sheet/song');

var _song2 = _interopRequireDefault(_song);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NEW_LINE = '\n';
var SQUARE_START = '[';
var SQUARE_END = ']';
var CURLY_START = '{';
var CURLY_END = '}';
var COLON = ':';

var ChordProParser = function (_ParserBase) {
  _inherits(ChordProParser, _ParserBase);

  function ChordProParser() {
    _classCallCheck(this, ChordProParser);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ChordProParser).call(this));

    _this.currentState = _this.state('readLyrics', function () {
      _this.on(NEW_LINE, function () {
        _this.song.addLine();
      });

      _this.on(SQUARE_START, function () {
        _this.song.addItem();
        _this.transitionTo('readChords');
      });

      _this.on(CURLY_START, function () {
        _this.transitionTo('readTagName');
      });

      _this.else(function (chr) {
        _this.song.lyrics(chr);
      });
    });

    _this.state('readChords', function () {
      _this.ignore(NEW_LINE, SQUARE_START);

      _this.on(SQUARE_END, function () {
        _this.transitionTo('readLyrics');
      });

      _this.else(function (chr) {
        _this.song.chords(chr);
      });
    });

    _this.state('readTagName', function () {
      _this.on(COLON, function () {
        _this.transitionTo('readTagValue');
      });

      _this.on(CURLY_END, function () {
        _this.finishTag();
        _this.transitionTo('readLyrics');
      });

      _this.else(function (chr) {
        _this.tagName += chr;
      });
    });

    _this.state('readTagValue', function () {
      _this.on(CURLY_END, function () {
        _this.finishTag();
        _this.transitionTo('readLyrics');
      });

      _this.else(function (chr) {
        _this.tagValue += chr;
      });
    });
    return _this;
  }

  _createClass(ChordProParser, [{
    key: 'finishTag',
    value: function finishTag() {
      this.debug('Tag: ' + this.tagName + ' = ' + this.tagValue);
      this.tagName = '';
      this.tagValue = '';
    }
  }, {
    key: 'parse',
    value: function parse(document) {
      this.song = new _song2.default();
      this.tagName = '';
      this.tagValue = '';
      _get(Object.getPrototypeOf(ChordProParser.prototype), 'parse', this).call(this, document);
      return this.song;
    }
  }]);

  return ChordProParser;
}(_parser_base2.default);

exports.default = ChordProParser;

},{"../chord_sheet/song":3,"./parser_base":12}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parser_base = require('./parser_base');

var _parser_base2 = _interopRequireDefault(_parser_base);

var _song = require('../chord_sheet/song');

var _song2 = _interopRequireDefault(_song);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WHITE_SPACE = /\s/;
var NEW_LINE = '\n';
var CHORD_LINE_REGEX = /^\s*((([A-G])(#|b)?([^\/\s]*)(\/([A-G])(#|b)?)?)(\s|$)+)+(\s|$)+/;

var ChordSheetParser = function () {
  function ChordSheetParser() {
    _classCallCheck(this, ChordSheetParser);
  }

  _createClass(ChordSheetParser, [{
    key: 'parse',
    value: function parse(document) {
      this.initialize(document);

      for (var l = 0, lineCount = this.lines.length; l < lineCount; l++) {
        var line = this.lines[l];

        if (line.trim().length == 0) {
          this.songLine = this.song.addLine();
          this.songItem = null;
        } else {
          this.songItem = this.songLine.addItem();

          if (CHORD_LINE_REGEX.test(line)) {
            var nextLine = this.lines[l + 1];
            this.parseLine(line, nextLine);
            l++;
          } else {
            this.songItem.lyrics = line + '';
          }

          this.songLine = this.song.addLine();
        }
      }

      return this.song;
    }
  }, {
    key: 'initialize',
    value: function initialize(document) {
      this.song = new _song2.default();
      this.lines = document.split("\n");
      this.songLine = this.song.addLine();
      this.processingText = false;
      this.isChordsLine = true;
    }
  }, {
    key: 'parseLine',
    value: function parseLine(line, nextLine) {
      this.processCharacters(line, nextLine);

      this.songItem.lyrics += nextLine.substring(line.length);

      this.songItem.chords = this.songItem.chords.trim();
      this.songItem.lyrics = this.songItem.lyrics.trim();

      if (!nextLine.trim().length) {
        this.songLine = this.song.addLine();
      }
    }
  }, {
    key: 'processCharacters',
    value: function processCharacters(line, nextLine) {
      for (var c = 0, charCount = line.length; c < charCount; c++) {
        var chr = line[c];

        if (WHITE_SPACE.test(chr)) {
          this.processingText = false;
        } else {
          if (!this.processingText) {
            this.songItem = this.songLine.addItem();
            this.processingText = true;
          }

          this.songItem.chords += chr;
        }

        var lyricChar = nextLine[c] || '';
        this.songItem.lyrics += lyricChar;
      }
    }
  }]);

  return ChordSheetParser;
}();

exports.default = ChordSheetParser;

},{"../chord_sheet/song":3,"./parser_base":12}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElseClass = function ElseClass() {
  _classCallCheck(this, ElseClass);
};

exports.default = new ElseClass();

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _else = require('./else');

var _else2 = _interopRequireDefault(_else);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParserBase = function () {
  function ParserBase() {
    _classCallCheck(this, ParserBase);

    this.cursor = 0;
    this.debugging = false;
    this.waitForExpr = null;
    this.state = {};
    this.namelessConditionIndex = 0;
    this.currentState = null;
  }

  _createClass(ParserBase, [{
    key: 'waitFor',
    value: function waitFor(waitForExpr) {
      this.waitForExpr = waitForExpr;
    }
  }, {
    key: 'error',
    value: function error(message) {
      console.error(message);
    }
  }, {
    key: 'debug',
    value: function debug(message) {
      var level = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (this.debugging) {
        var indentation = '';
        for (var l = 0; l < level; l++, indentation += '    ') {}
        console.log(indentation + message);
      }
    }
  }, {
    key: 'handleWaitForExpr',
    value: function handleWaitForExpr(chr) {
      if (this.testCondition(this.waitForExpr, chr)) {
        this.debug('Was waiting for ' + this.waitForExpr + ', now found', 1);
        this.waitForExpr = null;
      } else {
        this.debug('Still waiting for ' + this.waitForExpr, 1);
      }
    }
  }, {
    key: 'char',
    value: function char(chr) {
      switch (chr) {
        case '\n':
          return '<NEW LINE>';
        case ' ':
          return '<SPACE>';
        default:
          return chr;
      }
    }
  }, {
    key: 'parse',
    value: function parse(contents) {
      var length = contents.length;

      for (this.cursor = 0; this.cursor < length; this.cursor++) {
        var chr = contents[this.cursor];
        this.debug(this.char(chr) + ' #####');

        if (this.waitForExpr) {
          this.handleWaitForExpr(chr);
          continue;
        }

        this.debug('No expression to wait for, testing conditions', 1);
        this.testConditions(chr);
      }
    }
  }, {
    key: 'getNewState',
    value: function getNewState(chr, callback) {
      var newState = callback.call(this, chr);

      if (newState && newState != this.currentState && newState instanceof ParserState) {
        return this.currentState = newState;
      }

      return null;
    }
  }, {
    key: 'retryWith',
    value: function retryWith(name) {
      this.cursor--;
      return this.transitionTo(name);
    }
  }, {
    key: 'transitionTo',
    value: function transitionTo(name) {
      return this.currentState = this.states[name];
    }
  }, {
    key: 'testConditions',
    value: function testConditions(chr) {
      var _this = this;

      this.currentState.conditions.forEach(function (condition) {
        _this.debug('Condition ' + condition.condition, 1);

        if (_this.testCondition(condition.condition, chr)) {
          var newState = null;
          _this.debug('Matches condition, calling callback' + condition.callback, 2);

          if (newState = _this.getNewState(chr, condition.callback)) {
            _this.debug('New state: ' + newState.name, 1);
          } else {
            _this.debug('State remains ' + _this.currentState.name);
          }
        }
      });
    }
  }, {
    key: 'testCondition',
    value: function testCondition(condition, chr) {
      if (condition === _else2.default) {
        this.debug('Condition is ELSE conditions, so condition matches', 3);
        return true;
      } else if (condition instanceof RegExp) {
        if (condition.test(chr)) {
          this.debug(chr + ' matches regex ' + condition, 3);
          return true;
        }
      } else if (typeof condition == 'string') {
        if (condition == chr) {
          this.debug(chr + ' equals string ' + this.char(condition), 3);
          return true;
        }
      } else {
        this.debug('Invalid condition ' + condition, 3);
      }

      return false;
    }
  }, {
    key: 'state',
    value: function state(name, callback) {
      this.states[name] = new ParseState(name, callback);
    }
  }]);

  return ParserBase;
}();

exports.default = ParserBase;

},{"./else":11}]},{},[4]);
