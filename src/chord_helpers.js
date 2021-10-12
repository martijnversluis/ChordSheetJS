const A = 'A'.charCodeAt(0);
const G = 'G'.charCodeAt(0);

function keyChange(key, delta) {
  let charCode;
  charCode = key.toUpperCase().charCodeAt(0);
  charCode += delta;

  if (charCode > G) {
    charCode = A;
  }

  if (charCode < A) {
    charCode = G;
  }

  return String.fromCharCode(charCode);
}

export function keyUp(key) {
  return keyChange(key, 1);
}

export function keyDown(key) {
  return keyChange(key, -1);
}

export function normalize(base, modifier) {
  if (modifier === '#' && /^(B|E)$/.test(base)) {
    return [keyUp(base), null];
  }

  if (modifier === 'b' && /^(C|F)$/.test(base)) {
    return [keyDown(base), null];
  }

  return [base, modifier];
}

export function internalSwitchModifier(base, modifier) {
  if (modifier === '#') {
    return [keyUp(base), 'b'];
  }

  if (modifier === 'b') {
    return [keyDown(base), '#'];
  }

  throw new Error(`Unexpected modifier ${modifier}`);
}

export function switchModifier(base, modifier) {
  const [normalizedBase, normalizedModifier] = normalize(base, modifier);

  if (modifier) {
    return internalSwitchModifier(normalizedBase, normalizedModifier);
  }

  return [normalizedBase, normalizedModifier];
}

export function useModifier(base, modifier, newModifier) {
  if (modifier && modifier !== newModifier) {
    return internalSwitchModifier(base, modifier);
  }

  return [base, modifier];
}

function repeatProcessor(base, modifier, processor, amount) {
  let [processedBase, processedModifier] = [base, modifier];

  for (let i = 0; i < amount; i += 1) {
    [processedBase, processedModifier] = processor(processedBase, processedModifier);
  }

  return [processedBase, processedModifier];
}

export function transposeUp(base, modifier) {
  const [normalizedBase, normalizedModifier] = normalize(base, modifier);

  if (normalizedModifier === 'b') {
    return [normalizedBase, null];
  }

  if (normalizedModifier === '#') {
    return [keyUp(normalizedBase), null];
  }

  if (/^(B|E)$/.test(normalizedBase)) {
    return [keyUp(normalizedBase), null];
  }

  return [normalizedBase, '#'];
}

export function transposeDown(base, modifier) {
  const [normalizedBase, normalizedModifier] = normalize(base, modifier);

  if (normalizedModifier === 'b') {
    return [keyDown(normalizedBase), null];
  }

  if (normalizedModifier === '#') {
    return [normalizedBase, null];
  }

  if (/^(C|F)$/.test(normalizedBase)) {
    return [keyDown(normalizedBase), null];
  }

  return [normalizedBase, 'b'];
}

export function transpose(base, modifier, delta) {
  let [newBase, newModifier] = [base, modifier];

  if (delta < 0) {
    [newBase, newModifier] = repeatProcessor(base, modifier, transposeDown, Math.abs(delta));
  } else if (delta > 0) {
    [newBase, newModifier] = repeatProcessor(base, modifier, transposeUp, delta);
  }

  return useModifier(newBase, newModifier, modifier);
}

export function processChord(sourceChord, processor, processorArg) {
  const chord = sourceChord.clone();
  [chord.base, chord.modifier] = processor(sourceChord.base, sourceChord.modifier, processorArg);

  if (sourceChord.bassBase) {
    [chord.bassBase, chord.bassModifier] = processor(sourceChord.bassBase, sourceChord.bassModifier, processorArg);
  }

  return chord;
}

export function deprecate(message) {
  try {
    throw new Error(`DEPRECATION: ${message}`);
  } catch (e) {
    if (typeof process === 'object' && typeof process.emitWarning === 'function') {
      process.emitWarning(`${message}\n${e.stack}`);
    } else {
      console.warn(`${message}\n${e.stack}`);
    }
  }
}

export function isEmptyString(string) {
  return (string === null || string === undefined || string === '');
}
