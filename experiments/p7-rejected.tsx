// Doruk Şahin, 2023502030
// P7: props that the TypeScript compiler REJECTS. This file is not part of `npm run check`.
// Run `npx tsc --noEmit -p experiments` to see the errors (saved in experiments/errors.txt).
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'

type RatingProps = { stars: number }
function Rating({ stars }: RatingProps) {
  return <span>{'*'.repeat(stars)}</span>
}
type TagProps = { children?: ReactNode }
function Tag({ children }: TagProps) {
  return <span>{children}</span>
}
type TitleOnlyProps = { title: string } // no children in this type
function TitleOnly({ title }: TitleOnlyProps) {
  return <h2>{title}</h2>
}
function Card({ title, children }: PropsWithChildren<{ title: string }>) {
  return <section><h2>{title}</h2>{children}</section>
}
function PlayButton({ children, ...rest }: ComponentProps<'button'>) {
  return <button {...rest}>{children}</button>
}

export const wrongType = <Rating stars="four" /> // a string where a number is needed
export const missingProp = <Rating /> // stars is required
export const functionChild = <Tag>{() => 'Creep'}</Tag> // a function is not a ReactNode
export const objectChild = <Tag>{{ title: 'Creep' }}</Tag> // an object is not a ReactNode
export const childrenNotInType = <TitleOnly title="Yellow">extra text</TitleOnly> // no children in the type
export const missingTitle = <Card>songs</Card> // PropsWithChildren keeps title required
export const wrongHandler = <PlayButton onClick="play">Play</PlayButton> // onClick must be a function
export const unknownProp = <PlayButton volume={5}>Play</PlayButton> // a <button> has no volume
export const wrongButtonType = <PlayButton type="play">Play</PlayButton> // type is button, submit or reset
