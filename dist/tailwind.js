"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanTemplate = exports.mergeArrays = void 0;
const react_1 = __importDefault(require("react"));
const domElements_1 = __importDefault(require("./domElements"));
const tailwindcss_classnames_1 = require("tailwindcss-classnames");
const mergeArrays = (template, templateElements) => {
    return template.reduce((acc, c, i) => acc.concat(c || [], templateElements[i] || []), []);
};
exports.mergeArrays = mergeArrays;
const cleanTemplate = (template, inheritedClasses = "") => {
    const newClasses = template
        .join(" ")
        .trim()
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, " ")
        .split(" ")
        .filter((c) => c !== ",");
    const inheritedClassesArray = inheritedClasses ? inheritedClasses.split(" ") : [];
    return tailwindcss_classnames_1.classnames(...inheritedClassesArray
        .concat(newClasses)
        .filter((c) => c !== " ")
        .filter((v, i, arr) => arr.indexOf(v) === i));
};
exports.cleanTemplate = cleanTemplate;
function functionTemplate(Element) {
    return (template, ...templateElements) => {
        const result = react_1.default.forwardRef((props, ref) => (react_1.default.createElement(Element, Object.assign({}, Object.fromEntries(Object.entries(props).filter(([key]) => key.charAt(0) !== "$")), { ref: ref, className: exports.cleanTemplate(exports.mergeArrays(template, templateElements.map((t) => t(props))), props.className) }))));
        if (typeof (Element) !== 'string') {
            result.displayName = Element.displayName;
        }
        else {
            result.displayName = 'tw.' + Element;
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