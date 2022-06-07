import { getUUID } from '../../utils';
import { Listener } from '../../utils/IObservable';
import { AObservable } from '../../utils/Observable';
import { INode, NodeID, NodeType } from './types';

type NodeEvents = 'add-child';

export abstract class ANode extends AObservable<NodeEvents> implements INode {
    id: NodeID = getUUID();
    children: INode[] = [];
    createdOn = new Date();
    abstract type: NodeType;
    abstract label: string;
    abstract level: number;
    abstract parent: INode | null;
    listenerMap: Record<NodeEvents, Listener[]> = { 'add-child': [] };

    override notify(event: NodeEvents): void {
        console.log(event);
    }
}
