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

type FunctionTemplate = (
    template: TemplateStringsArray,
    ...templateElements: any[]
) => (props: { children?: any; [props: string]: any }) => any

const functionTemplate = (Element: any): FunctionTemplate => (template, ...templateElements) =>
    React.forwardRef(({ children, ...props }, ref) => (
        <Element
            {...props}
            ref={ref}
            className={parseTailwindClassNames(
                cleanTemplate(template, props.className),
                ...templateElements.map((t) => t(props))
            )}
        >
            {children}
        </Element>
    ))

type IntrinsicElements = {
    [key in keyof JSX.IntrinsicElements]?: FunctionTemplate
}

const intrinsicElements: IntrinsicElements = domElements.reduce(
    (acc, domElement) => ({ ...acc, [domElement]: functionTemplate(domElement) }),
    {}
)

const tw = Object.assign((Component: any) => functionTemplate(Component), intrinsicElements)

export default tw
