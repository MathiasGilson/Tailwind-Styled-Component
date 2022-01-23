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

// type TransientProps = Record<`$${string}`, any>
// // Prevent unnecessary type inference
// type NoInfer<T> = [T][T extends any ? 0 : never]
// Removes call signatures i.e functions from Object types
type StripCallSignature<T> = { [K in keyof T]: T[K] }

// call signatures in React.ForwardRefExoticComponent were interfering

type SpreadUnion<U> = U extends any ? { [K in keyof U]: U[K] } : never

type TailwindComponentProps<E extends React.ComponentType<any> | IntrinsicElementsKeys, K extends object> = SpreadUnion<
    React.RefAttributes<React.ComponentRef<E> | undefined>
> &
    K
type TailwindComponentPropsWith$As<
    E extends React.ComponentType<any> | IntrinsicElementsKeys,
    K extends object,
    As extends IntrinsicElementsKeys | React.ComponentType<any> = E
> = SpreadUnion<React.ComponentPropsWithoutRef<E> & InnerTailwindComponentProps<As>> & K & { $as?: As }

interface TailwindComponent<E extends React.ComponentType<any> | IntrinsicElementsKeys, K extends object>
    extends StripCallSignature<React.ForwardRefExoticComponent<TailwindComponentProps<E, K>>> {
    (props: TailwindComponentProps<E, K>): React.ReactElement<TailwindComponentProps<E, K>> | null

    <As extends IntrinsicElementsKeys | React.ComponentType<any> = E>(
        props: TailwindComponentPropsWith$As<E, K, As>
    ): React.ReactElement<TailwindComponentPropsWith$As<E, K, As>> | null

    // for easier type inferrence of TailwindComponent
    [isTwElement]: boolean
}

export type TemplateFunction<E extends React.ComponentType<any> | IntrinsicElementsKeys, K2 extends object = {}> = <
    K extends object = {}
>(
    template: TemplateStringsArray,
    ...templateElements: ((props: React.ComponentPropsWithRef<E> & K & K2) => string | undefined | null)[]
) => TailwindComponent<E, K & K2>

interface ClassNameProp {
    className?: string | undefined
}
interface AsProp {
    $as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}
const filter$FromProps = ([key]: [string, any]): boolean => key.charAt(0) !== "$"

type InnerTailwindComponent<E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>> =
    E extends TailwindComponent<infer E2, any> ? E2 : E

type InnerTailwindComponentOtherProps<
    E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>
> = E extends TailwindComponent<any, infer K2> ? K2 : {}

type InnerTailwindComponentProps<
    E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>
> = E extends TailwindComponent<infer E2, infer K2>
    ? React.ComponentPropsWithoutRef<E2> & K2 & React.RefAttributes<React.ComponentRef<E2> | undefined>
    : React.ComponentPropsWithoutRef<E> & React.RefAttributes<React.ComponentRef<E> | undefined>

function templateFunction<E extends TailwindComponent<any, any>>(
    Element: E
): TemplateFunction<InnerTailwindComponent<E>, InnerTailwindComponentOtherProps<E>>

function templateFunction<E extends React.ComponentType<any> | IntrinsicElementsKeys>(Element: E): TemplateFunction<E>

function templateFunction<E extends React.ComponentType<any> | IntrinsicElementsKeys | TailwindComponent<any, any>>(
    Element: E
): TemplateFunction<InnerTailwindComponent<E>, InnerTailwindComponentOtherProps<E>> {
    return <K extends object = {}>(
        template: TemplateStringsArray,
        ...templateElements: ((
            props: React.ComponentPropsWithRef<InnerTailwindComponent<E>> & K & InnerTailwindComponentOtherProps<E>
        ) => string | undefined | null)[]
    ) => {
        const result: any = React.forwardRef<
            InnerTailwindComponent<E>,
            TailwindComponentProps<InnerTailwindComponent<E>, K & InnerTailwindComponentOtherProps<E>> &
                AsProp &
                ClassNameProp
        >(({ $as, ...props }, ref) => {
            // change Element when `$as` prop detected
            const FinalElement = $as || Element

            // filter out props that starts with "$" props except when styling a tailwind-styled-component
            const filteredProps: React.ComponentProps<InnerTailwindComponent<E>> &
                K &
                InnerTailwindComponentOtherProps<E> =
                FinalElement[isTwElement] === true
                    ? (props as React.ComponentProps<InnerTailwindComponent<E>> &
                          K &
                          InnerTailwindComponentOtherProps<E>)
                    : (Object.fromEntries(Object.entries(props).filter(filter$FromProps)) as React.ComponentProps<
                          InnerTailwindComponent<E>
                      > &
                          K &
                          InnerTailwindComponentOtherProps<E>)
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
                            templateElements.map((t) =>
                                t({ ...props, $as } as React.ComponentPropsWithRef<InnerTailwindComponent<E>> &
                                    K &
                                    InnerTailwindComponentOtherProps<E>)
                            )
                        ),
                        props.className
                    )}
                />
            )
        })
        // symbol identifier for detecting tailwind-styled-components
        result[isTwElement] = true
        // This enables the react tree to show a name in devtools, much better debugging experience Note: Far from perfect, better implementations welcome
        if (typeof Element !== "string") {
            result.displayName = Element.displayName || Element.name || "tw.Component"
        } else {
            result.displayName = "tw." + Element
        }
        return result
    }
}

// type R1 = React.ForwardRefExoticComponent<
//     React.PropsWithoutRef<
//         OmitU<React.ComponentPropsWithRef<InnerTailwindComponent<"div">>, never> & AsProp & ClassNameProp
//     > &
//         React.RefAttributes<"div">
// >

// type R<F> = F extends React.ForwardRefExoticComponent<infer P1>
//     ? P1 extends React.PropsWithoutRef<infer P>
//         ? React.ForwardRefExoticComponent<P>
//         : never
//     : never
// type RR<F> = F extends React.ForwardRefExoticComponent<infer P1>
//     ? P1 extends React.PropsWithoutRef<any> & React.RefAttributes<infer Ref>
//         ? React.ForwardRefExoticComponent<Ref>
//         : never
//     : never

// type R2 = R<R1>
// type R3 = RR<R1>

export type IntrinsicElements = {
    [key in keyof JSX.IntrinsicElements]: TemplateFunction<key> // React.ElementRef turns a tag string to an Element e.g `"div"` to `HTMLDivElement`
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
