ChordSuffix
  = quality:Quality extensions:$(Extensions*) {
      return { quality: quality || null, extensions: extensions || null };
    }

Quality
  = "m" !"a"i { return "m"; } / "dim"i / "aug"i / "sus4"i / "sus2"i / "sus"i / ""

Extensions
  = "(" content:$([a-zA-Z0-9#\+\-o♭♯Δ]+) ")" { return "(" + content + ")"; }
  / $([a-zA-Z0-9#\+\-o♭♯Δ]+)
