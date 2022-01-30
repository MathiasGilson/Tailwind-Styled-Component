import tw from "../tailwind"
// @ts-ignore
import React from "react"
import { expectExactAny, expectExactType, expectNotAny, expectType } from "./test-types"

const Divvy2 = tw("div")<{ $test1: string }>`
        text-black
        `
const RedDiv = tw(Divvy2)`bg-red-500`

const Div = tw.div``
const H1 = tw.h1``
const A = tw.a``

// @ts-expect-error
const dfsdfe = <Div href="/" />

const dfsdfe2 = <Div $as="a" href="/" />
// @ts-expect-error
const dfsdfe2b = <Div $as="div" href="/" />
// @ts-expect-error
const dfsdfe3 = <Div $as={Div} href="/" />
// @ts-expect-error
const dfsdfe3b2 = Div({ $as: "div", href: "/" })
// @ts-expect-error
const dfsdfe3b2n = Div({ href: "/" })
// @ts-expect-error
const dfsdfe3a = <Div $as={H1} href="/" />
const dfsdfe3b = <Div $as="a" href="/" />

const dfsdfe3c = <Div $as={A} href="/" />

const C1 = (props: { className: string; booleanProp?: boolean }) => <div children={props.booleanProp} />
const C2 = () => <div />
const C3 = (props: { booleanProp: boolean }) => <div children={props.booleanProp} />
const C4 = (props: { booleanProp: boolean; children?: string }) => <div children={props.booleanProp} />
const C5 = (props: React.PropsWithChildren<{ booleanProp: boolean }>) => <div children={props.booleanProp} />

const T = tw.div``
const HasClassName = tw(C1)``
const HasClassNameAndBoolean = tw(C3)`
h-full
`
const HasChildren = tw(C4)``
const HasReqChildren = tw(C5)``

function testfunc<E extends React.ComponentType<any>, P = React.ComponentProps<E>>(e: E): P {
    return e as any
}

const result = testfunc(C5)

expectType<{ booleanProp: boolean } & { children?: React.ReactNode }>(result)
// @ts-expect-error
expectType<{ booleanProp: boolean } & { children: React.ReactNode }>(result)

// type P =

const NoProps = tw(C2)``

const TG = (props: { gar: number }) => <div>{props.gar}</div>

const TR = tw(TG)``

const Divvy = tw.div<{ $test1: string }>`
        text-black
        `
const RedDiv2 = tw(Divvy)`bg-red-500`

const AsDiv = <RedDiv $as="div" $test1="true" />
// @ts-expect-error
const AsDiv2 = <RedDiv $as="div" $test1="true" href="http://" />
// @ts-expect-error
const AsDiv2b = RedDiv({ $as: "div", $test1: "true", href: "http://" })

const AsA = <RedDiv $as="a" $test1="true" href="http://" />

const test1 = <T $as="a" href="" />
// @ts-expect-error
const test2 = <HasClassName $as="a" href="" />
const test3 = <HasClassName $as="a" href="" className="" />
// @ts-expect-error
const test4 = <NoProps $as="div" href="" />
const test4b = <NoProps $as="a" href="" />
const test5 = <T $as="div" onChange={() => {}} />
const test6 = <HasClassName $as="div" onChange={() => {}} className="" />
// @ts-expect-error
const test12 = <HasClassName $as="div" onChange={() => {}} className="" booleanProp="true" />
// @ts-expect-error
const test12b = <HasClassName onChange={() => {}} className="" booleanProp="true" />
const test12c = <HasClassName className="" booleanProp={true} />
const test12d = <HasClassName className="" />
const test13 = <HasClassName $as="div" onChange={() => {}} className="" booleanProp={true} />
const test8 = <NoProps $as="div" onChange={() => {}} />
// @ts-expect-error
const test7 = <HasClassName onChange={() => {}} />
// @ts-expect-error
const test11 = <HasClassName onChange={() => {}} classname="" />
// const test11b = HasClassName({onChange:() => {}, classname:""})
// @ts-expect-error
const test9 = <NoProps onChange={() => {}} />
// @ts-expect-error
const test10 = <T $as="div" href="/" />
// @ts-expect-error
const sfd2clk = <T $as="dive" href="/" />

type TTTTT = React.ComponentPropsWithRef<typeof HasClassName>

const sfdkj3 = (
    <T
        $as={C1}
        className=""
        booleanProp={true}
        // onChange= () => {}}
    />
)
// @ts-expect-error
const sfd4 = <T $as={C1} className="" css="true" />
