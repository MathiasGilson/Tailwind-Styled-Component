import React from "react"
import domElements from "../domElements"

type IntrinsicElementsKeys = keyof JSX.IntrinsicElements

type TailwindComponentProps<
    E extends React.ComponentType<any> | IntrinsicElementsKeys,
    K extends object
> = React.ComponentPropsWithRef<E> & K

type TailwindComponentPropsWith$As<
    E extends React.ComponentType<any> | IntrinsicElementsKeys,
    K extends object,
    As extends IntrinsicElementsKeys | React.ComponentType<any>
> = React.ComponentPropsWithoutRef<E> &
    InnerTailwindComponentProps<As> &
    K &
    InnerTailwindComponentOtherProps<As> & { $as?: As | undefined }

type InnerTailwindComponentOtherProps<E extends React.ComponentType<any> | IntrinsicElementsKeys> =
    E extends TailwindComponent<any, infer K2> ? K2 : {}

type InnerTailwindComponentProps<E extends React.ComponentType<any> | IntrinsicElementsKeys> =
    E extends TailwindComponent<infer E2, any> ? React.ComponentPropsWithRef<E2> : React.ComponentPropsWithRef<E>

interface TailwindComponent<E extends React.ComponentType<any> | IntrinsicElementsKeys, K extends object = {}> {
    (props: TailwindComponentProps<E, K> & { as?: never | undefined }): React.ReactElement<
        TailwindComponentProps<E, K>
    > | null

    <As extends IntrinsicElementsKeys | React.ComponentType<any> = E>(
        props: TailwindComponentPropsWith$As<E, K, As>
    ): React.ReactElement<TailwindComponentPropsWith$As<E, K, As>> | null

    // // for easier type narrowing of TailwindComponent
    isTwElement: boolean
}

export type TemplateFunction<E extends React.ComponentType<any> | IntrinsicElementsKeys, K2 extends object = {}> = <
    K extends object = {}
>(
    template: TemplateStringsArray,
    ...templateElements: ((props: React.ComponentPropsWithRef<E> & K & K2) => string | undefined | null)[]
) => TailwindComponent<E, K & K2>

type InnerTailwindComponent<E extends React.ComponentType<any>> = E extends TailwindComponent<infer E2, any> ? E2 : E

function templateFunction<E extends TailwindComponent<any, any>>(
    Element: E
): TemplateFunction<InnerTailwindComponent<E>>
function templateFunction<E extends React.ComponentType<any> | IntrinsicElementsKeys>(Element: E): TemplateFunction<E>

function templateFunction(E: any): any {
    return E
}

export type IntrinsicElements = {
    [key in keyof JSX.IntrinsicElements]: TemplateFunction<key>
}

const intrinsicElements: IntrinsicElements = domElements.reduce(
    <K extends keyof JSX.IntrinsicElements>(acc: IntrinsicElements, DomElement: K) => ({
        ...acc,
        [DomElement]: templateFunction(DomElement)
    }),
    {} as IntrinsicElements
)

const tw = Object.assign(templateFunction, intrinsicElements)

const D = tw.div<{ $test1: string }>``
const D2 = tw(D)``

const F = tw("div")<{ $test1: string }>``
const F2 = tw(F)``
