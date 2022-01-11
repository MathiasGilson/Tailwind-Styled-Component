import React from "react"
import domElements from "./domElements"
import { classnames } from "tailwindcss-classnames"

const isTwElement = Symbol("isTwElement?")

export type IntrinsicElementsKeys = keyof JSX.IntrinsicElements

export const mergeArrays = (template: TemplateStringsArray, templateElements: (string | undefined | null)[]) => {
    return template.reduce(
        (acc, c, i) => acc.concat(c || [], templateElements[i] || []), //  x || [] to remove falsey values e.g '', null, undefined. as Array.concat() ignores empty arrays i.e []
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

// function parseTailwindClassNames(template: string[], ...templateElements: (string | undefined | null)[]) {
//     return template
//         .reduce((classes, c) => {
//             return `${classes} ${c}` // set tailwind classes names on one line
//         }, templateElements.join(" "))
//         .trim()
//         .replace(/\s{2,}/g, " ") // replace line return by space
// }

type TransientProps = Record<`$${string}`, any>

interface TwC<P extends {}, E = {}> extends React.ForwardRefExoticComponent<P & E> {
(
        props: P & {
            $as?: never | undefined
        } & E
    ): React.ReactElement<any> | null
    <As extends IntrinsicElementsKeys>(
        props: P & { $as: As } & JSX.IntrinsicElements[As] & E
    ): React.ReactElement<any> | null
    <P2 extends {}>(props: P & { $as: (p: P2) => React.ReactElement | null } & P2 & E): React.ReactElement<any> | null

}

export type Ref<E> = E extends
    | IntrinsicElementsKeys
    | React.ForwardRefExoticComponent<any>
    | { new (props: any): React.Component<any> }
    | ((props: any, context?: any) => React.ReactElement | null)
    ? React.ElementRef<E>
    : {}

export type FunctionTemplate<P, E> = <K extends TransientProps = {}>(
    template: TemplateStringsArray,
    ...templateElements: ((props: P & K) => string | undefined | null)[]
) => TwC<React.PropsWithoutRef<P & K>, React.RefAttributes<Ref<E> | undefined>>

interface ClassNameProp {
    className?: string
}
interface AsProp {
    $as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}
const filter$FromProps = ([key]: [string, any]): boolean => key.charAt(0) !== "$"

function functionTemplate<P extends ClassNameProp & AsProp, E = any>(
    Element: React.ComponentType<P>
): FunctionTemplate<P, E> {
    return <K extends {}>(
        template: TemplateStringsArray,
        ...templateElements: ((props: P & K) => string | undefined | null)[]
    ) => {
        const result: any = React.forwardRef<E, P & K>(({ $as, ...props }, ref) => {
            // change Element when `$as` prop detected
            const FinalElement = $as || Element
            // filter out props that starts with "$" props except when styling a tailwind-styled-component
            const filteredProps: Omit<P & K, keyof TransientProps> =
                FinalElement[isTwElement] === true
                    ? (props as Omit<P & K, keyof TransientProps>)
                    : (Object.fromEntries(Object.entries(props).filter(filter$FromProps)) as Omit<
                          P & K,
                          keyof TransientProps
                      >)
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
                            templateElements.map((t) => t({ ...props, $as } as P & K))
                        ),
                        props.className
                    )}
                />
            )
        })
        // symbol identifier for detecting tailwind-styled-components
        result[isTwElement] = true
        // This enables the react tree to show a name in devtools, much better debugging experience
        if (typeof Element !== "string") {
            result.displayName = Element.displayName || Element.name
        } else {
            result.displayName = "tw." + Element
        }
        return result
    }
}

export type IntrinsicElements = {
    [key in keyof JSX.IntrinsicElements]: FunctionTemplate<JSX.IntrinsicElements[key], key>
}

const intrinsicElements: IntrinsicElements = domElements.reduce(
    <K extends keyof JSX.IntrinsicElements>(acc: IntrinsicElements, DomElement: K) => ({
        ...acc,
        [DomElement]: functionTemplate(DomElement as unknown as React.ComponentType<JSX.IntrinsicElements[K]>)
    }),
    {} as IntrinsicElements
)

const tw = Object.assign(functionTemplate, intrinsicElements)

export default tw
