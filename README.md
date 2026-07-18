That Time I Was an Office Worker and Put into a Coma by a Demon Sleep God

**[▶ Play it in your browser](https://ayeethemba.github.io/2D-rpgEngine/)**

A 2D side-scrolling RPG built with JavaScript and p5.js for CS 345 (Software Engineering)
at James Madison University, Spring 2026. Forked from chaoaj/sp26_cs345_team03.

Show Image

About

You play an office worker pulled into a coma by a demon sleep god. Fight through
levels, talk to NPCs through a dialogue system, and defeat the boss to wake up.

My Contributions (Co-Lead, Combat Engine)


Co-led the 5-person team: task breakdown, Git branching strategy, and keeping main stable across 133+ commits
Built the combat engine: collision detection, hit resolution, enemy AI behaviors, and boss battle mechanics
Developed attack animations and combat entities, including the damage calculation system
Tuned combat balance and movement feel so fights stay responsive across light, heavy, and special attacks
Contributed to creative direction: story beats and level structure


Architecture

Modular entity-component system in JavaScript: entities (player, enemies, NPCs) share
components for movement, collision, and rendering, with per-entity behavior logic layered
on top. Dialogue sequencing and NPC state transitions run through the same system.

Tech Stack

JavaScript (p5.js) · HTML5/CSS3 · Git/GitHub

How to Run

Play instantly in the browser via the link above, or run locally:

bashgit clone https://github.com/ayeethemba/2D-rpgEngine.git

Open index.html in your browser. No dependencies or installs required.

Controls

All key binds are remappable.

KeyActionW / A / DMoveSInteractJLight attackKHeavy attackGSpecialShiftSprint

Team


Themba Chika — co-lead, combat engine
Kyla Carver — level design
Nathan Dubuc — dialogue system, head creative dev
Thomas Doby — sound and SFX
Finn Bernuy — sprites and animations


Credits

All sprites, animations, and sound effects created by the team.

<!-- Confirm this is true; if any assets were borrowed (fonts, sound packs, sprite bases), credit the source here instead -->
