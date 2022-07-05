import tw, { TailwindComponent, TailwindComponentInnerProps } from "../tailwind"
// @ts-ignore
import React from "react"
import { expectExactAny, expectExactType, expectNotAny, expectType } from "./test-types"

const Divvy2 = tw("div")<{ $test1: string }>`
        text-black
        `
const RedDiv = tw(Divvy2)`bg-red-500`
const RedDiv2jn = tw(RedDiv)`bg-red-500`

const Div = tw.div``
const H1 = tw.h1``
const A = tw.a``

/**Test: Properly gives a type error when wrong props are used */
{
    // @ts-expect-error
    const Test1 = <Div href="/" />
    // @ts-expect-error
    const Test2 = Div({ href: "/" })
}

const Test2 = Div({ $as: "a", href: "/" })

/**Test: props are type cast properly with $as prop */
{
    const Test1 = <Div $as="a" href="/" />
    const Test2 = <Div $as={A} href="/" />
}

/** Test: types error for wrong props with $as prop */
{
    // @ts-expect-error
    const dfsdfe2b = <Div $as="div" href="/" />
    // @ts-expect-error
    const dfsdfe3 = <Div $as={Div} href="/" />
    // @ts-expect-error
    const dfsdfe3b2 = Div({ $as: "div", href: "/" })
    // @ts-expect-error
    const dfsdfe3a = <Div $as={H1} href="/" />
}

/** Has className prop and optional booleanProp */
const Component1 = (props: { className: string; booleanProp?: boolean }) => <div children={props.booleanProp} />
const Component2 = () => <div />
const C3 = (props: { booleanProp: boolean }) => <div children={props.booleanProp} />
const C4 = (props: { booleanProp: boolean; children?: string }) => <div children={props.booleanProp} />
const C5 = (props: React.PropsWithChildren<{ booleanProp: boolean }>) => <div children={props.booleanProp} />

const T = tw.div``
type T = TailwindComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>
expectType<T>(T)

const CA = tw(Component1)``
expectType<TailwindComponent<{ className: string; booleanProp?: boolean | undefined }, {}>>(CA)

const CB = tw(C3)`
h-full
`
expectType<
    TailwindComponent<
        {
            booleanProp: boolean
        },
        {}
    >
>(CB)

const CC = tw(C4)``
expectType<
    TailwindComponent<
        {
            booleanProp: boolean
            children?: string | undefined
        },
        {}
    >
>(CC)

const CD = tw(C5)``
expectExactType<
    TailwindComponent<
        {
            booleanProp: boolean
            children?: React.ReactNode
        },
        {}
    >
>(CD)

// type P =

const NoProps = tw(Component2)``

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
const test2 = <CA $as="a" href="" />
const test3 = <CA $as="a" href="" className="" />

const test4 = <NoProps />
// @ts-expect-error
const test4a = <NoProps $as="div" href="" />
const test4b = <NoProps $as="a" href="" />
const test5 = <T $as="div" onChange={() => {}} />
const test6 = <CA $as="div" onChange={() => {}} className="" />
// @ts-expect-error
const test12 = <CA $as="div" onChange={() => {}} className="" booleanProp="true" />
// @ts-expect-error
const test12b = <CA onChange={() => {}} className="" booleanProp="true" />
const test12c = <CA className="" booleanProp={true} />
const test12d = <CA className="" />
const test13 = <CA $as="div" onChange={() => {}} className="" booleanProp={true} />
const test8 = <NoProps $as="div" onChange={() => {}} />
// @ts-expect-error
const test7 = <CA onChange={() => {}} />
// @ts-expect-error
const test11 = <CA onChange={() => {}} classname="" />
// const test11b = CA({onChange:() => {}, classname:""})
// @ts-expect-error
const test9 = <NoProps onChange={() => {}} />
// @ts-expect-error
const test10 = <T $as="div" href="/" />
// @ts-expect-error
const sfd2clk = <T $as="dive" href="/" />

const sfd2csdlk = <T $as="div" />

type TTTTT = React.ComponentPropsWithRef<typeof CA>
type TTTTT1 = TailwindComponentInnerProps<typeof CA>

const sfdkj3 = (
    <T
        $as={Component1}
        className=""
        booleanProp={true}
        // onChange= () => {}}
    />
)
// @ts-expect-error
const sfd4 = <T $as={Component1} className="" css="true" />
