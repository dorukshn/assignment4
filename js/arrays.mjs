// Doruk Şahin, 2023502030
// Array destructuring (forms 1 to 4). Plain JavaScript: run with `node js/arrays.mjs`.
// My data: songs and a playlist queue.

// Form 1: take values out of an array by position.
// The function returns two values in one array: the shortest and the longest song (seconds).
function shortestAndLongest(lengths) {
  return [Math.min(...lengths), Math.max(...lengths)]
}
const [shortest, longest] = shortestAndLongest([214, 187, 356, 241])
console.log('form 1:', shortest, longest)
// The same without destructuring:
//   const result = shortestAndLongest([214, 187, 356, 241])
//   const shortest = result[0]
//   const longest = result[1]

// A pattern with more names than items: the extra name is undefined, no error.
const [onlyBpm, missingBpm] = [128]
console.log('form 1 (missing item):', onlyBpm, missingBpm)

// Form 2: skip an item and collect the rest, [, second, ...others]
const queue = ['Intro', 'Blinding Lights', 'Levitating', 'As It Was', 'Outro']
const [, firstRealSong, ...laterSongs] = queue
console.log('form 2:', firstRealSong, laterSongs)
// The rest is always an array, even when nothing is left.
const [, , ...nothingLeft] = ['Intro']
console.log('form 2 (empty rest):', nothingLeft)
// Rest in a pattern collects; spread in an expression expands. Same three dots, opposite jobs.
const longerQueue = [...queue, 'Encore']
console.log('form 2 (spread, not rest):', longerQueue.length)

// Form 3: swap two variables without a temporary, [a, b] = [b, a]
let nowPlaying = 'Levitating'
let upNext = 'As It Was'
;[nowPlaying, upNext] = [upNext, nowPlaying]
console.log('form 3:', nowPlaying, '|', upNext)

// Form 4: default values, const [a = 1, b = 2] = []
const [opener = 'Intro', closer = 'Outro'] = []
console.log('form 4:', opener, closer)
// A default is used only when the item is undefined.
const [mood = 'chill', energy = 5] = ['party', undefined]
console.log('form 4 (undefined uses the default):', mood, energy)
const [genre = 'pop'] = [null]
console.log('form 4 (null does not):', genre)
