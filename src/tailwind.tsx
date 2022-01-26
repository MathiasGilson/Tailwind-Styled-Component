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

// Removes call signatures i.e functions from Object types
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
> = StripCallSignature<React.ForwardRefExoticComponent<TailwindComponentProps<E, K>>>

// call signatures in React.ForwardRefExoticComponent were interfering
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

type NoInfer<T> = [T][T extends any ? 0 : never]

export type TemplateFunction<
    E extends React.ComponentType<any> | keyof JSX.IntrinsicElements,
    K2 extends object = {}
> = <K extends object = {}>(
    template: TemplateStringsArray,
    ...templateElements: ((props: NoInfer<React.ComponentPropsWithRef<E> & K2> & K) => string | undefined | null)[]
) => TailwindComponent<E, K & K2>

interface ClassNameProp {
    className?: string | undefined
}
interface AsProp {
    $as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}
type BaseProps = AsProp & ClassNameProp

const removeTransientProps = ([key]: [string, any]): boolean => key.charAt(0) !== "$"

type InnerTailwindComponent<E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>> =
    E extends TailwindComponent<infer E2, any> ? E2 : E

type InnerTailwindComponentOtherProps<
    E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>
> = E extends TailwindComponent<any, infer K2> ? K2 : {}

type InnerTailwindComponentAllProps<
    E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>
> = E extends TailwindComponent<infer E2, infer K2>
    ? React.ComponentPropsWithoutRef<E2> & K2 & React.RefAttributes<React.ComponentRef<E2> | undefined> // | undefined to fix types errors with useRef
    : React.ComponentPropsWithoutRef<E> & React.RefAttributes<React.ComponentRef<E> | undefined> // | undefined to fix types errors with useRef

function templateFunction<E extends TailwindComponent<any, any>>(
    Element: E
): TemplateFunction<InnerTailwindComponent<E>, InnerTailwindComponentOtherProps<E>>

function templateFunction<E extends React.ComponentType<any> | IntrinsicElementsKeys>(Element: E): TemplateFunction<E>

function templateFunction<E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>>(
    Element: E
): TemplateFunction<InnerTailwindComponent<E>, InnerTailwindComponentOtherProps<E>> {
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

export default tw
