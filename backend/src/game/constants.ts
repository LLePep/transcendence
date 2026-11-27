export const MAX_HP = 100;
export const ATTACK_DAMAGE = 25;
export const ATTACK_COOLDOWN_TICKS = 15;
export const COUNTDOWN_TICKS = 90;
export const MATCH_DURATION_TICKS = 5400;
export const HIT_OFFSET = 24;
export const HIT_RADIUS = 16;
export const MATCH_MIN_PLAYERS = 2;
export const MATCH_MAX_PLAYERS = 2;

export const SPAWN_POINTS = [
    { x: 60, y: 60 }, { x: 740, y: 540 }, { x: 740, y: 60 }, { x: 60, y: 540 },
] as const;

/*
* 30 ticks per sec
* 2 players max
* 4 predetermined spawn points
* as of 27/11
* */