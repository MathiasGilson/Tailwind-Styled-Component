import React from "react"
import domElements from "./domElements"
import { classnames } from "tailwindcss-classnames"

const cleanTemplate = (template: TemplateStringsArray, inheritedClasses: string = "") => {
    const newClasses: string[] = template
        .toString()
        .trim()
        .replace(/\s{2,}/g, " ")
        .split(" ")
        .filter((c) => c !== ",") // remove comma introduced by template to string

    const inheritedClassesArray: any = inheritedClasses ? inheritedClasses.split(" ") : []

    return classnames(
        ...inheritedClassesArray
            .concat(newClasses) // add new classes
            .filter((c: string) => c !== " ") // remove empty classes
            .filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i) // remove duplicate
    ).split(" ")
}

function parseTailwindClassNames(template: string[], ...templateElements: (string | undefined | null)[]) {
    return template
        .reduce((sum, n) => {
            return `${sum} ${n}`
        }, templateElements.join(' '))
        .trim()
        .replace(/\s{2,}/g, " ") // replace line return by space
}

type TransientProps = Record<`$${string}`, any>

export type FunctionTemplate<P, E> = <K extends TransientProps = {}>(
    template: TemplateStringsArray,
    ...templateElements: ((props: P & K) => string | undefined | null)[]
) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & K> & React.RefAttributes<E>>

interface FunctionTemplateProp {
    as?: keyof JSX.IntrinsicElements,
    className?: string
}

function functionTemplate<P extends FunctionTemplateProp, E = any>(Element: React.ComponentType<P>): FunctionTemplate<P, E> {
    return <K extends {}>(
        template: TemplateStringsArray,
        ...templateElements: ((props: P & K) => string | undefined | null)[]
    ) =>
        React.forwardRef<E, P & K>(({ as = Element, children, ...rest }, ref) => {
            const props = {
                ...Object.fromEntries(Object.entries(rest).filter(([key]) => key.charAt(0) !== "$")) as P,
                ref,
                className: parseTailwindClassNames(
                    cleanTemplate(template, rest.className),
                    ...templateElements.map((t) => t(rest as P & K))
                )
            }
            return React.createElement(as, props, children)
        })
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
