import React from "react"
import tw from "../../src"

export default () => {
    return (
        <Container bold={true}>
            <Title>Hello </Title>
        </Container>
    )
}

const Container = tw.div`
    flex
    bg-blue-200
    ${(p) => (p.bold ? "font-bold" : "font-normal")}
`

const Title = tw.div`
    flex
`
