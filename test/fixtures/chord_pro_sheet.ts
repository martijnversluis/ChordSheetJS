export default `
{title: Let it be}
{subtitle: ChordSheetJS example version}
{key: C}
{x_some_setting}
{composer: John Lennon}
{composer: Paul McCartney}
#This is my favorite song

Written by: %{composer|%{}|No composer defined for %{title|%{}|Untitled song}}

{start_of_verse: Verse 1}
Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
{transpose: 2}
[C]Whisper words of [F]wis[G]dom, let it [F]be [C/E] [Dm] [C]
{end_of_verse}

{start_of_chorus}
{comment: Breakdown}
{transpose: G}
[Am]Whisper words of [Bb]wisdom, let it [F]be [C]
{end_of_chorus}

{start_of_bridge: Bridge 1}
Bridge line
{end_of_bridge}

{start_of_grid: Grid 1}
Grid line
{end_of_grid}

{start_of_tab: Tab 1}
Tab line
{end_of_tab}`.substring(1);
