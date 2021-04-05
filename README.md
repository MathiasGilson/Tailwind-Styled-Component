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

*This extension requires TailwindCSS to be installed and configured on your project too. [Install TailwindCSS](https://tailwindcss.com/docs/installation)*

#### [Optional] Configure IntelliSense autocomplete on VSCode

First, install Tailwind CSS IntelliSense VSCode extension

https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss

Then add these user settings ([How to edit VSCode settings?](https://code.visualstudio.com/docs/getstarted/settings))

```js
"tailwindCSS.includeLanguages": {
    "typescript": "javascript", // if you are using typescript
    "typescriptreact": "javascript"  // if you are using typescript with react
},
"editor.quickSuggestions": {
    "strings": true // forces VS Code to trigger completions when editing "string" content
},
"tailwindCSS.experimental.classRegex": [
    "tw`([^`]*)", // tw`...`
    "tw=\"([^\"]*)", // <div tw="..." />
    "tw={\"([^\"}]*)", // <div tw={"..."} />
    "tw\\.\\w+`([^`]*)", // tw.xxx`...`
    "tw\\(.*?\\)`([^`]*)" // tw(Component)`...`
]
```

## Usage

### Import


```js
import tw from "tailwind-styled-components"
```

### Basic

Create a Tailwind Styled Component with Tailwind rules that you can render directly

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

```js
render(
    <Container>
        <div>Use the Container as any other React Component</div>
    </Container>
)
```

Will be rendered as

```html
<div class="flex items-center justify-center flex-col w-full bg-indigo-600">
  <div>Use the Container as any other React Component</div>
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

---
**Be sure to set the entire class name**

✅ &nbsp;Do `${p => p.primary ? "bg-indigo-600" : "bg-indigo-300"}`

❌ &nbsp;Don't `bg-indigo-${p => p.primary ? "600" : "300"}`

---

### Extends

```js
const DefaultContainer = tw.div`
    flex
    items-center
    bg-blue-600
`
```

```js
const RedContainer = tw(DefaultContainer)`
    bg-red-300
`
```

Will be rendered as

```html
<div class="flex items-center bg-red-300">
  <!-- children -->
</div>
```

*Overrides the parent background color class*


### Extends Styled Component

Extend [styled components](https://github.com/styled-components/styled-components)


```js
const StyledComponentWithCustomCss = styled.div`
    filter: blur(1px);
`

const  = tw(StyledComponentWithCustomCss)`
   flex
`
```

*Css rule `filter` is not suported by default on TailwindCSS*

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

// Create a <Title> react component that renders an <h1> which is
// indigo and sized at 1.125rem
const Title = tw.h1`
  ${p => p.large ? "text-lg": "text-base"}
  text-indigo-500
`

// Create a <SpecialBlueContainer> react component that renders a <section> with
// a special blue background color
const SpecialBlueContainer = styled.section`
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
render(
    <Container>
      <Title large={true}>Hello World, this is my first tailwind styled component!</Title>
    </Container>
)
```
