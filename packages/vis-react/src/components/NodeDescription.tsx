import { NodeId, ProvenanceNode, isStateNode } from '@trrack/core';
import { useEffect, useMemo, useState } from 'react';
import { animated, easings, useSpring } from '@react-spring/web';
import { AnnotationButton } from './AnnotationButton';
import { BookmarkButton } from './BookmarkButton';
import { ProvVisConfig } from './ProvVis';
import { useElementHeight } from './useElementHeight';

function getNodeTitle<T, S extends string>(
    node: ProvenanceNode<T, S>,
    annotation: string
) {
    return annotation.length > 0 ? `${node.label}\n${annotation}` : node.label;
}

export function NodeDescription<T, S extends string>({
    depth,
    yOffset,
    node,
    config,
    onClick,
    isHover,
    setHover,
    colorMap,
    isCurrent,
    extraHeight,
    setExtraHeight,
}: {
    depth: number;
    yOffset: number;
    node: ProvenanceNode<T, S>;
    config: ProvVisConfig<T, S>;
    currentNode: NodeId;
    onClick: () => void;
    isHover: boolean;
    setHover: (node: NodeId | null) => void;
    colorMap: Record<S | 'Root', string>;
    isCurrent: boolean;
    extraHeight: number;
    setExtraHeight: (n: number) => void;
}) {
    const [ref, height] = useElementHeight<HTMLDivElement>();
    const annotation = config.getAnnotation(node.id);
    const [isAnnotationOpen, setIsAnnotationOpen] = useState(false);

    const style = useSpring({
        config: {
            duration: config.animationDuration,
            easing: easings.easeInOutSine,
        },
        top:
            depth * config.verticalSpace +
            config.marginTop +
            yOffset -
            config.verticalSpace / 2 +
            extraHeight,
    });

    const extraNodeOpacity = useSpring({
        config: {
            duration: config.animationDuration,
            easing: easings.easeInOutSine,
        },
        opacity: isCurrent ? 1 : 0,
    });

    useEffect(() => {
        if (isCurrent) {
            setExtraHeight(height);
        }
    }, [height, isCurrent, setExtraHeight]);

    const actionWidth = useMemo(() => {
        if (isHover || isAnnotationOpen) {
            return config.bookmarkNode !== null ? 50 : 25;
        }

        if (config.bookmarkNode !== null && config.isBookmarked(node.id)) {
            return 25;
        }

        return 0;
    }, [config, isHover, isAnnotationOpen, node.id]);

    const textColor = config.isDarkMode ? 'white' : 'black';
    const subTextColor = config.isDarkMode ? '#cbd5e1' : '#6b7280';
    const title = getNodeTitle(node, annotation);

    return (
        <animated.div
            style={{
                ...style,
                cursor: 'pointer',
                display: 'flex',
                flexWrap: 'wrap',
                height: config.verticalSpace * 2,
                position: 'absolute',
                width: '100%',
            }}
            className="node-description"
            onClick={onClick}
            data-node-id={node.id}
            onMouseEnter={() => setHover(node.id)}
            onMouseLeave={() => setHover(null)}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 2,
                        height: config.verticalSpace,
                        minWidth: 0,
                    }}
                >
                    <div
                        title={title}
                        style={{
                            color: textColor,
                            display: 'flex',
                            flexDirection: 'row',
                            minWidth: 0,
                            width: `calc(100% - ${config.marginRight}px - ${actionWidth}px)`,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                marginRight: 'auto',
                                minWidth: 0,
                                width: '100%',
                            }}
                        >
                            <p
                                style={{
                                    margin: 0,
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {node.label}
                            </p>

                            {isStateNode(node) ? (
                                <p
                                    style={{
                                        color: subTextColor,
                                        fontSize: 10,
                                        margin: 0,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                    }}
                                >
                                    {annotation}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {config.bookmarkNode !== null &&
                    (isHover || isAnnotationOpen || config.isBookmarked(node.id)) ? (
                        <BookmarkButton
                            color={colorMap[node.event]}
                            isBookmarked={config.isBookmarked(node.id)}
                            onClick={() => config.bookmarkNode?.(node.id)}
                        />
                    ) : null}

                    {config.annotateNode !== null && (isHover || isAnnotationOpen) ? (
                        <AnnotationButton
                            color="cornflowerblue"
                            annotationOpen={isAnnotationOpen}
                            setAnnotationOpen={setIsAnnotationOpen}
                            setAnnotation={(value) =>
                                config.annotateNode?.(node.id, value)
                            }
                            annotation={annotation}
                        />
                    ) : null}
                </div>

                {isCurrent ? (
                    <animated.div style={extraNodeOpacity} ref={ref}>
                        {config.nodeExtra[node.event] || config.nodeExtra['*']}
                    </animated.div>
                ) : null}
            </div>
        </animated.div>
    );
}
