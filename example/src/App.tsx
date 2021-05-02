import React, { useState } from "react"
import tw from "../../src"

export default () => {
    const [value, setValue] = useState("hello")

    const onChange = (e) => {
        console.log(`input`, e.targe.event)
        setValue(e.target.value)
    }

    return (
        <Container>
            <Title $bold={false}>Hello</Title>
            <Input onChange={onChange} onFocus={() => console.log(`focus`)} value={value} />
        </Container>
    )
}

const Input = tw.input``

const Container = tw.div`
    flex
    bg-blue-200
`

const Title = tw.div<{ $bold: boolean }>`
    flex
    ${(p) => (p.$bold ? "font-bold" : "font-normal")}
`
