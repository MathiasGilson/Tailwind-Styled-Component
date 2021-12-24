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
            <Title $bold={false} $large={false}>
                Hello
            </Title>
            <Input onChange={onChange} onFocus={() => console.log(`focus`)} value={value} />

            <DefaultContainer $bold={false}>
                <pre>
                    DefaultContainer
                    <br />I have following classes: flex items-center
                </pre>
            </DefaultContainer>
            <RedContainer $bold={true}>
                <pre>
                    Red Container
                    <br />
                    I add the following class: bg-red-300
                    <br />
                    and I should have the classes: bg-red-300 flex items-center
                </pre>
            </RedContainer>
        </Container>
    )
}

const Input = tw.input``

const Container = tw.div`
    flex
`

const DefaultContainer = tw.div<{ $bold?: boolean }>`
    ${(p) => (p.$bold ? "font-bold" : "")}

    flex
    items-center
`

const RedContainer = tw(DefaultContainer)`
    bg-red-300
`

const Title = tw.div<{ $bold: boolean; $large?: boolean }>`
    flex
    
    ${(p) => (p.$bold ? "font-bold" : "font-normal")}
    ${(p) => (p.$large ? "text-xl" : "")}
`
