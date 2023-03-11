import { configureTrrackableStore } from '../../src';
import { Counter } from '../slices/counter';
import { Post } from '../slices/posts';
import { User } from '../slices/users';

export const trrackableStore = () =>
    configureTrrackableStore({
        reducer: {
            users: User.trrackableSlice.reducer,
            posts: Post.slice.reducer,
            counter: Counter.slice.reducer,
        },
        sliceMap: {
            users: User.trrackableSlice,
            posts: Post.slice,
            counter: Counter.slice,
        },
    });
