# TechOps — First Shift

**TechOps** is a browser-based IT career training game. The goal is to prepare new technicians for current CompTIA A+ material by making them *do the work* instead of grinding flashcards.

## Current playtest

**First Shift Playtest 0.2** targets CompTIA A+ V15:

- Core 1: **220-1201**
- Core 2: **220-1202**
- 8 playable incidents
- Top-down office exploration with keyboard and touch controls
- NPC users and contextual ticket conversations
- Simulated Windows 11 remote desktop
- Interactive command terminal (`ipconfig`, `ping`, `nslookup`, `tracert`, spooler commands, and more)
- Hardware repair bench with power, ESD, RAM, cooling, POST, and stress testing
- Network closet tools
- Bluetooth/mobile-device lab
- Malware/security incident workflow
- Printer/service troubleshooting
- AI safety and hallucination incident aligned to current Core 2 material
- Required ticket documentation and verification
- XP, reputation, local save, mission progression, and A+ skill matrix
- Wrong actions have consequences but are designed to teach rather than simply end the run

## Eight incidents

1. **Payday Panic** — DHCP, APIPA, IPv4 and connectivity verification
2. **Heat Death** — CPU overheating, cooling and stress testing
3. **Pop-Up Plague** — malware symptoms, containment and remediation
4. **POST Mortem** — RAM, POST, ESD and safe hardware procedure
5. **Printer From Hell** — print queues, services and Print Spooler
6. **The Name Game** — DNS isolation with `ping` and `nslookup`
7. **Pairing Panic** — Bluetooth discovery, pairing and verification
8. **Ghost in the Copilot** — AI policy, public/private AI, privacy, hallucination and verification

## How to play

Open `index.html` in a modern browser. For the most reliable local test, serve the folder with any static web server, for example:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

Use **WASD / arrow keys** to move and **E** to interact. Touch controls appear on smaller screens.

## Curriculum rule

Every mission must map to published current A+ concepts while remaining an **original scenario**. TechOps does not use exam dumps or copied protected questions. `objectives-map.json` documents the current playtest mapping.

The in-game readiness score measures mastery of content included in the current TechOps campaign; it is **not** presented as a guaranteed CompTIA exam score or a claim of complete objective coverage.

## Validation

The 0.2 critical path has been run end-to-end through all eight incidents in a headless Chromium playtest, including technical resolution, ticket documentation, progression, and the final shift-results screen.

## Direction

First Shift is the Level 1 help-desk campaign. Later TechOps campaigns can expand into Desktop Support, Networking, Systems Administration, security incidents, randomized root causes, deeper PBQ-style simulations, and ultimately repeated scenario coverage across the full current A+ objective set.
