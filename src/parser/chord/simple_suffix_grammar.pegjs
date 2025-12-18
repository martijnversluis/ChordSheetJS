ChordSuffix
  = suffix:ChordSuffixContent* { return suffix.join(""); }

ChordSuffixContent
  = "(" content:$([a-zA-Z0-9#\+\-o♭♯Δ]+) ")" { return "(" + content + ")"; }
  / $([a-zA-Z0-9#\+\-o♭♯Δ]+)
