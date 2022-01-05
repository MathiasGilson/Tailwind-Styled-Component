import React from "react"
import domElements from "./domElements"
import { classnames } from "tailwindcss-classnames"

const mergeTemplateStringArrays = (template: TemplateStringsArray, templateElements: (string | undefined | null)[]) => {
    return template.reduce(
        (acc, c, i) => acc.concat(c || [], templateElements[i] || []), //  x || [] to remove falsey values
        [] as (string | undefined | null)[]
    )
}

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
        .reduce((classes, c) => {
            return `${classes} ${c}` // set tailwind classes names on one line
        }, templateElements.join(" "))
        .trim()
        .replace(/\s{2,}/g, " ") // replace line return by space
}

type TransientProps = Record<`$${string}`, any>

export type FunctionTemplate<P, E> = <K extends TransientProps = {}>(
    template: TemplateStringsArray,
    ...templateElements: ((props: P & K) => string | undefined | null)[]
) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & K> & React.RefAttributes<E>>

interface ClassNameProp {
    className?: string
}

function functionTemplate<P extends ClassNameProp, E = any>(Element: React.ComponentType<P>): FunctionTemplate<P, E> {
    return <K extends {}>(
        template: TemplateStringsArray,
        ...templateElements: ((props: P & K) => string | undefined | null)[]
    ) => {
        return React.forwardRef<E, P & K>((props, ref) => (
            <Element
                // forward props
                {...(Object.fromEntries(Object.entries(props).filter(([key]) => key.charAt(0) !== "$")) as P)} // filter out props that starts with "$"
                // forward ref
                ref={ref}
                // set class names
                className={parseTailwindClassNames(
                    cleanTemplate(template, props.className),
                    ...templateElements.map((t) => t(props))
                )}
            />
        ))
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
