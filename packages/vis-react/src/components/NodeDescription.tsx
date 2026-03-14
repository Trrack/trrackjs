import { Group, Stack, Text, Tooltip } from '@mantine/core';
import { NodeId, ProvenanceNode, isStateNode } from '@trrack/core';
import { useEffect, useState } from 'react';
import { animated, easings, useSpring } from 'react-spring';
import { AnnotationButton } from './AnnotationButton';
import { BookmarkButton } from './BookmarkButton';
import { ProvVisConfig } from './ProvVis';
import { useResizeObserver } from '@mantine/hooks';

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
    const [ref, { height }] = useResizeObserver();

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
        if (isCurrent) setExtraHeight(height);
    }, [height, isCurrent, setExtraHeight]);

    const [isAnnotationOpen, setIsAnnotationOpen] = useState<boolean>(false);

    return (
        <animated.div
            style={{
                ...style,
                cursor: 'pointer',
                position: 'absolute',
                height: config.verticalSpace * 2,
                flexWrap: 'wrap',
                width: `100%`,
            }}
            className="node-description"
            onClick={onClick}
            data-node-id={node.id}
            onMouseEnter={() => setHover(node.id)}
            onMouseLeave={() => setHover(null)}
        >
            <Stack style={{ height: '100%' }} spacing={0}>
                <Group
                    spacing={2}
                    noWrap
                    style={{ height: config.verticalSpace }}
                >
                    <Tooltip
                        position="top-start"
                        openDelay={200}
                        withinPortal={true}
                        withArrow
                        color="gray"
                        multiline
                        sx={{ maxWidth: '200px' }}
                        label={
                            <Stack spacing={0}>
                                <Text weight={600}>{node.label}</Text>
                                {config.getAnnotation(node.id).length > 0 ? (
                                    <Text size="xs">
                                        {config.getAnnotation(node.id)}
                                    </Text>
                                ) : null}
                            </Stack>
                        }
                    >
                        <div
                            style={{
                                width: `calc(100% - ${config.marginRight}px - ${
                                    isHover || isAnnotationOpen
                                        ? 50
                                        : config.isBookmarked(node.id)
                                        ? 25
                                        : 0
                                }px)`,
                                display: 'flex',
                                flexDirection: 'row',
                                color: config.isDarkMode ? 'white' : 'black',
                            }}
                        >
                            <div
                                style={{
                                    alignItems: 'start',
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginRight: 'auto',
                                    width: '100%',
                                }}
                            >
                                <p
                                    style={{
                                        maxWidth: `100%`,
                                        margin: 0,
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
                                            width: '100%',
                                            margin: 0,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            color: 'gray',
                                            fontSize: 10,
                                        }}
                                    >
                                        {config.getAnnotation(node.id)}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </Tooltip>
                    {config.bookmarkNode !== null &&
                    (isHover ||
                        isAnnotationOpen ||
                        config.isBookmarked(node.id)) ? (
                        <BookmarkButton
                            color={colorMap[node.event]}
                            isBookmarked={config.isBookmarked(node.id)}
                            onClick={() => config.bookmarkNode?.(node.id)}
                        />
                    ) : null}
                    {config.annotateNode !== null &&
                    (isHover || isAnnotationOpen) ? (
                        <AnnotationButton
                            color="cornflowerblue"
                            annotationOpen={isAnnotationOpen}
                            setAnnotationOpen={(b: boolean) =>
                                setIsAnnotationOpen(b)
                            }
                            setAnnotation={(s) =>
                                config.annotateNode?.(node.id, s)
                            }
                            annotation={config.getAnnotation(node.id)}
                        />
                    ) : null}
                </Group>
                {isCurrent ? (
                    <animated.div style={{ ...extraNodeOpacity }} ref={ref}>
                        {config.nodeExtra[node.event] || config.nodeExtra['*']}
                    </animated.div>
                ) : null}
            </Stack>
        </animated.div>
    );
}
