ELSE = 'else'

class ParserState
  constructor: (@name, callback) ->
    @conditions = []
    @conditionCount = 0;
    callback.call(this)

  "on": (condition, callback) ->
    @conditions[@conditionCount++] = new ParserCondition(condition, callback)

  "else": (callback) ->
    @on ELSE, callback

class ParserCondition
  constructor: (@condition, @callback) ->

class ParserBase

  debugging: off

  constructor: ->
    @waitForExpr = null
    @states = {}
    @namelessConditionIndex = 0
    @currentState = null

  waitFor: (@waitForExpr) ->

  error: (message) -> console.error message

  debug: (message, level) ->
    l = 0

    while l++ < level
      message = "    #{message}"

    console.log message if @debugging

  handleWaitForExpr: (chr) ->
    if @testCondition(@waitForExpr, chr)
      @debug "was waiting for #{@waitForExpr}, now found", 1
      @waitForExpr = null
    else
      @debug "still waiting for #{@waitForExpr}", 1
      
  char: (chr) ->
    if chr == '\n'
      return '<NEW LINE>'
    if chr == ' '
      return '<SPACE>'
    return chr

  parse: (contents) ->
    for chr in contents
      @debug "#{@char chr} #####"

      if @waitForExpr
        @handleWaitForExpr(chr)
        continue

      @debug "No expression to wait for, testing conditions", 1
      @testConditions(chr)
    return

  getNewState: (chr, callback) ->
    if (newState = callback.call(this, chr))
      if newState && newState != @currentState && newState instanceof ParserState
        return @currentState = newState

    return null
    
  transitionTo: (name) ->
    @states[name]  

  testConditions: (chr) ->
    for condition in @currentState.conditions
      @debug "condition #{condition.condition}", 1

      if @testCondition(condition.condition, chr)
        @debug "matches condition, calling callback #{condition.callback}", 2

        if (newState = @getNewState(chr, condition.callback))
          @debug "new state: #{newState.name}", 1
        else
          @debug "state remains #{@currentState.name}", 1

        return

    @debug "did not match any condition. State remains #{@currentState.name}", 1

  testCondition: (condition, chr) ->
    if condition == ELSE
      @debug "Condition is ELSE conditions, so condition matches", 3
      return true
    else if condition instanceof RegExp
      if condition.test chr
        @debug "#{chr} matches regex #{condition}", 3
        return true
      else
        #@debug "#{chr} does not match regex #{condition}", 3
    else if typeof condition == 'string'
      if condition == chr
        @debug "#{chr} equals string #{@char condition}", 3
        return true
      else
        #@debug "#{chr} does not equal string #{condition}", 3
    else
      @debug "Unrecognized condition #{condition}", 3

    return false
      

  state: (name, callback) ->
    if typeof conditions == undefined && typeof name == 'object'
      conditions = name
      name = null

    @states[name] = new ParserState(name, callback)

NEW_LINE = '\n'
WHITESPACE = /\s/
TAG_NAME = /[a-z]/i
TAG_VALUE = /[^\}]/
CHORD_KEY = /[a-g]/i
CHORD_MODIFIER = /#|b/
CHORD_BASS_SEPARATOR = '/'
SQUARE_START = '['
SQUARE_END = ']'
CURLY_START = '{'
CURLY_END = '}'
COLON = ':'
LYRICS = /[^\n\{\}\[\]]/

ChordProJS = window.ChordProJS = {}

class Item
  constructor: ->
    @chords = ''
    @lyrics = ''
    
class Line
  constructor: ->
    @items = []
    @currentItem = null
    
  addItem: ->
    item = new Item
    @items.push item
    @currentItem = item

class Song
  constructor: ->
    @lines = []
    @currentLine = null
    
  chords: (chr) ->
    @currentLine.currentItem.chords += chr
    
  lyrics: (chr) ->
    @currentLine || @addLine()
    @currentLine.currentItem.lyrics += chr
    
  addLine: ->
    line = new Line
    @lines.push line
    @currentLine = line
    line.addItem()
    
  addItem: ->
    if @currentLine
      @currentLine.addItem()
    else
      @addLine()

class Parser extends ParserBase
  constructor: ->
    super()
    @song = new Song
    @tagName = ''
    @tagValue = ''

    @currentState = @state 'readLyrics', ->
      @on NEW_LINE, ->
        @song.addLine()
      
      @on SQUARE_START, ->
        @song.addItem()
        @transitionTo 'readChords'
        
      @on CURLY_START, ->
        @transitionTo 'readTagName'
      
      @else (chr) ->
        @song.lyrics chr
      
    @state 'readChords', ->
      @on NEW_LINE, ->
      
      @on SQUARE_START, ->
      
      @on SQUARE_END, ->
        @transitionTo 'readLyrics'
      
      @else (chr) ->
        @song.chords chr
        
    @state 'readTagName', ->
      @on COLON, ->
        @transitionTo 'readTagValue'
    
      @on CURLY_END, ->
        @finishTag()
        @transitionTo 'readLyrics'
      
      @else (chr) ->
        @tagName += chr
        
    @state 'readTagValue', ->
      @on CURLY_END, ->
        @finishTag()
        @transitionTo 'readLyrics'
        
      @else (chr) ->
        @tagValue += chr
        
  finishTag: ->
    @debug "TAG: #{@tagName} = #{@tagValue}"
    @tagName = @tagValue = ''
        
  parse: (document) ->
    super(document)
    @song
    
class Formatter
  constructor: ->
    @stringOutput = ''
    
  output: (str) ->
    @stringOutput += str

  format: (song) ->
    for line in song.lines
      @newLine()
      
      for item in line.items
        @formatItem item
        
    @endOfSong()        
    return @stringOutput
    
class TextFormatter extends Formatter
  constructor: ->
    super()
    @dirtyLine = no
    @chordsLine = ''
    @lyricsLine = ''
    
  finishLine: ->
    output = ''
    
    if @chordsLine.trim().length
      output += @chordsLine + NEW_LINE
      
    output += @lyricsLine + NEW_LINE  
    @output output
    @chordsLine = ''
    @lyricsLine = ''
    
  endOfSong: ->
    if @dirtyLine
      @finishLine()
    else
      @output NEW_LINE
    
  newLine: ->
    @finishLine() if @dirtyLine
      
  padString: (str, length) ->
    while str.length < length
      str += ' '
      
    return str    
      
  formatItem: (item) ->
    chordsLength = item.chords.length
    chordsLength++ if chordsLength
    
    length = Math.max(chordsLength, item.lyrics.length)
    @chordsLine += @padString(item.chords, length)
    @lyricsLine += @padString(item.lyrics, length)
    @dirtyLine = yes
    
class HtmlFormatter extends Formatter
  SPACE = '&nbsp;'

  constructor: ->
    super()
    @dirtyLine = no
    @lineEmpty = yes
    @chordsLine = ''
    @lyricsLine = ''
    
  formatItem: (item) ->
    chords = item.chords.trim()
    lyrics = item.lyrics.trim()
    
    if chords.length || lyrics.length
      if chords.length > lyrics.length
        chords += SPACE
      else if lyrics.length > chords.length
        lyrics += SPACE

      @chordsLine += @cell('chord', chords)
      @lyricsLine += @cell('lyrics', lyrics)
    
    @dirtyLine = yes
    
  finishLine: ->
    contents = @row(@chordsLine) + @row(@lyricsLine)
    @output @table(contents)
    @chordsLine = ''
    @lyricsLine = ''
    
  newLine: ->
    @finishLine() if @dirtyLine
    
  endOfSong: ->
    @finishLine() if @dirtyLine
    
  cell: (cssClass, value) ->
    "<td class=\"#{cssClass}\">#{value}</td>"
    
  row: (contents) ->
    attr = if contents then '' else ' class="empty-line"'
    "<tr#{attr}>#{contents}</tr>"
   
  table: (contents) ->
    "<table>#{contents}</table>"

@ChordProJS = {
  Parser:         Parser
  Song:           Song
  TextFormatter:  TextFormatter
  HtmlFormatter:  HtmlFormatter
}
