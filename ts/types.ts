// Doruk Şahin, 2023502030
// What only TypeScript adds (topics T1 to T5). Run with `npx tsx ts/types.ts`.

type Song = { title: string; artist: string; bpm: number; rating?: number }
const song: Song = { title: 'Creep', artist: 'Radiohead', bpm: 92 }

// T1: `{ title: string }` inside a pattern is a RENAME, not a type.
// This line looks like "title is a string", but it creates a variable called `string`.
const { title: string } = song
console.log('T1 (the confusion): a variable named string =', string)
// The correct way: the pattern first, then a colon and the type of the WHOLE object.
const { title, bpm }: { title: string; bpm: number } = song
console.log('T1 (correct):', title, bpm)

// T2: a tuple return type, and what `as const` does.
// Without a return type TypeScript infers an array, (string | number)[], not a tuple.
function looseTopSong() {
  return ['Yellow', 87]
}
const [looseTitle, looseBpm] = looseTopSong()
console.log('T2 (no tuple type):', typeof looseTitle, typeof looseBpm) // both are string | number for TS
// With a tuple type, each position has its own type.
function topSong(): [string, number] {
  return ['Yellow', 87]
}
const [tupleTitle, tupleBpm] = topSong()
console.log('T2 (tuple):', tupleTitle.toUpperCase(), tupleBpm + 1)
// `as const` makes a readonly tuple with literal types: ['Yellow', 87], not string[].
const favourite = ['Yellow', 87] as const
const [favTitle, favBpm] = favourite // favTitle: 'Yellow', favBpm: 87
console.log('T2 (as const):', favTitle, favBpm, favourite.length)

// T3: noUncheckedIndexedAccess. An array can be empty, so the first item may be undefined.
const queue: string[] = []
const [first] = queue // first: string | undefined
// first.toUpperCase() would be an error: 'first' is possibly 'undefined'.
console.log('T3 (check it):', first === undefined ? 'empty queue' : first.toUpperCase())
console.log('T3 (?? fallback):', first ?? 'nothing to play')
const [firstWithDefault = 'nothing to play'] = queue // a default removes undefined from the type
console.log('T3 (default):', firstWithDefault.toUpperCase())

// T4: defaults and optional fields.
const { rating } = song // rating?: number  ->  rating: number | undefined
console.log('T4 (optional, no default):', rating)
const { rating: ratingWithDefault = 0 } = song // with a default -> number
console.log('T4 (optional, with default):', ratingWithDefault + 1)
function describe({ title: name, rating: stars = 3 }: Song): string {
  return `${name}: ${'*'.repeat(stars)}`
}
console.log('T4 (default in a parameter):', describe(song))

// T5: a compile error that destructuring causes.
// The array literal ['Coldplay'] has the type [string]: a tuple with ONE position.
// The pattern asks for TWO positions, so TypeScript stops me at compile time.
// @ts-expect-error TS2493: Tuple type '[string]' of length '1' has no element at index '1'.
const [onlyArtist, missingTitle] = ['Coldplay']
console.log('T5 (it still runs, the error is only for the compiler):', onlyArtist, missingTitle)
// The fix: say what I really have. Either give the second value...
const [artistName, songTitle] = ['Coldplay', 'Yellow']
console.log('T5 (fix 1, give both values):', artistName, songTitle)
// ...or say it is an array that may be shorter, and handle the missing item.
const parts: string[] = ['Coldplay']
const [partArtist, partTitle = '(no title)'] = parts
console.log('T5 (fix 2, a string[] and a default):', partArtist, partTitle)
