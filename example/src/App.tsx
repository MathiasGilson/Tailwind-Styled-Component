import React, { useState } from "react"
import tw from "../../src"

import styled from "styled-components"

export default () => {
    const [value, setValue] = useState("hello")

    const onChange = (e: any) => {
        console.log(`input`, e.target.value)
        setValue(e.target.value)
    }
    const [value2, setValue2] = useState("blue")

    const onChange2 = (e: any) => {
        console.log(`input`, e.target.value)
        setValue2(e.target.value)
    }

    return (
        <Container>
            <Row>
                <Title $bold={false} $large={true}>
                    Hello
                </Title>
                <Title $bold={false} $large={false} $as={RedContainer}>
                    Hello, I'm a Title rendered as a RedContainer, Polymorphism!
                </Title>
                <Input onChange={onChange} onFocus={() => console.log(`focus`)} value={value} />

                <Anchor>anchor test</Anchor>

                <DefaultContainer $bold={false}>
                    <pre>
                        DefaultContainer
                        <br />I have following classes: flex items-center
                    </pre>
                </DefaultContainer>
                <RedContainer $bold={true} $as={Title} $large={true}>
                    <pre>
                        Red Container
                        <br />
                        I add the following class: bg-red-300
                        <br />
                        and I should have the classes: bg-red-300 flex items-center
                    </pre>
                </RedContainer>
            </Row>
            <Column>
                <p>Try changing the color code below</p>
                <Input onChange={onChange2} value={value2} />
                <Box color={value2}>
                    <BoxP>{value2}</BoxP>
                </Box>
            </Column>
        </Container>
    )
}

const Row = tw.div`
flex
`
const Column = tw.div`
flex-col flex flex-initial w-screen justify-center items-center
`
const Box = tw.div`
    h-32
    w-32
    m-9
`.withStyle<{ color: string }>((p) => ({ backgroundColor: p.color }))

const BoxP = tw.p`
text-black
mix-blend-difference
`

const LogInAnchor = tw.a`
  flex
`
const TwAnchor = tw(LogInAnchor)`
  text-sm
`
const Anchor = styled(TwAnchor)<{ $active?: boolean }>`
    color: ${(props) => (props.$active ? "red" : "blue")};
`

const Input = tw.input`
h-6
rounded-xl
shadow
`

const Container = tw.div`
    flex
    flex-col
`

const DefaultContainer = tw.div<{ $bold?: boolean }>`
    ${(p) => (p.$bold ? "font-bold" : "")}

    flex
    items-center
`

const StyledContainer = styled(DefaultContainer)<{ $active?: boolean }>`
    color: ${(props) => (props.$active ? "red" : "blue")};
`

const RedContainer = tw(DefaultContainer)`
    bg-red-300
`

const Title = tw.div<{ $bold: boolean; $large?: boolean }>`
    flex
    
    ${(p) => (p.$bold ? "font-bold" : "font-normal")}
    ${(p) => (p.$large ? "text-xl" : "")}

`
