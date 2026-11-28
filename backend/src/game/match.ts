import { ARENA_HEIGHT, ARENA_WIDTH } from "../shared/constants.js";
import type { MoveInputLike } from "../shared/movement.js";
import { COUNTDOWN_TICKS, MAX_HP, MATCH_MIN_PLAYERS, SPAWN_POINTS } from "./constants.js";
import {facingFromInput, facingTowards} from "./facing.js";
import type {EliminationEvent, Fighter, MatchState, PlayerSeat, StatePlayer, Vec2} from "./types.js";

export function createMatch(id: string, seats: PlayerSeat[]): MatchState {
    if (seats.length > SPAWN_POINTS.length)
        throw new Error("Too many players");
    const acenter : Vec2 = {x: ARENA_WIDTH/2, y: ARENA_HEIGHT/2};
    const fighters = new Map<string, Fighter>();
    for(let i = 0; i < seats.length; i++){
        const seat = seats[i];
        const point = SPAWN_POINTS[i];
        fighters.set(seat.id, {
            id: seat.id,
            userId: seat.userId,
            username: seat.username,
            x: point.x,
            y: point.y,
            vx: 0,
            vy: 0,
            input: { moveX: 0, moveY: 0 },
            facing: facingTowards(point, acenter),
            hp: MAX_HP,
            alive: true,
            lastAttackTick: null,
            attackRequested: false,
            kills: 0,
            score: 0,
            eliminatedAtTick: null,
            placement: null,
        })
    }
    return ({
        id: id,
        phase: "waiting",
        tick:0,
        countdownLeft: COUNTDOWN_TICKS,
        fighters: fighters
    })
}

export function canStart(match: MatchState): boolean {
    return match.fighters.size >= MATCH_MIN_PLAYERS;
}

export function setInput(match: MatchState, playerId: string, input: MoveInputLike): void {
    const f = match.fighters.get(playerId);
    if (!f || !f.alive)
        return;
    f.input = input;
}

export function requestAttack(match: MatchState, playerId: string): void {
    const f = match.fighters.get(playerId);
    if (match.phase !== "playing")
        return;
    if (!f || !f.alive)
        return;
    f.attackRequested = true;
}

export function forfeit(match: MatchState, playerId: string): EliminationEvent | null {
    const leaver = match.fighters.get(playerId);
    if (!leaver || !leaver.alive)
        return null;
    let aliveBefore = 0;
    for (const f of match.fighters.values()) {
        if (f.alive) {
            aliveBefore++;
        }
    }
    leaver.alive = false;
    leaver.placement = aliveBefore;
    leaver.eliminatedAtTick = match.tick;
    return {
        playerId: leaver.id,
        by: [],
        placement: leaver.placement,
    };
}

export function snapshotState(match: MatchState): Record<string, StatePlayer> {
    const out: Record<string, StatePlayer> = {};
    for (const f of match.fighters.values()) {
        if (!f.alive)
            continue;
        out[f.id] = {
            x: f.x,
            y: f.y,
            hp: f.hp,
            facingX: f.facing.x,
            facingY: f.facing.y,
        };
    }
    return out;
}