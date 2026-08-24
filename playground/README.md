# ChordSheetJS Playground

A development playground for visually testing ChordSheetJS formatters.

## Work in Progress

**This playground is a work in progress.** It was quickly put together to provide a visual representation of the various formatters and their output. The code quality reflects this—it was hacked together for testing purposes rather than production use.

## Known Issues

- **Config editing:** Editing the configuration and seeing realtime updates does not work reliably
- General UI polish and error handling are minimal

## Future Plans

A full rewrite of this playground is anticipated. The current implementation is functional for basic formatter testing, but expect significant changes in the future.

## Run

From the repository root:

```bash
yarn playground
```

Open `http://localhost:3300`. The initial Measured HTML example uses adaptive column widths with
`layout.global.contentWidth: "fit-columns"`, so a wide browser centers one shared header, body,
and footer container sized to the highest column slot used across the song.

## Purpose

The playground allows you to:

- Input ChordPro or chords-over-words formatted text
- Switch between different formatters (PDF, Measured HTML, etc.)
- See live output from the formatters
- Experiment with formatter configurations

