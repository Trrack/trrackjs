import { ActionId } from '../ids/types';
import { ActionRegistry, AddActionOptions } from './types';

export function createActionRegistry(): ActionRegistry {
  const __record: Map<ActionId, AddActionOptions> = new Map();

  return {
    listActions(): string[] {
      return [...__record.keys()];
    },
    has(id: ActionId) {
      return __record.has(id);
    },
    addAction(opts: AddActionOptions): ActionRegistry {
      if (__record.has(opts.id)) {
        throw new Error(`Action ${opts.id} already exists`);
      }

      __record.set(opts.id, opts);

      return this;
    },
    execute(id: string, ...args: unknown[]): void {
      const actionEntry = __record.get(id);

      if (!actionEntry) {
        throw new Error(`Action ${id} does not exist`);
      }

      const { fn } = actionEntry;
      fn(...args);
    },
  };
}
