import { Action } from '../../action/types';
import { ASerializable } from '../../utils/serializable';
import { getUUID } from '../../utils/uuid-generator';

type NodeType = 'RootNode' | 'ActionNode' | 'StateNode';

export interface INode {
  id: string;
  type: NodeType;
  children: INode[];
  createdOn: number;
  level: number;
  label: string;
  toJSON(): any;
}

export interface IRootNode extends INode {
  type: 'RootNode';
  label: 'Root';
}

export interface INonRootNode extends INode {
  type: NodeType;
  parent: INode;
  label: string;
}

export interface IActionNode<K, D extends unknown[], U extends unknown[], R>
  extends INonRootNode {
  type: 'ActionNode';
  action: Action<K, D, U>;
  results?: R;
}

export abstract class ANode extends ASerializable implements INode {
  id: string;
  children: INode[];
  createdOn: number;
  abstract label: string;
  abstract type: NodeType;
  abstract level: number;

  constructor() {
    super();
    this.id = getUUID();
    this.children = [];
    this.createdOn = Date.now();
  }

  toJSON() {
    return {
      id: this.id,
      children: this.children.map((n) => n.id),
      createdOn: this.createdOn,
      label: this.label,
      type: this.type,
      level: this.level,
    };
  }
}

export abstract class ARootNode extends ANode implements IRootNode {
  type: 'RootNode' = 'RootNode';
  level: number;
  label: 'Root' = 'Root';
  constructor() {
    super();
    this.level = 0;
  }
}

export abstract class ANonRootNode extends ANode implements INonRootNode {
  parent: INode;
  label: string;
  constructor(parent: INode, label: string) {
    super();
    this.parent = parent;
    this.parent.children.push(this);
    this.label = label;
  }

  get level() {
    return this.parent.level + 1;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      parent: this.parent.id,
    };
  }
}
