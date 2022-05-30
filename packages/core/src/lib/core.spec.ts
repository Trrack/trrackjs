import { ActionRegistry } from '../';
import { RegistryEntry } from '../action';
import { Trrack } from '../tracker';

describe('Graph Traverser', () => {
  it('should be true', () => {
    const actionRegistry = ActionRegistry.create({
      increment: RegistryEntry.create({
        action(count: number) {
          return count + 1;
        },
        inverse(count: number) {
          return count - 1;
        },
      }),
    });

    const trrack = Trrack.initialize(actionRegistry);

    trrack.apply({
      name: 'increment',
      label: 'Increase by one',
      doArgs: [1],
      undoArgs: [2],
    });

    trrack.apply({
      name: 'increment',
      label: 'Increase by one',
      doArgs: [1],
      undoArgs: [2],
    });

    trrack.apply({
      name: 'increment',
      label: 'Increase by one',
      doArgs: [1],
      undoArgs: [2],
    });

    console.log(trrack.getSerializedGraph());

    trrack.to(trrack.root);

    console.log(trrack.getSerializedGraph());

    expect(actionRegistry).toBeTruthy();
  });
});
