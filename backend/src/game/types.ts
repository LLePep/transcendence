import type { EntityState, MoveInputLike} from "../shared/movement.js";

export interface Vec2 { x:number, y:number }

export interface Fighter extends EntityState {
    id:string;
    userId:string | null;
    username:string;
    input:MoveInputLike;
    facing:Vec2;
    hp:number;
    alive:boolean;
    lastAttackTick:number | null;
    attackRequested:boolean;
    kills:number;
    score:number;
    eliminatedAtTick:number|null;
    placement:number | null;
}

export type MatchPhase = "waiting" | "countdown" | "playing" | "ended";

export interface MatchState {
    id: string;
    phase: MatchPhase;
    tick: number;
    countdownLeft: number;
    fighters: Map<string, Fighter>;
}

export interface HitEvent {
    attackerId:string;
    targetId:string;
}

export interface DamageEvent {
    attackerId:string;
    targetId:string;
    damage:number;
    hp:number;
}

export interface EliminationEvent {
    playerId:string;
    by:string[];
    placement:number;
}

export type EndReason = "last_alive" | "all_eliminated"| "timeout";

export interface ParticipantResult {
    playerId:string;
    userId:string | null;
    username:string;
    placement:number;
    result: "WIN" | "LOSS" | "DRAW";
    kills:number;
    score:number;
}

export interface MatchResult {
    matchId: string;
    gameMode: "ARENA";
    endReason: EndReason;
    isDraw: boolean;
    winnerPlayerId: string | null;
    winnerUserId: string | null;
    durationSeconds: number;
    participants: ParticipantResult[];
}

export interface TickEvents {
    hits: DamageEvent[];
    eliminations: EliminationEvent[];
    result: MatchResult | null;
}

export interface PlayerSeat {
    id: string;
    userId: string | null;
    username: string;
}

export interface StatePlayer {
    x: number;
    y: number;
    hp: number; 
    facingX: number;
    facingY: number;
}