import React from 'react';
import { AchievementTier } from '../../types';

interface AchievementIconProps {
  tier: AchievementTier;
  iconName: string;
  size?: number;
}

const ICONS: { [key: string]: React.ReactNode } = {
  star: <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />,
  clock: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />,
  checkmark: <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />,
  bolt: <path d="M7 2v11h3v9l7-12h-4l4-8z" />,
  flame: <path d="M13.6,7.2c-1-1.3-2.2-2.7-2.2-4.1c0-0.5,0.4-1,1-1s1,0.4,1,1c0,0.6-0.4,1.2-0.8,1.6c-0.5,0.5-1.1,1-1.1,1.7 c0,0,2.1-2.4,4.4-1.3c2.3,1.1,1.5,4-0.8,5.3c-2.3,1.3-4.2,0.5-4.2-1.3c0-1.1,0.6-2.1,1.6-3.2C12.3,6.5,13,5.8,13,5 c0-0.6,0.4-1,1-1s1,0.4,1,1c0,0.4-0.2,0.8-0.5,1.1c-0.9,1-2.4,2.2-2.4,3.8c0,2.2,2.5,3.1,4.9,1.9c2.4-1.2,3.2-4,0.9-6 C15.6,3.6,12,6.2,12,8.1c0,1.3,0.8,2.5,2,3.6c1.1,1.1,1.8,2.1,1.8,3.2c0,1.9-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5 C8.8,12.5,11.8,8.8,13.6,7.2z" />,
  book: <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />,
  shield: <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />,
  calendar: <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />,
  brain: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16c-2.21 0-4-1.79-4-4s1.79-4 4-4v1c-1.66 0-3 1.34-3 3s1.34 3 3 3v-1c1.66 0 3-1.34 3-3s-1.34-3-3-3V8c2.21 0 4 1.79 4 4s-1.79 4-4 4zm1-12c-1.66 0-3 1.34-3 3s1.34 3 3 3v-1c-1.1 0-2-.9-2-2s.9-2 2-2v1c1.1 0 2 .9 2 2s-.9 2-2 2v-1c-1.66 0-3 1.34-3 3s1.34 3 3 3v-1c1.1 0 2-.9 2-2s-.9-2-2-2V6zm0 10c1.1 0 2-.9 2-2s-.9-2-2-2v1c.55 0 1 .45 1 1s-.45 1-1 1v1z" />,
  target: <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z" />,
  mountain: <path d="M15 6l-2.5 4L10 6l-5 8h15z" />,
};

export const AchievementIcon: React.FC<AchievementIconProps> = ({ tier, iconName, size = 80 }) => {
    const tierColors = {
        Bronze: { main: '#CD7F32', shadow: '#8C5A23' },
        Silver: { main: '#C0C0C0', shadow: '#A9A9A9' },
        Gold: { main: '#FFD700', shadow: '#B8860B' },
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
            <defs>
                <radialGradient id={`grad-${tier}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: tierColors[tier].main, stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: tierColors[tier].shadow, stopOpacity: 1 }} />
                </radialGradient>
            </defs>
            <g transform="scale(0.9) translate(1.2, 1.2)">
                <path d="M12,2 L14.3,8.2 L21,9.2 L16.5,13.7 L17.6,20.5 L12,17.2 L6.4,20.5 L7.5,13.7 L3,9.2 L9.7,8.2 L12,2 Z" fill={`url(#grad-${tier})`} stroke={tierColors[tier].shadow} strokeWidth="0.5" />
                <g transform="scale(0.45) translate(13.5, 13.5)" fill={tier === 'Bronze' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)'}>
                    {ICONS[iconName] || ICONS.star}
                </g>
            </g>
        </svg>
    );
};
