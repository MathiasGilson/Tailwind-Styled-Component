import tw from "../tailwind"
// @ts-ignore
import React from "react"
import { expectExactAny, expectExactType, expectNotAny, expectType } from "./test-types"

const Div = tw.div``
const H1 = tw.h1``
const A = tw.a``

// @ts-expect-error
const dfsdfe = <Div href="/" />

const dfsdfe2 = <Div as="a" href="/" />
// @ts-expect-error
const dfsdfe2b = <Div as="div" href="/" />
// @ts-expect-error
const dfsdfe3 = <Div as={Div} href="/" />
// @ts-expect-error
const dfsdfe3a = <Div as={H1} href="/" />
const dfsdfe3b = <Div as="a" href="/" />

const dfsdfe3c = <Div as={A} href="/" />

const C1 = (_props: { className: string; css?: boolean }) => <div />
const C2 = () => <div />

const T = tw.div``
const HasClassName = tw(C1)``
const NoProps = tw(C2)``

const test1 = <T as="a" href="" />
// @ts-expect-error
const test2 = <HasClassName as="a" href="" />
const test3 = <HasClassName as="a" href="" className="" />
const test4 = <NoProps as="a" href="" />
const test5 = <T as="div" onChange={() => {}} />
const test6 = <HasClassName as="div" onChange={() => {}} className="" />
// @ts-expect-error
const test12 = <HasClassName as="div" onChange={() => {}} className="" css="true" />
const test13 = <HasClassName as="div" onChange={() => {}} className="" css={true} />
const test8 = <NoProps as="div" onChange={() => {}} />
// @ts-expect-error
const test7 = <HasClassName onChange={() => {}} />
// @ts-expect-error
const test11 = <HasClassName onChange={() => {}} classname="" />
// @ts-expect-error
const test9 = <NoProps onChange={() => {}} />
// @ts-expect-error
const test10 = <T as="div" href="/" />
// @ts-expect-error
const sfd2clk = <T as="dive" href="/" />

const sfdkj3 = (
    <T
        as={C1}
        className=""
        css={true}
        // onChange= () => {}}
    />
)
// @ts-expect-error
const sfd4 = <T as={C1} className="" css="true" />
