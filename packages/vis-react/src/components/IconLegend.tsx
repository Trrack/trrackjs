import { useMemo } from 'react';
import { defaultIcon } from '../utils/IconConfig';
import { ProvVisConfig } from './ProvVis';
import { StratifiedMap } from './useComputeNodePosition';

export function IconLegend<T, S extends string>({
    colorMap,
    nodes,
    config,
}: {
    colorMap: Record<S | 'Root', string>;
    nodes: StratifiedMap<T, S>;
    config: ProvVisConfig<T, S>;
}) {
    const legendCategories = useMemo(() => {
        const categoryList: (S | 'Root')[] = [];

        Object.values(nodes).forEach((node) => {
            if (!categoryList.includes(node.data.event)) {
                categoryList.push(node.data.event);
            }
        });

        return categoryList;
    }, [nodes]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {legendCategories.map((cat) => {
                return (
                    <div key={cat} style={{ display: 'flex' }}>
                        <svg height="20px" width="20px">
                            <g transform="translate(10, 10)">
                                {config.iconConfig?.[cat] &&
                                config.iconConfig[cat].glyph
                                    ? config.iconConfig?.[cat]?.glyph?.()
                                    : defaultIcon(colorMap[cat]).glyph()}
                            </g>
                        </svg>
                        <p style={{ margin: 0 }}>{cat}</p>
                    </div>
                );
            })}
        </div>
    );
}
