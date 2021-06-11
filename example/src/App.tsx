import React, { useState } from "react"
import tw from "../../src"

export default () => {
    const [value, setValue] = useState("hello")

    const onChange = (e) => {
        console.log(`input`, e.target.value)
        setValue(e.target.value)
    }

    return (
        <Container>
            <Title $bold={false}>Hello</Title>
            <Input onChange={onChange} onFocus={() => console.log(`focus`)} value={value} />

            <DefaultContainer>
                <pre>
                    DefaultContainer
                    <br />I have following classes: flex items-center bg-blue-600
                </pre>
            </DefaultContainer>
            <RedContainer>
                <pre>
                    Red Container
                    <br />
                    I have following classes: bg-red-300 flex items-center bg-blue-600
                    <br />
                    but I should have: bg-red-300 flex items-center
                </pre>
            </RedContainer>
        </Container>
    )
}

const Input = tw.input``

const Container = tw.div`
    flex
    bg-blue-200
`

const DefaultContainer = tw.div`
    flex
    items-center
    bg-blue-600
`

const RedContainer = tw(DefaultContainer)`
    bg-red-300
`

const Title = tw.div<{ $bold: boolean }>`
    flex
    ${(p) => (p.$bold ? "font-bold" : "font-normal")}
`
