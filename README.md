# Effect Select

_A schema-binding invocation for Active Effects in DND5E._

Effect Select empowers effect authors with intelligent dropdowns and recursive bonus logic. It injects a searchable, grouped key selector into Active Effect configuration and extends `.all` bonuses across every applicable domain — from attacks and damage to saves, checks, skills, tools, traits, and more.

## Features

- 🔽 **Dropdown Injection**  
  Adds a searchable, grouped dropdown to the Active Effect key field, powered by schema-driven logic.

- 🧠 **Recursive `.all` Bonus Support**  
  Automatically merges `.all` bonuses into specific roll domains during `getRollData()` and `prepareDerivedData()`.

- 🛠️ **Schema-Aware Extensibility**  
  Supports movement, AC, HP, traits, spell DCs, ability saves/checks, skills, and tools — all patched cleanly.

- 🧩 **Modular Architecture**  
  Core logic split into `allBonuses.js` for maintainability and reuse.

## Instilation

1. Manually add the manifest to FoundryVTT:
   ```json
   https://raw.githubusercontent.com/SlamHammerfist/Effect-Select/refs/heads/main/module.json
2. Enable Effect Select in your FoundryVTT world.
