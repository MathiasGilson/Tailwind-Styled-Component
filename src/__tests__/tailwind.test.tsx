import React, { useEffect, useRef } from "react"
import tw, { mergeArrays, cleanTemplate } from "../tailwind"
import { act, render } from "@testing-library/react"
import "@testing-library/jest-dom"

interface TestCompProps {
    className?: string
    someThingElse?: string
    ref?: unknown
    children?: React.ReactNode | React.ReactNode[]
}

describe("mergeArrays", () => {
    it("should merge arrays of same size in correct order", () => {
        const arr1 = ["1", "3", "5", "7", "9"]
        const arr2 = ["2", "4", "6", "8", "10"]
        const result = mergeArrays(arr1 as unknown as TemplateStringsArray, arr2)
        expect(result).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"])
    })

    it("should merge arrays of different size in correct order", () => {
        const arr1 = ["1", "3", "5", "7", "9"]
        const arr2 = ["2", "4", "6", "8"]
        const result = mergeArrays(arr1 as unknown as TemplateStringsArray, arr2)
        expect(result).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9"])
    })
})

describe("cleanTemplate", () => {
    it("should return a class string", () => {
        const template = [
            `fixed
    h-full
    w-full
    bg-green-500
    `
        ]
        const result = cleanTemplate(template)

        expect(result).toEqual("fixed h-full w-full bg-green-500")
    })
})

describe("tw", () => {
    it("passes ref [Type Test]", async () => {
        const Div = tw.div`bg-gray-400`
        let r: any = undefined
        const HasRef = () => {
            const ref = useRef<HTMLDivElement>(null)
            useEffect(() => {
                r = ref
            }, [ref])
            return (
                <Div data-testid="mydiv" ref={ref}>
                    ref
                </Div>
            )
        }
        render(<HasRef />)
        await act(async () => {
            expect(r).not.toBeUndefined()
            expect(r.current).not.toBeUndefined()
            expect(r.current.localName).toBe("div")
        })
    })

    it("should have a proper displayName", () => {
        const Div = tw.div`bg-gray-400`
        const A = tw.a`bg-gray-400`
        const Nav = tw.nav`bg-gray-400`
        const H1 = tw.h1`bg-gray-400`

        const TestComponent = () => <></>

        const TwTestComponent = tw(TestComponent)``

        expect(Div.displayName).toBe("tw.div")
        expect(A.displayName).toBe("tw.a")
        expect(Nav.displayName).toBe("tw.nav")
        expect(H1.displayName).toBe("tw.h1")
        expect(TwTestComponent.displayName).toBe("TestComponent")
    })

    it("matches snapshot with overridden classNames", () => {
        const Parent = tw.div`bg-gray-400 px-5`
        const Child = tw(Parent)`bg-blue-500 p-2`
        const { asFragment } = render(<Child />)
        expect(asFragment()).toMatchSnapshot()
    })

    it("matches snapshot with overridden classNames where child conflicting props win", () => {
        const Parent = tw.div`p-5`
        const Child = tw(Parent)`p-4`
        const { asFragment } = render(<Child />)
        expect(asFragment()).toMatchSnapshot()
    })

    it("matches snapshot with intrinsic element", () => {
        const Div = tw.div`bg-gray-400`
        const { asFragment } = render(<Div>test</Div>)
        expect(asFragment()).toMatchSnapshot()
    })

    it("matches snapshot with function component", () => {
        const TestComp: React.FC<TestCompProps> = ({ className, children }) => (
            <div className={className}>{children}</div>
        )
        const TestCompStyled = tw(TestComp)`bg-gray-400`
        const { asFragment } = render(<TestCompStyled>test</TestCompStyled>)
        expect(asFragment()).toMatchSnapshot()
    })

    it("matches snapshot with class component", () => {
        class TestComp extends React.Component<TestCompProps> {
            render() {
                return <div className={this.props.className}>{this.props.children}</div>
            }
        }
        const TestCompStyled = tw(TestComp)`bg-gray-400`
        const { asFragment } = render(<TestCompStyled>test</TestCompStyled>)
        expect(asFragment()).toMatchSnapshot()
    })

    it("matches snapshot with two properties", () => {
        const Div = tw.div<{ $test1?: string; $test2?: string }>`
      bg-gray-500
      p-10
      `

        const { asFragment } = render(
            <Div $test1="true" $test2="true">
                test
            </Div>
        )
        expect(asFragment()).toMatchSnapshot()
    })
    it("matches snapshot with three properties including `withStyle`", () => {
        const Div = tw.div<{ $test1?: string; $test2?: string }>`
      bg-gray-500
      p-10
      `.withStyle<{ $bgColor: string }>((p) => ({ backgroundColor: p.$bgColor }))

        const { asFragment } = render(
            <Div $test1="true" $test2="true" $bgColor="blue">
                test
            </Div>
        )

        expect(asFragment()).toMatchSnapshot()
    })

    it("matches snapshot with two dynamic properties", () => {
        const Div = tw.div<{ $test1?: string; $test2?: string }>`
      ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : ``)}
      ${(p: any) => (p.$test2 === "true" ? `p-10` : ``)}
      `

        const { asFragment } = render(
            <Div $test1="true" $test2="true">
                test
            </Div>
        )

        expect(asFragment()).toMatchSnapshot()
    })

    it("ignores undefined as return value", () => {
        const Div = tw.div<{ $test1?: string }>`
      ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : undefined)}
      p-10
      `

        const { getByText } = render(<Div $test1="false">test</Div>)

        const element = getByText("test")
        expect(element).toHaveClass("p-10", { exact: true })
    })

    it("ignores null as return value", () => {
        const Div = tw.div<{ $test1?: string }>`
      ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : null)}
      p-10
      `

        const { getByText } = render(<Div $test1="false">test</Div>)

        const element = getByText("test")
        expect(element).toHaveClass("p-10", { exact: true })
    })

    it("ignores empty string as return value", () => {
        const Div = tw.div<{ $test1?: string }>`
      ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : ``)}
      p-10
      `

        const { getByText } = render(<Div $test1="false">test</Div>)

        const element = getByText("test")
        expect(element).toHaveClass("p-10", { exact: true })
    })

    it("ignores false as return value", () => {
        const Div = tw.div<{ $test1?: string }>`
      ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : false)}
      p-10
      `

        const { getByText } = render(<Div $test1="false">test</Div>)

        const element = getByText("test")
        expect(element).toHaveClass("p-10", { exact: true })
    })

    it("works using the short hand syntax for false or undefined", () => {
        const Div = tw.div<{ $test1?: string; $test2?: string }>`
      ${(p: any) => p.$test1 === "true" && `bg-gray-500`}
      ${(p: any) => p.$test2 && `bg-gray-500`}
      p-10
      `

        const { getByText } = render(<Div $test1="false">test</Div>)

        const element = getByText("test")
        expect(element).toHaveClass("p-10", { exact: true })
    })

    it("matches snapshot with two properties & two dynamic properties and maintains class order", () => {
        const Div = tw.div<{ $test1?: string; $test2?: string }>`
      z-10
      ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : ``)}
      text-white
      ${(p: any) => (p.$test2 === "true" ? `p-10` : ``)}
      `

        const { asFragment } = render(
            <Div $test1="true" $test2="true">
                test
            </Div>
        )

        expect(asFragment()).toMatchSnapshot()
    })

    it("should render tag Component as html tag in `$as` prop", () => {
        const Div = tw.div<{ $test1: string }>`
      text-black
      ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : ``)}
      `

        const { asFragment } = render(<Div $as="a" $test1="true" href="http://" />)
        expect(asFragment()).toMatchSnapshot()
    })

    it("$as props polymorphism should work with class component", () => {
        class TestComp extends React.Component<TestCompProps> {
            render() {
                return <div className={this.props.className}>{this.props.children}</div>
            }
        }
        const TestCompStyled = tw(TestComp)`bg-gray-400`
        const { asFragment } = render(
            <TestCompStyled $as="a" href="http://###">
                test
            </TestCompStyled>
        )
        expect(asFragment()).toMatchSnapshot()
    })

    it("should render Component as html tag in `$as` prop", () => {
        const Div = tw.div<{ $test1: string }>`
        text-black
        ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : ``)}
        `
        const RedDiv = tw(Div)`bg-red-500`
        const { asFragment } = render(<RedDiv $as="a" $test1="true" href="http://" />)
        expect(asFragment()).toMatchSnapshot()
    })

    it("should render component as component in `$as` prop: test 1", () => {
        const Div = tw.div<{ $test1: string }>`
        text-black
        ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : ``)}
        `
        const Nav = tw.nav<{ $isVertical: boolean }>`flex h-20 w-full ${(p: any) =>
            p.$isVertical === true ? "flex-col h-full w-20" : ""}`
        const { asFragment } = render(<Div $as={Nav} $test1="true" $isVertical={true} />)
        expect(asFragment()).toMatchSnapshot()
    })
    it("should render base class component as component in `$as` prop: test 1", () => {
        class TestComp extends React.Component<TestCompProps> {
            render() {
                return <div className={this.props.className}>{this.props.children}</div>
            }
        }
        const ClassDiv = tw(TestComp)<{ $test1: string }>`
        text-black
        ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : ``)}
        `
        const Nav = tw.nav<{ $isVertical: boolean }>`flex h-20 w-full ${(p: any) =>
            p.$isVertical === true ? "flex-col h-full w-20" : ""}`
        const { asFragment } = render(<ClassDiv $as={Nav} $test1="true" $isVertical={true} />)
        expect(asFragment()).toMatchSnapshot()
    })

    it("should render component as component in `$as` prop: test 2", () => {
        const Div = tw.div<{ $test1: string }>`
        text-black
        ${(p: any) => (p.$test1 === "true" ? `bg-gray-500` : ``)}
        `
        const Nav = tw.nav<{ $isVertical: boolean }>`flex h-20 w-full ${(p: any) =>
            p.$isVertical === true ? "flex-col h-full w-20" : ""}`
        const RedDiv = tw(Div)`bg-red-500`
        const { asFragment } = render(<RedDiv $as={Nav} $test1="true" $isVertical={false} />)
        expect(asFragment()).toMatchSnapshot()
    })
    it("should not clear merged inheritedClasses without $as", () => {
        const Heading = tw.p`
        text-4xl font-bold text-gray-700
      `
        // extend the base Heading styled component
        const Display = tw(Heading)`
        text-6xl
      `
        const WithoutAs = ({}) => {
            return (
                // without the $as prop, all classnames will be merged in correctly.
                // text-6xl font-bold text-gray-700 border-2 p-4
                <Display className="border-2 p-4">{}</Display>
            )
        }

        const { asFragment } = render(<WithoutAs />)
        expect(asFragment()).toMatchSnapshot()
    })
    it("should not clear merged inheritedClasses with $as", () => {
        const Heading = tw.p`
        text-4xl font-bold text-gray-700
      `
        // extend the base Heading styled component
        const Display = tw(Heading)`
        text-6xl
      `
        const WithAs = ({}) => {
            return (
                // with the $as prop, only the most recent component's classes will be used
                // text-6xl border-2 p-4
                <Display className="border-2 p-4" $as="h1">
                    {}
                </Display>
            )
        }
        const { asFragment } = render(<WithAs />)
        expect(asFragment()).toMatchSnapshot()
    })
})
