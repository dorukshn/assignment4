// Doruk Şahin, 2023502030
// Destructuring mistakes that TypeScript catches (or, surprisingly, does not catch).
// This file is not part of `npm run check`. Run `npx tsc --noEmit -p experiments`.

type Song = { title: string; artist: string; bpm: number; rating?: number }
const song: Song = { title: 'Creep', artist: 'Radiohead', bpm: 92 }

// 1. A pattern with more positions than the tuple has.
export const [onlyArtist, missingTitle] = ['Coldplay']

// 2. A property that does not exist on the type.
export const { album } = song

// 3. T1 in a parameter: `title: string` is a rename, so the new variable `string` has no type.
export function showTitle({ title: string }) {
  return string
}

// 4. noUncheckedIndexedAccess: the first item of a string[] may be undefined.
const queue: string[] = []
const [first] = queue
first.toUpperCase()

// 5. Surprise: NO error here, although [] is an empty tuple (the default value makes it fine).
export const [volume = 50] = []
