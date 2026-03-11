/// <reference types="react" />
import { NodeId, Nodes } from '@trrack/core';
import { IconConfig } from '../utils/IconConfig';
interface ProvVisProps<T, S extends string> {
    root: NodeId;
    currentNode: NodeId;
    nodeMap: Nodes<T, S>;
    config?: Partial<ProvVisConfig<T, S>>;
}
export interface ProvVisConfig<T, S extends string> {
    gutter: number;
    verticalSpace: number;
    nodeWidthShown: number;
    marginRight: number;
    marginTop: number;
    marginLeft: number;
    animationDuration: number;
    annotationHeight: number;
    nodeAndLabelGap: number;
    labelWidth: number;
    iconConfig: IconConfig<T, S> | null;
    changeCurrent: (id: NodeId) => void;
    bookmarkNode: ((id: NodeId) => void) | null;
    annotateNode: ((id: NodeId, annotation: string) => void) | null;
    getAnnotation: (id: NodeId) => string;
    isBookmarked: (id: NodeId) => boolean;
    isDarkMode: boolean;
    nodeExtra: Partial<Record<S | '*', React.ReactElement | null>>;
}
export declare function ProvVis<T, S extends string>({ nodeMap, root, currentNode, config, }: ProvVisProps<T, S>): JSX.Element;
export {};
