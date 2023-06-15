import { configureTrrackableStore } from '../../src';
import { Counter } from '../slices/counter';
import { Post } from '../slices/posts';
import { User } from '../slices/users';

export const trrackableStore = configureTrrackableStore({
    sliceMap: {
        users: User.trrackableSlice,
        posts: Post.trrackableSlice,
        counter: Counter.trrackableSlice,
    },
});
