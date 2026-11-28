import { MATCH_DURATION_TICKS } from "./constants.js";
import { TICK_RATE } from "../shared/constants.js";
import type { EndReason, Fighter, MatchResult, MatchState, ParticipantResult } from "./types.js";

export function checkMatchEnd(match: MatchState): EndReason | null {
    let aliveBefore = 0;
    for (const f of match.fighters.values()) {
        if (f.alive) { aliveBefore++; }
    }
    if (aliveBefore === 0)
        return "all_eliminated";
    if (aliveBefore === 1)
        return "last_alive";
    if (match.tick >= MATCH_DURATION_TICKS)
        return "timeout";
    return null;
}

export function rankSurvivors(match: MatchState, reason: EndReason): void {
    if (reason === "all_eliminated")
        return;
    const survivors: Fighter[] = [];
    for (const f of match.fighters.values()) {
        if (f.alive) { survivors.push(f); }
    }
    for (const s of survivors) {
        let count = 0;
        for (const other of survivors) {
            if (other.hp > s.hp)
                count++;
        }
        s.placement = 1 + count;
    }
}

export function buildMatchResult(match: MatchState, reason: EndReason): MatchResult {
    const participants: ParticipantResult[] = [];
    for (const f of match.fighters.values()) {
        participants.push({
            playerId: f.id,
            userId: f.userId,
            username: f.username,
            placement: f.placement ?? 0,
            result: "LOSS",
            kills: f.kills,
            score: f.score,
        });
    }
    participants.sort((a, b) => a.placement - b.placement);
    let leaders = 0;
    for (const p of participants) {
        if (p.placement === 1)
            leaders++;
    }
    const isDraw = leaders > 1;
    for (const p of participants) {
        if (p.placement === 1) {
            p.result = isDraw ? "DRAW" : "WIN";
        }
    }
    let winP = null;
    let winU = null;
    if (!isDraw) {
        winP = participants[0].playerId;
        winU = participants[0].userId;
    }
    return {
        matchId: match.id,
        gameMode: "ARENA",
        endReason: reason,
        isDraw: isDraw,
        winnerPlayerId: winP,
        winnerUserId: winU,
        durationSeconds: Math.round(match.tick / TICK_RATE),
        participants: participants,
    };
}