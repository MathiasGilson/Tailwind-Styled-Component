import React, { CSSProperties } from "react"
import domElements from "./domElements"
import { classnames } from "tailwindcss-classnames"

interface REACT_STATICS {
    childContextTypes: true
    contextType: true
    contextTypes: true
    defaultProps: true
    displayName: true
    getDefaultProps: true
    getDerivedStateFromError: true
    getDerivedStateFromProps: true
    mixins: true
    propTypes: true
    type: true
}

interface KNOWN_STATICS {
    name: true
    length: true
    prototype: true
    caller: true
    callee: true
    arguments: true
    arity: true
}

interface MEMO_STATICS {
    $$typeof: true
    compare: true
    defaultProps: true
    displayName: true
    propTypes: true
    type: true
}

interface FORWARD_REF_STATICS {
    $$typeof: true
    render: true
    defaultProps: true
    displayName: true
    propTypes: true
}

declare namespace hoistNonReactStatics {
    type NonReactStatics<
        S extends React.ComponentType<any>,
        C extends {
            [key: string]: true
        } = {}
    > = {
        [key in Exclude<
            keyof S,
            S extends React.MemoExoticComponent<any>
                ? keyof MEMO_STATICS | keyof C
                : S extends React.ForwardRefExoticComponent<any>
                ? keyof FORWARD_REF_STATICS | keyof C
                : keyof REACT_STATICS | keyof KNOWN_STATICS | keyof C
        >]: S[key]
    }
}

const isTwElement = Symbol("isTwElement?")

export type IsTwElement = typeof isTwElement
export type FalseyValue = undefined | null | false

export type FlattenInterpolation<P> = ReadonlyArray<Interpolation<P>>
export type InterpolationValue = string | number | FalseyValue | TailwindComponentInterpolation

export type Interpolation<P> = InterpolationValue | InterpolationFunction<P> | FlattenInterpolation<P>

export type InterpolationFunction<P> = (props: P) => Interpolation<P>
type TailwindComponentInterpolation = PickU<TailwindComponentBase<any, any>, keyof TailwindComponentBase<any, any>>

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

/** Removes call signatures (i.e functions) from Object types */
// type StripCallSignature<T> = { [K in keyof T]: T[K] }

// needed for some reason, without it polymorphic $as props typing has issues - help requested
// type SpreadUnion<U> = U extends any ? { [K in keyof U]: U[K] } : never

/**
 * @author 'DefinitelyTyped/types/styled-components'.
 *
 * Because of React typing quirks, when getting props from a React.ComponentClass,
 * we need to manually add a `children` field.
 * See https://github.com/DefinitelyTyped/DefinitelyTyped/pull/31945
 * and https://github.com/DefinitelyTyped/DefinitelyTyped/pull/32843 */
// type WithChildrenIfReactComponentClass<C extends string | React.ComponentType<any>> =
//     C extends React.ComponentClass<any> ? { children?: React.ReactNode | undefined } : {}

export type PickU<T, K extends keyof T> = T extends any ? { [P in K]: T[P] } : never
export type OmitU<T, K extends keyof T> = T extends any ? PickU<T, Exclude<keyof T, K>> : never
type WithOptionalTheme<P extends { theme?: T | undefined }, T> = OmitU<P, "theme"> & {
    theme?: T | undefined
}

export type TailwindExoticComponent<P> = PickU<
    React.ForwardRefExoticComponent<P>,
    keyof React.ForwardRefExoticComponent<any>
>

/**
 * An interface represent a component styled by tailwind-styled-components
 *
 * @export
 * @interface TailwindComponent
 * @extends {TailwindExoticComponent<E, K>}
 * @template E The base react component or html tag
 * @template K The props added with the template function.
 */

type WithChildrenIfReactComponentClass<C extends string | React.ComponentType<any>> =
    C extends React.ComponentClass<any> ? { children?: React.ReactNode | undefined } : {}

type MakeAttrs<
    C extends string | React.ComponentType<any>,
    O extends object,
    P = React.ComponentPropsWithRef<C extends IntrinsicElementsKeys | React.ComponentType<any> ? C : never>
> =
    // Distribute unions early to avoid quadratic expansion
    P extends any ? P & O : never

export type TailwindComponentProps<
    // The Component from whose props are derived
    C extends string | React.ComponentType<any>,
    // The other props added by the template
    O extends object
    // $As extends string | React.ComponentType<any> = C
> =
    // Distribute O if O is a union type
    O extends object ? WithOptionalTheme<MakeAttrs<C, O> & WithChildrenIfReactComponentClass<C>, null> : never

type TailwindComponentPropsWith$As<
    C extends string | React.ComponentType<any>,
    O extends object,
    $As extends string | React.ComponentType<any> = C
> = TailwindComponentProps<C, O> & { $as?: $As | undefined }

export type TailwindComponent<
    C extends keyof JSX.IntrinsicElements | React.ComponentType<any>,
    O extends object = {}
> = IsTwElement &
    TailwindComponentBase<C, O> &
    WithStyles<C, O> &
    hoistNonReactStatics.NonReactStatics<C extends React.ComponentType<any> ? C : never>
export interface TailwindComponentBase<C extends string | React.ComponentType<any>, O extends object = {}>
    extends TailwindExoticComponent<TailwindComponentProps<C, O>> {
    // add our own fake call signature to implement the polymorphic '$as' prop
    (props: TailwindComponentProps<C, O> & { $as?: never | undefined }): React.ReactElement<
        TailwindComponentProps<C, O>
    >
    <$As extends string | React.ComponentType<any> = C>(
        props: TailwindComponentPropsWith$As<$As, O, $As>
    ): React.ReactElement<TailwindComponentPropsWith$As<$As, O, $As>>
}

export interface WithStyles<C extends keyof JSX.IntrinsicElements | React.ComponentType<any>, O extends object = {}> {
    withStyle: <S extends object = {}>(
        styles: CSSProperties | ((p: TailwindComponentProps<C, O> & S) => CSSProperties)
    ) => TailwindComponent<C, O & S>
}

type AnyTailwindComponent = TailwindComponent<any, any>

// type F<T$ extends {[isTwElement]: boolean}> = T$

// let ddf: F<{[isTwElement]: boolean}>

/**  Avoid unneccessary type inference */
// type NoInfer<T> = [T][T extends any ? 0 : never]

/**
 * A template function that accepts a template literal of tailwind classes and returns a tailwind-styled-component
 *
 * @export
 * @interface TemplateFunction
 * @template E
 * @template K2
 */
export interface TemplateFunction<C extends React.ComponentType<any> | IntrinsicElementsKeys, O extends object = {}> {
    (template: TemplateStringsArray): TailwindComponent<C, O>
    (
        template: TemplateStringsArray | InterpolationFunction<TailwindComponentPropsWithRef<C> & O>,
        ...rest: Array<Interpolation<TailwindComponentPropsWithRef<C> & O>>
    ): TailwindComponent<C, O>
    <K extends object>(
        template: TemplateStringsArray | InterpolationFunction<TailwindComponentPropsWithRef<C> & O & K>,
        ...rest: Array<Interpolation<TailwindComponentPropsWithRef<C> & O & K>>
    ): TailwindComponent<C, O & K>
}

interface ClassNameProp {
    className?: string | undefined
}
interface AsProp {
    $as?: IntrinsicElementsKeys | React.ComponentType<any>
}

// simple type alias
type BaseProps = AsProp & ClassNameProp

/**
 * A utility function that strips out transient props from a [key,value] array of props
 *
 * @param {[string, any]} [key]
 * @return boolean
 */
const removeTransientProps = ([key]: [string, any]): boolean => key.charAt(0) !== "$"

/**
 * A factory functions that returns templateFunctions
 *
 * @export
 * @interface TemplateFunctionFactory
 */
// export interface TemplateFunctionFactory {
//     /** overload needed to minimize `union is too complex` errors
//      * when testing due to the size of the `IntrinsicElementsKeys` union */
//     <E2 extends IntrinsicElementsKeys, K2 extends object = {}>(
//         Element: TailwindComponent<E2, K2>
//     ): TemplateFunction<E2, K2>

//     <E extends TailwindComponent<any, any>>(Element: E): TemplateFunction<
//         InnerTailwindComponent<E>,
//         InnerTailwindComponentOtherProps<E>
//     >

//     <E extends IntrinsicElementsKeys>(Element: E): TemplateFunction<E>

//     <E extends React.ComponentType<any>>(Element: E): TemplateFunction<E>
// }

export type TailwindComponentInnerComponent<C extends React.ComponentType<any>> = C extends TailwindComponent<
    infer I,
    any
>
    ? I
    : C

export type TailwindComponentPropsWithRef<C extends keyof JSX.IntrinsicElements | React.ComponentType<any>> =
    C extends AnyTailwindComponent
        ? React.ComponentPropsWithRef<TailwindComponentInnerComponent<C>>
        : React.ComponentPropsWithRef<C>

export type TailwindComponentInnerOtherProps<C extends AnyTailwindComponent> = C extends TailwindComponent<any, infer O>
    ? O
    : never

export type IntrinsicElementsTemplateFunctionsMap = {
    [RTag in keyof JSX.IntrinsicElements]: TemplateFunction<RTag>
}
export interface TailwindInterface extends IntrinsicElementsTemplateFunctionsMap {
    <C extends TailwindComponent<any, any>>(component: C): TemplateFunction<
        TailwindComponentInnerComponent<C>,
        TailwindComponentInnerOtherProps<C>
    >
    <C extends keyof JSX.IntrinsicElements | React.ComponentType<any>>(component: C): TemplateFunction<C>
}

const templateFunctionFactory: TailwindInterface = (<C extends React.ElementType>(Element: C): any => {
    return <K extends object = {}>(
        template: TemplateStringsArray,
        ...templateElements: ((props: React.ComponentPropsWithRef<C> & K) => string | undefined | null)[]
    ) => {
        const TwComponentConstructor = (
            styleArray: (CSSProperties | ((p: React.ComponentPropsWithRef<C> & K) => CSSProperties))[] = []
        ) => {
            // const renderFunction =
            const TwComponent: TailwindComponent<C, K> = React.forwardRef(
                (
                    baseProps: React.ComponentPropsWithRef<C> & K & BaseProps,
                    ref: React.ForwardedRef<C>
                ): JSX.Element => {
                    const { $as, style = {}, ...props } = baseProps

                    // change Element when `$as` prop detected
                    const FinalElement = $as || Element

                    const withStyles: CSSProperties = styleArray.reduce<CSSProperties>(
                        (acc, intStyle) =>
                            Object.assign(acc, typeof intStyle === "function" ? intStyle(baseProps) : intStyle),
                        {} as CSSProperties
                    )
                    // const style = TwComponent.style(props)

                    // filter out props that starts with "$" props except when styling a tailwind-styled-component
                    const filteredProps: React.ComponentPropsWithRef<C> & K =
                        FinalElement[isTwElement] === true
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
                        />
                    )
                }
            ) as any
            // symbol identifier for detecting tailwind-styled-components
            // TwComponent[isTwElement] = true
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
        [DomElement]: templateFunctionFactory(DomElement as any)
    }),
    {} as IntrinsicElementsTemplateFunctionsMap
)

const tw: TailwindInterface = Object.assign(templateFunctionFactory, intrinsicElementsMap)

export default tw
