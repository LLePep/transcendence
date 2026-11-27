import type { MoveInputLike } from "../shared/movement.js";
import type { Vec2 } from "./types.js";

export function facingFromInput(input: MoveInputLike, current: Vec2): Vec2 {
    if (input.moveX === 0 && input.moveY === 0) {
        return current;
    }
    if (input.moveX !== 0 && input.moveY !== 0) {
        return { x: input.moveX * Math.SQRT1_2, y: input.moveY * Math.SQRT1_2 };
    }
    return { x: input.moveX, y: input.moveY };
}

export function facingTowards(from: Vec2, to: Vec2): Vec2 {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    if (length === 0)
        return { x: 1, y: 0 };
    return { x: dx / length, y: dy / length };
}
