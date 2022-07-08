import { ResultCreator } from 'omnibus-rxjs';
import { Subscription } from 'rxjs';

import { IGraphNode, NodeID } from './graph-elements';

export type CurrentChangeSource = 'add' | 'jump' | 'undo' | 'redo' | 'misc';

export type CurrentChangeObject<T> = {
    current: T;
    previousCurrent: T;
    source: CurrentChangeSource;
};

export interface IGraph<T extends IGraphNode> {
    readonly nodes: Map<NodeID, T>;
    readonly edgeList: Map<NodeID, Array<T>>;
    readonly current: T;
    readonly nnodes: number;
    readonly nedges: number;
    addNode(node: T, setCurrent?: boolean): void;
    nodeBy(id: NodeID): T;
    getNodes(sortFn?: (a: T, b: T) => number): T[];
    jumpTo(nodeOrId: T | NodeID, source: CurrentChangeSource): void;
    addCurrentChangeListener<TCon>(
        listener: ResultCreator<CurrentChangeObject<T>, TCon>
    ): Subscription;
}
