export interface Point {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverUrl: string;
  color: string;
}

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'AI Synth 01',
    duration: '3:45',
    coverUrl: 'https://picsum.photos/seed/cyber1/300/300',
    color: '#00ccff', // Cyan
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'AI Synth 02',
    duration: '4:20',
    coverUrl: 'https://picsum.photos/seed/neon2/300/300',
    color: '#ff00ff', // Magenta
  },
  {
    id: '3',
    title: 'Void Echo',
    artist: 'AI Synth 03',
    duration: '2:55',
    coverUrl: 'https://picsum.photos/seed/void3/300/300',
    color: '#9900ff', // Purple
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION: Direction = 'UP';
export const GAME_SPEED = 100; // ms
