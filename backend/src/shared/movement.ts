import { ARENA_WIDTH, ARENA_HEIGHT, PLAYER_HALF, PLAYER_SPEED } from "./constants.js";

export interface EntityState { x: number; y: number; vx: number; vy: number; }
export interface MoveInputLike { moveX: number; moveY: number; }

const clamp = (value: number, min: number, max: number) =>
  (value < min ? min : value > max ? max : value);

export function stepEntity(entity: EntityState, input: MoveInputLike, dt: number): void {
  let dirX = input.moveX;
  let dirY = input.moveY;

  // Normalize the diagonal, so it isn't faster than a straight line.
  if (dirX !== 0 && dirY !== 0) {
    dirX *= Math.SQRT1_2;
    dirY *= Math.SQRT1_2;
  }

  let vx = dirX * PLAYER_SPEED;
  let vy = dirY * PLAYER_SPEED;

  const x = entity.x + vx * dt;
  const y = entity.y + vy * dt;

  const clampedX = clamp(x, PLAYER_HALF, ARENA_WIDTH - PLAYER_HALF);
  const clampedY = clamp(y, PLAYER_HALF, ARENA_HEIGHT - PLAYER_HALF);

  // Hitting a wall also kills the velocity heading into it, so the reconciler
  // replays the same stop the server did.
  if (clampedX !== x) { vx = 0; }
  if (clampedY !== y) { vy = 0; }

  entity.x = clampedX;
  entity.y = clampedY;
  entity.vx = vx;
  entity.vy = vy;
}
