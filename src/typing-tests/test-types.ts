/**
 * @author 'tsdef'
 */
export type IsAny<T, True, False = never> = True | False extends (T extends never ? True : False) ? True : False
/**
 * @author 'tsdef'
 */
export type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False

type Equals<T, U> = IsAny<T, never, IsAny<U, never, [T] extends [U] ? ([U] extends [T] ? any : never) : never>>
type IsNotAny<T> = IsAny<T, never, any>
type EnsureUnknown<T extends any> = IsUnknown<T, any, never>
type EnsureAny<T extends any> = IsAny<T, any, never>

export function expectType<T>(t: T): T {
    return t
}
export function expectExactType<T>(t: T) {
    return <U extends Equals<T, U>>(u: U) => [t, u]
}

export function expectUnknown<T extends EnsureUnknown<T>>(t: T) {
    return t
}

export function expectExactAny<T extends EnsureAny<T>>(t: T) {
    return t
}

export function expectNotAny<T extends IsNotAny<T>>(t: T): T {
    return t
}
