import { initializeTrrack } from '../src/provenance/trrack';
import { Registry } from '../src/registry';
function setup() {
    const registry = Registry.create();

    const add = registry.register('add', (state, amt) => {
        state.counter += amt;
    });

    const sub = registry.register('sub', (state, amt) => {
        state.counter -= amt;
    });

    const trrack = initializeTrrack({
        registry,
        initialState: {
            counter: 0,
        },
    });

    return { trrack, add, sub };
}

describe('Artifacts', () => {
    it('artifacts should be undefined if not set', () => {
        const { trrack } = setup();

        expect(trrack.artifact.latest()).toBeUndefined();
    });

    it('should be able to create an artifact on root', () => {
        const { trrack } = setup();

        const artifact = {
            file: 'url-to-file',
        };

        trrack.artifact.add(artifact);
        expect(trrack.artifact.latest()?.val).toStrictEqual(artifact);
    });

    it('should be able to add artifacts on node', () => {
        const { trrack, add } = setup();

        trrack.apply('add', add(3));

        const artifact = {
            file: 'url-to-file',
        };

        trrack.artifact.add(artifact);
        expect(trrack.artifact.latest()?.val).toStrictEqual(artifact);
        expect(
            trrack.artifact.latest((trrack.current as any).parent)?.val
        ).toBeUndefined();
    });

    it('should be able to add and get multiple artifacts', () => {
        const { trrack, add } = setup();

        trrack.apply('add', add(3));

        const artifact1 = {
            file: 'url-to-file',
        };

        const artifact2 = {
            file: 'url-to-file2',
        };

        trrack.artifact.add(artifact1);
        trrack.artifact.add(artifact2);

        expect(trrack.artifact.all()?.length).toBe(2);
        expect(trrack.artifact.all()?.map((a) => a.val)).toContain(artifact1);
        expect(trrack.artifact.all()?.map((a) => a.val)).toContain(artifact2);
    });
});

describe('Metadata', () => {
    const METADATA_TYPE_1 = 'test';
    const METADATA_TYPE_2 = 'test2';

    it('metadata of a type should be undefined if not set', () => {
        const { trrack } = setup();

        expect(trrack.metadata.latestOfType(METADATA_TYPE_1)).toBeUndefined();
    });

    it('should be able to create metadata on root', () => {
        const { trrack } = setup();

        const metadata = {
            [METADATA_TYPE_1]: Date.now(),
        };

        trrack.metadata.add(metadata);
        expect(
            trrack.metadata.latestOfType(METADATA_TYPE_1)?.val
        ).toStrictEqual(metadata[METADATA_TYPE_1]);
    });

    it('should be able to add metadata on node', () => {
        const { trrack, add } = setup();

        trrack.apply('add', add(3));

        const metadata = {
            [METADATA_TYPE_1]: Date.now(),
        };

        trrack.metadata.add(metadata);
        expect(
            trrack.metadata.latestOfType(METADATA_TYPE_1)?.val
        ).toStrictEqual(metadata[METADATA_TYPE_1]);
        expect(
            trrack.metadata.latestOfType(
                METADATA_TYPE_1,
                (trrack.current as any).parent
            )?.val
        ).toBeUndefined();
    });

    it('should be able to add and get multiple types and counts of metadatas', () => {
        const { trrack, add } = setup();

        trrack.apply('add', add(3));

        const metadata1 = {
            [METADATA_TYPE_1]: Date.now() + METADATA_TYPE_1,
            [METADATA_TYPE_2]: Date.now() + METADATA_TYPE_2,
        };

        const metadata2 = {
            [METADATA_TYPE_1]: Date.now() + METADATA_TYPE_1 + 1,
        };

        trrack.metadata.add(metadata1);
        expect(trrack.metadata.latestOfType(METADATA_TYPE_1)?.val).toContain(
            metadata1[METADATA_TYPE_1]
        );
        expect(trrack.metadata.latestOfType(METADATA_TYPE_2)?.val).toContain(
            metadata1[METADATA_TYPE_2]
        );

        trrack.metadata.add(metadata2);

        expect(trrack.metadata.allOfType(METADATA_TYPE_1)?.length).toBe(2);
        expect(trrack.metadata.latestOfType(METADATA_TYPE_1)?.val).toContain(
            metadata2[METADATA_TYPE_1]
        );
        expect(trrack.metadata.latestOfType(METADATA_TYPE_2)?.val).toContain(
            metadata1[METADATA_TYPE_2]
        );
    });
});

describe('Annotations', () => {
    it('annotations should be undefined if not set', () => {
        const { trrack } = setup();

        expect(trrack.annotations.latest()).toBeUndefined();
    });

    it('should be able to create annotation on root', () => {
        const { trrack } = setup();

        const ann = Date.now().toString();

        trrack.annotations.add(ann);
        expect(trrack.annotations.latest()).toStrictEqual(ann);
    });

    it('should be able to add annotation on node', () => {
        const { trrack, add } = setup();

        trrack.apply('add', add(3));

        const ann = Date.now().toString();

        trrack.annotations.add(ann);
        expect(trrack.annotations.latest()).toStrictEqual(ann);

        expect(
            trrack.annotations.latest((trrack.current as any).parent)
        ).toBeUndefined();
    });

    it('should be able to add and get multiple annotations', () => {
        const { trrack, add } = setup();

        trrack.apply('add', add(3));

        const ann = Date.now().toString();
        const ann2 = Date.now().toString() + 2;

        trrack.annotations.add(ann);
        expect(trrack.annotations.latest()).toStrictEqual(ann);

        trrack.annotations.add(ann2);
        expect(trrack.annotations.all()?.length).toBe(2);
        expect(trrack.annotations.all()).toContain(ann);
        expect(trrack.annotations.all()).toContain(ann2);
    });
});

describe('Bookmarks', () => {
    it('bookmark should return false if not set', () => {
        const { trrack } = setup();

        expect(trrack.bookmarks.is()).toBeFalsy();
    });

    it('should be able to add bookmark on root', () => {
        const { trrack } = setup();

        trrack.bookmarks.add();
        expect(trrack.bookmarks.is()).toBeTruthy();
    });

    it('should be able to add/remove bookmark on node', () => {
        const { trrack, add } = setup();

        trrack.apply('add', add(3));

        trrack.bookmarks.add();
        expect(trrack.bookmarks.is()).toBeTruthy();

        trrack.bookmarks.remove();
        expect(trrack.bookmarks.is()).toBeFalsy();
    });

    it('should be able to toggle bookmarks', () => {
        const { trrack, add } = setup();

        trrack.apply('add', add(3));

        trrack.bookmarks.add();
        trrack.bookmarks.toggle();
        expect(trrack.bookmarks.is()).toBeFalsy();

        trrack.bookmarks.toggle();
        expect(trrack.bookmarks.is()).toBeTruthy();
    });
});
