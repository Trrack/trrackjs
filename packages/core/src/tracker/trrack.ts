import { ActionFunctionMap, GenericArgs, IActionRegistry } from '../action';
import { ActionNode, ProvenanceGraph } from '../graph';
import { INode } from '../graph/nodes/types';
import { IProvenanceGraph } from '../graph/types';
import { ApplyActionParams } from './types';

export class Trrack<
    T extends IActionRegistry<ActionFunctionMap>,
    R extends Exclude<keyof T['registry'], `${string}_undo`>
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

    apply<K extends R, Args extends GenericArgs = Parameters<T['registry'][K]>>(
        opts: ApplyActionParams<K, Args>
    ) {
        const action = this.registry.get(opts.action as string);
        const results = action(...opts.args);

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
