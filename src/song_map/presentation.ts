/**
 * Whether to render the song as written (`source`) or in the order of its song map (`mapped`)
 */
export type RenderOrder = 'source' | 'mapped';

/**
 * Whether to render every song map occurrence in full (`full`) or to combine adjacent occurrences of one
 * section into one section with a repeat label (`condensed`)
 */
export type RepeatPresentation = 'full' | 'condensed';
