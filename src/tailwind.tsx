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
        .reduce((sum, n, index) => {
            const templateElement = templateElements[index]
            if (typeof templateElement === "string") {
                return `${sum} ${n} ${templateElement}`
            }
            return `${sum} ${n}`
        }, "")
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
    ) =>
        React.forwardRef<E, P & K>((props, ref) => (
            <Element
                {...Object.fromEntries(Object.entries(props).filter(([key]) => key.charAt(0) !== "$")) as P} //filter props that starts with "$"
                ref={ref}
                className={parseTailwindClassNames(
                    cleanTemplate(template, props.className),
                    ...templateElements.map((t) => t(props))
                )}
            />
        ))
}

export type IntrinsicElements = {
    [key in keyof JSX.IntrinsicElements]: FunctionTemplate<JSX.IntrinsicElements[key], key>
}

const intrinsicElements: IntrinsicElements = domElements.reduce(
    (acc, DomElement) => ({
        ...acc,
        [DomElement]: functionTemplate((p) => <DomElement {...p} />)
    }),
    {} as IntrinsicElements
)

const tw = Object.assign(functionTemplate, intrinsicElements)

export default tw
