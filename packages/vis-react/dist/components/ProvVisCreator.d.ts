import { initializeTrrack } from '@trrack/core';
import { ProvVisConfig } from './ProvVis';
type TrrackLike = ReturnType<typeof initializeTrrack>;
export declare function ProvVisCreator<TrrackInstance extends TrrackLike>(node: Element, trrackInstance: TrrackInstance, config?: Partial<ProvVisConfig<unknown, string>>, REACT_16?: boolean): Promise<void>;
export {};
