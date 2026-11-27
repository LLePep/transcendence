import { HIT_OFFSET, HIT_RADIUS } from "./constants.js";
import { PLAYER_HALF } from "../shared/constants.js";
import type { Fighter, Vec2 } from "./types.js";

export function hitCircleCenter(position: Vec2, facing: Vec2): Vec2 {
    return { x: position.x + facing.x * HIT_OFFSET, y: position.y + facing.y * HIT_OFFSET };
}

export function circleTouchesSquare(center: Vec2, radius: number, square: Vec2, half: number): boolean {
    const closestX = Math.min(Math.max(center.x, square.x - half), square.x + half);
    const closestY = Math.min(Math.max(center.y, square.y - half), square.y + half);

    const dx = closestX - center.x;
    const dy = closestY - center.y;

    return dx * dx + dy * dy <= radius * radius;
}

export function findTargets(attacker: Fighter, fighters: Iterable<Fighter>): string[] {
    const center = hitCircleCenter(attacker, attacker.facing);
    const targets: string[] = [];
    for (const f of fighters) {
        if (f.id === attacker.id || !f.alive)
            continue;
        if (circleTouchesSquare(center, HIT_RADIUS, f, PLAYER_HALF)) {
            targets.push(f.id);
        }
    }
    return targets;
}
