import { TrrackAction } from './types';

export class ActionUtils {
    private constructor() {
        throw new Error(
            'Do not create instance of ActionUtils. Use the static methods.'
        );
    }

    static createTrrackAction({
        doName,
        doArgs = [],
        undoName = doName,
        undoArgs = doArgs,
    }: {
        doName: string;
        doArgs?: any[];
        undoName?: string;
        undoArgs?: any[];
    }): TrrackAction {
        return {
            do: {
                name: doName,
                args: doArgs,
            },
            undo: {
                name: undoName,
                args: undoArgs,
            },
        };
    }
}
