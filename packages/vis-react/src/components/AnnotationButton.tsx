import type { CSSProperties } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { EditIcon } from './icons';

const panelStyle: CSSProperties = {
    background: 'white',
    border: '1px solid #d0d7de',
    borderRadius: 8,
    boxShadow: '0 12px 28px rgba(15, 23, 42, 0.18)',
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: 180,
    zIndex: 2,
};

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
    const containerRef = useRef<HTMLDivElement>(null);
    const textareaId = useId();

    useEffect(() => {
        setTextValue(annotation);
    }, [annotation]);

    useEffect(() => {
        if (!annotationOpen) {
            return undefined;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setAnnotationOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [annotationOpen, setAnnotationOpen]);

    return (
        <div
            ref={containerRef}
            style={{
                color: annotationOpen || isHover ? color : 'lightgray',
                marginRight: '5px',
                position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setAnnotationOpen(!annotationOpen);
                }}
                style={{
                    alignItems: 'center',
                    background: 'transparent',
                    border: 0,
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    padding: 0,
                }}
                aria-label="Edit annotation"
            >
                <EditIcon />
            </button>

            {annotationOpen ? (
                <div style={panelStyle}>
                    <label
                        htmlFor={textareaId}
                        style={{
                            color: '#4b5563',
                            display: 'block',
                            fontSize: 11,
                            fontWeight: 600,
                            marginBottom: 6,
                        }}
                    >
                        Annotation
                    </label>
                    <textarea
                        id={textareaId}
                        value={textValue}
                        onChange={(event) =>
                            setTextValue(event.currentTarget.value)
                        }
                        rows={4}
                        style={{
                            border: '1px solid #d0d7de',
                            borderRadius: 6,
                            boxSizing: 'border-box',
                            font: 'inherit',
                            fontSize: 12,
                            minHeight: 72,
                            padding: '8px 10px',
                            resize: 'vertical',
                            width: '100%',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            gap: 6,
                            justifyContent: 'flex-end',
                            marginTop: 8,
                        }}
                    >
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setAnnotationOpen(false);
                            }}
                            style={{
                                background: 'transparent',
                                border: '1px solid #d0d7de',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontSize: 12,
                                padding: '4px 8px',
                            }}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setAnnotation(textValue);
                                setAnnotationOpen(false);
                            }}
                            style={{
                                background: color,
                                border: '1px solid transparent',
                                borderRadius: 6,
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: 12,
                                padding: '4px 8px',
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
