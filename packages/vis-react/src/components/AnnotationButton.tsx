import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Group, Popover, Stack, Textarea } from '@mantine/core';
import { useState } from 'react';

export function AnnotationButton({
    color,
    annotation,
    setAnnotation,
    setAnnotationOpen,
    annotationOpen,
}: {
    annotationOpen: boolean;
    setAnnotationOpen: (b: boolean) => void;
    annotation: string;
    setAnnotation: (s: string) => void;
    color: string;
}) {
    const [isHover, setHover] = useState<boolean>(false);
    const [textValue, setTextValue] = useState<string>(annotation);

    return (
        <div
            style={{
                marginRight: '5px',
                color: annotationOpen || isHover ? color : 'lightgray',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Popover
                width={150}
                trapFocus
                position="bottom"
                withArrow
                arrowSize={10}
                shadow="md"
                onChange={setAnnotationOpen}
                opened={annotationOpen}
            >
                <Popover.Target>
                    <FontAwesomeIcon
                        icon={faEdit}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAnnotationOpen(!annotationOpen);
                        }}
                    />
                </Popover.Target>
                <Popover.Dropdown
                    sx={(theme) => ({
                        background:
                            theme.colorScheme === 'dark'
                                ? theme.colors.dark[7]
                                : theme.white,
                    })}
                >
                    <Stack spacing={4}>
                        <Textarea
                            autosize
                            maxRows={10}
                            label="Annotation"
                            value={textValue}
                            size="xs"
                            mt={0}
                            onChange={(event) =>
                                setTextValue(event.currentTarget.value)
                            }
                        />
                        <Group position="right" spacing={4}>
                            <Button
                                compact
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAnnotationOpen(false);
                                }}
                                size={'xs'}
                                variant={'outline'}
                            >
                                Close
                            </Button>
                            <Button
                                compact
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAnnotation(textValue);
                                    setAnnotationOpen(false);
                                }}
                                size={'xs'}
                            >
                                Save
                            </Button>
                        </Group>
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </div>
    );
}
