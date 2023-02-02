import { initializeTrrack, Registry } from '@trrack/core';
import {
  Column,
  EngineRenderer,
  ISortCriteria,
  LineUp,
  Ranking,
} from 'lineupjs';

// * To Track:
// * https://github.com/datavisyn/tdp_core/blob/49700025e732529bd2592e8371c29d2f1bdf51ee/src/lineup/internal/cmds.ts
/**
 * CMD_SET_SORTING_CRITERIA = 'lineupSetRankingSortCriteria', - done
 * CMD_SET_GROUP_CRITERIA = 'lineupSetGroupCriteria', - done
 * CMD_SET_COLUMN = 'lineupSetColumn', - working
 * CMD_ADD_COLUMN = 'lineupAddColumn', - working
 * CMD_MOVE_COLUMN = 'lineupMoveColumn', - working
 * CMD_SET_AGGREGATION = 'lineupSetAggregation', - TODO
 * https://github.com/datavisyn/tdp_core/blob/93527f782845514b934e12b7b5f713b3cd5d930e/src/lineup/internal/cmds.ts#L891-L954
 */

/**
 * Tracking selections too
 */

// ! Add trrack suffix to all events

function trrackedEvent(event: string) {
  return `${event}.trrack`;
}

type Trrack = ReturnType<typeof initializeTrrack>;

function initDialogTracker() {
  let isOpen = false;

  return {
    isOpen,
    setOpen() {
      isOpen = true;
    },
    setClose() {
      isOpen = false;
    },
  };
}

type DialogTracker = ReturnType<typeof initDialogTracker>;

function dirtyRankingWaiter(ranking: Ranking) {
  const trrackDirtyOrder = `${Ranking.EVENT_DIRTY_ORDER}.trrack`;
  const trrackOrderChange = `${Ranking.EVENT_ORDER_CHANGED}.trrack`;

  return new Promise((res) => {
    ranking.on(trrackDirtyOrder, (a) => {
      ranking.on(trrackDirtyOrder, null);

      ranking.on(trrackOrderChange, () => {
        ranking.on(trrackOrderChange, null);
        res(null);
      });
    });
  });
}

// ? Look at filter events in setColumn
// ? https://github.com/datavisyn/tdp_core/blob/93527f782845514b934e12b7b5f713b3cd5d930e/src/lineup/internal/cmds.ts#L442

function trrackSortLike<T = any>(
  eventType: string,
  id: string,
  ranking: Ranking,
  handler: (previous: T, current: T) => void,
  executor: (arg: T) => void,
  registry: Registry<any>
) {
  const suffixedEventType = `${eventType}.trrack`;

  ranking.on(suffixedEventType, handler);

  registry.register(id, (args: T) => {
    ranking.on(suffixedEventType, null);
    executor(args);
    ranking.on(suffixedEventType, handler);
    return dirtyRankingWaiter(ranking);
  });
}

function trrackColumnEvents(
  lineupId: string,
  lineup: LineUp,
  ranking: Ranking,
  trrack: Trrack,
  registry: Registry<any>
) {
  // TODO: Add column events
}

function trrackRanking(
  lineupId: string,
  lineupInstance: LineUp,
  ranking: Ranking,
  trrack: Trrack,
  registry: Registry<any>
) {
  // Sort
  const sortEvent = `${lineupId}-${ranking.id}-${Ranking.EVENT_SORT_CRITERIA_CHANGED}`;
  trrackSortLike(
    Ranking.EVENT_SORT_CRITERIA_CHANGED,
    sortEvent,
    ranking,
    (
      p: ISortCriteria | ISortCriteria[],
      c: ISortCriteria | ISortCriteria[]
    ) => {
      trrack.record({
        label: 'Sort',
        eventType: 'Sort',
        state: null,
        sideEffects: {
          do: [{ type: sortEvent, payload: c }],
          undo: [{ type: sortEvent, payload: p }],
        },
      });
    },
    (sortBy: ISortCriteria | ISortCriteria[]) =>
      ranking.setSortCriteria(sortBy),
    registry
  );

  const groupEvent = `${lineupId}-${ranking.id}-${Ranking.EVENT_GROUP_CRITERIA_CHANGED}`;
  trrackSortLike(
    Ranking.EVENT_GROUP_CRITERIA_CHANGED,
    groupEvent,
    ranking,
    (p: Column[], c: Column[]) => {
      trrack.record({
        label: 'Group',
        eventType: 'Group',
        state: null,
        sideEffects: {
          do: [{ type: groupEvent, payload: c }],
          undo: [{ type: groupEvent, payload: p }],
        },
      });
    },
    (col: Column[]) => {
      console.log(col);
      ranking.setGroupCriteria(col);
    },
    registry
  );

  trrackColumnEvents(lineupId, lineupInstance, ranking, trrack, registry);
}

function trrackLineUp(
  id: string,
  instance: LineUp,
  trrack: Trrack,
  registry: Registry<any>
) {
  instance.data
    .getRankings()
    .forEach((r) => trrackRanking(id, instance, r, trrack, registry));

  let previousSelection: number[] = [];

  const instanceSelectionId = `${id}-${LineUp.EVENT_SELECTION_CHANGED}`;
  const suffixedSelectionEvent = `${LineUp.EVENT_SELECTION_CHANGED}.trrack`;

  const selectionEventHandler = (selection: number[]) => {
    trrack.record({
      label: 'Sort',
      eventType: 'Sort',
      state: null,
      sideEffects: {
        do: [{ type: instanceSelectionId, payload: selection }],
        undo: [{ type: instanceSelectionId, payload: previousSelection }],
      },
    });

    previousSelection = selection;
  };

  instance.on(LineUp.EVENT_SELECTION_CHANGED, selectionEventHandler);

  registry.register(instanceSelectionId, (selections: number[]) => {
    instance.on(suffixedSelectionEvent, null);
    instance.setSelection(selections);
    instance.on(suffixedSelectionEvent, selectionEventHandler);
  });
}

export function initLineupManager(trrack: Trrack, registry: Registry<any>) {
  const instances: Map<string, LineUp> = new Map();

  return {
    add(id: string, instance: LineUp) {
      trrackLineUp(id, instance, trrack, registry);
      instances.set(id, instance);
    },
    print() {
      instances.forEach((a, i) => console.log({ i, a }));
    },
  };
}

function setupBuffer(instance: LineUp) {
  const dialog: DialogTracker = initDialogTracker();

  const initialStates = new Map<string, string>();
  const bufferedActions = new Map<string, any>();

  function clearBuffer() {
    initialStates.clear();
    bufferedActions.clear();
  }

  instance.on(`${EngineRenderer.EVENT_DIALOG_OPENED}.trrack`, () => {
    dialog.setOpen();
    clearBuffer();
  });

  // ! https://github.com/datavisyn/tdp_core/blob/93527f782845514b934e12b7b5f713b3cd5d930e/src/lineup/internal/cmds.ts#L862
  // ! Bug in clue wrapper
  // ! Filed the issue. Stopping the buffer for now.
  instance.on(
    `${EngineRenderer.EVENT_DIALOG_CLOSED}.trrack`,
    (_, dialogAction: 'cancel' | 'confirm') => {
      console.log('Dialog closed with:', dialogAction);
    }
  );

  clearBuffer();
  dialog.setClose();

  // ? Add event to close dialog when running provenance actions
  // ? Same for execution

  return {
    clearBuffer,
    addToBuffer() {
      // TODO: Add to buffer
    },
    isDialogOpen: () => dialog.isOpen,
  };
}
