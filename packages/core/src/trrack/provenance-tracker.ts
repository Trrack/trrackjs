import { ResultCreator } from 'omnibus-rxjs';

import { CurrentChangeObject, NodeID } from '../graph';
import {
    ActionFunctionMap,
    ActionNode,
    ActionRegistry,
    ApplyActionObject,
    IProvenanceGraph,
    IProvenanceNode,
    LabelGenerator,
    ProvenanceGraph,
    ProvenanceNodeUtils,
    TrrackAction,
    TrrackActionFunction,
} from '../provenance';
import { ProvenanceGraphUtils } from '../provenance/utils';

export class Trrack<
    M extends ActionFunctionMap = ActionFunctionMap,
    T extends ActionRegistry<M> = ActionRegistry<M>,
    R extends keyof M = keyof M
> {
    static init<
        M extends ActionFunctionMap = ActionFunctionMap,
        T extends ActionRegistry<M> = ActionRegistry<M>
    >(registry?: T, graph?: IProvenanceGraph) {
        return new Trrack({ registry, graph });
    }

    private registry: T;
    readonly graph: IProvenanceGraph;

    private constructor(opts: { registry?: T; graph?: IProvenanceGraph } = {}) {
        const { registry = null, graph = null } = opts;

        this.registry = registry ? registry : (ActionRegistry.init<M>() as T);

        this.graph = graph ? graph : ProvenanceGraph.init();
    }

    get current() {
        return this.graph.current;
    }

    get root() {
        return this.graph.root;
    }

    get registeredActions(): string[] {
        return this.registry.registeredActions;
    }

    has<K extends Extract<keyof M, string>>(name: K): boolean {
        return this.registeredActions.includes(name);
    }

    register<
        K extends string,
        S extends TrrackActionFunction<any, any, any>,
        TLabel extends LabelGenerator<Parameters<S>>
    >(name: K, action: S, labelGenerator: TLabel) {
        const registry = this.registry.register(name, action, labelGenerator);

        return Trrack.init(registry, this.graph);
    }

    registerAction(label: string, action: TrrackAction) {
        const actionNode = ActionNode.create(label, action);
        this.graph.addNode(actionNode);
    }

    apply({
        name,
        args,
        label = undefined,
    }: ApplyActionObject<Extract<R, string>, Parameters<M[R]>> & {
        label?: string;
    }) {
        const act = this.registry.apply({ name, args });

        this.registerAction(
            label ? label : this.registry.getLabel({ name, args }),
            act
        );
    }

    to(
        targetOrId: NodeID | IProvenanceNode,
        source: 'undo' | 'redo' | 'jump' = 'jump'
    ) {
        const target =
            typeof targetOrId === 'string'
                ? this.graph.nodeBy(targetOrId)
                : targetOrId;

        if (this.current === target) return;

        const path = ProvenanceGraphUtils.getPath(this.current, target);

        for (let i = 0; i < path.length - 1; i++) {
            const currentNode = path[i];
            const nextNode = path[i + 1];

            const isUndo = ProvenanceGraphUtils.isNextNodeUp(
                currentNode,
                nextNode
            );

            const action = isUndo
                ? ProvenanceNodeUtils.isAction(currentNode) &&
                  currentNode.action.undo
                : ProvenanceNodeUtils.isAction(nextNode) && nextNode.action.do;

            if (action) {
                this.registry.apply(action);
            }
        }

        this.graph.jumpTo(target, source);
    }

    undo() {
        if (ProvenanceNodeUtils.isNonRoot(this.current)) {
            this.to(this.current.parent, 'undo');
        }
    }

    redo(
        selectorFn: (nodes: IProvenanceNode[]) => IProvenanceNode = (nodes) =>
            nodes[nodes.length - 1]
    ) {
        if (this.current.children.length > 0) {
            this.to(selectorFn(this.current.children), 'redo');
        }
    }

    tree() {
        console.warn('Remove tree fn');
        return getTreeFromNode(this.graph.root);
    }

    currentChangeListener<TCon>(
        listener: ResultCreator<CurrentChangeObject<IProvenanceNode>, TCon>
    ) {
        return this.graph.addCurrentChangeListener(listener);
    }
}

type TreeNode = Omit<IProvenanceNode, 'children' | 'name'> & {
    name: string;
    children: TreeNode[];
};

function getTreeFromNode(node: IProvenanceNode): TreeNode {
    return {
        ...node,
        children: node.children.map((n) => getTreeFromNode(n)),
        name: `${node.label}`,
    };
}
