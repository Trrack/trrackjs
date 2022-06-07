import { Action, ActionRegistry } from '../action';
import { ActionNode, ProvenanceGraph } from '../graph';
import { RootNode } from '../graph/nodes/rootnode';
import { INode } from '../graph/nodes/types';
import { getPathToNode, isNextNodeUp } from '../graph/traversal';

type RegistryType<R> = R extends ActionRegistry<infer T> ? T : never;

export class Trrack<T extends ActionRegistry<any>> {
  private registry: T;
  private graph: ProvenanceGraph;

  constructor(registry: T) {
    this.registry = registry;
    this.graph = ProvenanceGraph.setup();
  }

  static initialize<T extends ActionRegistry<any>>(reg: T) {
    return new Trrack(reg);
  }

  get current() {
    return this.graph.current;
  }

  get root() {
    return this.graph.root;
  }

  get tree() {
    return getTreeFromNode(this.root);
  }

  apply<
    R extends RegistryType<T>,
    K extends keyof R,
    D extends Parameters<R[K]['apply']>,
    U extends Parameters<R[K]['inverse']>
  >(action: Action<K, D, U>, skip = false) {
    // Execute the action first.
    const results = skip
      ? null
      : this.registry.get(action.name).apply(action.doArgs);
    const newNode = new ActionNode(this.current, action, results);
    this.graph.addNode(newNode);

    return newNode;
  }

  to(node: string | INode) {
    const target =
      typeof node === 'string' ? this.graph.getNodeById(node) : node;

    const path = getPathToNode(this.current, target);

    const actionsToExecute: {
      action: Action<any, any, any>;
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

        if (!action) {
          throw new Error('Something went wrong in traversal');
        }

        actionsToExecute.push({
          direction: 'up',
          action,
        });
      } else {
        const action = ActionNode.isActionNode(nextNode)
          ? nextNode.action
          : null;

        if (!action) {
          throw new Error('Something went wrong in traversal');
        }

        actionsToExecute.push({
          direction: 'down',
          action,
        });
      }
    }

    actionsToExecute.forEach(({ action, direction }) => {
      const actionFunction = this.registry.get(action.name);
      direction === 'up'
        ? actionFunction.inverse(action.undoArgs)
        : actionFunction.apply(action.doArgs);
    });

    this.graph.current = target;
  }

  undo() {
    if (
      RootNode.isNonRootNode(this.current) &&
      this.current.id === this.root.id
    )
      console.warn('Already at root');
    if (RootNode.isNonRootNode(this.current)) this.to(this.current.parent);
  }

  redo() {
    if (this.current.children.length > 0) this.to(this.current.children[0]);
    else console.warn('Already at latest');
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
