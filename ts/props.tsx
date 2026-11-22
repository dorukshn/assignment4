// Doruk Şahin, 2023502030
// Props and children in TypeScript. Run with `npx tsx ts/props.tsx`.
import type { ComponentProps, PropsWithChildren, ReactElement, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const show = (label: string, element: ReactElement) => console.log(label, renderToStaticMarkup(element))

// P1: props is ONE object. The type describes that object, and it goes after the whole pattern.
type SongCardProps = { title: string; artist: string; children?: ReactNode }
function SongCardA(props: SongCardProps) {
  return (
    <article>
      <h3>{props.title}</h3>
      <p>{props.artist}</p>
      {props.children}
    </article>
  )
}
function SongCardB({ title, artist, children }: SongCardProps) {
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

// P2: children is only a prop, so it is in the props type like any other prop.
type TagProps = { children?: ReactNode }
function Tag({ children }: TagProps) {
  return <span className="tag">{children}</span>
}
show('P2 between the tags:', <Tag>indie rock</Tag>)
show('P2 as an attribute:', <Tag children="indie rock" />)

// P3: what children can be. ReactNode allows strings, numbers, elements, arrays, null, undefined and booleans.
function Box({ children }: { children?: ReactNode }) {
  return <div>{children}</div>
}
show('P3 number:', <Box>{92}</Box>)
show('P3 several elements:', <Box><b>Creep</b><i>Radiohead</i></Box>)
show('P3 null:', <Box>{null}</Box>)
show('P3 false:', <Box>{false}</Box>)
// A function is NOT a ReactNode. If a component wants a function as children, its type must say so.
type NowPlayingProps = { children: (title: string, artist: string) => ReactNode }
function NowPlaying({ children }: NowPlayingProps) {
  return <div>{children('Creep', 'Radiohead')}</div>
}
show('P3 function children (typed):', <NowPlaying>{(t, a) => <span>{t} by {a}</span>}</NowPlaying>)

// P4: children apart from the other props; the rest is typed as the props of a <section>.
type SectionProps = { title: string } & ComponentProps<'section'>
function Section({ title, children, ...rest }: SectionProps) {
  return (
    <section className="playlist" {...rest}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
show('P4 rest spread:', <Section title="Gym Mix" id="gym" aria-label="Gym playlist">songs here</Section>)
show('P4 spread after className:', <Section title="Gym Mix" className="dark">songs</Section>)

// P5: props or children? Slots as typed props, or one children prop.
type SlotsProps = { header: ReactNode; footer?: ReactNode; songs: string[] }
function PlaylistWithSlots({ header, footer, songs }: SlotsProps) {
  return (
    <div className="playlist">
      <header>{header}</header>
      <ul>{songs.map((s) => <li key={s}>{s}</li>)}</ul>
      <footer>{footer}</footer>
    </div>
  )
}
show('P5 slots:', <PlaylistWithSlots header={<h2>Sunday Drive</h2>} songs={['Yellow', 'Creep']} />)
function PlaylistFrame({ children }: PropsWithChildren) {
  return <div className="playlist">{children}</div>
}
show('P5 children:', <PlaylistFrame><h2>Sunday Drive</h2><small>2 songs</small></PlaylistFrame>)

// P6: defaults. label is optional and may be null; with a default, undefined becomes 'New'.
type BadgeProps = { label?: string | null; color?: string }
function Badge({ label = 'New', color = 'gray' }: BadgeProps) {
  return <span className={color}>{label}</span>
}
show('P6 prop not given:', <Badge />)
show('P6 undefined:', <Badge label={undefined} />)
show('P6 null:', <Badge label={null} />)

// P7: three ways to type children and props.
// (a) children?: ReactNode written by hand.
type RatingProps = { stars: number; children?: ReactNode }
function Rating({ stars, children }: RatingProps) {
  return <span>{'*'.repeat(stars)} {children}</span>
}
show('P7 (a) children?: ReactNode:', <Rating stars={4}>Yellow</Rating>)
// (b) PropsWithChildren<P> adds `children?: ReactNode` to P for me.
function Card({ title, children }: PropsWithChildren<{ title: string }>) {
  return <section><h2>{title}</h2>{children}</section>
}
show('P7 (b) PropsWithChildren:', <Card title="Sunday Drive">2 songs</Card>)
// (c) ComponentProps<'button'> gives every prop a real <button> accepts, children and onClick included.
function PlayButton({ children, ...rest }: ComponentProps<'button'>) {
  return <button type="button" {...rest}>▶ {children}</button>
}
show('P7 (c) ComponentProps<\'button\'>:', <PlayButton disabled title="Play Yellow">Play</PlayButton>)
// What the compiler rejects is in experiments/p7-rejected.tsx (it is not part of npm run check).
