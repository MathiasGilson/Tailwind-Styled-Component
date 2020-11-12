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
