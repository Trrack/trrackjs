import { INode, IRootNode } from './nodes';

type ProvenanceGraphStructure = {
    nodes: Map<string, INode>;
    current: INode;
    root: IRootNode;
};

type ReadonlyProvenanceGraph = Readonly<ProvenanceGraphStructure>;

type SerializedProvenanceGraph = any;

export type CurrentChangeSource = 'add' | 'to' | 'undo' | 'redo';

export type CurrentChangeListener = (
    current: INode,
    opts?: {
        source?: CurrentChangeSource;
        previousCurrentNode?: INode;
        path?: INode[];
    }
) => void;

export type ProvenanceGraphEvents = {
    currentChanged: Parameters<CurrentChangeListener>;
};

export interface IProvenanceGraph {
    readonly current: INode;
    readonly root: IRootNode;
    addNode(node: INode): void;
    getNodeById(id: string): INode;
    get(
        serialized?: boolean
    ): ReadonlyProvenanceGraph | SerializedProvenanceGraph;
    subscribe(
        event: keyof ProvenanceGraphEvents,
        listener: CurrentChangeListener
    ): void;
    clear(event: keyof ProvenanceGraphEvents): void;
    moveCurrent(to: INode, source: CurrentChangeSource): void;
}
