import { Trrack } from '@trrack/core';
import { buildCategoricalColumn, builder as bld, buildNumberColumn, buildStringColumn } from 'lineupjs';

import { LUManager } from './lineup-manager';

const arr: any[] = [];
const cats = ['c1', 'c2', 'c3'];
for (let i = 0; i < 100; ++i) {
  arr.push({
    a: Math.random() * 10,
    d: 'Row ' + i,
    cat: cats[Math.floor(Math.random() * 3)],
    cat2: cats[Math.floor(Math.random() * 3)],
  });
}

export function setup(node: HTMLElement) {
  const builder = bld(arr);

  builder
    .column(buildStringColumn('d'))
    .column(buildCategoricalColumn('cat', cats))
    .column(buildCategoricalColumn('cat2', cats))
    .column(buildNumberColumn('a'));

  let trrack = Trrack.init();

  const manager = LUManager.setup(trrack);

  trrack = manager.addInstance(builder.build(node));

  console.log((trrack as any).registry);

  // lineup.trrackLineUpEvent(Ranking.EVENT_SORT_CRITERIA_CHANGED);

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
