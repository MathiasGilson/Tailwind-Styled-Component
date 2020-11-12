# Tailwind-Styled-Component
Create tailwind css react components like styled components with classes name on multiple lines

### Install

```bash
# using npm
npm i -D tailwind-styled-components

# using yarn
yarn add -D tailwind-styled-components
```

### Usage

## Import


```js
import tw from "tailwind-styled-components"
```

## Basic

You can use tailwind-styled-components without using styled components

```js
const Container = tw.div`
    flex
    items-center
    justify-center
    flex-col
    w-full
    bg-indigo-600
`
```

Will be rendered as

```html
<div class="flex items-center justify-center flex-col w-full bg-indigo-600">
  <!-- children -->
</div>
```

## Extends

```js
const RedContainer = tw(Container)`
    bg-red-600
`
```

Will be rendered as

```html
<div class="flex items-center justify-center flex-col w-full bg-red-600">
  <!-- children -->
</div>
```

*Overrides the parent background color class*


## Extends Styled Component

Extend [styled components](https://github.com/styled-components/styled-components)


```js
const StyledComponentWithCustomJs = styled.div`
    filter: blur(1px)
`

const  = tw(StyledComponentWithCustomJs)`
   flex
`
```

Will be rendered as

```html
<div class="flex" style="filter: blur(1px);">
  <!-- children -->
</div>
```


### Example

```jsx
import React from "react"
import tw from "tailwind-styled-components"
import styled from "styled-components"

const Container = tw.div`
    flex
    items-center
    justify-center
`

// Create a <Title> react component that renders an <h1> which is
// indigo and sized at 1.125rem
const Title = tw.h1`
  text-lg
  text-indigo-500
`

// Create a <SpecialBlueContainer> react component that renders a <section> with
// a special blue background color
const Container = styled.section`
  background-color: #0366d6;
`

// Create a <Container> react component that extends the SpecialBlueContainer to render
// a tailwind <section> with the special blue background and adds the flex classes 
const Container = tw(SpecialBlueContainer)`
    flex
    items-center
    justify-center
    w-full
`

// Use them like any other React component – except they're styled!
<Container>
  <Title>Hello World, this is my first styled component!</Title>
</Container>
```
