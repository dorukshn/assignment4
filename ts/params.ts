// Doruk Şahin, 2023502030
// Forms 11 and 12 in TypeScript, and the typing rules for patterns in parameters.
// Run with `npx tsx ts/params.ts`.

type PlaylistOptions = { name?: string; shuffle?: boolean; maxSongs?: number }

// Form 11: the type goes after the whole pattern, and `= {}` makes the whole argument optional.
function makePlaylist({ name = 'Untitled', shuffle = false, maxSongs = 20 }: PlaylistOptions = {}): string {
  return `${name} (shuffle: ${shuffle}, max ${maxSongs})`
}
console.log('form 11:', makePlaylist({ name: 'Gym Mix', shuffle: true }))
console.log('form 11 (no argument):', makePlaylist())

// Form 11b: an array parameter. A tuple type says what is at each position.
const toLabel = ([songTitle, songArtist]: [string, string]): string => `${songTitle} by ${songArtist}`
console.log('form 11b:', toLabel(['Yellow', 'Coldplay']))
const pairs: [string, string][] = [
  ['Yellow', 'Coldplay'],
  ['Creep', 'Radiohead'],
]
console.log('form 11b (in map):', pairs.map(([t, a]) => `${a}: ${t}`))

// Form 12: patterns in loops. Object.entries gives [string, number] pairs here.
const playCounts: Record<string, number> = { 'Blinding Lights': 42, Levitating: 17, Yellow: 8 }
for (const [songTitle, count] of Object.entries(playCounts)) {
  console.log('form 12:', songTitle, '->', count)
}
const stars = new Map<string, number>([
  ['Creep', 5],
  ['Yellow', 4],
])
for (const [songTitle, rating] of stars) {
  console.log('form 12 (Map):', songTitle, '*'.repeat(rating))
}
type LibrarySong = { title: string; bpm: number }
const library: LibrarySong[] = [
  { title: 'Yellow', bpm: 87 },
  { title: 'Creep', bpm: 92 },
]
for (const { title, bpm } of library) {
  console.log('form 12 (objects in a loop):', title, bpm)
}
