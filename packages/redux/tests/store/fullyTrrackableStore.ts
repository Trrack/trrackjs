import { configureTrrackableStore } from '../../src';
import { Counter } from '../slices/counter';
import { Post } from '../slices/posts';
import { User } from '../slices/users';

export const trrackableStore = configureTrrackableStore({
    reducer: {
        users: User.trrackableSlice.reducer,
        posts: Post.trrackableSlice.reducer,
        counter: Counter.trrackableSlice.reducer,
    },
    sliceMap: {
        users: User.trrackableSlice,
        posts: Post.trrackableSlice,
        counter: Counter.trrackableSlice,
    },
});
