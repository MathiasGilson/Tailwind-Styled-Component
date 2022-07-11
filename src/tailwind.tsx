import React, { CSSProperties } from "react"
import domElements from "./domElements"
import { twMerge } from "tailwind-merge"

const isTwElement = Symbol("isTwElement?")

export type IsTwElement = { [isTwElement]: true }
export type FalseyValue = undefined | null | false

export type FlattenInterpolation<P> = ReadonlyArray<Interpolation<P>>
export type InterpolationValue = string | number | FalseyValue | TailwindComponentInterpolation

export type Interpolation<P> = InterpolationValue | InterpolationFunction<P> | FlattenInterpolation<P>

export type InterpolationFunction<P> = (props: P) => Interpolation<P>
type TailwindComponentInterpolation = PickU<TailwindComponentBase<any, any>, keyof TailwindComponentBase<any, any>>

type IntrinsicElementsKeys = keyof JSX.IntrinsicElements

type IsAny<T, True, False = never> = True | False extends (T extends never ? True : False) ? True : False

export const mergeArrays = (template: TemplateStringsArray, templateElements: (string | undefined | null)[]) => {
    return template.reduce(
        (acc, c, i) => acc.concat(c || [], templateElements[i] || []), //  x || [] to remove false values e.g '', null, undefined. as Array.concat() ignores empty arrays i.e []
        [] as string[]
    )
}

export const cleanTemplate = (template: Array<Interpolation<any>>, inheritedClasses: string = "") => {
    const newClasses: string[] = template
        .join(" ")
        .trim()
        .replace(/\n/g, " ") // replace newline with space
        .replace(/\s{2,}/g, " ") // replace line return by space
        .split(" ")
        .filter((c) => c !== ",") // remove comma introduced by template to string

    const inheritedClassesArray: string[] = inheritedClasses ? inheritedClasses.split(" ") : []

    return twMerge(
        ...newClasses
            .concat(inheritedClassesArray) // add new classes to inherited classes
            .filter((c: string) => c !== " ") // remove empty classes
    )
}

export type PickU<T, K extends keyof T> = T extends any ? { [P in K]: T[P] } : never
// export type OmitU<T, K extends keyof T> = T extends any ? PickU<T, Exclude<keyof T, K>> : never
export type RemoveIndex<T> = {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K]
}

/**
 * ForwardRef typings
 */
export type TailwindExoticComponent<P> = PickU<
    React.ForwardRefExoticComponent<P>,
    keyof React.ForwardRefExoticComponent<any>
>

type MergeProps<O extends object, P extends {} = {}> =
    // Distribute unions early to avoid quadratic expansion
    P extends any ? IsAny<P, RemoveIndex<P> & O, P & O> : never
// RemoveIndex<P> is used to make React.ComponentPropsWithRef typesafe on Tailwind components, delete if causing issues

type TailwindPropHelper<
    P,
    O extends object = {}
    // PickU is needed here to make $as typing work
> = PickU<MergeProps<O, P>, keyof MergeProps<O, P>>

type TailwindComponentPropsWith$As<
    P extends object,
    O extends object,
    $As extends string | React.ComponentType<any> = React.ComponentType<P>,
    P2 = $As extends AnyTailwindComponent
        ? TailwindComponentAllInnerProps<$As>
        : $As extends IntrinsicElementsKeys | React.ComponentType<any>
        ? React.ComponentPropsWithRef<$As>
        : never
> = P & O & TailwindPropHelper<P2> & { $as?: $As }

/**
 * An interface represent a component styled by tailwind-styled-components
 *
 * @export
 * @interface TailwindComponent
 * @template P The base react props
 * @template O The props added with the template function.
 */
export type TailwindComponent<P extends object, O extends object = {}> = IsTwElement &
    TailwindComponentBase<P, O> &
    WithStyle<P, O>

/**
 * An interface represent a component styled by tailwind-styled-components
 *
 * @export
 * @interface TailwindComponentBase
 * @extends {TailwindExoticComponent<TailwindPropHelper<P, O>>}
 * @template P The base react props
 * @template O The props added with the template function.
 */
export interface TailwindComponentBase<P extends object, O extends object = {}>
    extends TailwindExoticComponent<TailwindPropHelper<P, O>> {
    // add our own fake call signature to implement the polymorphic '$as' prop
    (props: TailwindPropHelper<P, O> & { $as?: never | undefined }): React.ReactElement<TailwindPropHelper<P, O>>

    <$As extends string | React.ComponentType<any> = React.ComponentType<P>>(
        props: TailwindComponentPropsWith$As<P, O, $As>
    ): React.ReactElement<TailwindComponentPropsWith$As<P, O, $As>>
}
/**
 *  An interface represent withStyle functionality
 *
 * @export
 * @interface WithStyle
 * @template P
 * @template O
 */
export interface WithStyle<P extends object, O extends object = {}> {
    withStyle: <S extends object = {}>(
        styles: CSSProperties | ((p: P & O & S) => CSSProperties)
    ) => TailwindComponent<P, O & S>
}
/**
 * Generice TailwindComponent
 */
type AnyTailwindComponent = TailwindComponent<any, any>

/**
 * A template function that accepts a template literal of tailwind classes and returns a tailwind-styled-component
 *
 * @export
 * @interface TemplateFunction
 * @template E
 */
export interface TemplateFunction<P extends object, O extends object = {}> {
    (template: TemplateStringsArray): TailwindComponent<P, O>
    (
        template: TemplateStringsArray | InterpolationFunction<P & O>,
        ...rest: Array<Interpolation<P & O>>
    ): TailwindComponent<P, O>
    <K extends object>(
        template: TemplateStringsArray | InterpolationFunction<P & O & K>,
        ...rest: Array<Interpolation<P & O & K>>
    ): TailwindComponent<P, O & K>
}

/**
 * A utility function that strips out transient props from a [key,value] array of props
 *
 * @param {[string, any]} [key]
 * @return boolean
 */
const removeTransientProps = ([key]: [string, any]): boolean => key.charAt(0) !== "$"

export type TailwindComponentInnerProps<C extends AnyTailwindComponent> = C extends TailwindComponent<infer P, any>
    ? P
    : never

export type TailwindComponentInnerOtherProps<C extends AnyTailwindComponent> = C extends TailwindComponent<any, infer O>
    ? O
    : never

export type TailwindComponentAllInnerProps<C extends AnyTailwindComponent> = TailwindComponentInnerProps<C> &
    TailwindComponentInnerOtherProps<C>

export type IntrinsicElementsTemplateFunctionsMap = {
    [RTag in keyof JSX.IntrinsicElements]: TemplateFunction<JSX.IntrinsicElements[RTag]>
}

/**
 *
 *
 * @export
 * @interface TailwindInterface
 * @extends {IntrinsicElementsTemplateFunctionsMap}
 */
export interface TailwindInterface extends IntrinsicElementsTemplateFunctionsMap {
    <C extends TailwindComponent<any, any>>(component: C): TemplateFunction<
        TailwindComponentInnerProps<C>,
        TailwindComponentInnerOtherProps<C>
    >
    <C extends React.ComponentType<any>>(component: C): TemplateFunction<
        // Prevent functional components without props infering props as `unknown`
        C extends (P?: never) => any ? {} : React.ComponentPropsWithoutRef<C>
    >

    <C extends keyof JSX.IntrinsicElements>(component: C): TemplateFunction<JSX.IntrinsicElements[C]>
}

const isTw = (c: any): c is AnyTailwindComponent => c[isTwElement] === true

// type FDF = React.ElementType<JSX.IntrinsicElements['div']>

const templateFunctionFactory: TailwindInterface = (<C extends React.ElementType>(Element: C): any => {
    return <K extends object = {}>(
        template: TemplateStringsArray,
        ...templateElements: ((props: React.ComponentPropsWithRef<C> & K) => string | undefined | null)[]
    ) => {
        const TwComponentConstructor = (
            styleArray: (CSSProperties | ((p: React.ComponentPropsWithRef<C> & K) => CSSProperties))[] = []
        ) => {
            // const renderFunction =
            const TwComponent: TailwindComponent<any, K> = React.forwardRef(
                (
                    baseProps: React.ComponentPropsWithRef<C> & K & { $as?: React.ElementType },
                    ref: React.ForwardedRef<C>
                ): JSX.Element => {
                    const { $as = Element, style = {}, ...props } = baseProps

                    // set FinalElement based on if Element is a TailwindComponent, $as defaults to Element if undefined
                    const FinalElement = isTw(Element) ? Element : $as

                    const withStyles: CSSProperties = styleArray
                        ? styleArray.reduce<CSSProperties>(
                              (acc, intStyle) =>
                                  Object.assign(acc, typeof intStyle === "function" ? intStyle(baseProps) : intStyle),
                              {} as CSSProperties
                          )
                        : {}
                    // const style = TwComponent.style(props)

                    // filter out props that starts with "$" props except when styling a tailwind-styled-component
                    const filteredProps: React.ComponentPropsWithRef<C> & K = isTw(FinalElement)
                        ? (props as React.ComponentPropsWithRef<C> & K)
                        : (Object.fromEntries(
                              Object.entries(props).filter(removeTransientProps)
                          ) as React.ComponentPropsWithRef<C> & K)
                    return (
                        <FinalElement
                            // forward props
                            {...filteredProps}
                            style={{ ...withStyles, ...style }}
                            // forward ref
                            ref={ref}
                            // set class names
                            className={cleanTemplate(
                                mergeArrays(
                                    template,
                                    templateElements.map((t) =>
                                        t({ ...props, $as } as React.ComponentPropsWithRef<C> & K)
                                    )
                                ),
                                props.className
                            )}
                            {...(isTw(Element) ? { $as } : {})}
                        />
                    )
                }
            ) as any
            // symbol identifier for detecting tailwind-styled-components
            TwComponent[isTwElement] = true
            // This enables the react tree to show a name in devtools, much better debugging experience Note: Far from perfect, better implementations welcome
            if (typeof Element !== "string") {
                TwComponent.displayName = (Element as any).displayName || (Element as any).name || "tw.Component"
            } else {
                TwComponent.displayName = "tw." + Element
            }
            TwComponent.withStyle = <S extends object = {}>(
                styles: ((p: React.ComponentPropsWithRef<C> & S) => CSSProperties) | CSSProperties
            ) => TwComponentConstructor(styleArray.concat(styles)) as any

            return TwComponent
        }
        return TwComponentConstructor()
    }
}) as any

const intrinsicElementsMap: IntrinsicElementsTemplateFunctionsMap = domElements.reduce(
    <K extends IntrinsicElementsKeys>(acc: IntrinsicElementsTemplateFunctionsMap, DomElement: K) => ({
        ...acc,
        [DomElement]: templateFunctionFactory(DomElement)
    }),
    {} as IntrinsicElementsTemplateFunctionsMap
)

const tw: TailwindInterface = Object.assign(templateFunctionFactory, intrinsicElementsMap)

export default tw
