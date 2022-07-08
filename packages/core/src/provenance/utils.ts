import { IProvenanceNode, ProvenanceNodeUtils } from './node/types';

export class ProvenanceGraphUtils {
    private constructor() {
        throw new Error('Please use static methods directly');
    }

    private static LCA(
        current: IProvenanceNode,
        destination: IProvenanceNode
    ): IProvenanceNode {
        let [source, target] = [current, destination];

        if (source.level > target.level) {
            [source, target] = [target, source];
        }

        let diff = target.level - source.level;

        while (ProvenanceNodeUtils.isNonRoot(target) && diff !== 0) {
            target = target.parent;
            diff -= 1;
        }

        if (source.id === target.id) return source;

        while (source.id !== target.id) {
            if (ProvenanceNodeUtils.isNonRoot(source)) source = source.parent;
            if (ProvenanceNodeUtils.isNonRoot(target)) target = target.parent;
        }

        return source;
    }

    static getPath(current: IProvenanceNode, destination: IProvenanceNode) {
        const lca = ProvenanceGraphUtils.LCA(current, destination);

        const pathFromSourceToLca: IProvenanceNode[] = [];
        const pathFromDestinationToLca: IProvenanceNode[] = [];

        let [source, target] = [current, destination];

        while (source !== lca) {
            pathFromSourceToLca.push(source);
            if (ProvenanceNodeUtils.isNonRoot(source)) {
                source = source.parent;
            }
        }

        pathFromSourceToLca.push(source);

        while (target !== lca) {
            pathFromDestinationToLca.push(target);
            if (ProvenanceNodeUtils.isNonRoot(target)) {
                target = target.parent;
            }
        }

        return [...pathFromSourceToLca, ...pathFromDestinationToLca.reverse()];
    }

    static isNextNodeUp(
        source: IProvenanceNode,
        target: IProvenanceNode
    ): boolean {
        if (
            ProvenanceNodeUtils.isNonRoot(source) &&
            source.parent.id === target.id
        )
            return true;

        if (
            ProvenanceNodeUtils.isNonRoot(target) &&
            target.parent.id === source.id
        )
            return false;

        throw new Error(
            `Illegal use of function. Nodes ${source.id} and ${target.id} are not connected.`
        );
    }
}
