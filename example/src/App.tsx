import React from "react"
import tw from "../../src"

export default () => {
    return (
        <Container>
            <Title $bold={false}>Hello</Title>
        </Container>
    )
}

const Container = tw.div`
    flex
    bg-blue-200
`

const Title = tw.div<{ $bold: boolean }>`
    flex
    ${(p) => (p.$bold ? "font-bold" : "font-normal")}
`
