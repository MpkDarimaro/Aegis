import React from 'react';

interface StarIconProps {
    filled?: boolean;
    size?: number;
}

export const StarIcon: React.FC<StarIconProps> = ({ filled = true, size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
        className={`transition-colors ${filled ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);
