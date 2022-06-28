import { ActionRegistry, IActionRegistry, Trrack } from '@trrack/core';
import LineUp, { DataBuilder, Ranking } from 'lineupjs';

export class LineupManager {
  lineup: LineUp;
  _trrack: Trrack<any, any> = Trrack.setup({} as any);
  private registry: IActionRegistry<any>;
  private addedEvents: string[] = [];

  private shouldBufferActions = false;
  private actionBuffer: any[] = [];

  private handlers: Map<string, any> = new Map([
    [
      Ranking.EVENT_SORT_CRITERIA_CHANGED,
      (prev, curr) => {
        const trrackActionExecutor = () => {
          this.trrack.apply(
            {
              action: Ranking.EVENT_SORT_CRITERIA_CHANGED,
              label: 'Sort',
              args: [curr],
            },
            true
          );
        };

        if (this.shouldBufferActions) {
          this.actionBuffer = [];
          this.actionBuffer.push(trrackActionExecutor);
        } else {
          trrackActionExecutor();
        }
      },
    ],
  ]);

  private executors: Map<string, any> = new Map([
    [
      Ranking.EVENT_SORT_CRITERIA_CHANGED,
      (sortCriteria: any) => {
        this.firstRanking.setSortCriteria(sortCriteria);
      },
    ],
  ]);

  constructor(public readonly builder: DataBuilder, node: HTMLElement) {
    this.lineup = builder.build(node);
    this.registry = ActionRegistry.init();

    this.lineup.on('dialogOpened', () => {
      this.shouldBufferActions = true;
    });

    this.lineup.on('dialogClosed', (_, action) => {
      if (action === 'confirm' && this.actionBuffer.length > 0)
        this.actionBuffer[this.actionBuffer.length - 1]();
      this.shouldBufferActions = false;
      this.actionBuffer = [];
    });
  }

  get trrack() {
    return this._trrack;
  }

  set trrack(t: any) {
    this._trrack = t;
  }

  get dataProvider() {
    return this.lineup.data;
  }

  get rankings() {
    return this.dataProvider.getRankings();
  }

  get firstRanking() {
    return this.dataProvider.getFirstRanking();
  }

  trrackLineUpEvent(event: string) {
    this.addedEvents.push(event);
    this.updateTrrack();

    this.addedEvents.forEach((event: string) => {
      const evHandler = this.handlers.get(event);
      this.firstRanking.on(event, evHandler);
    });
  }

  updateTrrack() {
    const afr: any = {};

    this.addedEvents.forEach((event) => {
      const eventHandler = this.handlers.get(event);
      const execute = this.executors.get(event);

      this.registry = this.registry
        .register(event, (arg: any) => {
          this.firstRanking.on(event, null);
          execute(arg);
          this.firstRanking.on(event, eventHandler);

          return {
            inverse: {
              f_id: `${event}_undo`,
              parameters: [],
            },
          };
        })
        .register(`${event}_undo`, (arg: any) => {
          this.firstRanking.on(event, null);
          execute(arg);
          this.firstRanking.on(event, eventHandler);

          return {
            inverse: {
              f_id: event,
              parameters: [],
            },
          };
        });
    });

    this.trrack.updateRegistry(this.registry);
  }
}
