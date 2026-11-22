# Destructuring Field Guide

Name: Doruk Şahin  
Student number: 2023502030

MIS 233 Web Based Application Programming, Fall 2026, Assignment 4.

Bonuses claimed: **Bonus 2: Depth**, **Bonus 3: Real code**, **Bonus 4: Git repository** (each has its own section near the end).

All my examples use one theme: **music**. Songs (title, artist, bpm, year), a playlist with an owner and songs, a play queue, play counts and star ratings.

## Run

```
npm install
npm run all      # runs the JS and TS examples (and js/depth.mjs for Bonus 2)
npm run check    # type-checks in strict mode, no errors
npx tsc --noEmit -p experiments   # fails on purpose: it shows the errors I collected
```

`output.txt` is the real output of `npm run all > output.txt 2>&1` on my Mac. I added `2>&1` because React prints its warnings on stderr; without it the warnings are not in the file. `experiments/errors.txt` is the real output of the last command.

| File | What is in it |
| --- | --- |
| `js/arrays.mjs`, `js/objects.mjs`, `js/params.mjs` | forms 1 to 12 in plain JavaScript |
| `js/pitfalls.mjs` | six pitfalls |
| `js/props.jsx` | props and children, P1 to P7 (and two extra experiments) |
| `js/depth.mjs` | Bonus 2 experiments |
| `ts/arrays.ts`, `ts/objects.ts`, `ts/params.ts` | forms 1 to 12 with types |
| `ts/types.ts` | TypeScript topics T1 to T5 |
| `ts/props.tsx` | props and children with types, P1 to P7 |
| `experiments/` | code that the compiler rejects, on purpose, and `errors.txt` |

Every **output** in this guide is copied from `output.txt` (or `experiments/errors.txt`). Most code blocks are copied from the files; a few longer components are shortened to one line here so that the guide stays readable, and the full code is in the file named next to them.

## The idea in one sentence

A destructuring pattern on the left side describes a **shape**, and JavaScript takes the values out of the right side **by position** (array pattern `[ ]`) or **by name** (object pattern `{ }`). Every pattern can be written again as plain assignments, one line per variable; I add that version to each entry because it is the clearest way to see what the pattern does.

## Field guide

### Form 1: values by position, `const [x, y] = f()`

**Syntax:** `const [shortest, longest] = shortestAndLongest(lengths)`

**Example** (from `js/arrays.mjs`, my own data):

```js
function shortestAndLongest(lengths) {
  return [Math.min(...lengths), Math.max(...lengths)]
}
const [shortest, longest] = shortestAndLongest([214, 187, 356, 241])
console.log('form 1:', shortest, longest)

const [onlyBpm, missingBpm] = [128]
console.log('form 1 (missing item):', onlyBpm, missingBpm)
```

**Output:**

```
form 1: 187 356
form 1 (missing item): 128 undefined
```

**Without destructuring:** `const result = shortestAndLongest(...)`, `const shortest = result[0]`, `const longest = result[1]`.

**Use it when:** a function gives back several values that belong together and their order is fixed, like `useState` and `useReducer` in React (`const [state, dispatch] = useReducer(...)`).

**Watch out:** the names are matched by **position only**. If I write `const [longest, shortest]` I get the values the wrong way round and nothing warns me. A position that does not exist simply becomes `undefined`, no error.

**In TypeScript:** give the function a tuple return type, `[number, number]` (see T2), otherwise each item is a union of all item types.

### Form 2: skip an item and collect the rest, `const [, second, ...others] = list`

**Syntax:** `const [, firstRealSong, ...laterSongs] = queue`

**Example** (from `js/arrays.mjs`):

```js
const queue = ['Intro', 'Blinding Lights', 'Levitating', 'As It Was', 'Outro']
const [, firstRealSong, ...laterSongs] = queue
console.log('form 2:', firstRealSong, laterSongs)

const [, , ...nothingLeft] = ['Intro']
console.log('form 2 (empty rest):', nothingLeft)

const longerQueue = [...queue, 'Encore']
console.log('form 2 (spread, not rest):', longerQueue.length)
```

**Output:**

```
form 2: Blinding Lights [ 'Levitating', 'As It Was', 'Outro' ]
form 2 (empty rest): []
form 2 (spread, not rest): 6
```

**Without destructuring:** `const firstRealSong = queue[1]`, `const laterSongs = queue.slice(2)`.

**Use it when:** the first item is special (a header, an intro track) and I want it out of the way, or I want "the first one and everything else".

**Watch out:** the empty place before the first comma is the skipped item; it is easy to miss when reading. The rest must be the **last** thing in the pattern, and it is always a new array, never `undefined` (an empty array if nothing is left). **Rest and spread use the same three dots for opposite jobs:** in a pattern (left of `=`) `...laterSongs` **collects** items into an array; in an expression (right of `=`) `[...queue, 'Encore']` **expands** an array into items.

### Form 3: swap two variables, `[a, b] = [b, a]`

**Syntax:** `;[nowPlaying, upNext] = [upNext, nowPlaying]`

**Example** (from `js/arrays.mjs`):

```js
let nowPlaying = 'Levitating'
let upNext = 'As It Was'
;[nowPlaying, upNext] = [upNext, nowPlaying]
console.log('form 3:', nowPlaying, '|', upNext)
```

**Output:**

```
form 3: As It Was | Levitating
```

**Without destructuring:** `const temp = nowPlaying`, `nowPlaying = upNext`, `upNext = temp`.

**Use it when:** two variables must change places, for example "skip to the next song" in a player.

**Watch out:** the right side `[upNext, nowPlaying]` is a **new array** that is built first, with the old values; only then are the two variables assigned. That is why no temporary variable is needed. The variables must be `let`, not `const`. And because the line starts with `[`, the line before it must end with a semicolon (or the line starts with `;`). Without it the two lines are joined, see pitfall 6 and my log.

### Form 4: default values in an array, `const [a = 1, b = 2] = []`

**Syntax:** `const [opener = 'Intro', closer = 'Outro'] = []`

**Example** (from `js/arrays.mjs`):

```js
const [opener = 'Intro', closer = 'Outro'] = []
console.log('form 4:', opener, closer)
const [mood = 'chill', energy = 5] = ['party', undefined]
console.log('form 4 (undefined uses the default):', mood, energy)
const [genre = 'pop'] = [null]
console.log('form 4 (null does not):', genre)
```

**Output:**

```
form 4: Intro Outro
form 4 (undefined uses the default): party 5
form 4 (null does not): null
```

**Without destructuring:** `const opener = list[0] === undefined ? 'Intro' : list[0]`.

**Use it when:** an item may be missing and there is a sensible value to use instead.

**Watch out:** the default is used **only when the item is `undefined`** (missing or written as `undefined`). `null` is a real value, so `genre` stays `null`. This is different from `list[0] || 'pop'`, which would also replace `null`, `0` and `''`.

### Form 5: properties by name, `let { a, b } = t`

**Syntax:** `let { title, artist } = song`

**Example** (from `js/objects.mjs`):

```js
const song = { id: 's1', title: 'Blinding Lights', artist: 'The Weeknd', bpm: 171, year: 2019 }
let { title, artist } = song
console.log('form 5:', title, '-', artist)
title = 'Save Your Tears'
console.log('form 5 (variable changed, object did not):', title, '|', song.title)
const { album } = song
console.log('form 5 (missing property):', album)
```

**Output:**

```
form 5: Blinding Lights - The Weeknd
form 5 (variable changed, object did not): Save Your Tears | Blinding Lights
form 5 (missing property): undefined
```

**Without destructuring:** `let title = song.title`, `let artist = song.artist`.

**Use it when:** I need a few properties of an object many times; the code gets shorter and the names say what I use.

**Watch out:** the variable name must be the **same** as the property name (use form 6 to change it). The variables are copies of the values: changing `title` does not change `song.title`. A property that does not exist gives `undefined`, no error.

### Form 6: rename while you take it, `const { a: alpha } = t`

**Syntax:** `const { title: songName, bpm: tempo } = song`

**Example** (from `js/objects.mjs`):

```js
const { title: songName, bpm: tempo } = song
console.log('form 6:', songName, tempo)
try {
  console.log(bpm)
} catch (error) {
  console.log('form 6 (old name):', error.message)
}
```

**Output:**

```
form 6: Blinding Lights 171
form 6 (old name): bpm is not defined
```

**Without destructuring:** `const songName = song.title`, `const tempo = song.bpm`.

**Use it when:** the property name is already used by another variable (I already had `title` from form 5), or the name is not clear in this place (`bpm` is clearer as `tempo` in a player).

**Watch out:** left of the colon is **where the value comes from**, right of the colon is **the new variable**. Only the new name exists afterwards: `bpm` is not a variable, so using it throws a `ReferenceError`. In TypeScript this is the big trap of T1: the colon here is a rename, not a type.

### Form 7: default values in an object, `const { a = 1 } = t`

**Syntax:** `const { rating = 3, explicit = false } = song`

**Example** (from `js/objects.mjs`):

```js
const { rating = 3, explicit = false } = song
console.log('form 7:', rating, explicit)
const { year = 2000 } = song
console.log('form 7 (real value wins):', year)
const { cover = 'no-cover.png' } = { cover: null }
console.log('form 7 (null is kept):', cover)
```

**Output:**

```
form 7: 3 false
form 7 (real value wins): 2019
form 7 (null is kept): null
```

**Without destructuring:** `const rating = song.rating === undefined ? 3 : song.rating`.

**Use it when:** an object may come without some fields (a new song has no rating yet) and I want one place that says what the normal value is.

**Watch out:** like form 4, only `undefined` triggers the default, `null` does not. Defaults and renames can be combined: `{ rating: stars = 3 }` takes `rating`, calls it `stars`, and uses `3` if it is missing.

### Form 8: rest in an object, `const { a, ...others } = t`

**Syntax:** `const { id, ...songWithoutId } = song`

**Example** (from `js/objects.mjs`):

```js
const { id, ...songWithoutId } = song
console.log('form 8:', id, songWithoutId)
console.log('form 8 (a new object):', songWithoutId !== song)
```

**Output:**

```
form 8: s1 {
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  bpm: 171,
  year: 2019
}
form 8 (a new object): true
```

**Without destructuring:** `const songWithoutId = { ...song }` and then `delete songWithoutId.id` (two steps, and `delete` changes the object).

**Use it when:** I want "everything except some fields", for example to remove an internal id before showing or sending an object. In React this is how a component separates its own props from the ones it passes on (P4).

**Watch out:** the rest object is new, but it is only a **shallow** copy: nested objects inside it are still shared with the original (pitfall 4). The rest must be the last element.

### Form 9: nested patterns, `const { p: { x }, list: [first] } = t`

**Syntax:** `const { owner: { username }, songs: [firstSong, { title: secondTitle }] } = playlist`

**Example** (from `js/objects.mjs`):

```js
const playlist = {
  name: 'Sunday Drive',
  owner: { username: 'doruk', country: 'TR' },
  songs: [song, { id: 's2', title: 'Levitating', artist: 'Dua Lipa', bpm: 103, year: 2020 }],
}
const {
  owner: { username },
  songs: [firstSong, { title: secondTitle }],
} = playlist
console.log('form 9:', username, '|', firstSong.title, '|', secondTitle)
try {
  console.log(owner)
} catch (error) {
  console.log('form 9 (owner is not a variable):', error.message)
}
```

**Output:**

```
form 9: doruk | Blinding Lights | Levitating
form 9 (owner is not a variable): owner is not defined
```

**Without destructuring:** `const username = playlist.owner.username`, `const firstSong = playlist.songs[0]`, `const secondTitle = playlist.songs[1].title`.

**Use it when:** I need a few values deep inside one object and the structure is fixed and known.

**Watch out:** `owner:` and `songs:` are only **paths**; they do not create variables, so `owner` is not defined. If any level is missing (no `owner` at all) the whole line throws a `TypeError`, because it tries to destructure `undefined` (pitfall 1). Deep patterns quickly become hard to read (see Bonus 3).

### Form 10: a computed key, `const { [key]: value } = t`

**Syntax:** `const { [sortBy]: sortValue } = song`

**Example** (from `js/objects.mjs`):

```js
const sortBy = 'artist'
const { [sortBy]: sortValue } = song
console.log('form 10:', sortBy, '=', sortValue)
for (const key of ['title', 'year']) {
  const { [key]: value } = song
  console.log('form 10 (in a loop):', key, '=', value)
}
```

**Output:**

```
form 10: artist = The Weeknd
form 10 (in a loop): title = Blinding Lights
form 10 (in a loop): year = 2019
```

**Without destructuring:** `const sortValue = song[sortBy]`.

**Use it when:** the property name is only known when the program runs, for example the column a user chose to sort the playlist by.

**Watch out:** a computed key **must** be renamed (`[sortBy]: sortValue`), because JavaScript cannot invent a variable name from a value. Honestly, for one value `song[sortBy]` is shorter; the pattern is useful when it is combined with others or with a rest (`const { [key]: removed, ...rest } = obj` removes a property chosen at run time).

### Form 11: patterns in parameters, with defaults, `function f({ a = 1, b } = {})`

**Syntax:** `function makePlaylist({ name, shuffle = false, maxSongs = 20 } = {})`

**Example** (from `js/params.mjs`):

```js
function makePlaylist({ name, shuffle = false, maxSongs = 20 } = {}) {
  return `${name} (shuffle: ${shuffle}, max ${maxSongs})`
}
console.log('form 11:', makePlaylist({ name: 'Gym Mix', shuffle: true }))
console.log('form 11 (no argument):', makePlaylist())
try {
  makePlaylist(null)
} catch (error) {
  console.log('form 11 (null):', error.message)
}

const toLabel = ([songTitle, songArtist]) => `${songTitle} by ${songArtist}`
console.log('form 11b:', toLabel(['Yellow', 'Coldplay']))
```

**Output:**

```
form 11: Gym Mix (shuffle: true, max 20)
form 11 (no argument): undefined (shuffle: false, max 20)
form 11 (null): Cannot destructure property 'name' of '(intermediate value)(intermediate value)(intermediate value)' as it is null.
form 11b: Yellow by Coldplay
```

**Without destructuring:** `function makePlaylist(options) { const name = options.name; const shuffle = options.shuffle === undefined ? false : options.shuffle; ... }`.

**Use it when:** a function has several options, most of them optional. The caller writes names (`{ shuffle: true }`) instead of remembering an order, and the defaults are visible in the first line of the function. Every React component that takes props uses this form.

**Watch out:** there are **two different defaults**. `shuffle = false` is the default for one property; `= {}` at the end is the default for the **whole argument**. Without `= {}`, `makePlaylist()` would throw, because it would destructure `undefined`. And `= {}` does not help with `null` (only `undefined` triggers defaults), so `makePlaylist(null)` still throws.

### Form 12: patterns in loops, `for (const [k, v] of Object.entries(o))`

**Syntax:** `for (const [songTitle, count] of Object.entries(playCounts))`

**Example** (from `js/params.mjs`):

```js
const playCounts = { 'Blinding Lights': 42, Levitating: 17, Yellow: 8 }
for (const [songTitle, count] of Object.entries(playCounts)) {
  console.log('form 12:', songTitle, '->', count)
}
const stars = new Map([
  ['Creep', 5],
  ['Yellow', 4],
])
for (const [songTitle, rating] of stars) {
  console.log('form 12 (Map):', songTitle, '*'.repeat(rating))
}
for (const [index, songTitle] of ['Intro', 'Outro'].entries()) {
  console.log('form 12 (array.entries):', index, songTitle)
}
for (const { title, bpm } of library) {
  console.log('form 12 (objects in a loop):', title, bpm)
}
```

**Output:**

```
form 12: Blinding Lights -> 42
form 12: Levitating -> 17
form 12: Yellow -> 8
form 12 (Map): Creep *****
form 12 (Map): Yellow ****
form 12 (array.entries): 0 Intro
form 12 (array.entries): 1 Outro
form 12 (objects in a loop): Yellow 87
form 12 (objects in a loop): Creep 92
```

**Without destructuring:** `for (const entry of Object.entries(playCounts)) { const songTitle = entry[0]; const count = entry[1]; ... }`.

**Use it when:** I go through key/value pairs (an object, a `Map`) or through a list of objects and need only some fields of each.

**Watch out:** an object is not iterable, so `for (const [k, v] of playCounts)` does not work; it needs `Object.entries(...)`. A `Map` already gives `[key, value]` pairs. `array.entries()` gives `[index, value]`, index first.

## Pitfalls

All six are in `js/pitfalls.mjs` and run with `npm run all`.

**Pitfall 1: destructuring `undefined` or `null` throws.**

```js
const findSong = (title) => library.find((s) => s.title === title)
const { bpm } = findSong('Unknown Song') // find returns undefined
```

Output: `pitfall 1: TypeError - Cannot destructure property 'bpm' of 'findSong(...)' as it is undefined.`

Why: `{ bpm } = x` means `x.bpm`, and reading a property of `undefined` is not possible. `find` returns `undefined` when nothing matches, which is easy to forget. Fix: check the result first, or give a default (`= {}`) where it makes sense.

**Pitfall 2: a default only applies to `undefined`, not to `null`.**

```js
const fromApi = { title: 'Creep', artist: null }
const { artist = 'Unknown artist', album = 'Unknown album' } = fromApi
```

Output: `pitfall 2: null | Unknown album`

Why: `album` is missing (`undefined`), so it gets the default; `artist` exists and its value is `null`, and JavaScript treats `null` as "a value was given on purpose". Data from servers often uses `null`, so defaults alone are not enough there; `artist ?? 'Unknown artist'` handles both.

**Pitfall 3: assigning to existing variables needs parentheses.**

```js
let title
let bpm
;({ title, bpm } = library[0])         // works
// { title } = { title: 'Yellow' }      // SyntaxError
```

Output:

```
pitfall 3 (with parentheses): Yellow 87
pitfall 3 (without): SyntaxError - Unexpected token '='
```

Why: when a statement starts with `{`, JavaScript reads it as a **block** of code, not as an object pattern; then `=` after the block makes no sense. Parentheses make it an expression. With `const`/`let` in front there is no problem.

**Pitfall 4: destructuring copies references, not deep copies.**

```js
const { title: copiedTitle, ...rest } = library[1]
rest.owner.username = 'someone-else' // I only changed the copy... or did I?
```

Output: `pitfall 4: Creep | someone-else | true`

Why: `rest` is a new object, but its `owner` property points to the **same** `owner` object as `library[1].owner` (`true` in the output). Changing it through `rest` changes the original too. Destructuring and rest copy one level only.

**Pitfall 5: in objects the order does not matter, in arrays it does.**

```js
const { bpm: speed, title: name } = library[0]
const [songArtist, songTitle] = ['Yellow', 'Coldplay'] // I meant [title, artist]
```

Output:

```
pitfall 5 (object, any order): Yellow 87
pitfall 5 (array, order matters): Yellow by Coldplay
```

Why: object patterns match by **name**, array patterns by **position**. My variable `songArtist` got `'Yellow'` only because it is first, so the sentence says "Yellow by Coldplay" correctly by accident while both variable names are wrong. Nothing warns about it.

**Pitfall 6: a missing semicolon before a line that starts with `[`.**

```js
let a = 'Yellow'
let b = 'Creep'
[a, b] = [b, a]
```

Output: `pitfall 6: ReferenceError - Cannot access 'b' before initialization`

Why: JavaScript does not add a semicolon when the next line starts with `[`, so it reads `let b = 'Creep'[a, b] = [b, a]`: it tries to use `b` inside its own declaration. I write without semicolons, so I start such lines with `;`.

## TypeScript topics

All five are in `ts/types.ts`.

**T1: in a pattern, `{ title: string }` is a rename, not a type.**

```ts
const { title: string } = song
console.log('T1 (the confusion): a variable named string =', string)
const { title, bpm }: { title: string; bpm: number } = song
```

Output:

```
T1 (the confusion): a variable named string = Creep
T1 (correct): Creep 92
```

The first line looks like "title has type string", but it is form 6: it creates a variable **called** `string`. In a function parameter the same mistake gives a compile error, `TS7031: Binding element 'string' implicitly has an 'any' type.` (`experiments/destructuring-errors.ts`). The rule: the type always goes **after the whole pattern**, `{ ... }: Type`.

**T2: a tuple return type, and `as const`.**

```ts
function looseTopSong() { return ['Yellow', 87] }        // inferred: (string | number)[]
function topSong(): [string, number] { return ['Yellow', 87] }
const favourite = ['Yellow', 87] as const                // readonly ['Yellow', 87]
```

Output:

```
T2 (no tuple type): string number
T2 (tuple): YELLOW 88
T2 (as const): Yellow 87 2
```

Without a return type TypeScript infers an **array** of `string | number`, so after `const [looseTitle] = looseTopSong()` I cannot call `looseTitle.toUpperCase()` (`TS2339: Property 'toUpperCase' does not exist on type 'string | number'.`). At run time `typeof` still says `string` and `number`; the problem only exists for the compiler. With `[string, number]` each position has its own type. `as const` goes further: a **readonly** tuple with literal types, so `favTitle` has the type `'Yellow'`, not just `string`.

**T3: `noUncheckedIndexedAccess` and `const [first] = items`.**

```ts
const queue: string[] = []
const [first] = queue // first: string | undefined
console.log('T3 (check it):', first === undefined ? 'empty queue' : first.toUpperCase())
console.log('T3 (?? fallback):', first ?? 'nothing to play')
const [firstWithDefault = 'nothing to play'] = queue
```

Output:

```
T3 (check it): empty queue
T3 (?? fallback): nothing to play
T3 (default): NOTHING TO PLAY
```

With this option on, TypeScript admits that an array may be shorter than I think, so `first` is `string | undefined`. Calling `first.toUpperCase()` directly is `TS18048: 'first' is possibly 'undefined'.` Three fixes: check it, use `??`, or give a default in the pattern (the default removes `undefined` from the type).

**T4: optional fields and defaults change the type.**

```ts
type Song = { title: string; artist: string; bpm: number; rating?: number }
const { rating } = song                              // number | undefined
const { rating: ratingWithDefault = 0 } = song       // number
function describe({ title: name, rating: stars = 3 }: Song): string { ... }
```

Output:

```
T4 (optional, no default): undefined
T4 (optional, with default): 1
T4 (default in a parameter): Creep: ***
```

An optional field (`rating?`) gives a variable of type `number | undefined`. A default in the pattern makes it plain `number`, because the `undefined` case is handled. The last line combines a rename and a default: `rating: stars = 3`.

**T5: a compile error that destructuring causes.**

```ts
// @ts-expect-error TS2493: Tuple type '[string]' of length '1' has no element at index '1'.
const [onlyArtist, missingTitle] = ['Coldplay']
```

Output:

```
T5 (it still runs, the error is only for the compiler): Coldplay undefined
T5 (fix 1, give both values): Coldplay Yellow
T5 (fix 2, a string[] and a default): Coldplay (no title)
```

The literal `['Coldplay']` has the type `[string]`, a tuple with exactly one position, and the pattern asks for two. This is the only `@ts-expect-error` in the project. The fixes: give both values, or say the value is a `string[]` (an array of any length) and give the second name a default. My first try for T5 did not produce an error at all; see my log.

## Props and children

A React component receives **one object**, its props. Every attribute written in JSX becomes a property of that object, and whatever is written between the opening and closing tags becomes one more property called `children`. Destructuring in the parameter list (forms 5, 7 and 11) is how almost every component takes that object apart. The JavaScript versions are in `js/props.jsx`, the typed versions in `ts/props.tsx`; both render with `renderToStaticMarkup` and print the HTML.

### P1: props is one object

```jsx
function SongCardA(props) {
  return <article><h3>{props.title}</h3><p>{props.artist}</p>{props.children}</article>
}
function SongCardB({ title, artist, children }) {
  return <article><h3>{title}</h3><p>{artist}</p>{children}</article>
}
```

Output:

```
P1 A: <article><h3>Yellow</h3><p>Coldplay</p>Parachutes, 2000</article>
P1 B: <article><h3>Yellow</h3><p>Coldplay</p>Parachutes, 2000</article>
P1 the props object: { title: 'Yellow', bpm: 87, children: 'Parachutes' }
```

Both give the same HTML. `SongCardB` is **form 11** (a pattern in the parameter list) made of **form 5** (properties by name): `{ title, artist, children }` is short for `const title = props.title`, and so on. The third line prints what React really passes to a component for `<PrintProps title="Yellow" bpm={87}>Parachutes</PrintProps>`: one object, and `children` is just one of its keys. In TypeScript the type goes after the pattern: `function SongCardB({ title, artist, children }: SongCardProps)`.

### P2: children is only a prop

```jsx
show('P2 between the tags:', <Tag>indie rock</Tag>)
show('P2 as an attribute:', <Tag children="indie rock" />)
show('P2 both at once:', <Tag children="from the attribute">from the tags</Tag>)
show('P2 no children:', <Tag />)
```

Output:

```
P2 between the tags: <span class="tag">indie rock</span>
P2 as an attribute: <span class="tag">indie rock</span>
P2 both at once: <span class="tag">from the tags</span>
P2 no children: <span class="tag"></span>
```

The first two are the same thing: writing between the tags is only a nicer way to set the `children` prop. When I give both, **the content between the tags wins**, because JSX sets `children` from the tags after the attributes. With no children the prop is `undefined`, and `undefined` renders as nothing.

### P3: what children can be

Output (from `js/props.jsx`, each one is `<Box>{...}</Box>` with `Box` returning `<div>{children}</div>`):

```
P3 string: <div>Creep</div>
P3 number: <div>92</div>
P3 zero: <div>0</div>
P3 one element: <div><b>Creep</b></div>
P3 several elements: <div><b>Creep</b><i>Radiohead</i></div>
P3 an array: <div><em>Yellow</em><em>Creep</em></div>
P3 undefined: <div></div>
P3 null: <div></div>
P3 false: <div></div>
P3 true: <div></div>
P3 0 && ...: <div>0</div>
P3 a function, nobody calls it: <div></div>
P3 a function the component calls: <div><span>Creep by Radiohead</span></div>
P3 an object: Objects are not valid as a React child (found: object with keys {title}). If you meant to render a collection of children, use an array instead.
```

| children | What appears |
| --- | --- |
| string, number | the text; **`0` is shown** like any number |
| one element, several elements, an array | the elements, in order (an array needs a `key` on each item) |
| `undefined`, `null`, `false`, `true` | nothing; this is what makes `{isPlaying && <Pause />}` work |
| `0 && 'has songs'` | `0`, because `&&` returns the `0` itself, and numbers are rendered |
| a function | nothing, and React prints the warning *"Functions are not valid as a React child..."*; it is only useful when the component **calls** it (`children('Creep', 'Radiohead')`, a "render prop") |
| a plain object | an error: *"Objects are not valid as a React child"* |

In TypeScript `children?: ReactNode` accepts the first three rows; a function or an object is a compile error (see P7), and a component that wants a function must say so in its type: `children: (title: string, artist: string) => ReactNode` (`ts/props.tsx`).

### P4: children apart from the other props, and rest onto a DOM element

```jsx
function Section({ title, children, ...rest }) {
  return <section className="playlist" {...rest}><h2>{title}</h2>{children}</section>
}
function SectionFixedClass({ title, children, ...rest }) {
  return <section {...rest} className="playlist"><h2>{title}</h2>{children}</section>
}
```

Output:

```
P4 rest is: { id: 'gym', 'data-songs': '12' }
P4 rest goes to <section>: <section class="playlist" id="gym" data-songs="12"><h2>Gym Mix</h2>songs here</section>
P4 rest is: { className: 'dark' }
P4 spread after className: <section class="dark"><h2>Gym Mix</h2>songs</section>
P4 className after spread: <section class="playlist"><h2>Gym Mix</h2>songs</section>
Row: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)
P4 props.key is: undefined
P4 key: <li>Yellow</li>
```

`{ title, children, ...rest }` is **form 8** in a parameter: the component keeps `title` and `children` for itself and collects every other prop into `rest`, which it passes on with **spread** (`{...rest}`) to the `<section>`. So the caller can add `id`, `data-*` or `aria-*` attributes without the component knowing them. **Order decides who wins**, exactly like in an object literal: the later one overwrites the earlier one. In `Section`, `className="playlist"` comes before `{...rest}`, so the caller's `className="dark"` replaces it; in `SectionFixedClass` it comes after, so the component's own class always wins. `key` looks like a prop, but React takes it for itself: inside the component `props.key` is `undefined`, and React prints the warning above. In TypeScript the rest gets a real type with `ComponentProps<'section'>`.

### P5: props or children?

```jsx
<PlaylistWithSlots header={<h2>Sunday Drive</h2>} footer={<small>2 songs</small>} songs={['Yellow', 'Creep']} />

<PlaylistFrame>
  <h2>Sunday Drive</h2>
  <ul><li>Yellow</li><li>Creep</li></ul>
  <small>2 songs</small>
</PlaylistFrame>
```

Output:

```
P5 with header and footer props: <div class="playlist"><header><h2>Sunday Drive</h2></header><ul><li>Yellow</li><li>Creep</li></ul><footer><small>2 songs</small></footer></div>
P5 with children only: <div class="playlist"><h2>Sunday Drive</h2><ul><li>Yellow</li><li>Creep</li></ul><small>2 songs</small></div>
```

With **named props** (`header`, `footer`, `songs`) the component decides the structure: the header always goes into `<header>`, the list is always built the same way, and the caller only fills the slots. With **children only** the component is just a frame, and the caller decides everything inside, so two playlists can look completely different. I would use props when the parts have fixed places and meanings (a card with a title and a footer, a layout with a sidebar), and children when the component wraps content it does not need to understand (a frame, a modal, a page section). Both are props in the end; `children` is just the one that is written between the tags.

### P6: defaults for props

```jsx
function Badge({ label = 'New', color = 'gray' }) {
  return <span className={color}>{label}</span>
}
```

Output:

```
P6 prop not given: <span class="gray">New</span>
P6 undefined: <span class="gray">New</span>
P6 null: <span class="gray"></span>
P6 empty string: <span class="gray"></span>
```

This is **form 7** in the parameter list. Not giving the prop and giving `label={undefined}` are the same for the pattern, so both show `New`. `label={null}` is a real value, so the default is not used, and `null` renders as nothing: the badge is **empty on the screen**. An empty string is a real value too. In TypeScript `label?: string | null` makes this visible in the type.

### P7: types for props and children

From `ts/props.tsx`:

```tsx
type RatingProps = { stars: number; children?: ReactNode }               // (a) by hand
function Card({ title, children }: PropsWithChildren<{ title: string }>)  // (b)
function PlayButton({ children, ...rest }: ComponentProps<'button'>)       // (c)
```

Output:

```
P7 (a) children?: ReactNode: <span>**** Yellow</span>
P7 (b) PropsWithChildren: <section><h2>Sunday Drive</h2>2 songs</section>
P7 (c) ComponentProps<'button'>: <button type="button" disabled="" title="Play Yellow">▶ Play</button>
```

- **`children?: ReactNode`** written by hand: anything React can render (text, numbers, elements, arrays, `null`, `undefined`, booleans), and the `?` makes it optional.
- **`PropsWithChildren<P>`** is `P` plus `children?: ReactNode`; it saves writing that line, and the other props of `P` stay required.
- **`ComponentProps<'button'>`** is every prop a real `<button>` accepts (`onClick`, `disabled`, `type`, `children`...). With rest and spread, `PlayButton` passes all of them on, and the types come from React for free.

What the compiler **rejects** (`experiments/p7-rejected.tsx`, messages from `experiments/errors.txt`):

| JSX | Error |
| --- | --- |
| `<Rating stars="four" />` | `TS2322: Type 'string' is not assignable to type 'number'.` |
| `<Rating />` | `TS2741: Property 'stars' is missing in type '{}' but required in type 'RatingProps'.` |
| `<Tag>{() => 'Creep'}</Tag>` | `TS2322: Type '() => string' is not assignable to type 'ReactNode'.` |
| `<Tag>{{ title: 'Creep' }}</Tag>` | `TS2353: Object literal may only specify known properties, and 'title' does not exist in type 'ReactElement<...> \| Iterable<ReactNode> \| ReactPortal \| Promise<...>'.` |
| `<TitleOnly title="Yellow">extra text</TitleOnly>` | `TS2322: ... Property 'children' does not exist on type 'IntrinsicAttributes & TitleOnlyProps'.` |
| `<Card>songs</Card>` | `TS2741: Property 'title' is missing in type '{ children: string; }' but required in type '{ title: string; }'.` |
| `<PlayButton onClick="play">` | `TS2322: Type 'string' is not assignable to type 'MouseEventHandler<HTMLButtonElement>'.` |
| `<PlayButton volume={5}>` | `TS2322: ... Property 'volume' does not exist on type 'IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>'.` |
| `<PlayButton type="play">` | `TS2322: Type '"play"' is not assignable to type '"button" \| "submit" \| "reset" \| undefined'.` |

In JavaScript the same mistakes are silent: `<Rating stars="four" />` and `<Rating />` both render an empty `<span></span>` (`P7 (JS)` lines in `output.txt`), because `'*'.repeat('four')` and `'*'.repeat(undefined)` repeat zero times. The fifth row is the clearest one for this assignment: a component whose props type has no `children` does not accept children at all.

## JavaScript versus TypeScript

The pattern itself never changes in TypeScript; what I add is a type **after** the pattern (or on the function), and the compiler then checks every name in it. Errors from `experiments/js-vs-ts.ts` and `experiments/destructuring-errors.ts` (`experiments/errors.txt`).

| Form | Stays the same | What I add in TS | Error when I get it wrong |
| --- | --- | --- | --- |
| 1 `[x, y] = f()` | the pattern | a tuple return type `[string, number]` | no tuple type: `TS2339: Property 'toUpperCase' does not exist on type 'string \| number'.` |
| 2 `[, second, ...rest]` | the pattern, rest is `string[]` | nothing; the skipped-to item is `string \| undefined` | `TS18048: 'secondSong' is possibly 'undefined'.` |
| 3 `[a, b] = [b, a]` | the swap | variables of compatible types | swapping a string and a number: `TS2322: Type 'number' is not assignable to type 'string'.` |
| 4 `[a = 1] = list` | the defaults | a type for the list (`string[]`) | pattern longer than a tuple: `TS2493: Tuple type '[string]' of length '1' has no element at index '1'.` |
| 5 `{ a, b } = t` | the pattern | a type for the object (`Song`) | a name that is not in the type: `TS2339: Property 'album' does not exist on type 'Song'.` |
| 6 `{ a: alpha }` | the rename | the type after the whole pattern | type written inside: `TS7031: Binding element 'string' implicitly has an 'any' type.` |
| 7 `{ a = 1 }` | the default | an optional field `rating?: number` | no default: `TS18048: 'rating' is possibly 'undefined'.` |
| 8 `{ a, ...rest }` | the rest | nothing; rest is typed as the object without `a` | `TS2339: Property 'id' does not exist on type '{ title: string; artist: string; bpm: number; rating?: number \| undefined; }'.` |
| 9 nested | the pattern | nothing; items of `Song[]` are `Song \| undefined` | using them without a check: `'... is possibly 'undefined'` (TS18048, as in T3) |
| 10 `{ [key]: v }` | the pattern | a key of type `keyof Song` | a key of type `string`: `TS2537: Type 'Song' has no matching index signature for type 'string'.` |
| 11 parameters | the pattern and defaults | `: Options = {}` after the pattern | a typo in an option: `TS2561: Object literal may only specify known properties, but 'nam' does not exist in type 'PlaylistOptions'. Did you mean to write 'name'?` |
| 12 loops | the pattern | a typed `Map<string, number>` or `Record<string, number>` | `TS2339: Property 'toUpperCase' does not exist on type 'number'.` |

## Bonus 2: Depth

Bonus 2: Depth. All experiments are in `js/depth.mjs` and their output is in `output.txt`.

**1. An array pattern works on any iterable.**

```js
const [firstLetter, ...otherLetters] = 'Creep'
const [firstGenre] = new Set(['rock', 'pop', 'rock'])
const [[firstKey, firstValue]] = new Map([['Yellow', 87]])
```

```
depth 1 (string): C [ 'r', 'e', 'e', 'p' ]
depth 1 (Set): rock
depth 1 (Map): Yellow 87
```

A string gives its characters, a `Set` its values, a `Map` its `[key, value]` pairs (so the Map needs a pattern inside a pattern). The array pattern does not care about "arrays", it only needs something it can iterate.

**2. What an array pattern really calls.** I made an object with my own `Symbol.iterator` that prints every call:

```
depth 2: Symbol.iterator was called
depth 2: next() call 1
depth 2: next() call 2
depth 2: return() was called, the pattern stopped early
depth 2: got Yellow Creep
```

`const [one, two] = loggingPlaylist` calls `[Symbol.iterator]()` once, then `next()` exactly **twice** (once per name), and then `return()` to tell the iterator it is done, although there were four songs. So an array pattern is not "read index 0 and 1"; it is "start iterating, take as many items as I have names, then stop". This also explains pitfall-like errors: an object without `Symbol.iterator` cannot be used at all.

**3. A generator only runs as far as the pattern pulls.**

```
depth 3: playing song 1
depth 3: got Yellow
```

The generator has three `yield`s, but `const [firstOnRadio] = radio()` asks for one item, so the code before song 2 never runs. This is the lazy behaviour of experiment 2 with a real generator.

**4. A plain object is not iterable.**

```
depth 4: TypeError - {(intermediate value)} is not iterable
```

`const [x] = { title: 'Yellow' }` fails because objects have no `Symbol.iterator` (that is why form 12 needs `Object.entries`).

**5. A default is only computed when it is needed.**

```js
const [bpmA = lookUpBpm()] = [87]
const [bpmB = lookUpBpm()] = []
```

```
depth 5: 87 100 lookups = 1
```

The function with a side effect (it counts its calls) ran only once, for the missing item. A default is evaluated lazily, like the right side of `??`, so an expensive default costs nothing when the value is there.

**6. A default can use an earlier name of the same pattern, not a later one.**

```
depth 6 (earlier name): 30 60
depth 6 (later name): ReferenceError - Cannot access 'b' before initialization
```

`[introLength, outroLength = introLength * 2]` works because the pattern is filled left to right. `[a = b, b = 1]` fails: when the default of `a` runs, `b` exists but is not initialised yet (the "temporal dead zone"), the same error as pitfall 6.

**7. Destructuring in other places: `catch` and assignment targets.**

```
depth 7 (catch): SyntaxError - Expected property name or '}' in JSON at position 2 (line 1 column 3)
depth 7 (assignment targets): { current: 'Yellow', next: 'Creep' }
```

`catch ({ name, message })` takes the error object apart directly. And the targets of a destructuring assignment do not have to be variables: `[player.current, player.next] = ['Yellow', 'Creep']` writes into object properties.

**8. `for...in` against `for...of`.**

```
depth 8 (for...in): Yellow
depth 8 (for...in): Creep
depth 8 (for...of + entries): Yellow 87
depth 8 (for...of + entries): Creep 92
```

`for...in` walks over the **keys** (strings) of an object, so there is nothing to destructure. `for...of` walks over the **values** of an iterable, and `Object.entries` turns the object into `[key, value]` pairs that a pattern can take apart (form 12).

## Bonus 3: Real code

Bonus 3: Real code. Destructuring found in code I did not write: the Assignment 3 Task Manager **starter** (from the course), and the TypeScript compiler, an open-source project that is installed in this project (`node_modules/typescript/lib/_tsc.js`, version 5.8.3).

| # | File and line | Code | Form | Without destructuring |
| --- | --- | --- | --- | --- |
| 1 | Assignment 3 starter `src/App.tsx`, line 37 | `const [tasks, dispatch] = useReducer(taskReducer, [])` | 1 | `const pair = useReducer(...); const tasks = pair[0]; const dispatch = pair[1]` |
| 2 | Assignment 3 starter `src/TaskRow.tsx`, line 5 | `function TaskRow({ task, onNext, onDelete }: TaskRowProps)` | 11 (+5) | `function TaskRow(props: TaskRowProps) { const task = props.task; ... }` |
| 3 | `node_modules/typescript/lib/_tsc.js`, line 2302 | `const [, major, minor = "0", patch = "0", prerelease = "", build2 = ""] = match;` | 2 and 4 | `const major = match[1]; const minor = match[2] === undefined ? "0" : match[2]; ...` |
| 4 | `node_modules/typescript/lib/_tsc.js`, line 2260 | `const { major, minor, patch, prerelease, build: build2 } = result;` | 5 and 6 | `const major = result.major; ... const build2 = result.build;` |
| 5 | `node_modules/typescript/lib/_tsc.js`, line 1450 | `for (const [enumValue, enumName] of members) {` | 12 | `for (const entry of members) { const enumValue = entry[0]; const enumName = entry[1]; ...` |
| 6 | `node_modules/typescript/lib/_tsc.js`, line 13953 | `const { line: startLine } = getLineAndCharacterOfPosition(sourceFile, node.body.pos);` | 6 | `const startLine = getLineAndCharacterOfPosition(...).line;` |
| 7 | `node_modules/typescript/lib/_tsc.js`, line 18265 | `const [commonResolved, commonOriginal] = guessDirectorySymlink(...) \|\| emptyArray;` | 1 | `const pair = guessDirectorySymlink(...) \|\| emptyArray; const commonResolved = pair[0]; ...` |
| 8 | `node_modules/typescript/lib/_tsc.js`, line 19030 | `const { parent: parent3 } = node;` | 6 | `const parent3 = node.parent;` |

**Notes on the cases.**

- Case 3 is a nice real use of forms 2 and 4 together: `match` is the result of a regular expression, whose index 0 is the whole matched text. The empty place at the start skips it, and the defaults (`"0"`, `""`) fill the parts of a version number like `5.8` that are missing (no patch number). Written without destructuring, it would be six lines with six `=== undefined` checks.
- Case 7 protects itself against pitfall 1: `guessDirectorySymlink` can return `undefined`, and destructuring `undefined` throws, so the code adds `|| emptyArray` to always have something iterable on the right; then both names are just `undefined`.
- **A case where destructuring makes the code worse: case 8.** `const { parent: parent3 } = node;` saves nothing over `const parent3 = node.parent;`, and the rename to `parent3` (made by the tool that bundled the compiler, because there were other variables called `parent`) hides where the value comes from. Reading `parent3` two lines later, I have to scroll up to learn it is `node.parent`. Case 6 is similar: `getLineAndCharacterOfPosition(...).line` would be as short and needs no rename.
- **React props case: case 2.** In `TaskRow({ task, onNext, onDelete })`, all three are normal **props**, written as attributes in `App.tsx` (`<TaskRow task={t} onNext={...} onDelete={...} />`). There is **no children** here: `TaskRow` is used as a self-closing tag, and `children` is not even in `TaskRowProps`, so TypeScript would reject content between the tags (like the `TitleOnly` row in P7). The opposite example is in the same starter, `src/main.tsx`, lines 6 to 8: `<StrictMode><App /></StrictMode>`. There `StrictMode` gets **no attributes at all**, and `<App />` is its only prop, `children`.

## Bonus 4: Git repository

Bonus 4: Git repository

LINK_PLACEHOLDER

The repository has a `.gitignore` that leaves out `node_modules` (and the course handout files), and it runs after `git clone`, `npm install` and `npm run all`. The history shows the work in steps: the starter, then the JavaScript forms, the pitfalls, props and children, the TypeScript forms, the TypeScript topics, the compiler experiments, Bonus 2, and the guide.

## My own log

Real things that went wrong or surprised me while building this project, with the exact messages.

1. **My first T5 did not cause any error.** I wanted the compile error of an empty array: `const [volume = 50] = []` with `// @ts-expect-error` above it. `npm run check` then failed with `error TS2578: Unused '@ts-expect-error' directive.` So the line I expected to be wrong is fine for TypeScript, because the default value covers the missing position. Two things learned: `@ts-expect-error` is safer than an ignore, because it complains when the error disappears; and a default really changes what TypeScript accepts. I used `const [onlyArtist, missingTitle] = ['Coldplay']` instead (TS2493), and kept the empty-array line in `experiments/destructuring-errors.ts` as "no error here".
2. **The swap without a semicolon is not a syntax error.** I expected the joined lines of pitfall 6 to give a `SyntaxError`, but the result was `ReferenceError - Cannot access 'b' before initialization`. Reading it as one line, `let b = 'Creep'[a, b] = [b, a]`, explains it: `b` is used inside its own declaration. Since I do not use semicolons, every line that starts with `[` or `(` needs a `;` in front, which is why form 3 and pitfall 3 start with `;`.
3. **A strange error message for `null`.** `makePlaylist(null)` printed `Cannot destructure property 'name' of '(intermediate value)(intermediate value)(intermediate value)' as it is null.` For the same mistake without a parameter default (pitfall 1) the message names the real expression, `'findSong(...)'`. The difference is the `= {}` default: JavaScript evaluates "the argument, or `{}` if it is undefined" as a hidden expression with no name. The useful part of the message is the end, `as it is null`: the `= {}` default did not help, because defaults only work for `undefined`.
4. **My first pitfall 4 proved nothing.** The first version was `const { owner, ...rest } = library[1]` and then `rest.owner === library[1].owner`, and the output was `pitfall 4: someone-else | false`. `false` looked like "the copy is independent", but it was only because I had taken `owner` out of `rest` with the pattern, so `rest.owner` was `undefined`. The rest object only contains the properties that are **not** named in the pattern. I changed the pattern to take `title` out instead, and then `rest.owner === library[1].owner` is `true`: the nested object is shared.
5. **React keeps `key` for itself.** In P4 I passed `key="s1"` to a component and printed `props.key`: it was `undefined`, and React wrote `Row: \`key\` is not a prop. Trying to access it will result in \`undefined\` being returned.` So not every JSX attribute ends up in props; to use the id inside the component it needs a second prop with another name.
6. **Props cannot be changed.** A component that does `props.title = 'Changed title'` crashed with `TypeError - Cannot assign to read only property 'title' of object '#<Object>'`. React freezes the props object in development, so a component can only read props; to change something it needs state. (Destructuring into `let` variables and changing those is fine, because that only changes the local variable, form 5.)
7. **`0` shows up on the screen.** I expected `{songCount && 'has songs'}` to show nothing when `songCount` is `0`, but the output was `<div>0</div>`. `&&` returns its left side when that is falsy, and React renders numbers, including `0`; only `false`, `null`, `undefined` and `true` render as nothing. `songCount > 0 && ...` would be the correct condition.
8. **`npm run all > output.txt` misses React's warnings.** The warnings for `key` and for a function as a child appear in the terminal but went to stderr, so I added `2>&1` to get the complete real output into `output.txt`.
