import { useState } from 'react';
import { BookmarkIcon } from './icons';

export function BookmarkButton({
    onClick,
    isBookmarked,
    color,
}: {
    onClick: () => void;
    isBookmarked: boolean;
    color: string;
}) {
    const [isHover, setHover] = useState<boolean>(false);
    return (
        <button
            type="button"
            style={{
                alignItems: 'center',
                background: 'transparent',
                border: 0,
                color: isBookmarked || isHover ? color : 'lightgray',
                cursor: 'pointer',
                display: 'inline-flex',
                marginRight: '5px',
                padding: 0,
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
            <BookmarkIcon />
        </button>
    );
}
