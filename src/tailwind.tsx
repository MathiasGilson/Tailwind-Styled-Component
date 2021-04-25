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

function parseTailwindClassNames(template: string[], ...templateElements: any[]) {
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

export type FunctionTemplate<P, E> = (
    template: TemplateStringsArray,
    ...templateElements: any[]
) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<E>>

interface ClassNameProp { className?: string }
type Component<Props extends ClassNameProp> = React.ComponentType<Props>

function functionTemplate<P extends ClassNameProp, E = unknown>(Element: Component<P>): FunctionTemplate<P, E> {
    return (template, ...templateElements) => React.forwardRef<E, P>(({ children, ...props }, ref) => (
        <Element
            {...props as P}
            ref={ref}
            className={parseTailwindClassNames(
                cleanTemplate(template, props.className),
                ...templateElements.map((t) => t(props))
            )}
        >
            {children}
        </Element>
    ))
}

export type IntrinsicElements = {
    [key in keyof JSX.IntrinsicElements]: FunctionTemplate<React.ComponentProps<key>, JSX.IntrinsicElements[key]>
}

const intrinsicElements: IntrinsicElements = domElements.reduce(
    (acc, DomElement) => ({
        ...acc,
        [DomElement]: functionTemplate((p) => <DomElement {...p} />),
    }),
    {} as IntrinsicElements
)

const tw = Object.assign(
    functionTemplate,
    intrinsicElements,
)

export default tw
