# CLAUDE.md

Behavioral guidelines for this project. Bias toward caution; judgment for trivial tasks.

## 1. Think Before Coding

State assumptions. Surface tradeoffs. Don't hide confusion.

Before implementation:
- Name your assumptions explicitly
- If multiple interpretations exist, present all — don't pick silently
- If a simpler approach exists, say so
- If unclear, stop and ask

## 2. Simplicity First

Minimum code that solves the problem. No speculation.

- No features beyond what was asked
- No abstractions for single-use code
- No error handling for impossible scenarios
- If 200 lines could be 50, rewrite it

Ask: "Would a senior engineer call this overcomplicated?" If yes, simplify.

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing:
- Don't improve adjacent code, comments, formatting
- Don't refactor things that aren't broken
- Match existing style, even if you'd do it differently

When your changes make things unused:
- Remove imports/variables/functions YOUR changes orphaned
- Don't remove pre-existing dead code unless asked

Test: Every changed line traces back to the user's request.

## 4. Goal-Driven Execution

Define success. Loop until verified.

Transform requests into goals:
- "Add validation" → test invalid inputs, make them pass
- "Fix bug" → write test that reproduces it, make it pass
- "Refactor X" → tests pass before and after

For multi-step work, state a brief plan with checks:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

Strong criteria let you loop independently.

---

## Writing Standards

All prose follows Orwell's 1946 rules. Technical terms stay exact.

### Orwell's Rules (1946)

1. **Never use a metaphor, simile, or figure of speech you see often in print.**
   - Bad: "Think outside the box"
   - Good: "Consider new approaches"

2. **Never use a long word where a short one will do.**
   - Bad: "utilize", "facilitate", "implement"
   - Good: "use", "help", "build"

3. **If it is possible to cut a word out, always cut it out.**
   - Bad: "In order to track deliveries, we need..."
   - Good: "To track deliveries, we need..."

4. **Never use the passive where you can use the active.**
   - Bad: "The delivery was tracked by the system"
   - Good: "The system tracked the delivery"

5. **Never use a foreign phrase, a scientific word, or a jargon word if you can think of an everyday English equivalent.**
   - Bad: "utilize the GPS functionality for localization"
   - Good: "track location with GPS"

6. **Break any of these rules sooner than say anything outright barbarous.**
   - If following a rule makes prose unreadable, break it

### How to apply

Before publishing prose (README, comments, docs):

1. Read it aloud — does it sound natural?
2. Count words — shorter is better
3. Check passive verbs — use active instead
4. Remove filler ("very", "quite", "actually", "just")
5. Replace jargon — would a delivery driver understand?

Examples in this project:

| Jargon | Simple |
|--------|--------|
| "asyncronous API calls with state management" | "fetch data while app stays responsive" |
| "leverage the geolocation APIs" | "track driver location" |
| "implement persistence via AsyncStorage" | "save data on device" |
| "seamless offline-first architecture" | "works without network" |

---

## Project-Specific

**Tech stack:** React Native + Expo + TypeScript strict mode + Google Maps.

**Scope:** Delivery tracking app. Three screens (list, details, map). Real-time GPS simulation. Offline support.

**No tests required** — app runs on device; verification happens there. Good test would be: open app, tap delivery, watch GPS markers move on map every 2 seconds. That's the proof.

**Code style:** Minimal comments. Names are clear. Only comment the "why" when non-obvious. Remove filler comments.

**Architecture:** Services (deliveryService, notificationService) separate from screens. Types defined once. No magic numbers.

---

**These guidelines work if:** changes are surgical (every line traces back to the request), code is readable (not over-engineered), and prose is clear (Orwell-compliant).
