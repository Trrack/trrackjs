import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { randomUUID } from 'crypto';
import { createTrrackableSlice } from '../../src';
import { SliceWrapper } from './utils';

export type SinglePost = {
    id: string;
    title: string;
    content: string;
    user: string;
};

export type Posts = SinglePost[];

const initialState: Posts = [];

const postsSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action: PayloadAction<SinglePost>) {
                state.push(action.payload);
            },
            prepare(args: { title: string; content: string; user: string }) {
                const { title, content, user } = args;
                return {
                    payload: {
                        id: randomUUID(),
                        title,
                        content,
                        user,
                    },
                };
            },
        },
        postUpdated(state, action: PayloadAction<SinglePost>) {
            const { id, title, content } = action.payload;
            const existingPost = state.find((post) => post.id === id);
            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
    },
});

const trrackablePostsSlice = createTrrackableSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action: PayloadAction<SinglePost>) {
                state.push(action.payload);
            },
            prepare(args: { title: string; content: string; user: string }) {
                const { title, content, user } = args;
                return {
                    payload: {
                        id: randomUUID(),
                        title,
                        content,
                        user,
                    },
                };
            },
        },
        postUpdated(state, action: PayloadAction<SinglePost>) {
            const { id, title, content } = action.payload;
            const existingPost = state.find((post) => post.id === id);
            if (existingPost) {
                existingPost.title = title;
                existingPost.content = content;
            }
        },
    },
});

export const Post: SliceWrapper<
    typeof postsSlice,
    typeof trrackablePostsSlice,
    Omit<SinglePost, 'id'>
> = {
    slice: postsSlice,
    trrackableSlice: trrackablePostsSlice,
    generate(args: string) {
        return {
            title: `Post ${Math.floor(Math.random() * 1000)}`,
            content: `Content ${Math.floor(Math.random() * 10000)}`,
            user: args,
        };
    },
    actions: trrackablePostsSlice.actions,
};
