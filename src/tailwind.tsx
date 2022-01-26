import React from "react"
import domElements from "./domElements"
import { classnames } from "tailwindcss-classnames"

const isTwElement = Symbol("isTwElement?")

type IntrinsicElementsKeys = keyof JSX.IntrinsicElements

export const mergeArrays = (template: TemplateStringsArray, templateElements: (string | undefined | null)[]) => {
    return template.reduce(
        (acc, c, i) => acc.concat(c || [], templateElements[i] || []), //  x || [] to remove false values e.g '', null, undefined. as Array.concat() ignores empty arrays i.e []
        [] as (string | undefined | null)[]
    )
}

export const cleanTemplate = (template: (string | undefined | null)[], inheritedClasses: string = "") => {
    const newClasses: string[] = template
        .join(" ")
        .trim()
        .replace(/\n/g, " ") // replace newline with space
        .replace(/\s{2,}/g, " ") // replace line return by space
        .split(" ")
        .filter((c) => c !== ",") // remove comma introduced by template to string

    const inheritedClassesArray: string[] = inheritedClasses ? inheritedClasses.split(" ") : []

    return classnames(
        ...(newClasses as any)
            .concat(inheritedClassesArray) // add new classes
            .filter((c: string) => c !== " ") // remove empty classes
            .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i) // remove duplicate
    ) as string // to remove "TAILWIND_STRING" type
}

// Removes call signatures (i.e functions) from Object types
type StripCallSignature<T> = { [K in keyof T]: T[K] }

// needed for some reason, without it polymorphic $as props typing has issues - help requested
type SpreadUnion<U> = U extends any ? { [K in keyof U]: U[K] } : never

type TailwindComponentProps<E extends React.ComponentType<any> | IntrinsicElementsKeys, K extends object> = SpreadUnion<
    React.ComponentPropsWithoutRef<E> & React.RefAttributes<React.ComponentRef<E> | undefined>
> &
    K

type TailwindComponentPropsWith$As<
    E extends React.ComponentType<any> | IntrinsicElementsKeys,
    K extends object,
    As extends IntrinsicElementsKeys | React.ComponentType<any> = E
> = SpreadUnion<React.ComponentPropsWithoutRef<E> & InnerTailwindComponentAllProps<As>> & K & { $as?: As }

type TailwindExoticComponent<
    E extends React.ComponentType<any> | IntrinsicElementsKeys,
    K extends object
    // call signatures in React.ForwardRefExoticComponent were interfering
> = StripCallSignature<React.ForwardRefExoticComponent<TailwindComponentProps<E, K>>>

interface TailwindComponent<E extends React.ComponentType<any> | IntrinsicElementsKeys, K extends object>
    extends TailwindExoticComponent<E, K> {
    (props: TailwindComponentProps<E, K> & { as?: never | undefined }): React.ReactElement<
        TailwindComponentProps<E, K>
    > | null

    <As extends IntrinsicElementsKeys | React.ComponentType<any> = E>(
        props: TailwindComponentPropsWith$As<E, K, As>
    ): React.ReactElement<TailwindComponentPropsWith$As<E, K, As>> | null

    // for easier type narrowing of TailwindComponent
    [isTwElement]: boolean
}

// Avoid unneccessary type inference
type NoInfer<T> = [T][T extends any ? 0 : never]

export type TemplateFunction<E extends React.ComponentType<any> | IntrinsicElementsKeys, K2 extends object = {}> = <
    K extends object = {}
>(
    template: TemplateStringsArray,
    ...templateElements: ((props: NoInfer<React.ComponentPropsWithRef<E> & K2> & K) => string | undefined | null)[]
) => TailwindComponent<E, K & K2>

interface ClassNameProp {
    className?: string | undefined
}
interface AsProp {
    $as?: IntrinsicElementsKeys | React.ComponentType<any>
}

// simple type alias
type BaseProps = AsProp & ClassNameProp

const removeTransientProps = ([key]: [string, any]): boolean => key.charAt(0) !== "$"

// Extracts inner tailwind component, e.g it extracts `"div"` from `TailwindComponent<"div", {$test1: string}>`
type InnerTailwindComponent<E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>> =
    E extends TailwindComponent<infer E2, any> ? E2 : E

// Extracts inner tailwind component other props, e.g it extracts `{$test1: string}` from `TailwindComponent<"div", {$test1: string}>`
type InnerTailwindComponentOtherProps<
    E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>
> = E extends TailwindComponent<any, infer K2> ? K2 : {}

// Extracts all inner tailwind component props, e.g it returns `React.ComponentProps<"div"> & {$test1: string}` from `TailwindComponent<"div", {$test1: string}>`
type InnerTailwindComponentAllProps<
    E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>
> = E extends TailwindComponent<infer E2, infer K2>
    ? React.ComponentPropsWithoutRef<E2> & K2 & React.RefAttributes<React.ComponentRef<E2> | undefined> // | undefined to fix types errors with useRef
    : React.ComponentPropsWithoutRef<E> & React.RefAttributes<React.ComponentRef<E> | undefined> // | undefined to fix types errors with useRef

interface TemplateFunctionFactory {
    /* overload needed to minimize `union is too complex` errors
when testing due to the size of the `IntrinsicElementsKeys` union */
    <E extends TailwindComponent<E2, K2>, E2 extends IntrinsicElementsKeys, K2 extends object = {}>(
        Element: E
    ): TemplateFunction<E2, K2>

    <E extends TailwindComponent<any, any>>(Element: E): TemplateFunction<
        InnerTailwindComponent<E>,
        InnerTailwindComponentOtherProps<E>
    >

    <E extends IntrinsicElementsKeys>(Element: E): TemplateFunction<E>

    <E extends React.ComponentType<any>>(Element: E): TemplateFunction<E>
}

const templateFunction: TemplateFunctionFactory = <
    E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>
>(
    Element: E
): TemplateFunction<InnerTailwindComponent<E>, InnerTailwindComponentOtherProps<E>> => {
    return <K extends object = {}>(
        template: TemplateStringsArray,
        ...templateElements: ((props: InnerTailwindComponentAllProps<E> & K) => string | undefined | null)[]
    ) => {
        const TwComponent: any = React.forwardRef<
            InnerTailwindComponent<E>,
            InnerTailwindComponentAllProps<E> & K & BaseProps
        >(({ $as, ...props }, ref) => {
            // change Element when `$as` prop detected
            const FinalElement = $as || Element

            // filter out props that starts with "$" props except when styling a tailwind-styled-component
            const filteredProps: InnerTailwindComponentAllProps<E> & K =
                FinalElement[isTwElement] === true
                    ? (props as InnerTailwindComponentAllProps<E> & K)
                    : (Object.fromEntries(
                          Object.entries(props).filter(removeTransientProps)
                      ) as InnerTailwindComponentAllProps<E> & K)
            return (
                <FinalElement
                    // forward props
                    {...filteredProps}
                    // forward ref
                    ref={ref}
                    // set class names
                    className={cleanTemplate(
                        mergeArrays(
                            template,
                            templateElements.map((t) => t({ ...props, $as } as InnerTailwindComponentAllProps<E> & K))
                        ),
                        props.className
                    )}
                />
            )
        })
        // symbol identifier for detecting tailwind-styled-components
        TwComponent[isTwElement] = true
        // This enables the react tree to show a name in devtools, much better debugging experience Note: Far from perfect, better implementations welcome
        if (typeof Element !== "string") {
            TwComponent.displayName = (Element as any).displayName || (Element as any).name || "tw.Component"
        } else {
            TwComponent.displayName = "tw." + Element
        }
        return TwComponent
    }
}

export type IntrinsicElements = {
    [key in IntrinsicElementsKeys]: TemplateFunction<key>
}

const intrinsicElements: IntrinsicElements = domElements.reduce(
    <K extends IntrinsicElementsKeys>(acc: IntrinsicElements, DomElement: K) => ({
        ...acc,
        [DomElement]: templateFunction(DomElement)
    }),
    {} as IntrinsicElements
)

const tw = Object.assign(templateFunction, intrinsicElements)

export default tw
