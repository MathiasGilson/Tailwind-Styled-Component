import React from "react";
export declare const mergeArrays: (template: TemplateStringsArray, templateElements: (string | undefined | null)[]) => (string | null | undefined)[];
export declare const cleanTemplate: (template: (string | undefined | null)[], inheritedClasses?: string) => string;
declare type TransientProps = Record<`$${string}`, any>;
export declare type FunctionTemplate<P, E> = <K extends TransientProps = {}>(template: TemplateStringsArray, ...templateElements: ((props: P & K) => string | undefined | null)[]) => React.ForwardRefExoticComponent<React.PropsWithoutRef<P & K> & React.RefAttributes<E>>;
interface ClassNameProp {
    className?: string;
}
declare function functionTemplate<P extends ClassNameProp, E = any>(Element: React.ComponentType<P>): FunctionTemplate<P, E>;
declare function functionTemplate<P extends ClassNameProp & {
    as: keyof JSX.IntrinsicElements | React.ComponentType<P2>;
}, E = any, P2 = any>(Element: React.ComponentType<P>): FunctionTemplate<P2, E>;
export declare type IntrinsicElements = {
    [key in keyof JSX.IntrinsicElements]: FunctionTemplate<JSX.IntrinsicElements[key], any>;
};
declare const tw: typeof functionTemplate & IntrinsicElements;
export default tw;
