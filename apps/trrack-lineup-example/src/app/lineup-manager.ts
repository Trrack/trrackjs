import { IActionRegistry, Trrack } from '@trrack/core';
import LineUp, { Ranking } from 'lineupjs';

export class LineUpManager {
  static setup(opts?: {
    initialInstance: {
      id: string;
      instance: LineUp;
    };
  }) {
    return new LineUpManager(opts?.initialInstance);
  }

  instances: Map<string, LineUpInstance> = new Map();

  private constructor(initial?: { id: string; instance: LineUp }) {
    if (initial) {
      const { id, instance } = initial;
      this.instances.set(id, LineUpInstance.create(id, instance));
    }
  }

  add(id: string, instance: LineUp) {
    if (this.instances.has(id))
      throw new Error('LineUp instance with this id already exists');

    this.instances.set(id, LineUpInstance.create(id, instance));
  }

  all(fn: (instance: LineUpInstance) => void) {
    Array.from(this.instances.values()).forEach((i) => {
      console.group(i.id);
      fn(i);
      console.groupEnd();
    });
  }
}

// ! Events for everything!
const events = [Ranking.EVENT_SORT_CRITERIA_CHANGED];

class LineUpRanking {
  static create(ranking: Ranking, lineup: LineUpInstance) {
    return new LineUpRanking(ranking, lineup);
  }

  static handleSort(trrack: Trrack<any>, eventId: string) {
    return (previous: any, current: any) => {
      trrack.apply({
        action: eventId,
        label: `Set Sort`,
        args: [current],
        undoArgs: [previous],
      });
    };
  }

  private constructor(
    public readonly ranking: Ranking,
    public readonly lineup: LineUpInstance
  ) {}

  register<T extends IActionRegistry<any>>(trrack: Trrack<T>) {
    const eventId = `${this.lineup.id}-${this.ranking.id}-${Ranking.EVENT_SORT_CRITERIA_CHANGED}`;
    this.ranking.on(
      `${this.lineup.id}-${this.ranking.id}-${Ranking.EVENT_SORT_CRITERIA_CHANGED}`,
      LineUpRanking.handleSort(trrack, eventId)
    );

    return trrack.register(eventId, (sortCriteria: any) => {
      this.ranking.on(Ranking.EVENT_SORT_CRITERIA_CHANGED, null);
      this.ranking.setSortCriteria(sortCriteria);
      this.ranking.on(
        Ranking.EVENT_SORT_CRITERIA_CHANGED,
        LineUpRanking.handleSort(trrack, eventId)
      );

      return {
        inverse: {
          f_id: eventId,
          parameters: [],
        },
      };
    });
  }

  get id() {
    return this.ranking.id;
  }
}

class LineUpInstance {
  static create(id: string, instance: LineUp) {
    return new LineUpInstance(id, instance);
  }

  private rankings: Map<string, LineUpRanking> = new Map();

  constructor(public readonly id: string, public readonly instance: LineUp) {
    this.dataProvider.getRankings().forEach((r) => {
      this.rankings.set(r.id, LineUpRanking.create(r, this));
    });
  }

  get dataProvider() {
    return this.instance.data;
  }

  register<T extends IActionRegistry<any>>(trrack: Trrack<T>) {
    this.rankings.forEach((ranking) => {
      trrack = ranking.register(trrack) as any;
    });

    return trrack;
  }

  print() {
    console.table(this.rankings);
  }
}

// export class _LineupManager<T extends IActionRegistry<any>> {
//   lineup: LineUp;

//   _trrack: Trrack<T>;
//   private registry: IActionRegistry<any>;
//   private addedEvents: string[] = [];

//   private shouldBufferActions = false;
//   private actionBuffer: any[] = [];

//   private handlers: Map<string, any> = new Map([
//     [
//       Ranking.EVENT_SORT_CRITERIA_CHANGED,
//       (prev, curr) => {
//         const trrackActionExecutor = () => {
//           this.trrack.apply(
//             {
//               action: Ranking.EVENT_SORT_CRITERIA_CHANGED,
//               label: 'Sort',
//               args: [curr],
//             },
//             true
//           );
//         };

//         if (this.shouldBufferActions) {
//           this.actionBuffer = [];
//           this.actionBuffer.push(trrackActionExecutor);
//         } else {
//           trrackActionExecutor();
//         }
//       },
//     ],
//   ]);

//   private executors: Map<string, any> = new Map([
//     [
//       Ranking.EVENT_SORT_CRITERIA_CHANGED,
//       (sortCriteria: any) => {
//         this.firstRanking.setSortCriteria(sortCriteria);
//       },
//     ],
//   ]);

//   constructor(public readonly builder: DataBuilder, node: HTMLElement) {
//     this.lineup = builder.build(node);
//     this.registry = ActionRegistry.init();

//     this.lineup.on('dialogOpened', () => {
//       this.shouldBufferActions = true;
//     });

//     this.lineup.on('dialogClosed', (_, action) => {
//       if (action === 'confirm' && this.actionBuffer.length > 0)
//         this.actionBuffer[this.actionBuffer.length - 1]();
//       this.shouldBufferActions = false;
//       this.actionBuffer = [];
//     });
//   }

//   get dataProvider() {
//     return this.lineup.data;
//   }

//   get rankings() {
//     return this.dataProvider.getRankings();
//   }

//   get firstRanking() {
//     return this.dataProvider.getFirstRanking();
//   }

//   trrackLineUpEvent(event: string) {
//     this.addedEvents.push(event);
//     this.updateTrrack();

//     this.addedEvents.forEach((event: string) => {
//       const evHandler = this.handlers.get(event);
//       this.firstRanking.on(event, evHandler);
//     });
//   }

//   updateTrrack() {
//     const afr: any = {};

//     this.addedEvents.forEach((event) => {
//       const eventHandler = this.handlers.get(event);
//       const execute = this.executors.get(event);

//       this.registry = this.registry
//         .register(event, (arg: any) => {
//           this.firstRanking.on(event, null);
//           execute(arg);
//           this.firstRanking.on(event, eventHandler);

//           return {
//             inverse: {
//               f_id: `${event}_undo`,
//               parameters: [],
//             },
//           };
//         })
//         .register(`${event}_undo`, (arg: any) => {
//           this.firstRanking.on(event, null);
//           execute(arg);
//           this.firstRanking.on(event, eventHandler);

//           return {
//             inverse: {
//               f_id: event,
//               parameters: [],
//             },
//           };
//         });
//     });

//     this.trrack.updateRegistry(this.registry);
//   }
// }
