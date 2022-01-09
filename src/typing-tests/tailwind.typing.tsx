import tw from "../tailwind"
// @ts-ignore
import React from "react"
import { expectExactAny, expectExactType, expectNotAny, expectType } from "./test-types"

const Div = tw.div``
const H1 = tw.h1``
const A = tw.a``

// @ts-expect-error
const dfsdfe = <Div href="/" />
// @ts-expect-error
const dfsdfe2 = <Div as="a" href="/" />
// @ts-expect-error
const dfsdfe2b = <Div as="div" href="/" />
// @ts-expect-error
const dfsdfe3 = <Div as={Div} href="/" />
// @ts-expect-error
const dfsdfe3a = <Div as={H1} href="/" />
const dfsdfe3b = <Div as="a" href="/" />

const dfsdfe3c = <Div as={A} href="/" />
