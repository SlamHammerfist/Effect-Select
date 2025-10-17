export function getGroupedKeys(parent) {
  const keyGroups = {
    Abilities: Object.keys(CONFIG.DND5E.abilities).flatMap(abbr => {
      const base = `system.abilities.${abbr}`;
      return [
        `${base}.value`,
        `${base}.bonuses.check`,
        `${base}.bonuses.save`,
        `${base}.check.roll.min`,
        `${base}.check.roll.max`,
        `${base}.check.roll.mode`,
        `${base}.save.roll.min`,
        `${base}.save.roll.max`,
        `${base}.save.roll.mode`
      ];
    }),

    Skills: Object.keys(CONFIG.DND5E.skills).flatMap(abbr => {
      const base = `system.skills.${abbr}`;
      return [
        `${base}.value`,
        `${base}.bonuses.check`,
        `${base}.passive`,
        `${base}.roll.min`,
        `${base}.roll.max`,
        `${base}.roll.mode`
      ];
    }),

    Bonuses: [
      ...["mwak", "rwak", "msak", "rsak"].flatMap(type => [
        `system.bonuses.${type}.attack`,
        `system.bonuses.${type}.damage`
      ]),
      `system.bonuses.spell.attack`,
      `system.bonuses.spell.damage`,
      `system.bonuses.spell.dc`,
      `system.bonuses.attack.all`,
      `system.bonuses.damage.all`,
      `system.bonuses.save.all`,
      `system.bonuses.check.all`
    ],

    AC: [
      "system.attributes.ac.bonus",
      "system.attributes.ac.formula",
      "system.attributes.ac.calc",
      "system.attributes.ac.cover",
      "system.attributes.ac.flat",
      "system.attributes.ac.min",
      "system.attributes.ac.all"
    ],

    Movement: [
      ...Object.keys(parent.system?.attributes?.movement ?? {}).map(t => `system.attributes.movement.${t}`),
      "system.attributes.movement.ignoredDifficultTerrain",
      "system.attributes.movement.all"
    ],

    Misc: [
      "image",
      "name",
      "system.description.value",
    ],

    HP: [
      "system.attributes.hp.value",
      "system.attributes.hp.max",
      "system.attributes.hp.temp",
      "system.attributes.hp.tempmax",
      "system.attributes.hp.bonuses.level",
      "system.attributes.hp.bonuses.overall",
      "system.attributes.hp.bonuses.all"
    ],

    Senses: [
      "system.attributes.senses.darkvision",
      "system.attributes.senses.blindsight",
      "system.attributes.senses.tremorsense",
      "system.attributes.senses.truesight"
    ],

    Traits: [
      "system.traits.ci.value",
      "system.traits.ci.all",
      "system.traits.di.value",
      "system.traits.di.all",
      "system.traits.dr.value",
      "system.traits.dr.all",
      "system.traits.dv.value",
      "system.traits.dv.all",
      "system.traits.languages.value",
      "system.traits.size",
      "system.traits.weaponProf.mastery.bonus"
    ],

    Tools: Object.keys(parent.system?.tools ?? {}).flatMap(tool => [
      `system.tools.${tool}.value`,
      `system.tools.${tool}.bonuses.check`
    ]).concat("system.tools.all.bonuses.check"),

    Scale: (() => {
      const scale = parent.system?.scale ?? {};
      const keys = [];
      for (const [cls, entries] of Object.entries(scale)) {
        for (const id of Object.keys(entries)) {
          const base = `system.scale.${cls}.${id}`;
          keys.push(
            `${base}.value`,
            `${base}.number`,
            `${base}.die`,
            `${base}.faces`,
            `${base}.modifiers`
          );
        }
      }
      return keys;
    })(),

    SpellDC: [
      "system.spell.dc",
      "system.spell.dc.all"
    ],
  };
  // ✅ Conditionally add Advantage Reminder keys
  if (game.modules.get("adv-reminder")?.active) {
    keyGroups["Advantage Reminder"] = [
      "flags.adv-reminder.message.attack.all",
      "flags.adv-reminder.message.attack.mwak",
      "flags.adv-reminder.message.attack.rwak",
      "flags.adv-reminder.message.attack.msak",
      "flags.adv-reminder.message.attack.rsak",
      "flags.adv-reminder.grants.message.attack.all",
      "flags.adv-reminder.grants.message.attack.mwak",
      "flags.adv-reminder.grants.message.attack.rwak",
      "flags.adv-reminder.grants.message.attack.msak",
      "flags.adv-reminder.grants.message.attack.rsak",
      "flags.adv-reminder.message.damage.all",
      "flags.adv-reminder.message.damage.mwak",
      "flags.adv-reminder.message.damage.rwak",
      "flags.adv-reminder.message.damage.msak",
      "flags.adv-reminder.message.damage.rsak",
      "flags.adv-reminder.grants.message.damage.all",
      "flags.adv-reminder.grants.message.damage.mwak",
      "flags.adv-reminder.grants.message.damage.rwak",
      "flags.adv-reminder.grants.message.damage.msak",
      "flags.adv-reminder.grants.message.damage.rsak",
      "flags.adv-reminder.message.ability.check.all",
      "flags.adv-reminder.message.ability.check.str",
      "flags.adv-reminder.message.ability.check.dex",
      "flags.adv-reminder.message.ability.check.con",
      "flags.adv-reminder.message.ability.check.int",
      "flags.adv-reminder.message.ability.check.wis",
      "flags.adv-reminder.message.ability.check.cha",
      "flags.adv-reminder.message.ability.save.all",
      "flags.adv-reminder.message.ability.save.str",
      "flags.adv-reminder.message.ability.save.dex",
      "flags.adv-reminder.message.ability.save.con",
      "flags.adv-reminder.message.ability.save.int",
      "flags.adv-reminder.message.ability.save.wis",
      "flags.adv-reminder.message.ability.save.cha",
      "flags.adv-reminder.message.skill.all",
      "flags.adv-reminder.message.skill.acr",
      "flags.adv-reminder.message.skill.ani",
      "flags.adv-reminder.message.skill.arc",
      "flags.adv-reminder.message.skill.ath",
      "flags.adv-reminder.message.skill.dec",
      "flags.adv-reminder.message.skill.his",
      "flags.adv-reminder.message.skill.ins",
      "flags.adv-reminder.message.skill.inv",
      "flags.adv-reminder.message.skill.itm",
      "flags.adv-reminder.message.skill.med",
      "flags.adv-reminder.message.skill.nat",
      "flags.adv-reminder.message.skill.per",
      "flags.adv-reminder.message.skill.prc",
      "flags.adv-reminder.message.skill.prf",
      "flags.adv-reminder.message.skill.rel",
      "flags.adv-reminder.message.skill.slt",
      "flags.adv-reminder.message.skill.ste",
      "flags.adv-reminder.message.skill.sur",
      "flags.adv-reminder.message.deathSave"
    ];
  }
  // ✅ Conditionally add Active Token Lighting keys
 if (game.modules.get("ATL")?.active) {
    keyGroups["Active Token Lighting"] = [
      // 🎨 Appearance
      "ATL.texture.src",
      "ATL.texture.fit",
      "ATL.texture.anchorX",
      "ATL.texture.anchorY",
      "ATL.texture.scaleX",
      "ATL.texture.scaleY",
      "ATL.texture.tint",
      "ATL.texture.offsetX",
      "ATL.texture.offsetY",
      "ATL.texture.rotation",
      "ATL.width",
      "ATL.height",
      "ATL.hexagonalShape",
      "ATL.alpha",

      // 🌀 Ring Effects
      "ATL.ring.enabled",
      "ATL.ring.colors.ring",
      "ATL.ring.colors.background",
      "ATL.ring.subject.texture",
      "ATL.ring.subject.scale",
      "ATL.ring.effects",

      // 👁️ Vision
      "ATL.sight.enabled",
      "ATL.sight.range",
      "ATL.sight.angle",
      "ATL.sight.visionMode",
      "ATL.sight.color",
      "ATL.sight.attenuation",
      "ATL.sight.brightness",
      "ATL.sight.saturation",
      "ATL.sight.contrast",

      // 🧬 Detection Modes
      "ATL.detectionModes.lightPerception.range",
      "ATL.detectionModes.lightPerception.enabled",
      "ATL.detectionModes.basicSight.range",
      "ATL.detectionModes.basicSight.enabled",
      "ATL.detectionModes.seeInvisibility.range",
      "ATL.detectionModes.seeInvisibility.enabled",
      "ATL.detectionModes.senseInvisibility.range",
      "ATL.detectionModes.senseInvisibility.enabled",
      "ATL.detectionModes.feelTremor.range",
      "ATL.detectionModes.feelTremor.enabled",
      "ATL.detectionModes.seeAll.range",
      "ATL.detectionModes.seeAll.enabled",
      "ATL.detectionModes.senseAll.range",
      "ATL.detectionModes.senseAll.enabled",

      // 💡 Light
      "ATL.light.negative",
      "ATL.light.dim",
      "ATL.light.bright",
      "ATL.light.angle",
      "ATL.light.color",
      "ATL.light.alpha",
      "ATL.light.animation.type",
      "ATL.light.animation.speed",
      "ATL.light.animation.reverse",
      "ATL.light.animation.intensity",
      "ATL.light.coloration",
      "ATL.light.luminosity",
      "ATL.light.attenuation",
      "ATL.light.saturation",
      "ATL.light.contrast",
      "ATL.light.shadows",
      "ATL.light.tint",
      "ATL.light.tintAlpha",
      "ATL.light.darkness.min",
      "ATL.light.darkness.max",

      // 🧪 Presets & Control
      "ATL.preset",
      "ATL.override",
      "ATL.active",

      // 🌈 Token Aura Ring (if installed)
      "ATL.flags.token-aura-ring.[name].radius",
      "ATL.flags.token-aura-ring.[name].colour",
      "ATL.flags.token-aura-ring.[name].opacity",
      "ATL.flags.token-aura-ring.[name].weight",
      "ATL.flags.token-aura-ring.[name].visibility",
      "ATL.flags.token-aura-ring.[name].direction",
      "ATL.flags.token-aura-ring.[name].angle",

      // 🌈 Token Auras (if installed)
      "ATL.flags.token-auras.aura1.permission",
      "ATL.flags.token-auras.aura1.colour",
      "ATL.flags.token-auras.aura1.opacity",
      "ATL.flags.token-auras.aura1.distance",
      "ATL.flags.token-auras.aura1.square",

      // 🧿 Perfect Vision (if installed)
      "ATL.flags.perfect-vision.sight.range"
    ];
  }

  return keyGroups;
}