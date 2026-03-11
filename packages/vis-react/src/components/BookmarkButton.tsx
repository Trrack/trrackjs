import { faBookmark } from '@fortawesome/free-solid-svg-icons/faBookmark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

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
        <div
            style={{
                marginRight: '5px',
                color: isBookmarked || isHover ? color : 'lightgray',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <FontAwesomeIcon icon={faBookmark} />
        </div>
    );
}
