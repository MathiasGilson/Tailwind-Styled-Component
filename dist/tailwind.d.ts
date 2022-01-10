import React from "react";
export declare type IntrinsicElementsKeys = keyof JSX.IntrinsicElements;
export declare const mergeArrays: (template: TemplateStringsArray, templateElements: (string | undefined | null)[]) => (string | null | undefined)[];
export declare const cleanTemplate: (template: (string | undefined | null)[], inheritedClasses?: string) => string;
declare type TransientProps = Record<`$${string}`, any>;
declare type Const<A> = {
    [x in keyof A]: A[x];
};
interface TwC<P extends {}> extends Const<React.ForwardRefExoticComponent<P>> {
    (props: P & {
        as?: never | undefined;
    }): React.ReactElement<any> | null;
    <As extends IntrinsicElementsKeys>(props: P & {
        as: As;
    } & JSX.IntrinsicElements[As]): React.ReactElement<any> | null;
    <P2 extends {}>(props: P & {
        as: (p: P2) => React.ReactElement | null;
    } & P2): React.ReactElement<any> | null;
}
declare type Ref<E> = E extends IntrinsicElementsKeys | React.ForwardRefExoticComponent<any> | {
    new (props: any): React.Component<any>;
} | ((props: any, context?: any) => React.ReactElement | null) ? React.ElementRef<E> : {};
export declare type FunctionTemplate<P, E> = <K extends TransientProps = {}>(template: TemplateStringsArray, ...templateElements: ((props: P & AsProp & K) => string | undefined | null)[]) => TwC<P & K & React.RefAttributes<Ref<E>>>;
interface ClassNameProp {
    className?: string;
}
interface AsProp {
    as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}
declare function functionTemplate<P extends ClassNameProp, E = any>(Element: React.ComponentType<P>): FunctionTemplate<P, E>;
export declare type IntrinsicElements = {
    [key in keyof JSX.IntrinsicElements]: FunctionTemplate<JSX.IntrinsicElements[key], key>;
};
declare const tw: typeof functionTemplate & IntrinsicElements;
export default tw;
