import { ActionUtils, Trrack } from '@trrack/core';
import LineUp, { Ranking } from 'lineupjs';

class LU {
  constructor(
    public readonly id: string,
    public readonly instance: LineUp,
    private _trrack: Trrack
  ) {
    this.rankings.forEach((rank) => {
      // this._trrack = this.addRankingSortToTrrack(r);
      rank.on('groupCriteriaChanged', (a, b) => {
        console.log({ a, b });
      });

      this._trrack = this.addAnyEventToTrrack(
        rank,
        Ranking.EVENT_GROUP_CRITERIA_CHANGED,
        (r, s) => r.setGroupCriteria(s),
        () => 'Group'
      );

      this._trrack = this.addAnyEventToTrrack(
        rank,
        Ranking.EVENT_SORT_CRITERIA_CHANGED,
        (r, s) => r.setSortCriteria(s),
        () => 'sort'
      );
    });
  }

  get trrack() {
    return this._trrack;
  }

  get data() {
    return this.instance.data;
  }

  get rankings() {
    return this.instance.data.getRankings();
  }

  addAnyEventToTrrack(
    rank: Ranking,
    event: string,
    executor: (rank: Ranking, arg: any) => void,
    labelMaker: () => string
  ) {
    const rankingSpecificEventName = `${this.id}-${rank.id}-${event}`;

    const eventHandler = (previous: any, current: any) => {
      this.trrack.registerAction(
        labelMaker(),
        ActionUtils.createTrrackAction({
          doName: rankingSpecificEventName,
          doArgs: [current],
          undoArgs: [previous],
        })
      );
    };

    rank.on(event, eventHandler);

    return this._trrack.register(rankingSpecificEventName, (arg: any) => {
      rank.on(event, null);
      executor(rank, arg);
      rank.on(event, eventHandler);

      return {
        name: '',
        args: [],
      };
    });
  }
}

export class LUManager {
  static setup(trrack: Trrack) {
    return new LUManager(trrack);
  }

  instances: Map<string, LU> = new Map();

  private constructor(public _trrack: Trrack) {}

  get trrack() {
    return this._trrack;
  }

  addInstance(instance: LineUp, id = `Instance_${this.instances.size + 1}`) {
    if (this.instances.has(id)) throw new Error(`${id} already exists!`);
    const inst = new LU(id, instance, this._trrack);
    this.instances.set(id, inst);
    this._trrack = inst.trrack;

    return this.trrack;
  }

  all(cb: (instance: LU) => void) {
    this.instances.forEach((lineup) => {
      cb(lineup);
    });
  }
}
