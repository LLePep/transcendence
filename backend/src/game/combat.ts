import { ATTACK_COOLDOWN_TICKS } from "./constants.js";
import { findTargets } from "./hit.js";
import type { Fighter, HitEvent } from "./types.js";

export function canAttack(fighter: Fighter, tick: number): boolean {
    if (!fighter.alive)
        return false;
    if (fighter.lastAttackTick === null)
        return true;
    return tick - fighter.lastAttackTick >= ATTACK_COOLDOWN_TICKS;
}

export function resolveAttacks(fighters: Map<string, Fighter>, tick: number): HitEvent[] {
    const hits: HitEvent[] = [];
    for (const f of fighters.values()) {
        if (!f.attackRequested) {
            continue;
        }
        if (!canAttack(f, tick))
        {
            f.attackRequested = false;
            continue;
        }
        f.lastAttackTick = tick;
        f.attackRequested = false;
        for (const targetId of findTargets(f, fighters.values())) {
            hits.push({ attackerId: f.id, targetId: targetId });
        }
    }
    return hits;
}