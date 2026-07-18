That Time I Was an Office Worker and Put into a Coma by a Demon Sleep God

A 2D side-scrolling RPG built with JavaScript and p5.js for CS 345 (Software Engineering)
at James Madison University, Spring 2026. Forked from chaoaj/sp26_cs345_team03.


![Gameplay demo](assets/gameplay.gif)

About

You play an office worker pulled into a coma by a demon sleep god. Fight through
levels, talk to NPCs through a dialogue system, and defeat the boss to wake up.

My Contributions (Co-Lead, Combat Engine)


Co-led the 5-person team: task breakdown, Git branching strategy, and keeping main stable across 133+ commits
Built the combat engine: collision detection, hit resolution, enemy AI behaviors, and boss battle mechanics

- Developed attack animations and entities
- Damage calculations and balanced character fluidity throughout
- Co-led creative development, adding story and layers to the game.


<!-- TODO: add 1-2 more specifics that are true, e.g. damage/knockback system, attack animations, enemy behavior state machine -->

Architecture

Modular entity-component system in JavaScript: entities (player, enemies, NPCs) share
components for movement, collision, and rendering, with per-entity behavior logic layered
on top. Dialogue sequencing and NPC state transitions run through the same system.

Tech Stack

JavaScript (p5.js) · HTML5/CSS3 · Git/GitHub

How to Run

bashgit clone https://github.com/ayeethemba/YOUR-FORK-NAME.git

Open index.html in your browser. No dependencies or installs required.

Controls (** All Key Binds are mappable **):
<!-- TODO: fill in (e.g. Arrow keys / WASD to move, X to attack, Z to interact) -->

- WAD - Movement
- S - Interact
- K - Heavy Atk
- J - Light Atk
- Shift - Sprint
- G - Special


<!-- Once GitHub Pages is enabled (Settings → Pages → Deploy from branch → main), add:
**[▶ Play it in your browser](https://ayeethemba.github.io/YOUR-FORK-NAME/)**
and move that link up under the title. -->
Team


- Themba Chika — co-lead, combat engine
- Kyla Carver - Level Design
- Nathan Dubuc - Dialogue System & Head Creative Dev
- Thomas Doby - Sound and SFX Dev
- Finn Bernuy - Sprites and animations
Credits

<!-- TODO: if any sprites/sounds weren't made by the team, credit the sources here; if all custom, say "All sprites and sound effects created by the team." -->
