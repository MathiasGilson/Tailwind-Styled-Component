"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanTemplate = exports.mergeArrays = void 0;
const react_1 = __importDefault(require("react"));
const domElements_1 = __importDefault(require("./domElements"));
const tailwindcss_classnames_1 = require("tailwindcss-classnames");
const isTwElement = Symbol("isTwElement?");
const mergeArrays = (template, templateElements) => {
    return template.reduce((acc, c, i) => acc.concat(c || [], templateElements[i] || []), []);
};
exports.mergeArrays = mergeArrays;
const cleanTemplate = (template, inheritedClasses = "") => {
    const newClasses = template
        .join(" ")
        .trim()
        .replace(/\n/g, " ")
        .replace(/\s{2,}/g, " ")
        .split(" ")
        .filter((c) => c !== ",");
    const inheritedClassesArray = inheritedClasses ? inheritedClasses.split(" ") : [];
    return (0, tailwindcss_classnames_1.classnames)(...newClasses
        .concat(inheritedClassesArray)
        .filter((c) => c !== " ")
        .filter((v, i, arr) => arr.indexOf(v) === i));
};
exports.cleanTemplate = cleanTemplate;
const filter$FromProps = ([key]) => key.charAt(0) !== "$" && key !== "as";
function functionTemplate(Element) {
    return (template, ...templateElements) => {
        const result = react_1.default.forwardRef((props, ref) => {
            const FinalElement = props.as || Element;
            const filteredProps = FinalElement[isTwElement]
                ? props
                : Object.fromEntries(Object.entries(props).filter(filter$FromProps));
            return (react_1.default.createElement(FinalElement, { ...filteredProps, ref: ref, className: (0, exports.cleanTemplate)((0, exports.mergeArrays)(template, templateElements.map((t) => t(props))), props.className) }));
        });
        result[isTwElement] = true;
        if (typeof Element !== "string") {
            result.displayName = Element.displayName || Element.name;
        }
        else {
            result.displayName = "tw." + Element;
        }
        return result;
    };
}
const intrinsicElements = domElements_1.default.reduce((acc, DomElement) => ({
    ...acc,
    [DomElement]: functionTemplate(DomElement)
}), {});
const tw = Object.assign(functionTemplate, intrinsicElements);
exports.default = tw;
//# sourceMappingURL=tailwind.js.map