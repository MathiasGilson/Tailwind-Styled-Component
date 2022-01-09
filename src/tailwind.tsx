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

// type Check<As> = As extends IntrinsicElementsKeys ? JSX.IntrinsicElements[As] : never

type NewType<As extends string | React.ComponentType<any>> = React.ComponentProps<
    As extends IntrinsicElementsKeys | React.ComponentType<any> ? As : never
>

// type ForAs<As extends string> = 0 & 1 extends any ? React.ComponentProps<NewType<As>> : never

type Const<A> = { [x in keyof A]: A[x] }

interface TwC<P extends {}> extends Const<React.ForwardRefExoticComponent<P>> {
    // <As extends React.ComponentType<any>>(
    //     props:{ as: As }& React.ComponentProps<C> ): React.ReactElement<React.ComponentProps<C>>
    (
        props: P & {
            as?: never | undefined
        }
    ): React.ReactElement<any> | null
    <As extends IntrinsicElementsKeys>(
        props: P & { as: As } & JSX.IntrinsicElements[As]
    ): React.ReactElement<any> | null
    <P2 extends {}>(props: P & { as: (p: P2) => React.ReactElement | null } & P2): React.ReactElement<any> | null

    // <As extends React.ComponentType<P2>,P2 extends {}>(
    //     props: P & { as: As } & P2
    // ): React.ReactElement<any>

    // <As extends string>(props: P & { as: As }): React.ReactElement<P>

    // (props: P ): React.ReactElement<React.ComponentProps<C>>
}

const G = ({ className }: { className: string; css?: boolean }) => <div />
const G2 = () => <div />

const T: TwC<{}> = ((x: any) => x) as any

const sfd = T({ as: "a", href: "" })
const sfd2 = T({ as: "div", onChange: () => {} })
const sfd2b = T({ as: "div", href: "/" })
const sfd2c = T({ as: "dive", href: "/" })
const sfd3 = T({
    as: G,
    className: "",
    css: true
    // onChange: () => {}
})
const sfd4 = T({
    as: G,
    className: "",
    css: "true"
    // onChange: () => {}
})

type sdf = JSX.IntrinsicAttributes

const T2 = <T as="a" href="http://" />
const T4 = <T as="div" href="http://" />

const T3 = <T as={G} href="http://" />

// // const

// const R = <T className="true" />

export type FunctionTemplate<P, E> = <K extends TransientProps = {}>(
    template: TemplateStringsArray,
    ...templateElements: ((props: P & AsProp & K) => string | undefined | null)[]
) => TwC<P & K & React.ElementRef<E extends IntrinsicElementsKeys | React.ComponentType<any> ? E : any>>

type SF = React.RefAttributes<"div">
interface ClassNameProp {
    className?: string
}
// interface AsProp$ {
//     as: keyof JSX.IntrinsicElements | React.ComponentType<any>
// }
interface AsProp {
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>
}
const filter$FromProps = ([key]: [string, any]): boolean => key.charAt(0) !== "$" && key !== "as"

function functionTemplate<P extends ClassNameProp, E = any>(Element: React.ComponentType<P>): FunctionTemplate<P, E> {
    return <K extends {}>(
        template: TemplateStringsArray,
        ...templateElements: ((props: P & K) => string | undefined | null)[]
    ) => {
        const result: any = React.forwardRef<E, P & K>((props, ref) => {
            // change Element when `as` prop detected
            const FinalElement = (props as any).as || Element
            // filter out props that starts with "$" and `as` props except when styling a tailwind-styled-component
            const filteredProps: Omit<P, "as"> = FinalElement[isTwElement]
                ? props
                : (Object.fromEntries(Object.entries(props).filter(filter$FromProps)) as Omit<P, "as">)
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
                            templateElements.map((t) => t(props as P & K))
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
    [key in keyof JSX.IntrinsicElements]: FunctionTemplate<JSX.IntrinsicElements[key], any>
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
