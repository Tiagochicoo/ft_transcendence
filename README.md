# ft_transcendence

## Summary

Build a website for playing Pong online.

Version: 14

## Contents

1. Preamble
2. Essential points
3. Mandatory part
4. Modules
5. Bonus part
6. Submission and peer evaluation

## Chapter 1 - Preamble

## Chapter 2 - Essential points

This project requires decisions within the constraints. You have some flexibility. All choices must be justified.

Ask yourself if a tool is truly necessary. Understand if a library will help you. Make the proposed features work.

Understand the project requirements before you start coding. Stay within the framework of the project.

Module choices affect each other. Justify your choices during evaluation.

## Chapter 3 - Mandatory part

Build a website for playing Pong against other players.

### Overview

- Users play Pong with others online
- Provide a nice user interface
- Support real-time multiplayer

### Technical requirements

- You may build with or without a backend
- If you use a backend, it must be in pure Ruby (unless you use the Framework module)
- If you use a database, follow the Database module constraints
- The frontend must use vanilla JavaScript (unless you use the Frontend module)
- The website must be a single-page application
- Browser Back and Forward buttons must work
- Support the latest stable version of Google Chrome
- No unhandled errors or warnings
- Run with one command: `docker-compose up --build`

### Docker requirements

When running on Linux clusters:
- Use Docker in rootless mode
- Docker files must be in `/goinfre` or `/sgoinfre`
- Do not use bind-mount volumes with non-root UIDs

### Game

- Users play live Pong against another player
- Both players use the same keyboard
- Support tournaments with multiple players
- Each player enters an alias at the start
- A matchmaking system announces the next fight
- All players follow the same rules (same paddle speed)
- The game must look like the original Pong (1972)

### Security

- Hash passwords in the database
- Protect against SQL injection and XSS
- Use HTTPS (WSS instead of WS)
- Validate all forms and user input

Store credentials in a `.env` file. Do not commit credentials to Git.

## Chapter 4 - Modules

You need at least 7 major modules for 100% completion. Read all modules carefully.

Two minor modules equal one major module.

### Module overview

| Module | Description |
|--------|-------------|
| Web | Framework, front-end toolkit, database, blockchain |
| User Management | Authentication, remote auth |
| Gameplay | Remote players, multiplayer, new game, chat |
| AI-Algo | AI opponent, stats dashboards |
| Cybersecurity | WAF, GDPR, 2FA |
| DevOps | Logs, monitoring, microservices |
| Graphics | 3D techniques |
| Accessibility | Device support, browser support, languages, SSR |
| Server-Side Pong | API, CLI gameplay |

### Web module

- Major: Use Django as backend framework
- Minor: Use Bootstrap for frontend
- Minor: Use PostgreSQL database
- Major: Store tournament scores on blockchain (Ethereum, Solidity)

### User Management module

- Major: Standard user management (sign up, log in, profiles, friends)
- Major: Remote authentication (OAuth 2.0 with 42)

### Gameplay module

- Major: Remote players (two players on different computers)
- Major: Multiplayer (more than 2 players)
- Major: Add another game with history and matchmaking
- Minor: Game customization options
- Major: Live chat

### AI-Algo module

- Major: AI opponent
- Minor: User and game stats dashboards

### Cybersecurity module

- Major: WAF/ModSecurity with HashiCorp Vault
- Minor: GDPR compliance (anonymization, data management)
- Major: Two-factor authentication and JWT

### DevOps module

- Major: Log management infrastructure
- Minor: Monitoring system
- Major: Backend as microservices

### Graphics module

- Major: Advanced 3D techniques

### Accessibility module

- Minor: Support on all devices
- Minor: Browser compatibility
- Minor: Multiple languages
- Minor: Accessibility for visually impaired users
- Minor: Server-side rendering

### Server-Side Pong module

- Major: Server-side Pong with API
- Major: CLI gameplay against web users

## Chapter 5 - Bonus part

The bonus part is graded only if the mandatory part is perfect and works without errors.

## Chapter 6 - Submission and peer evaluation

Turn in your assignment in your Git repository. Only the work in the repository is evaluated.