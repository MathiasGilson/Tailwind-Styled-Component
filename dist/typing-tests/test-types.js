"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectNotAny = exports.expectExactAny = exports.expectUnknown = exports.expectExactType = exports.expectType = void 0;
function expectType(t) {
    return t;
}
exports.expectType = expectType;
function expectExactType(t) {
    return (u) => [t, u];
}
exports.expectExactType = expectExactType;
function expectUnknown(t) {
    return t;
}
exports.expectUnknown = expectUnknown;
function expectExactAny(t) {
    return t;
}
exports.expectExactAny = expectExactAny;
function expectNotAny(t) {
    return t;
}
exports.expectNotAny = expectNotAny;
//# sourceMappingURL=test-types.js.map