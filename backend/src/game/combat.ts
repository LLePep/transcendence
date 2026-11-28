import { ATTACK_COOLDOWN_TICKS, ATTACK_DAMAGE } from "./constants.js";
import { findTargets } from "./hit.js";
import type { DamageEvent, EliminationEvent, Fighter, HitEvent } from "./types.js";

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

export function applyHits(fighters: Map<string, Fighter>, hits: HitEvent[]): DamageEvent[] {
    const damageE: DamageEvent[] = [];
    for (const hit of hits) {
        const attacker = fighters.get(hit.attackerId);
        const target = fighters.get(hit.targetId);
        if (!attacker || !target)
            continue;
        const damage = Math.min(ATTACK_DAMAGE, target.hp);
        target.hp -= damage;
        attacker.score += damage;
        damageE.push({ attackerId: attacker.id, damage: damage, hp: target.hp, targetId: target.id });
    }
    return damageE;
}

export function collectEliminations(fighters: Map<string, Fighter>, damages: DamageEvent[], tick: number): EliminationEvent[] {
    const elim: EliminationEvent[] = [];
    const victims: Fighter[] = [];
    let aliveBefore = 0;
    for (const f of fighters.values()) {
        if (f.alive) {
            aliveBefore++;
            if (f.hp <= 0) {
                victims.push(f);
            }
        }
    }
    const place = aliveBefore - victims.length + 1;
    for (const v of victims) {
        const by: string[] = [];
        for (const d of damages) {
            if (d.targetId === v.id && !by.includes(d.attackerId))
                by.push(d.attackerId);
        }
        for (const b of by) {
            const killer = fighters.get(b);
            if (!killer)
                continue;
            killer.kills++;
        }
        v.alive = false;
        v.placement = place;
        v.eliminatedAtTick = tick;
        elim.push({ playerId: v.id, by: by, placement: v.placement });
    }
    return elim;
}