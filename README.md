# Tailwind-Styled-Component

Create tailwind css react components like styled components with classes name on multiple lines

[![NPM version][npm-image]][npm-url] 

[npm-image]: http://img.shields.io/npm/v/tailwind-styled-components.svg?style=flat-square
[npm-url]: http://npmjs.org/package/tailwind-styled-components

## Install

```bash
# using npm
npm i -D tailwind-styled-components

# using yarn
yarn add -D tailwind-styled-components
```

## Usage

### Import


```js
import tw from "tailwind-styled-components"
```

### Basic

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


### Conditional class names

Set tailwind class conditionaly with the same syntaxt as [styled components](https://styled-components.com/docs/basics#adapting-based-on-props)

```js
const Button = tw.button`
    flex
    ${p => p.primary ? "bg-indigo-600" : "bg-indigo-300"}
`
```
---
**Be sure to set the entire class name**

✅ &nbsp;Do `${p => p.primary ? "bg-indigo-600" : "bg-indigo-300"}`

❌ &nbsp;Don't `bg-indigo-${p => p.primary ? "600" : "300"}`

---

```jsx
<Button primary={true} />
```

Will be rendered as

```html
<button class="flex bg-indigo-600">
  <!-- children -->
</button>
```

and

```jsx
<Button primary={false} />
```

Will be rendered as

```html
<button class="flex bg-indigo-300">
  <!-- children -->
</button>
```


### Extends

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


### Extends Styled Component

Extend [styled components](https://github.com/styled-components/styled-components)


```js
const StyledComponentWithCustomJs = styled.div`
    filter: blur(1px);
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


## Example

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
  ${p => p.large ? "text-lg": "text-base"}
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
  <Title large={true}>Hello World, this is my first tailwind styled component!</Title>
</Container>
```
