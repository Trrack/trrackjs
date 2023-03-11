import { Counter } from './slices/counter';
import { Post } from './slices/posts';
import { User } from './slices/users';
import { trrackableStore } from './store/partiallyTrrackableStore';

describe('untrracked slice', () => {
    const { store, trrack } = trrackableStore();
    const actions = {
        ...User.actions,
        ...Post.actions,
        ...Counter.actions,
    };

    const user1 = User.generate();
    const user2 = User.generate();
    const user3 = User.generate();

    it('should have all users added at correct position', () => {
        store.dispatch(actions.addUser(user1));
        store.dispatch(actions.addUser(user2));
        store.dispatch(actions.addUser(user3));

        expect(trrack.getState().users).toHaveLength(3);
        expect(trrack.getState().users[0]).toStrictEqual(user1);
        expect(trrack.getState().users[1]).toStrictEqual(user2);
        expect(trrack.getState().users[2]).toStrictEqual(user3);
    });

    it('undo should remove last added user', () => {
        trrack.undo();

        expect(trrack.getState().users).toHaveLength(2);
        expect(trrack.getState().users[0]).toStrictEqual(user1);
        expect(trrack.getState().users[1]).toStrictEqual(user2);
        expect(trrack.getState().users[2]).toBeUndefined();

        trrack.redo();
    });

    // it('should not have posts key', () => {
    //     expect(trrack.getState().posts).toBeUndefined();
    // });

    // it('should increment counter by 1', () => {
    //     store.dispatch(actions.increment());

    //     expect(trrack.getState().counter).toBeUndefined();
    // });
});
