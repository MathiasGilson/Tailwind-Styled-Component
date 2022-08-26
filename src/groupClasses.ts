const groups = {
    layout: [
        "flex",
        "basis",
        "grow",
        "shrink",
        "justify-",
        "items-",
        "content-",
        "self-",

        "grid",
        "-flow",
        "flow-root",
        "space-",
        "wrap",

        "gap",
        "table-",
        "inline-",
        "column",
        "col-",
        "-col",
        "-cols",
        "row"
    ],

    layoutOptions: [
        "static",
        "fixed",
        "absolute",
        "relative",
        "sticky",

        "top",
        "right",
        "bottom",
        "left",
        "inset",
        "z-",

        "aspect-",
        "container",
        "break-after",
        "box-",
        `order-[\d]`,

        "clear-",
        "float-",
        "overflow-",
        "isolate",
        "isolation",
        "object"
    ],

    spacing: ["m-", "mt-", "mb-", "ml-", "mr-", "mx-", "my-", "p-", "pt-", "pb-", "pl-", "pr-", "px-", "py-", "space-"],

    sizing: ["h-", "w-", "max-h", "max-w", "min-h", "min-w"],

    typography: [
        "text-",
        "antialiased",
        "break",
        "truncate",
        "case",
        "capitalize",
        "leading-",
        "underline",
        "overline",
        "line-through",
        "font-",
        "italic",
        "whitespace",
        "decoration-",
        "tracking",
        "-nums",
        "list-",
        "ordinal",
        "indent",
        "slashed-zero",
        "align-",
        "fractions",
        "content-none"
    ],

    backgrounds: ["bg-", "from-", "to-", "via-"],

    borders: ["border-", "divide-", "rounded-", "outline-", "ring"],

    effects: ["shadow", "mix-blend", "opacity", "visible", "sr-only"],

    filters: [
        "blur",
        "brightness",
        "contrast",
        "drop-shadow",
        "grayscale",
        "hue-rotate",
        "invert",
        "saturate",
        "sepia",
        "backdrop"
    ],

    animations: ["animate", "transition", "delay", "ease", "duration"],

    transform: ["transform", "translate-", "origin-", "scale-", "rotate-", "skew-", "diagonal-fractions"]
}
