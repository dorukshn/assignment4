// Doruk Şahin, 2023502030
// Props and children in plain JavaScript (JSX). Run with `npx tsx js/props.jsx`.
import { renderToStaticMarkup } from 'react-dom/server'

// A small helper: render an element to HTML and print it with a label.
const show = (label, element) => console.log(label, renderToStaticMarkup(element))

// P1: props is ONE object. Both components below do the same thing.
function SongCardA(props) {
  return (
    <article>
      <h3>{props.title}</h3>
      <p>{props.artist}</p>
      {props.children}
    </article>
  )
}
// Form 5 (properties by name) + form 11 (a pattern in the parameter list).
function SongCardB({ title, artist, children }) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{artist}</p>
      {children}
    </article>
  )
}
show('P1 A:', <SongCardA title="Yellow" artist="Coldplay">Parachutes, 2000</SongCardA>)
show('P1 B:', <SongCardB title="Yellow" artist="Coldplay">Parachutes, 2000</SongCardB>)
// What React really passes to the component: one object.
function PrintProps(props) {
  console.log('P1 the props object:', props)
  return null
}
renderToStaticMarkup(<PrintProps title="Yellow" bpm={87}>Parachutes</PrintProps>)

// P2: children is only a prop.
function Tag({ children }) {
  return <span className="tag">{children}</span>
}
show('P2 between the tags:', <Tag>indie rock</Tag>)
show('P2 as an attribute:', <Tag children="indie rock" />)
show('P2 both at once:', <Tag children="from the attribute">from the tags</Tag>)
show('P2 no children:', <Tag />)

// P3: what children can be.
function Box({ children }) {
  return <div>{children}</div>
}
show('P3 string:', <Box>{'Creep'}</Box>)
show('P3 number:', <Box>{92}</Box>)
show('P3 zero:', <Box>{0}</Box>)
show('P3 one element:', <Box><b>Creep</b></Box>)
show('P3 several elements:', <Box><b>Creep</b><i>Radiohead</i></Box>)
show('P3 an array:', <Box>{['Yellow', 'Creep'].map((t) => <em key={t}>{t}</em>)}</Box>)
show('P3 undefined:', <Box>{undefined}</Box>)
show('P3 null:', <Box>{null}</Box>)
show('P3 false:', <Box>{false}</Box>)
show('P3 true:', <Box>{true}</Box>)
const songCount = 0
show('P3 0 && ...:', <Box>{songCount && 'has songs'}</Box>)
// A function as a child is not rendered by React on its own...
show('P3 a function, nobody calls it:', <Box>{() => 'Creep'}</Box>)
// ...but a component can call it (the "render prop" idea).
function NowPlaying({ children }) {
  return <div>{children('Creep', 'Radiohead')}</div>
}
show('P3 a function the component calls:', <NowPlaying>{(t, a) => <span>{t} by {a}</span>}</NowPlaying>)
// A plain object is not a valid child.
try {
  renderToStaticMarkup(<Box>{{ title: 'Creep' }}</Box>)
} catch (error) {
  console.log('P3 an object:', error.message.split('\n')[0])
}

// P4: separating children from the other props, and spreading the rest onto a DOM element.
function Section({ title, children, ...rest }) {
  console.log('P4 rest is:', rest)
  return (
    <section className="playlist" {...rest}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
show('P4 rest goes to <section>:', <Section title="Gym Mix" id="gym" data-songs="12">songs here</Section>)
// className is written BEFORE {...rest}, so a className inside rest replaces it.
show('P4 spread after className:', <Section title="Gym Mix" className="dark">songs</Section>)
function SectionFixedClass({ title, children, ...rest }) {
  return (
    <section {...rest} className="playlist">
      <h2>{title}</h2>
      {children}
    </section>
  )
}
// Here className is written AFTER {...rest}, so it wins.
show('P4 className after spread:', <SectionFixedClass title="Gym Mix" className="dark">songs</SectionFixedClass>)
// key looks like a prop in JSX, but React keeps it for itself.
function Row(props) {
  console.log('P4 props.key is:', props.key)
  return <li>{props.title}</li>
}
show('P4 key:', <Row key="s1" title="Yellow" />)

// P5: props or children? The same playlist box built twice.
function PlaylistWithSlots({ header, footer, songs }) {
  return (
    <div className="playlist">
      <header>{header}</header>
      <ul>{songs.map((s) => <li key={s}>{s}</li>)}</ul>
      <footer>{footer}</footer>
    </div>
  )
}
show(
  'P5 with header and footer props:',
  <PlaylistWithSlots header={<h2>Sunday Drive</h2>} footer={<small>2 songs</small>} songs={['Yellow', 'Creep']} />,
)
function PlaylistFrame({ children }) {
  return <div className="playlist">{children}</div>
}
show(
  'P5 with children only:',
  <PlaylistFrame>
    <h2>Sunday Drive</h2>
    <ul><li>Yellow</li><li>Creep</li></ul>
    <small>2 songs</small>
  </PlaylistFrame>,
)

// P6: defaults for props, form 7 in the parameter.
function Badge({ label = 'New', color = 'gray' }) {
  return <span className={color}>{label}</span>
}
show('P6 prop not given:', <Badge />)
show('P6 undefined:', <Badge label={undefined} />)
show('P6 null:', <Badge label={null} />)
show('P6 empty string:', <Badge label="" />)

// P7: JavaScript has no types, so nothing stops a wrong prop. (See ts/props.tsx.)
function Rating({ stars }) {
  return <span>{'*'.repeat(stars)}</span>
}
show('P7 (JS) a number:', <Rating stars={4} />)
show('P7 (JS) a string:', <Rating stars="four" />)
show('P7 (JS) missing:', <Rating />)

// Extra: a component that changes its props.
function RenameSong(props) {
  props.title = 'Changed title'
  return <b>{props.title}</b>
}
try {
  show('extra: changing props:', <RenameSong title="Yellow" />)
} catch (error) {
  console.log('extra: changing props:', error.constructor.name, '-', error.message)
}
