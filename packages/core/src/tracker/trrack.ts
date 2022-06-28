import { ActionFunctionMap, IActionRegistry, TrrackAction } from '../action';
import { ActionNode, getPathToNode, isNextNodeUp, ProvenanceGraph } from '../graph';
import { INode } from '../graph/nodes/types';
import { IProvenanceGraph } from '../graph/types';
import { ApplyActionParams } from './types';

export class Trrack<
    T extends IActionRegistry<ActionFunctionMap>,
    R extends Exclude<keyof T['registry'], `${string}_undo`> = Exclude<
        keyof T['registry'],
        `${string}_undo`
    >
> {
    private registry: T;
    private graph: IProvenanceGraph;
    private constructor(reg: T) {
        this.registry = reg;
        this.graph = ProvenanceGraph.setup();
    }

    static setup<T extends IActionRegistry<ActionFunctionMap>>(reg: T) {
        return new Trrack(reg);
    }

    apply<K extends R, Args extends Parameters<T['registry'][K]>>(
        opts: ApplyActionParams<K, Args>
    ) {
        const action = this.registry.get(opts.action as string);
        const results = action(...(opts.args as any));

        const newActionNode = ActionNode.create({
            parent: this.graph.current,
            action: {
                label: opts.label,
                do: {
                    name: opts.action as string,
                    args: opts.args,
                },
                undo: {
                    name: results.inverse.f_id,
                    args: results.inverse.parameters,
                },
            },
        });

        this.graph.addNode(newActionNode);

        return results;
    }

    updateRegistry<K extends T>(registry: K) {
        this.registry = registry;
    }

    to(target: INode, source: 'undo' | 'redo' | 'to') {
        if (this.graph.current === target) return;

        const path = getPathToNode(this.graph.current, target);

        const actionsToExecute: {
            action: TrrackAction<any, any, any, any>;
            direction: 'up' | 'down';
        }[] = [];

        for (let i = 0; i < path.length - 1; ++i) {
            const currentNode = path[i];
            const nextNode = path[i + 1];

            const isGoingUp = isNextNodeUp(currentNode, nextNode);
            if (isGoingUp) {
                const action = ActionNode.isActionNode(currentNode)
                    ? currentNode.action
                    : null;

                if (!action) throw new Error('Something went wrong');

                actionsToExecute.push({ action, direction: 'up' });
            } else {
                const action = ActionNode.isActionNode(nextNode)
                    ? nextNode.action
                    : null;

                if (!action) throw new Error('Something went wrong');

                actionsToExecute.push({ action, direction: 'down' });
            }
        }

        actionsToExecute.forEach(({ action, direction }) => {
            const actionName =
                direction === 'up' ? action.undo.name : action.do.name;
            const actionArgs =
                direction === 'up' ? action.undo.args : action.do.args;
            const actionFn = this.registry.get(actionName);

            actionFn(...actionArgs);
        });

        this.graph.moveCurrent(target, source);
    }

    undo() {
        if (this.graph.current.parent)
            this.to(this.graph.current.parent, 'undo');
    }
}

type TreeNode = Omit<INode, 'children' | 'name'> & {
    name: string;
    children: TreeNode[];
};

function getTreeFromNode(node: INode): TreeNode {
    return {
        ...node,
        children: node.children.map((n) => getTreeFromNode(n)),
        name: `${node.label}`,
    };
}
