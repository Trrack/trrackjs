import { initializeTrrack, Registry } from '@trrack/core';
import { buildCategoricalColumn, builder as bld, buildNumberColumn, buildStringColumn } from 'lineupjs';

import { initLineupManager } from './lineup-manager';

const arr: any[] = [];
const cats = ['c1', 'c2', 'c3'];
for (let i = 0; i < 10000; ++i) {
  arr.push({
    a: Math.random() * 10,
    d: 'Row ' + i,
    cat: cats[Math.floor(Math.random() * 3)],
    cat2: cats[Math.floor(Math.random() * 3)],
  });
}

export function setup(node: HTMLElement[]) {
  const builder1 = bld(arr);

  builder1
    .column(buildStringColumn('d'))
    .column(buildCategoricalColumn('cat', cats))
    .column(buildCategoricalColumn('cat2', cats))
    .column(buildNumberColumn('a'));

  const builder2 = bld(arr);

  builder2
    .column(buildStringColumn('d'))
    .column(buildCategoricalColumn('cat', cats))
    .column(buildCategoricalColumn('cat2', cats))
    .column(buildNumberColumn('a'));

  const registry = Registry.create();
  const trrack = initializeTrrack({
    registry,
    initialState: null,
  });

  const manager = initLineupManager(trrack, registry);

  manager.add('first', builder1.build(node[0]));
  manager.add('second', builder2.build(node[1]));

  console.log(trrack.registry);

  document.querySelector<HTMLButtonElement>('#undo').onclick = (e) => {
    trrack.undo();
  };

  document.querySelector<HTMLButtonElement>('#redo').onclick = (e) => {
    trrack.redo();
  };

  document.querySelector<HTMLButtonElement>('#log').onclick = (e) => {
    console.table((trrack as any).graph.nodes);
  };
}
