import { Counter } from './slices/counter';
import { Post } from './slices/posts';
import { User } from './slices/users';
import { trrackableStore } from './store/fullyTrrackableStore';

describe('trracked slice', () => {
    const { store, trrack } = trrackableStore;
    const actions = {
        ...User.actions,
        ...Post.actions,
        ...Counter.actions,
    };

    const user1 = User.generate();
    const user2 = User.generate();
    const user3 = User.generate();

    const post1 = Post.generate(user1.id);
    const post2 = Post.generate(user1.id);
    const post3 = Post.generate(user2.id);
    const post4 = Post.generate(user2.id);
    const post5 = Post.generate(user3.id);

    it('should have all users added at correct position', () => {
        store.dispatch(actions.addUser(user1));
        store.dispatch(actions.addUser(user2));
        store.dispatch(actions.addUser(user3));

        expect(store.getState().users).toHaveLength(3);
        expect(store.getState().users[0]).toStrictEqual(user1);
        expect(store.getState().users[1]).toStrictEqual(user2);
        expect(store.getState().users[2]).toStrictEqual(user3);
    });

    it('undo should remove last added user', () => {
        trrack.undo();

        expect(store.getState().users).toHaveLength(2);
        expect(store.getState().users[0]).toStrictEqual(user1);
        expect(store.getState().users[1]).toStrictEqual(user2);
        expect(store.getState().users[2]).toBeUndefined();

        trrack.redo();
    });

    it('should have all posts added at correct position', () => {
        store.dispatch(actions.postAdded(post1));
        store.dispatch(actions.postAdded(post2));
        store.dispatch(actions.postAdded(post3));
        store.dispatch(actions.postAdded(post4));
        store.dispatch(actions.postAdded(post5));

        expect(store.getState().posts).toHaveLength(5);
        expect(store.getState().posts[0].content).toEqual(post1.content);
        expect(store.getState().posts[1].content).toEqual(post2.content);
        expect(store.getState().posts[2].content).toEqual(post3.content);
        expect(store.getState().posts[3].content).toEqual(post4.content);
        expect(store.getState().posts[4].content).toEqual(post5.content);
    });

    it('undo should remove last added post', () => {
        trrack.undo();

        expect(store.getState().posts).toHaveLength(4);
        expect(store.getState().posts[0].content).toEqual(post1.content);
        expect(store.getState().posts[1].content).toEqual(post2.content);
        expect(store.getState().posts[2].content).toEqual(post3.content);
        expect(store.getState().posts[3].content).toEqual(post4.content);
        expect(store.getState().posts[4]).toBeUndefined();

        trrack.redo();
    });

    it('undo should remove last added post', () => {
        trrack.undo();

        expect(store.getState().posts).toHaveLength(4);
        expect(store.getState().posts[0].content).toEqual(post1.content);
        expect(store.getState().posts[1].content).toEqual(post2.content);
        expect(store.getState().posts[2].content).toEqual(post3.content);
        expect(store.getState().posts[3].content).toEqual(post4.content);
        expect(store.getState().posts[4]).toBeUndefined();

        trrack.redo();
    });
});
