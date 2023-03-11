import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { Posts } from '../slices/posts';
import { Users } from '../slices/users';

export const BASE_URL = 'https://trrack-test.dev';

const users: Users = [
    {
        id: '1',
        name: 'Leanne Graham',
    },
    {
        id: '2',
        name: 'Ervin Howell',
    },
    {
        id: '3',
        name: 'Clementine Bauch',
    },
];

const posts: Posts = [
    {
        user: '1',
        id: '1',
        title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        content:
            'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    },
    {
        user: '1',
        id: '2',
        title: 'qui est esse',
        content:
            'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
    },
    {
        user: '2',
        id: '3',
        title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
        content:
            'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
    },
    {
        user: '3',
        id: '4',
        title: 'eum et est occaecati',
        content:
            'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit',
    },
    {
        user: '3',
        id: '5',
        title: 'nesciunt quas odio',
        content:
            'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque',
    },
];

export const restHandlers = [
    rest.get(`${BASE_URL}/posts`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(posts));
    }),
    rest.get(`${BASE_URL}/users`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(users));
    }),
];

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
