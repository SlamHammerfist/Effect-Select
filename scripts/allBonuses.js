export function allBonuses(OriginalActor) {
  return class extends OriginalActor {
    getRollData() {
      const data = super.getRollData?.() ?? {};

      const mergeBonus = (base, all) => {
        if (typeof all !== "string" && typeof all !== "number") return base;
        const baseStr = typeof base === "string" || typeof base === "number" ? String(base) : "";
        const allStr = String(all);
        const parts = baseStr.split(" + ").map(p => p.trim());
        return parts.includes(allStr) ? baseStr : [baseStr, allStr].filter(Boolean).join(" + ");
      };

      const attackAll = foundry.utils.getProperty(this.system, "bonuses.attack.all");
      const damageAll = foundry.utils.getProperty(this.system, "bonuses.damage.all");

      for (const type of ["mwak", "rwak", "msak", "rsak"]) {
        const atkPath = `bonuses.${type}.attack`;
        const dmgPath = `bonuses.${type}.damage`;

        const atkCurrent = foundry.utils.getProperty(data, atkPath);
        const dmgCurrent = foundry.utils.getProperty(data, dmgPath);

        if (attackAll) {
          foundry.utils.setProperty(data, atkPath, mergeBonus(atkCurrent, attackAll));
        }
        if (damageAll) {
          foundry.utils.setProperty(data, dmgPath, mergeBonus(dmgCurrent, damageAll));
        }
      }

      const spellDCAll = foundry.utils.getProperty(this.system, "spell.dc.all");
      const spellDC = foundry.utils.getProperty(data, "spell.dc");
      if (spellDCAll) {
        foundry.utils.setProperty(data, "spell.dc", mergeBonus(spellDC, spellDCAll));
      }

      const saveAll = foundry.utils.getProperty(this.system, "bonuses.save.all");
      const checkAll = foundry.utils.getProperty(this.system, "bonuses.check.all");

      for (const abbr of Object.keys(CONFIG.DND5E.abilities)) {
        const savePath = `abilities.${abbr}.bonuses.save`;
        const checkPath = `abilities.${abbr}.bonuses.check`;

        const saveCurrent = foundry.utils.getProperty(data, savePath);
        const checkCurrent = foundry.utils.getProperty(data, checkPath);

        if (saveAll) {
          foundry.utils.setProperty(data, savePath, mergeBonus(saveCurrent, saveAll));
        }
        if (checkAll) {
          foundry.utils.setProperty(data, checkPath, mergeBonus(checkCurrent, checkAll));
        }
      }

      const skillAll = foundry.utils.getProperty(this.system, "skills.all.bonuses.check");
      for (const skill of Object.keys(CONFIG.DND5E.skills)) {
        const path = `skills.${skill}.bonuses.check`;
        const current = foundry.utils.getProperty(data, path);
        if (skillAll) {
          foundry.utils.setProperty(data, path, mergeBonus(current, skillAll));
        }
      }

      const toolAll = foundry.utils.getProperty(this.system, "tools.all.bonuses.check");
      for (const tool of Object.keys(this.system.tools ?? {})) {
        const path = `tools.${tool}.bonuses.check`;
        const current = foundry.utils.getProperty(data, path);
        if (toolAll) {
          foundry.utils.setProperty(data, path, mergeBonus(current, toolAll));
        }
      }

      return data;
    }

    prepareDerivedData() {
      super.prepareDerivedData?.();

      const system = this.system;
      if (!system || typeof system !== "object") return;

      const applyAllKeys = (obj, seen = new WeakSet()) => {
        if (!obj || typeof obj !== "object" || seen.has(obj)) return;
        seen.add(obj);

        for (const [key, value] of Object.entries(obj)) {
          if (value && typeof value === "object" && !Array.isArray(value)) {
            applyAllKeys(value, seen);
          }

          if (key === "all" && typeof value === "number") {
            for (const siblingKey of Object.keys(obj)) {
              if (siblingKey !== "all" && typeof obj[siblingKey] === "number") {
                obj[siblingKey] += value;
              }
            }
          }

          if (key === "all" && Array.isArray(value)) {
            for (const siblingKey of Object.keys(obj)) {
              if (siblingKey !== "all" && Array.isArray(obj[siblingKey])) {
                obj[siblingKey] = Array.from(new Set([...obj[siblingKey], ...value]));
              }
            }
          }
        }
      };

      applyAllKeys(system);
    }
  };
}