# Tamagui conventions

Style source is `tamagui.config.ts` (built on `@tamagui/config/v5`). Tokens, themes, and fonts live there — not in a separate markdown guide. Read the typed config, not prose.

**Versions:** Tamagui 2.x, config v5. Most v1/config-v4 examples online need adapting, not copying.

## v2 prop names

Config v5 default ships **no shorthands**. Use full CSS-aligned names:

| Old (v1 / RN) | v2 / config v5 |
|---------------|----------------|
| `alignItems`  | `items`        |
| `justifyContent` | `justify`   |
| `backgroundColor` | `background` |
| `ai` / `jc` shorthands | not enabled |

`flex`, `gap`, `color`, `fontSize` unchanged. When a prop errors, check for the CSS-name version first.

## Rules

- Tokens over raw values: `gap="$4"`, `color="$color"`, `background="$background"`. No magic numbers.
- `styled()` only when a component repeats. One-off screens use inline props.
- Theme via `TamaguiProvider defaultTheme`; follow device with `useColorScheme`.
- Official docs pin to the exact version: https://tamagui.dev/docs
