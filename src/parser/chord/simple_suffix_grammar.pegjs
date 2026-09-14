ChordSuffix
  = quality:Quality extensions:$(Extensions*) {
      return { quality: quality || null, extensions: extensions || null };
    }

Quality
  = $(SuspendedQuality / MinorQuality / MajorQuality / HalfDiminishedQuality / DiminishedQuality / AugmentedQuality)
  / ""

SuspendedQuality
  = "sus4"i / "sus2"i / "sus"i

MajorQuality
  = "major"i / "Majj" / "maj"i / "ma"i !"dd"i / "M" / "Δ" / "∆" / "△"

MinorQuality
  = "minor"i / "min"i / "mi"i / "m" &"add"i / "m" !"a"i / "-" !"5"

HalfDiminishedQuality
  = "ø" / "⌀"

DiminishedQuality
  = "dim"i / "°" / "o"i

AugmentedQuality
  = "aug"i

Extensions
  = "(" content:$([a-zA-Z0-9#\+\-o♭♯Δ∆△°ø⌀]+) ")" { return "(" + content + ")"; }
  / $([a-zA-Z0-9#\+\-o♭♯Δ∆△°ø⌀]+)
