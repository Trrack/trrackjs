import { buildCategoricalColumn, builder as bld, buildNumberColumn, buildStringColumn, Ranking } from 'lineupjs';

import { LineupManager } from './lineup-manager';

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

  const lineup = new LineupManager(builder, node);
  lineup.trrackLineUpEvent(Ranking.EVENT_SORT_CRITERIA_CHANGED);

  document.querySelector<HTMLButtonElement>('#undo').onclick = (e) => {
    lineup.trrack.undo();
  };

  document.querySelector<HTMLButtonElement>('#redo').onclick = (e) => {
    lineup.trrack.redo();
  };

  document.querySelector<HTMLButtonElement>('#log').onclick = (e) => {
    console.table(lineup.trrack.graph.nodes);
  };
}
