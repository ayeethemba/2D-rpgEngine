let retryScreenOpacity = 140;

let gameState = "music";
let selectedClass = "";
let canScreenshot = true;
let frameWait = 0;

let town1Sprite;
let town2Sprite;
let town3Sprite;
let town4Sprite;

let sprinting = false;
let hurtFrameCounter = 0;
let playerCanBeHurt = true;
let sprintVel;
let testText = ""
let testCount = 0
let nightmareSong
let musicGirei;
let musicCredits;
let creditsPhase = 0;
let creditsTimer = 0;
let creditsScrollY = 0;
let specialMusicRef = null;
let barPlaylist = [];
let barSongIndex = 0;
let barMuted = false;
let barNextButton;
let barMuteButton;
let canSprint = true;
let sprintSound;
let enemyWaves = 0;
let isFocusing
let enemyGameState = "none"

let musicEnemies;
let musicBoss
let hurtSound
let hurtSound2
let chargingSound
let musicTown
let helped = false;
let playerLaunched = false;
let launchAmount = 0;

const GAME_W = 960;
const GAME_H = 540;
let scaleFactor = 1;
let scaleOffsetX = 0;
let scaleOffsetY = 0;

function toScreenX(gx) { return scaleOffsetX + gx * scaleFactor; }
function toScreenY(gy) { return scaleOffsetY + gy * scaleFactor; }
function gameMX() { return (mouseX - scaleOffsetX) / scaleFactor; }
function gameMY() { return (mouseY - scaleOffsetY) / scaleFactor; }

let fadingFromBlack = false;
let blackFadeCount = 500;

let startButton;
let settingsButton;
let quitButton;
let devSkipBarButton;
let backButton;

let isPaused = false;
let pauseSubScreen = "main"
let pauseMenuButton;
let pauseResumeButton;
let pauseSettingsButton;
let pauseQuitButton;
let pauseSnapshot = null;

let masterVolumeSlider;
let musicVolumeSlider;
let sfxVolumeSlider;

let musicTrack = [];
let sfxTrack = [];

let mouseReleased = false;
//-1 means not waiting, 0 means waiting with no click
//1 means something is waiting and the mouse has been clicked
let entityWaitingForMouse = -1;

// keybind system
// each binding is { type: "key" | "mouse" | "none", code?, button?, label }
let keybinds;
let keyMappingButton;
let rebindingAction = null;
let rebindArmed = false;  // becomes true after the input that triggered rebind is released
let keyMapInputArmed = false; // becomes true after the click that opened keymap is released
let prevMouseIsPressedState = false;

const KEYMAP_ACTIONS = [
  { id: "jump",        label: "Jump"         },
  { id: "moveLeft",    label: "Move Left"    },
  { id: "moveRight",   label: "Move Right"   },
  { id: "heavyAttack", label: "Heavy Attack" },
  { id: "lightAttack", label: "Light Attack" },
  { id: "sprint", label: "Sprint"},
  { id: "focus", label: "Focus"},
  { id: "interact", label: "Interact"},
  { id: "special",  label: "Special Ability"}
];

let specialBar = 0;
let maxSpecialBar = 100;
let isTimeStop = false;
let timeStopTimer = 0;
let isRageMode = false;
let rageModeTimer = 0;
let mushroomReceived = false;
let showMushroomPopup = false;
let bartenderDia;
let sfxZaWarudo;
let sfxSaiyan;
let npc2Sprite, npc3Sprite, npc4Sprite, npc5Sprite;
let rageProjectiles = [];
let bartenderTalkStarted = false;

let isDialogue = false;

let mageButton;
let meleeButton;

let sfxLightMelee;
let sfxHeavyMelee;
let sfxLightMage;
let sfxHeavyMage;
let sfxAmbience;

let HP;
let maxHP;
let magic;
let maxMagic;
let stamina;
let maxStamina;

let stars = [];
let particles = [];
let poemLines;
let frames = 0;
let tenFrames = 0;
let fireflies = [];
let fairySprite;
let playerTalkSprite;
let dialogueSprite;
let npcSprites;
let traderSprite;
let leaderSprite;
let skipDialogueButton;
let mageSprite;
let meleeSprite;

// pre-rendered static background buffers
let menuBgBuffer;
let introSkyBuffer;
let vignetteBuffer;

// main menu panel
let menuPanel = {
  get x() { return GAME_W * 0.073 },
  get y() { return GAME_H * 0.05 },
  get w() { return GAME_W * 0.238 },
  get h() { return GAME_H * 0.80 }
};

// intro level
let introStage = 0;
let cameraX = 0;
let worldWidth = 2400;

let introDialogue = "";
let introPrompt = "";
let introObjective = "";

// player
let spriteSheet;
let playerX = 200;
let playerY;
let groundY;
let velY = 0;
let facingLeft = false;
let currentFrame = 0;
let moveFrameIndex = 0;
let animTimer = 0;
let onGround = false;

const frameWidth = 320;
const frameHeight = 320;
const drawSize = 80;
const gravity = 0.6;
const jumpForce = -14;

// attacks
let atkLightSheet;
let atkHeavySheet;
let attackType = "";   // "", "light", "heavy"
let attackFrame = 0;
let attackTimer = 0;
const attackFrameSpeed = 3; // draw frames per sprite frame

// mage projectile system
let mageProjectiles = [];

// melee attack system
let meleeAttacks = [];

// Hollow Purple charge system (mage heavy)
let isCharging = false;
let chargeTime = 0;
const maxChargeTime = 180; // 3 seconds at 60fps caps the charge

// extra sfx globals
let sfxWalking;
let sfxBarFull;
let sfxTextLoop;
let wasWalking = false;

//enemy spawning
let introEnemiesSpawned = false;
let forestEnemiesSpawned = false;

function buildMenuBgBuffer() {
  if (menuBgBuffer) menuBgBuffer.remove();
  menuBgBuffer = createGraphics(GAME_W, GAME_H);
  let pg = menuBgBuffer;

  for (let y = 0; y < GAME_H; y++) {
    let t = map(y, 0, GAME_H, 0, 1);
    let top = color(13, 14, 28);
    let mid = color(28, 24, 48);
    let bot = color(70, 52, 92);
    let c = t < 0.55 ? lerpColor(top, mid, t / 0.55) : lerpColor(mid, bot, (t - 0.55) / 0.45);
    pg.stroke(c);
    pg.line(0, y, GAME_W, y);
  }
  pg.noStroke();

  let glowX = GAME_W * 0.63;
  let glowY = GAME_H * 0.22;
  for (let i = 0; i < 10; i++) {
    pg.fill(205, 215, 255, 10 - i * 0.7);
    pg.ellipse(glowX, glowY, 320 - i * 24, 220 - i * 16);
  }
  pg.fill(220, 230, 255, 14);
  pg.ellipse(glowX, glowY, 130, 90);

  pg.fill(25, 22, 42);
  pg.beginShape();
  pg.vertex(0, GAME_H * 0.72);
  pg.vertex(GAME_W * 0.06, GAME_H * 0.63);
  pg.vertex(GAME_W * 0.14, GAME_H * 0.68);
  pg.vertex(GAME_W * 0.22, GAME_H * 0.56);
  pg.vertex(GAME_W * 0.30, GAME_H * 0.65);
  pg.vertex(GAME_W * 0.39, GAME_H * 0.50);
  pg.vertex(GAME_W * 0.49, GAME_H * 0.63);
  pg.vertex(GAME_W * 0.58, GAME_H * 0.52);
  pg.vertex(GAME_W * 0.68, GAME_H * 0.66);
  pg.vertex(GAME_W * 0.78, GAME_H * 0.56);
  pg.vertex(GAME_W * 0.88, GAME_H * 0.67);
  pg.vertex(GAME_W, GAME_H * 0.58);
  pg.vertex(GAME_W, GAME_H);
  pg.vertex(0, GAME_H);
  pg.endShape(CLOSE);

  pg.fill(17, 15, 28);
  pg.beginShape();
  pg.vertex(0, GAME_H * 0.82);
  pg.vertex(GAME_W * 0.08, GAME_H * 0.73);
  pg.vertex(GAME_W * 0.16, GAME_H * 0.79);
  pg.vertex(GAME_W * 0.24, GAME_H * 0.67);
  pg.vertex(GAME_W * 0.33, GAME_H * 0.78);
  pg.vertex(GAME_W * 0.42, GAME_H * 0.69);
  pg.vertex(GAME_W * 0.52, GAME_H * 0.83);
  pg.vertex(GAME_W * 0.61, GAME_H * 0.70);
  pg.vertex(GAME_W * 0.71, GAME_H * 0.81);
  pg.vertex(GAME_W * 0.81, GAME_H * 0.69);
  pg.vertex(GAME_W * 0.91, GAME_H * 0.80);
  pg.vertex(GAME_W, GAME_H * 0.73);
  pg.vertex(GAME_W, GAME_H);
  pg.vertex(0, GAME_H);
  pg.endShape(CLOSE);

  pg.push();
  pg.translate(GAME_W * 0.67, GAME_H * 0.52);
  pg.fill(9, 9, 15);
  pg.rect(-36, 95, 170, 170);
  pg.rect(18, 18, 32, 247);
  pg.rect(82, 52, 36, 213);
  pg.rect(-74, 46, 34, 219);
  pg.triangle(-74, 46, -57, 6, -40, 46);
  pg.triangle(18, 18, 34, -28, 50, 18);
  pg.triangle(82, 52, 100, 10, 118, 52);
  pg.rect(17, 176, 40, 89, 13);
  pg.fill(255, 210, 50, 32);
  pg.rect(-24, 130, 12, 18);
  pg.rect(66, 118, 12, 18);
  pg.rect(92, 128, 12, 18);
  pg.pop();
}

function buildIntroSkyBuffer() {
  if (introSkyBuffer) introSkyBuffer.remove();
  introSkyBuffer = createGraphics(GAME_W, GAME_H);
  let pg = introSkyBuffer;

  for (let y = 0; y < GAME_H; y++) {
    let t = map(y, 0, GAME_H, 0, 1);
    let c1 = color(17, 15, 31);
    let c2 = color(48, 61, 72);
    let c3 = color(84, 90, 88);
    let c = t < 0.58 ? lerpColor(c1, c2, t / 0.58) : lerpColor(c2, c3, (t - 0.58) / 0.42);
    pg.stroke(c);
    pg.line(0, y, GAME_W, y);
  }
  pg.noStroke();
  pg.fill(220, 240, 255, 18);
  pg.ellipse(GAME_W * 0.72, 110, 180, 120);
}

function buildVignetteBuffer() {
  if (vignetteBuffer) vignetteBuffer.remove();
  vignetteBuffer = createGraphics(GAME_W, GAME_H);
  let pg = vignetteBuffer;
  pg.noFill();
  for (let i = 0; i < 78; i++) {
    pg.stroke(0, 0, 0, 3);
    pg.rect(-i, -i, GAME_W + i * 2, GAME_H + i * 2);
  }
  pg.noStroke();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  updateGameScale();

  town4Sprite = town4Sprite.get(162, 0, 1118, 677)
  traderSprite = npcSprites.get(40, 0, 240, 240);
  leaderSprite = npcSprites.get(1640, 0, 240, 240);
  npc2Sprite   = npcSprites.get(360, 0, 240, 240);
  npc3Sprite   = npcSprites.get(680, 0, 240, 240);
  npc4Sprite   = npcSprites.get(1000, 0, 240, 240);
  npc5Sprite   = npcSprites.get(1320, 0, 240, 240);
  mageSprite = mageSprite.get(40, 0, 240, 240);
  meleeSprite = meleeSprite.get(40, 0, 240, 240);
  forestSprite = forestSprite.get(10, 7, 2489, 570);

  for (let i = 0; i < 80; i++) {
    stars.push({
      x: random(GAME_W),
      y: random(GAME_H * 0.55),
      size: random(1, 2.8),
      alpha: random(60, 170),
      speed: random(0.002, 0.01)
    });
  }

  for (let i = 0; i < 35; i++) {
    particles.push({
      x: random(GAME_W),
      y: random(GAME_H),
      size: random(2, 4),
      speedX: random(-0.12, 0.12),
      speedY: random(-0.22, -0.04),
      alpha: random(20, 70)
    });
  }

  for (let i = 0; i < 18; i++) {
    fireflies.push({
      x: random(worldWidth),
      y: random(180, 360),
      offset: random(1000),
      size: random(3, 5)
    });
  }

  musicButton = createMusicButton("Allow music?", 0, 0, function() {
    initMusic();
    updateUI();
    musicButton.hide();
    gameState = "menu"
    updateUI();
  })
  musicButton.size(300 * scaleFactor, 100 * scaleFactor);
  musicButton.position(toScreenX(GAME_W / 2) - 150 * scaleFactor, toScreenY(GAME_H / 2) - 50 * scaleFactor);
  skipDialogueButton = createMusicButton("Skip Dialogue", 0, 0, function() {
    if (!canFindTimer("text")) {
      diaIndex = 0;
      nextDiaLine = 0;
      isDialogue = false;
      nextDialogueReady = false
      for (i = 0; i < entityCount; i++) {
        if (entities[i].constructor === Dialogue) {
          //entities[i].endDialogueEarly()
        }
      }
      if (sfxTextLoop) sfxTextLoop.stop();
      skipDialogueButton.hide();
      updateUI();
    }
  })
  skipDialogueButton.hide();
  skipDialogueButton.size(200 * scaleFactor, 80 * scaleFactor);
  skipDialogueButton.position(toScreenX(GAME_W / 2) - 100 * scaleFactor, toScreenY(GAME_H / 2) - 40 * scaleFactor)

  startButton = createMainMenuButton("Start", 0, 0, function() {
    gameState = "poem";
    updateUI();
  });

  settingsButton = createMainMenuButton("Settings", 0, 0, function() {
    gameState = "settings";
    updateUI();
  });

  quitButton = createMainMenuButton("Quit", 0, 0, function() {
    gameState = "quit";
    updateUI();
  });

  devSkipBarButton = createMainMenuButton("[DEV] Skip to Bar", 0, 0, function() {
    devSkipToTavern();
  });
  devSkipBarButton.style('font-size', '12px');
  devSkipBarButton.style('opacity', '0.7');

  retryButton = createRetryButton("Retry", toScreenX(GAME_W * 0.4), toScreenY(GAME_H * 0.66), function () {
    gameState = "menu";
    mouseReleased = false;
    retryScreenOpacity = 0;
    HP = maxHP;
    updateUI();
  });
  


  mageButton = createMainMenuButton("Mage", 0, 0, function() {
    selectedClass = "Mage";
    initIntroLevel();
    introEnemiesSpawned = false;
    fadingFromBlack = true;
    gameState = "introLevel";
    stopMusic();
    //musicIntro.stop();
    //musicDream.stop();
    if (musicDream) musicDream.loop();
    mouseReleased = false;
    updateUI();
  });
  mageButton.size(200, 62);

  meleeButton = createMainMenuButton("Melee", 0, 0, function() {
    selectedClass = "Melee";
    initIntroLevel();
    fadingFromBlack = true;
    gameState = "introLevel";
    //musicIntro.stop();
    //musicDream.stop();
    stopMusic();
    if (musicDream) musicDream.loop();
    mouseReleased = false;
    updateUI();
  });
  meleeButton.size(200, 62);

  backButton = createButton("Back");
  backButton.size(98, 40);
  backButton.position(toScreenX(26), toScreenY(22));
  styleSecondaryButton(backButton);
  backButton.mousePressed(function() {
    if (isPaused && pauseSubScreen === "keymap") {
      pauseSubScreen = "settings";
      rebindingAction = null;
      mouseReleased = false;
      updateUI();
      return;
    }
    if (isPaused && pauseSubScreen === "settings") {
      pauseSubScreen = "main";
      mouseReleased = false;
      updateUI();
      return;
    }
    if (gameState === "keyMapping") {
      rebindingAction = null;
      mouseReleased = false;
      gameState = "settings";
      updateUI();
      return;
    }
    if (gameState === "settings" || gameState === "quit" || gameState === "poem") {
      mouseReleased = false;
      gameState = "menu";
      //musicIntro.stop();
      //musicDream.stop();
      stopMusic();
      musicIntro.loop();
    } else if (gameState === "classSelect") {
      mouseReleased = false;
      gameState = "poem";
    } else if (gameState === "introLevel") {
      gameState = "classSelect";
      if (sfxAmbience) sfxAmbience.stop();
      if (sfxWalking && sfxWalking.isPlaying()) sfxWalking.stop();
      if (sfxTextLoop && sfxTextLoop.isPlaying()) sfxTextLoop.stop();
    } else {
      gameState = "menu";
    }
    updateUI();
  });

pauseMenuButton = createButton("☰");
pauseMenuButton.size(44, 44);
pauseMenuButton.position(toScreenX(26), toScreenY(22));
styleSecondaryButton(pauseMenuButton);
pauseMenuButton.style("font-size", "22px");
pauseMenuButton.mousePressed(function() {
  if (gameState === "introLevel" || gameState === "introForest" || gameState === "townLevel" || gameState === "bossLevel" || gameState === "tavernLevel" || gameState === "dungeonLevel") {
    isPaused = true;
    resetAttackStuff()
    pauseSubScreen = "main";
    mouseReleased = false;
    updateUI();
  }
});

pauseResumeButton = createMainMenuButton("Resume", 0, 0, function() {
  isPaused = false;
  pauseSnapshot = null;
  mouseReleased = false;
  updateUI();
  mouseReleased = false;
  updateUI();
});

pauseSettingsButton = createMainMenuButton("Settings", 0, 0, function() {
  pauseSubScreen = "settings";
  mouseReleased = false;
  updateUI();
});

pauseQuitButton = createMainMenuButton("Quit", 0, 0, function() {
  isPaused = false;
  pauseSnapshot = null;
  pauseSubScreen = "main";
  gameState = "menu";
  if (sfxAmbience) sfxAmbience.stop();
  if (sfxWalking && sfxWalking.isPlaying()) sfxWalking.stop();
  if (sfxTextLoop && sfxTextLoop.isPlaying()) sfxTextLoop.stop();
  //musicDream.stop();
  stopMusic();
  musicIntro.loop();
  mouseReleased = false;
  updateUI();
});

layoutPauseButtons();


  barNextButton = createButton("Next Song ▶");
  barNextButton.size(120, 36);
  styleSecondaryButton(barNextButton);
  barNextButton.mousePressed(function() {
    if (barPlaylist.length === 0) return;
    barPlaylist[barSongIndex].stop();
    barSongIndex = (barSongIndex + 1) % barPlaylist.length;
    if (!barMuted) barPlaylist[barSongIndex].loop();
  });
  barNextButton.hide();

  barMuteButton = createButton("Mute 🔇");
  barMuteButton.size(90, 36);
  styleSecondaryButton(barMuteButton);
  barMuteButton.mousePressed(function() {
    barMuted = !barMuted;
    if (barMuted) {
      barPlaylist[barSongIndex].stop();
      barMuteButton.html("Unmute 🔊");
    } else {
      barPlaylist[barSongIndex].loop();
      barMuteButton.html("Mute 🔇");
    }
  });
  barMuteButton.hide();

  masterVolumeSlider = createSlider(0, 100, 50);
  musicVolumeSlider  = createSlider(0, 100, 50);
  sfxVolumeSlider    = createSlider(0, 100, 50);

  keybinds = getDefaultKeybinds();

  keyMappingButton = createButton("Key Mapping");
  styleSecondaryButton(keyMappingButton);
  keyMappingButton.mousePressed(enterKeyMapping);
  keyMappingButton.hide();

  layoutVolumeSliders();

  buildMenuBgBuffer();
  buildIntroSkyBuffer();
  buildVignetteBuffer();
  layoutMenuButtons();
  layoutClassButtons();
  updateUI();

  // Allow direct return links into intro level from sub-pages.
  try {
    let params = new URLSearchParams(window.location.search);
    let startState = params.get("state");
    let urlClass = params.get("class");
    if (urlClass === "Mage" || urlClass === "Melee") {
      selectedClass = urlClass;
    }
    if (startState === "introLevel" && (selectedClass === "Mage" || selectedClass === "Melee")) {
      initIntroLevel(true);
      fadingFromBlack = true;
      gameState = "introLevel";
      musicButton.hide();
      //musicIntro.stop();
      //musicDream.stop();
      stopMusic();
      if (musicDream) musicDream.loop();
      mouseReleased = false;
      updateUI();
    }
  } catch (e) {
    // Ignore malformed URL params.
  }

}

function updateGameScale() {
  scaleFactor = min(windowWidth / GAME_W, windowHeight / GAME_H);
  scaleOffsetX = (windowWidth - GAME_W * scaleFactor) / 2;
  scaleOffsetY = (windowHeight - GAME_H * scaleFactor) / 2;
}

function preload() {
  poemLines = loadStrings("./libraries/data/intro_poem.txt");
  fairyDia = loadStrings("./libraries/data/dialogue/fairy.txt");
  traderDia = loadStrings("./libraries/data/dialogue/trader.txt");
  leaderDia = loadStrings("./libraries/data/dialogue/leader.txt");
  npcSprites = loadImage("sprites/sprint6/npcs_New.png");
  mageSprite = loadImage("sprites/sprint2/mage_class_320x320.png");
  meleeSprite = loadImage("sprites/sprint2/melee_class_320x320.png");
  forestSprite = loadImage("sprites/sprint5/forest.png")
  town1Sprite = loadImage("sprites/sprint5/townLevel1.png");
  town2Sprite = loadImage("sprites/sprint5/townLevel2.png");
  town3Sprite = loadImage("sprites/sprint5/townLevel3.png");
  town4Sprite = loadImage("sprites/sprint5/townLevel4.png");
  
  chargingSound = loadSound("sounds/charging.mp3");
  hurtSound = loadSound("sounds/hurt.wav");
  hurtSound2 = loadSound("sounds/hurt2.mp3");
  sfxLightMelee = loadSound("sounds/light swing.mp3");
  sfxHeavyMelee = loadSound("sounds/heavy swing.mp3");
  sfxLightMage  = loadSound("sounds/light spell.mp3");
  sfxHeavyMage  = loadSound("sounds/heavy spell.mp3");
  sfxAmbience = loadSound("sounds/forest ambience.mp3");
  musicIntro = loadSound("sounds/music/introScreen.mp3");
  musicDream = loadSound("sounds/music/Dream3.wav");
  musicBoss = loadSound("sounds/music/BossSong.wav");
  musicTown = loadSound("sounds/music/townSong.wav");
  musicEnemies = loadSound("sounds/music/fightingEnemies.mp3");
  nightmareSong = loadSound("sounds/music/nightmare.wav");
  musicGirei   = loadSound("sounds/music/Girei.mp3");
  musicCredits = loadSound("sounds/music/End Music/01. Elden Ring.mp3");
  sfxZaWarudo = loadSound("sounds/special music/hd-stardust-crusaders-za-warudo_1.mp3");
  sfxSaiyan   = loadSound("sounds/special music/saiyan.mp3");
  bartenderDia = loadStrings("./libraries/data/dialogue/bartender.txt");
  barPlaylist = [
    loadSound("sounds/music/Bar Music/starter.mp3"),
    loadSound("sounds/music/Bar Music/Travis Scott - SICKO MODE ft. Drake.mp3"),
    loadSound("sounds/music/Bar Music/Alice in Chains - Man In the Box.mp3"),
    loadSound("sounds/music/Bar Music/Disco Lines - No Broke Boys.mp3"),
    loadSound("sounds/music/Bar Music/Mobb Deep - Shook Ones pt.ll.mp3"),
    loadSound("sounds/music/Bar Music/Fortnite - Orange Justice - Emote Music Audio.mp3"),
    loadSound("sounds/music/Bar Music/Terreria Jungle.mp3")
  ];

  sprintSound = loadSound("sounds/sprintSound.wav");
  sfxWalking  = loadSound("sounds/walking hard_surface2.mp3");
  sfxBarFull  = loadSound("sounds/bar full.mp3");
  sfxTextLoop = loadSound("sounds/text loop.mp3");

  musicTrack = [
  { sound: musicIntro, base: 0.4 },
  { sound: musicDream, base: 0.4 },
  { sound: musicEnemies, base: 1.5 },
  { sound: musicBoss,  base: 0.4},
  { sound: musicTown,  base: 0.7},
  { sound: nightmareSong, base: 1.0},
  { sound: musicGirei,   base: 0.6 },
  { sound: musicCredits, base: 0.55 }
];

sfxTrack = [
  { sound: sfxLightMelee, base: 0.3 },
  { sound: sfxHeavyMelee, base: 0.3 },
  { sound: sfxLightMage,  base: 0.2 },
  { sound: sfxHeavyMage,  base: 0.5 },
  { sound: sfxAmbience,   base: 0.4 },
  { sound: sfxWalking,    base: 0.35 },
  { sound: sfxBarFull,    base: 0.5 },
  { sound: sfxTextLoop,   base: 0.2 },
  { sound : sprintSound,  base: 0.4},
  { sound : hurtSound, base: 0.2},
  { sound : hurtSound2, base: 2.0},
  { sound : chargingSound, base: 0.5},
  { sound: sfxZaWarudo, base: 0.7 },
  { sound: sfxSaiyan,   base: 0.8 }
];
}

function draw() {

  background(0);
  translate(scaleOffsetX, scaleOffsetY);
  scale(scaleFactor);
  
  frames++;
  if (frames > 9) frames = 0;
  if (frames == 9 && frameWait > 0) frameWait--;
  tenFrames++;
  if (tenFrames > 99) tenFrames = 0;
  if (!(playerCanBeHurt)) {
    hurtFrameCounter++
    if (hurtFrameCounter > 30) {
      playerCanBeHurt = true;
      hurtFrameCounter = 0
    }
  }
  
  if (sprinting && !(canFindTimer("sprint"))) {
    
    sprinting = false;
  }

  
  if (gameState !== "introLevel" && gameState !== "introForest" && gameState !== "townLevel" && gameState !== "bossLevel" && gameState !== "tavernLevel" && gameState !== "dungeonLevel" && gameState !== "creditsScreen") drawFantasyBackground();

  if (gameState === "menu") {
    drawMenuPanel();
    drawTitle();
  } else if (gameState === "poem") {
    drawPoemScreen();
  } else if (gameState === "classSelect") {
    drawClassSelectScreen();
  } else if (gameState === "introLevel") {
    //drawIntroLevelScreen();
    updateIntroLevel();
    drawIntroLevelScreen();
    if (fadingFromBlack) {
      fill(0, 0, 0, blackFadeCount)
      rect(0, 0, GAME_W, GAME_H)
      blackFadeCount -= 5;
      if (blackFadeCount <= 0) {
        /*let cross1 = new CrossAtk(GAME_W / 2, GAME_H / 2, 1)
        let cross3 = new CrossAtk(10, GAME_H / 2, 1)
        let cross2 = new CrossAtk(300, 200, 1)
        let cross4 = new CrossAtk(30, GAME_H, 1)
        let cross5 = new CrossAtk(300, GAME_H, 1)*/
        fadingFromBlack = false;
        skipDialogueButton.show();
        //level1DevButton.show();
        //testLevelButton.show();
        //bossLevelButton.show();
        pauseMenuButton.show();
        blackFadeCount = 500;
        //enemyWaves = 0;
      }
    }
    if (enemyWaves == 0 && playerX > worldWidth / 4) {
      //spawnEnemy("lar", "right")
      //spawnEnemy("med", "right")
      enemyWaves++;
      //initTownLevel()
      initBossLevel()
      //initTownLevel()
    }
    if (playerX > worldWidth - (worldWidth / 16)) {
      playerX = 10;
      cameraX = 0;
      enemyWaves = 0;
      cleanEntities()
      gameState = "introForest"
      worldWidth = 4960
      forestEnemiesSpawned = false;
      helped = false;
      updateUI();
      //initBossLevel();
    }
  } else if (gameState === "introForest") {

    if (!helped) {
      introObjective = "Venture deeper into the forest";
    } else if (enemiesAlive > 0) {
      introObjective = "Defeat all enemies (" + enemiesAlive + " remaining)";
    } else if (enemyWaves >= 3) {
      introObjective = "Go right to continue";
    } else {
      introObjective = "Survive the waves";
    }
    drawIntroForestScreen();
    if (!(helped) && playerX > (GAME_W / 6)) {
      helped = true;
      if (sfxWalking) sfxWalking.stop()
      initDiaFile("help")
      if (musicDream) musicDream.stop()
      musicEnemies.loop()
      spawnEnemy("sml", "right-ish");
      spawnEnemy("sml", "right");
      spawnEnemy("sml", "left");
      spawnEnemy("med", "middle");
      enemyWaves = 1
    }
    if (enemyWaves == 1 && enemiesAlive <= 0) {
      spawnEnemy("med", "right-ish");
      spawnEnemy("med", "right");
      spawnEnemy("sml", "left-ish");
      spawnEnemy("sml", "left");
      spawnEnemy("sml", "middle");
      spawnEnemy("med", "middle");
      spawnEnemy("sml", "left");
      spawnEnemy("sml", "right-ish");
      enemyWaves++
    }
    if (enemyWaves == 2 && enemiesAlive <= 0) {
      spawnEnemy("sml", "right-ish");
      spawnEnemy("sml", "right");
      spawnEnemy("sml", "left-ish");
      spawnEnemy("sml", "left");
      spawnEnemy("sml", "middle");
      spawnEnemy("sml", "middle");
      spawnEnemy("sml", "left");
      spawnEnemy("sml", "right-ish");
      spawnEnemy("sml", "right");
      spawnEnemy("sml", "right-ish");
      spawnEnemy("sml", "left");
      spawnEnemy("sml", "middle");
      spawnEnemy("sml", "right");

      enemyWaves++
    }
    if (playerX > 4960 - (GAME_W / 6) && enemiesAlive <= 0) {
      initTownLevel();
    }

  } else if (gameState === "townLevel") {

    if (enemyGameState === "none") {
      introObjective = "Speak to the trader";
    } else if (enemyGameState === "duringRaid" || enemyGameState === "raid") {
      introObjective = enemiesAlive > 0 ? "Defend the town! (" + enemiesAlive + " remaining)" : "Hold the line...";
    } else if (enemyGameState === "postRaid") {
      introObjective = "The town is safe. Find the tavern.";
    }
    drawTownLevel();
    if (enemyGameState === "raid") {
      enemyWaves = 1
      spawnWave("sml", 10)
      enemyGameState = "duringRaid"
    } else if (enemiesAlive <= 0 && enemyWaves == 1) {
      cleanEntities()
      spawnWave("sml", 7)
      spawnWave("med", 4)
      enemyWaves++
    } else if (enemiesAlive <= 0 && enemyWaves == 2) {
      cleanEntities()
      spawnWave("sml", 7)
      spawnWave("med", 5)
      spawnWave("lar", 2)
      enemyWaves++
    } else if (enemiesAlive <= 0 && enemyWaves == 3) {
      cleanEntities()
      spawnWave("sml", 5)
      spawnWave("med", 5)
      spawnWave("lar", 3)
      enemyWaves++
    } else if (enemiesAlive <= 0 && enemyWaves == 4) {
      cleanEntities()
      spawnWave("sml", 5)
      spawnWave("med", 8)
      spawnWave("lar", 2)
      enemyWaves++
    } else if (enemiesAlive <= 0 && enemyWaves == 5) {
      cleanEntities()
      spawnWave("sml", 10)
      enemyWaves++
    } else if (enemiesAlive <= 5 && enemyWaves == 5) {
      cleanEntities()
      spawnWave("sml", 10)
      enemyWaves++
    } else if (enemiesAlive <= 0 && enemyWaves == 5) {
      cleanEntities()
      spawnWave("sml", 10)
      enemyWaves++
    } else if (enemiesAlive <= 0 && enemyWaves == 6) {
      cleanEntities()
      enemyGameState = "postRaid"
    }
    /*if (mouseIsPressed && frameWait <= 0) {
      frameWait = 10;
      let picture1;
      picture1 = get(0, 0, width, (height * 1) / 1);
      picture1.save("screenshot" + playerX + ".png");
      playerX += width;
    }*/
   if (enemyGameState === "postRaid" && playerX > 4400 - (GAME_W / 6) && enemiesAlive <= 0) {
      initTavernLevel();
   }

  } else if (gameState === "bossLevel") {

    drawBossLevel();
    if (enemyWaves == 0 && playerX > (GAME_W / 6)) {
      spawnEnemy("boss", "right");
    if (enemyWaves == 0 && playerX > (width / 6)) {
      //spawnEnemy("lar", "right");
      //spawnEnemy("boss", "right");
      //spawnEnemy("boss", "right");
      //spawnEnemy("lar", "right");
      let boss = new Boss()
      //let cross = new CrossAtk(100, 100, 1)
      enemyWaves++;
    }
    if (enemyWaves >= 1 && enemiesAlive <= 0) {
      initCreditsScreen();
    }

  } else if (gameState === "creditsScreen") {
    drawCreditsScreen();

  } else if (gameState === "tavernLevel") {
    introObjective = mushroomReceived ? "Leave through the exit on the right" : "Speak to the bartender";
    drawTavernLevel();
    // Bartender interaction: player near bar and presses interact
    if (!isDialogue && !mushroomReceived && playerX > worldWidth - 520 && keyIsDown(83)) {
      if (!bartenderTalkStarted) {
        bartenderTalkStarted = true;
        initDiaFile("bartender");
      }
    } else if (!isDialogue && playerX < worldWidth - 520) {
      bartenderTalkStarted = false;
    }
  } else if (gameState === "dungeonLevel") {

    introObjective = enemiesAlive > 0 ? "Defeat enemies (" + enemiesAlive + " remaining)" : "Descend deeper...";
    drawDungeonLevelScreen();
    if (enemyWaves === 0 && playerX > GAME_W / 6) {
      spawnEnemy("sml", "right-ish");
      spawnEnemy("sml", "right");
      spawnEnemy("sml", "left");
      spawnEnemy("med", "middle");
      spawnEnemy("sml", "right");
      enemyWaves = 1;
    }
    if (enemyWaves === 1 && enemiesAlive <= 0) {
      spawnEnemy("med", "right-ish");
      spawnEnemy("med", "right");
      spawnEnemy("sml", "left-ish");
      spawnEnemy("sml", "left");
      spawnEnemy("lar", "middle");
      spawnEnemy("sml", "right");
      spawnEnemy("med", "right-ish");
      enemyWaves = 2;
    }
    if (enemyWaves === 2 && enemiesAlive <= 0) {
      spawnEnemy("lar", "right-ish");
      spawnEnemy("sml", "right");
      spawnEnemy("med", "left-ish");
      spawnEnemy("sml", "left");
      spawnEnemy("lar", "middle");
      spawnEnemy("med", "right");
      spawnEnemy("sml", "left");
      spawnEnemy("med", "right-ish");
      spawnEnemy("sml", "right");
      enemyWaves = 3;
    }
    if (enemyWaves === 3 && enemiesAlive <= 0 && playerX > 4800 - (GAME_W / 6)) {
      introObjective = "Face the final guardian...";
      initBossLevel();
    }

  } else if (gameState === "settings") {
    drawSettingsScreen();
  } else if (gameState === "keyMapping") {
    drawKeyMappingScreen();
  } else if (gameState === "quit") {
    drawQuitScreen();
  } else if (gameState === "deathScreen") {
    drawRetryScreen();
  }
  if (entityWaitingForMouse == 0 && mouseIsPressed && !canFindTimer("text")) {
    if (isDialogue) {
      if (gameMY() > (GAME_H * 3) / 4) {
        entityWaitingForMouse = 1;
      }
    } else {
      entityWaitingForMouse = 1;
    }
    
  }

  // Time stop overlay
  if (isTimeStop && (gameState === "introLevel" || gameState === "introForest" || gameState === "townLevel" || gameState === "bossLevel" || gameState === "tavernLevel" || gameState === "dungeonLevel")) {
    let progress = timeStopTimer / 420;
    fill(20, 0, 60, map(progress, 1, 0.7, 0, 80, true));
    noStroke();
    rect(0, 0, GAME_W, GAME_H);
    if (timeStopTimer > 360) {
      fill(255, 240, 80, map(timeStopTimer, 420, 360, 0, 255));
      textAlign(CENTER, CENTER);
      textFont("Georgia");
      textSize(48);
      text("ZA WARUDO", GAME_W / 2, GAME_H / 3);
      textSize(22);
      fill(220, 200, 255, map(timeStopTimer, 420, 360, 0, 220));
      text("Time has stopped.", GAME_W / 2, GAME_H / 3 + 58);
    }
    fill(220, 200, 255, 80);
    textAlign(RIGHT, TOP);
    textFont("Georgia");
    textSize(13);
    text("TIME STOP  " + ceil(timeStopTimer / 60) + "s", GAME_W - 24, 8);
  }

  // Rage mode overlay
  if (isRageMode && (gameState === "introLevel" || gameState === "introForest" || gameState === "townLevel" || gameState === "bossLevel" || gameState === "tavernLevel" || gameState === "dungeonLevel")) {
    if (rageModeTimer > 360) {
      fill(200, 0, 0, map(rageModeTimer, 420, 360, 0, 120));
      noStroke();
      rect(0, 0, GAME_W, GAME_H);
      fill(255, 60, 0, map(rageModeTimer, 420, 360, 0, 255));
      textAlign(CENTER, CENTER);
      textFont("Georgia");
      textSize(48);
      text("RAGE MODE", GAME_W / 2, GAME_H / 3);
      textSize(20);
      fill(255, 200, 100, map(rageModeTimer, 420, 360, 0, 200));
      text("Fury unleashed.", GAME_W / 2, GAME_H / 3 + 56);
    }
    fill(255, 140, 60, 80);
    textAlign(RIGHT, TOP);
    textFont("Georgia");
    textSize(13);
    text("RAGE  " + ceil(rageModeTimer / 60) + "s", GAME_W - 24, 8);
  }

  // Mushroom popup
  if (showMushroomPopup) {
    fill(10, 8, 18, 200);
    noStroke();
    rect(GAME_W / 2 - 200, GAME_H / 2 - 50, 400, 110, 12);
    fill(255, 240, 100);
    textAlign(CENTER, CENTER);
    textFont("Georgia");
    textSize(16);
    text("The mushroom's power awakens within you.", GAME_W / 2, GAME_H / 2 - 18);
    textSize(14);
    fill(220, 200, 255);
    text("Press G to unleash fury in battle.", GAME_W / 2, GAME_H / 2 + 10);
    textSize(11);
    fill(160, 160, 180);
    text("[ Click anywhere to continue ]", GAME_W / 2, GAME_H / 2 + 36);
  }

  outputVolume(masterVolumeSlider.value() / 100);

  let musicMul = musicVolumeSlider.value() / 100;
  for (let t of musicTrack) t.sound.setVolume(t.base * musicMul);

  let sfxMul = sfxVolumeSlider.value() / 100;
  for (let t of sfxTrack) t.sound.setVolume(t.base * sfxMul);

  // arm rebind/keymap capture once the triggering click is released
  if (!mouseIsPressed) {
    keyMapInputArmed = true;
    if (rebindingAction) rebindArmed = true;
  }

  // mouse release edge: lets a mouse-bound heavy attack fire on release for the mage charge
  if (prevMouseIsPressedState && !mouseIsPressed) {
    if (selectedClass === "Mage" && isCharging) {
      let b = keybinds && keybinds.heavyAttack;
      if (b && b.type === "mouse") {
        fireHeavyMageProjectile();
        isCharging = false;
        chargeTime = 0;
      }
    }
  }
  prevMouseIsPressedState = mouseIsPressed;

  fill(0, 0, 0)
  rect(-(width / 20), 0, (width / 20), height)
  rect((width - (width / 4)), 0, (width / 20), height)
  fill(255, 255, 255)
  textSize(30)
  //text(canFindTimer("sprint"), playerX - cameraX, height / 2)
  fill(255, 255, 255)
  textSize(30)
  
  //text(timers.length, playerX - cameraX, height / 2)
  
  
}

function spawnWave(type, amount) {

  for (i = 0; i < amount; i++) {
    let side = floor(random(6))
    if (side == 0) {
      spawnEnemy(type, "right")
    } else if (side == 1) {
      spawnEnemy(type, "right-ish")
    } else if (side == 2) {
      spawnEnemy(type, "left")
    } else if (side == 3) {
      spawnEnemy(type, "middle")
    } else if (side == 0) {
      spawnEnemy(type, "left-ish")
    }
  }

}

function initTownLevel() {
  enemyGameState = "none"
  enemyWaves = 0
  worldWidth = 4400
  playerX = 10
  cameraX = 0;
  groundY = (GAME_H * 7 / 8) - drawSize;
  stopMusic();
  musicTown.loop()
  gameState = "townLevel"
  let traderNPC = new NPC(0, "trader", 300, drawSize / 320, gameState)
  let villageLeaderNPC = new NPC(5, "leader", 2000, drawSize / 320, gameState)
  updateUI();
}

function stopMusic() {

  for (let m of musicTrack) {
    if (m.sound) m.sound.stop();
  }
  for (let s of barPlaylist) {
    if (s && s.isPlaying()) s.stop();
  }

}

function initBossLevel() {

  cleanEntities()
  worldWidth = 3200
  playerX = 10;
  cameraX = 0;
  buildDungeonPlatforms();
  seedEmbers();
  groundY = (GAME_H * 13 / 16) - drawSize;
  stopMusic();
  if (musicGirei && musicGirei.isPlaying()) musicGirei.stop();
  specialMusicRef = null;
  isTimeStop = false; timeStopTimer = 0;
  isRageMode = false; rageModeTimer = 0;
  musicBoss.loop();
  gameState = "bossLevel";
  //let boss = new Boss();
  enemyWaves = 0;
  rageProjectiles = [];
  updateUI();

}

function devSkipToTavern() {
  if (!selectedClass) selectedClass = "Melee";
  let spritePath = selectedClass === "Mage"
    ? "sprites/sprint2/mage_class_320x320.png"
    : "sprites/sprint2/melee_class_320x320.png";
  spriteSheet = loadImage(spritePath);
  playerTalkSprite = selectedClass === "Mage" ? mageSprite : meleeSprite;
  if (selectedClass === "Melee") {
    atkLightSheet = loadImage("sprites/sprint2/melee_attack_320x160.png");
    atkHeavySheet = loadImage("sprites/sprint2/heavy_melee_atk_320x320.png");
  } else {
    atkLightSheet = loadImage("sprites/sprint2/light_spell_atk_320x320.png");
    atkHeavySheet = loadImage("sprites/sprint2/heavy_spell_atk_320x320.png");
  }
  currentFrame = 0; moveFrameIndex = 0; animTimer = 0;
  attackType = ""; attackFrame = 0; attackTimer = 0;
  isCharging = false; chargeTime = 0;
  velX = 0; velY = 0;
  facingLeft = false; sprinting = false; canSprint = true; sprintVel = 0;
  HP = maxHP; magic = maxMagic; stamina = maxStamina;
  initTavernLevel();
}

function initTavernLevel() {
  stopMusic();
  worldWidth = 1200;
  playerX = 80;
  cameraX = 0;
  groundY = (GAME_H * 3 / 4) - drawSize;
  HP = maxHP;
  magic = maxMagic;
  stamina = maxStamina;
  enemyWaves = 0;
  gameState = "tavernLevel";
  barSongIndex = 0;
  barMuted = false;
  if (barMuteButton) barMuteButton.html("Mute 🔇");
  if (barPlaylist.length > 0) barPlaylist[0].loop();
  specialBar = 0;
  isTimeStop = false;
  timeStopTimer = 0;
  isRageMode = false;
  rageModeTimer = 0;
  mushroomReceived = false;
  showMushroomPopup = false;
  rageProjectiles = [];
  bartenderTalkStarted = false;
  updateUI();
}

function initDungeonLevel() {
  stopMusic();
  worldWidth = 4800;
  playerX = 10;
  cameraX = 0;
  buildDungeonPlatforms();
  seedEmbers();
  groundY = (GAME_H * 13 / 16) - drawSize;
  enemyWaves = 0;
  gameState = "dungeonLevel";
  musicGirei.loop();
  rageProjectiles = [];
  updateUI();
}

function initCreditsScreen() {
  stopMusic();
  if (specialMusicRef) { specialMusicRef = null; }
  isTimeStop = false; isRageMode = false;
  creditsPhase = 0;
  creditsTimer = 0;
  creditsScrollY = GAME_H + 80;
  gameState = "creditsScreen";
  musicCredits.loop();
  updateUI();
}

// ─── CREDITS DATA ────────────────────────────────────────────────────────────
const CREDITS_POEM = [
  { text: "THAT TIME I WAS AN OFFICE WORKER",  size: 28, style: 'bold',   col: [255, 230, 140], gap: 10 },
  { text: "AND PUT IN A COMA BY A DEMON SLEEP GOD", size: 16, style: 'normal', col: [200, 185, 120], gap: 48 },
  { text: "—  F I N  —",                        size: 22, style: 'bold',   col: [255, 200, 80],  gap: 52 },
  { text: "The beast is slain.",                 size: 15, style: 'normal', col: [210, 200, 220], gap: 8  },
  { text: "Its ancient dream shattered like glass across stone.",  size: 15, style: 'normal', col: [210, 200, 220], gap: 8  },
  { text: "Silence — real silence — for the first time.",  size: 15, style: 'normal', col: [210, 200, 220], gap: 48 },
  { text: "You woke up.",                        size: 20, style: 'bold',   col: [255, 255, 255], gap: 40 },
  { text: "Not the same person who closed their eyes", size: 14, style: 'normal', col: [180, 175, 195], gap: 6  },
  { text: "in that grey office chair,",          size: 14, style: 'normal', col: [180, 175, 195], gap: 6  },
  { text: "under the hum of fluorescent lights", size: 14, style: 'normal', col: [180, 175, 195], gap: 6  },
  { text: "and the weight of a life that had stopped surprising you.", size: 14, style: 'normal', col: [180, 175, 195], gap: 48 },
  { text: "The mist, the forest, the burning town,", size: 14, style: 'normal', col: [180, 175, 195], gap: 6  },
  { text: "the ruins older than any name —",     size: 14, style: 'normal', col: [180, 175, 195], gap: 6  },
  { text: "they changed you.",                   size: 14, style: 'normal', col: [180, 175, 195], gap: 6  },
  { text: "Every scar earned. Every step forward, chosen.", size: 14, style: 'normal', col: [180, 175, 195], gap: 48 },
  { text: "The demon believed slumber",           size: 14, style: 'normal', col: [180, 175, 195], gap: 6  },
  { text: "was the cruelest mercy.",              size: 14, style: 'normal', col: [180, 175, 195], gap: 6  },
  { text: "You proved it wrong.",                 size: 16, style: 'bold',   col: [255, 220, 100], gap: 52 },
  { text: "Rise.",                                size: 30, style: 'bold',   col: [255, 255, 255], gap: 0  },
];

const CREDITS_ROLL = [
  { text: "────────────────────────────────", size: 12, col: [80, 75, 95],  gap: 44 },
  { text: "CS345  —  Software Engineering",   size: 14, col: [180, 170, 200], gap: 6 },
  { text: "Spring 2026  ·  Final Project",    size: 13, col: [150, 145, 170], gap: 44 },
  { text: "Special Thanks",                   size: 16, style: 'bold', col: [255, 230, 140], gap: 12 },
  { text: "Professor Chao  'Chaosillator'",  size: 13, col: [210, 200, 225], gap: 6  },
  { text: "For the vision, the chaos, and the deadline extensions.", size: 12, col: [150, 145, 165], gap: 40 },
  { text: "Everyone who played and suffered alongside us.", size: 12, col: [150, 145, 165], gap: 52 },
  { text: "────────────────────────────────", size: 12, col: [80, 75, 95],  gap: 44 },
  { text: "G A M E   C R E D I T S",         size: 18, style: 'bold', col: [255, 230, 140], gap: 48 },
  { text: "Creative Director",                size: 12, col: [160, 155, 180], gap: 6  },
  { text: "Nathan Dubuc",                    size: 17, style: 'bold', col: [230, 220, 255], gap: 6  },
  { text: "Head Story & Mechanics Development", size: 12, col: [140, 135, 160], gap: 44 },
  { text: "Combat Director",                  size: 12, col: [160, 155, 180], gap: 6  },
  { text: "Themba Chika",                     size: 17, style: 'bold', col: [230, 220, 255], gap: 6  },
  { text: "Head Combat & Systems Development", size: 12, col: [140, 135, 160], gap: 44 },
  { text: "Art Director",                     size: 12, col: [160, 155, 180], gap: 6  },
  { text: "Finn Bernuy",                      size: 17, style: 'bold', col: [230, 220, 255], gap: 6  },
  { text: "Head Animator & Sprite Development", size: 12, col: [140, 135, 160], gap: 44 },
  { text: "Interface Director",               size: 12, col: [160, 155, 180], gap: 6  },
  { text: "Thomas Doby",                      size: 17, style: 'bold', col: [230, 220, 255], gap: 6  },
  { text: "Head UI Mechanics & Systems Designer",     size: 12, col: [140, 135, 160], gap: 44 },
  { text: "Environmental Director",           size: 12, col: [160, 155, 180], gap: 6  },
  { text: "Kyla Carver",                      size: 17, style: 'bold', col: [230, 220, 255], gap: 6  },
  { text: "Head Graphic Design & Level Design", size: 12, col: [140, 135, 160], gap: 60 },
  { text: "────────────────────────────────", size: 12, col: [80, 75, 95],  gap: 52 },
  { text: "Thank you for playing our game.",  size: 18, style: 'bold', col: [255, 255, 255], gap: 10 },
  { text: "We hope it was worth waking up for.", size: 14, col: [200, 190, 220], gap: 80 },
];

function drawCreditsScreen() {
  background(4, 3, 8);

  if (creditsPhase === 0) {
    // ── Ending poem — scrolls upward ──────────────────────────────────────
    creditsScrollY -= 0.7;

    for (let s of stars) {
      fill(255, 255, 255, s.alpha * 0.4);
      noStroke();
      ellipse(s.x, s.y, s.size, s.size);
    }

    textAlign(CENTER, TOP);
    textFont("Georgia");
    noStroke();
    let cy = creditsScrollY;
    let totalH = 0;
    for (let line of CREDITS_POEM) totalH += line.size * 1.4 + (line.gap || 0);

    for (let line of CREDITS_POEM) {
      textSize(line.size);
      textStyle(line.style || 'normal');
      let lineAlpha = 255;
      if (cy < 60)          lineAlpha = map(cy, 0, 60, 0, 255, true);
      if (cy > GAME_H - 30) lineAlpha = map(cy, GAME_H - 60, GAME_H, 255, 0, true);
      fill(line.col[0], line.col[1], line.col[2], lineAlpha);
      text(line.text, GAME_W / 2, cy);
      cy += line.size * 1.4 + (line.gap || 0);
    }
    textStyle(NORMAL);

    if (creditsScrollY + totalH < 20) {
      creditsPhase = 1;
      creditsScrollY = GAME_H + 80;
    }

  } else {
    // ── Scrolling credits phase ────────────────────────────────────────────
    creditsScrollY -= 0.9; // scroll speed

    // starfield
    for (let s of stars) {
      fill(255, 255, 255, s.alpha * 0.4);
      noStroke();
      ellipse(s.x, s.y, s.size, s.size);
    }

    textAlign(CENTER, TOP);
    textFont("Georgia");
    let cy = creditsScrollY;
    let totalH = 0;
    for (let line of CREDITS_ROLL) {
      totalH += (line.size || 14) * 1.4 + (line.gap || 10);
    }

    for (let line of CREDITS_ROLL) {
      textSize(line.size || 14);
      textStyle(line.style || 'normal');
      let lineAlpha = 255;
      // fade in at bottom, fade out at top
      if (cy < 60) lineAlpha = map(cy, 0, 60, 0, 255, true);
      if (cy > GAME_H - 30) lineAlpha = map(cy, GAME_H - 60, GAME_H, 255, 0, true);
      fill(line.col[0], line.col[1], line.col[2], lineAlpha);
      text(line.text, GAME_W / 2, cy);
      cy += (line.size || 14) * 1.4 + (line.gap || 10);
    }
    textStyle(NORMAL);

    // once last line scrolls off top, prompt return to menu
    if (creditsScrollY + totalH < 20) {
      fill(180, 170, 200, 160 + sin(frameCount * 0.05) * 60);
      textSize(13);
      textAlign(CENTER, CENTER);
      text("[ Click anywhere to return to the main menu ]", GAME_W / 2, GAME_H - 28);
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  updateGameScale();
  buildMenuBgBuffer();
  buildIntroSkyBuffer();
  buildVignetteBuffer();
  groundY = (GAME_H * 3 / 4) - drawSize;
  if (gameState === "townLevel") {
    groundY = (GAME_H * 5 / 6) - drawSize;
  }
  if (gameState === "dungeonLevel" || gameState === "bossLevel") {
    groundY = (GAME_H * 13 / 16) - drawSize;
    buildDungeonPlatforms();
  }
  if (playerY > groundY) playerY = groundY;
  layoutMenuButtons();
  layoutClassButtons();
  layoutVolumeSliders();
  layoutPauseButtons();
  musicButton.size(300 * scaleFactor, 100 * scaleFactor);
  musicButton.position(toScreenX(GAME_W / 2) - 150 * scaleFactor, toScreenY(GAME_H / 2) - 50 * scaleFactor);
  skipDialogueButton.size(200 * scaleFactor, 80 * scaleFactor);
  skipDialogueButton.position(toScreenX(GAME_W / 2) - 100 * scaleFactor, toScreenY(GAME_H / 2) - 40 * scaleFactor);
  backButton.position(toScreenX(26), toScreenY(22));
  pauseMenuButton.position(toScreenX(26), toScreenY(22));
  if (barNextButton) barNextButton.position(toScreenX(GAME_W - 250), toScreenY(GAME_H - 60));
  if (barMuteButton) barMuteButton.position(toScreenX(GAME_W - 120), toScreenY(GAME_H - 60));
}

function keyPressed() {
  // 1. rebind capture takes priority over everything else
  if (rebindingAction) {
    if (keyCode === ESCAPE) {
      rebindingAction = null;
      return false;
    }
    if (!rebindArmed) return false;
    setBinding(rebindingAction, makeKeyBinding(keyCode));
    rebindingAction = null;
    return false;
  }

  // 2. ESC backs out of the keymap screen when reached from the main menu
  if (keyCode === ESCAPE && gameState === "keyMapping" && !isPaused) {
    gameState = "settings";
    updateUI();
    return false;
  }

  // gameplay-only past this point
  if (gameState !== "introLevel" && gameState !== "introForest" && gameState !== "townLevel" && gameState !== "bossLevel" && gameState !== "tavernLevel" && gameState !== "dungeonLevel") return;
  //testText = keyCode + "";
  if (keyCode === ESCAPE) {
    if (!isPaused) {
      isPaused = true;
      pauseSubScreen = "main";
    } else if (pauseSubScreen === "keymap") {
      pauseSubScreen = "settings";
    } else if (pauseSubScreen === "settings") {
      pauseSubScreen = "main";
    } else {
      isPaused = false;
      pauseSnapshot = null;
    }
    updateUI();
    return false;
  }

  if (isPaused) return;
  if (keyPressMatches("lightAttack", keyCode)) {
    if (selectedClass === "Mage") {
      if (!canFindTimer("lightAtk")) {
        let lightTimer = new Timer(6, "lightAtk")
        triggerLightAttack();
      }
    } else {
      triggerLightAttack();
    }
    return;
  } /*else if ((key === 'j' || key === 'J') && selectedClass === "Mage" && magic > 10) {
    spawnLightMageProjectile();
    sfxLightMage.play();
    magic = max(0, magic - 10);
  }*/
 if (keyPressMatches("heavyAttack", keyCode) && attackType === "" && !isCharging) {
    if (selectedClass === "Mage") {
      if (!canFindTimer("heavyAtk")) {
        let heavyTimer = new Timer(25, "heavyAtk")
        triggerHeavyAttack();
      }
    } else {
      triggerHeavyAttack();
    }
    return;
  }
  
  if (keyPressMatches("focus", keyCode)) {
    if (isCharging) {
      fireHeavyMageProjectile();
      isCharging = false;
      chargeTime = 0;
    }
    attackType = ""
    if ((selectedClass === "Mage" && magic < maxMagic - 5) || ((selectedClass === "Melee" && stamina < maxStamina) && onGround)) {
      isFocusing = true
      if (chargingSound) { chargingSound.rate(1.5); chargingSound.loop(); }
      magic = min(maxMagic, magic + 0.5);
      stamina = min(maxStamina, stamina + 0.5);
      if (gameState === "bossLevel") {
        magic = min(maxMagic, magic + 0.5);
        stamina = min(maxStamina, stamina + 0.5);
      }
      return;
    } else {
      isFocusing = false
      if (chargingSound) chargingSound.stop()
    }
  }
  isFocusing = false
  if (chargingSound) chargingSound.stop()

  if (keyPressMatches("jump", keyCode)) {
    tryJump();
    return;
  }

  

  

  if (keyPressMatches("sprint", keyCode) && canSprint) {
    let energyMeasure
    if (selectedClass === "Mage") {
      energyMeasure = magic;
    } else {
      energyMeasure = stamina
    }
    if (!(canFindTimer("sprint")) && (energyMeasure > 10)) {
      sprintTimer = new Timer(10, "sprint")
      sprintCooldown = new Timer(20, "sprintCool")
      if (sprintSound) sprintSound.play()
      if (velY < 0) {
        velY = 0;
      }
      magic -= 10
      stamina -= 10
      sprinting = true;
      canSprint = false;
      if (facingLeft) {
        sprintVel = -17
      } else {
        sprintVel = 17
      }
    }
    return;

  }

  if (keyPressMatches("special", keyCode) && mushroomReceived && specialBar >= maxSpecialBar && !isTimeStop && !isRageMode) {
    triggerSpecialAbility();
  }

  if (key === ' ' || keyCode === ENTER) {
    if (introStage < 4) {
      introStage++;
    }
  }

  if (key === 'p' || key === 'P') {
    decrementHealth();
  }
}

function initMusic() {
  musicIntro.setVolume(0.4);
  musicIntro.loop();
}

function keyReleased() {
  if (gameState !== "introLevel" && gameState !== "introForest" && gameState !== "townLevel" && gameState !== "bossLevel" && gameState !== "tavernLevel" && gameState !== "dungeonLevel") return;
  if (keyPressMatches("heavyAttack", keyCode) && isCharging && selectedClass === "Mage") {
    fireHeavyMageProjectile();
    isCharging = false;
    chargeTime = 0;
  }
  if (keyPressMatches("focus", keyCode) && isFocusing) {
    isFocusing = false
    if (chargingSound) chargingSound.stop()
  }
}

function initIntroLevel(skipDialogue = false) {
  introStage = skipDialogue ? 4 : 0;
  cameraX = 0;

  HP = 300;
  maxHP = 300;
  magic = 225;
  maxMagic = 225;
  stamina = 200;
  maxStamina = 200;

  if (sfxAmbience) { sfxAmbience.setVolume(0.4); sfxAmbience.loop(); }

  //introDialogue = "Placeholder intro text.";
  introPrompt = "Click to continue";
  //introObjective = "Begin";

  if (skipDialogue) {
    introDialogue = "Placeholder next area.";
    introPrompt = "";
    introObjective = "Continue";
    isDialogue = false;
    skipDialogueButton.hide();
    entityWaitingForMouse = -1;
    if (sfxTextLoop && sfxTextLoop.isPlaying()) sfxTextLoop.stop();
  } else {
    //init test dialogue
    //dialogue = new Dialogue("This is test dialogue. This should print on the screen letter by letter if it is working.")
    fairySprite = loadImage("sprites/sprint2/fairy_320x320.png");
    
    

    dialogueSprite = fairySprite
    initDiaFile("fairy");
    skipDialogueButton.show();
  }
  // init player
  groundY = (GAME_H * 3 / 4) - drawSize;
  playerX = 200;
  playerY = groundY;
  velY = 0;
  onGround = false;
  currentFrame = 0;
  moveFrameIndex = 0;
  animTimer = 0;

  let spritePath = selectedClass === "Mage"
    ? "sprites/sprint2/mage_class_320x320.png"
    : "sprites/sprint2/melee_class_320x320.png";
  spriteSheet = loadImage(spritePath);
  if (selectedClass === "Mage") {
    playerTalkSprite = mageSprite;
  }

  if (selectedClass === "Melee") {
    playerTalkSprite = meleeSprite;
    atkLightSheet = loadImage("sprites/sprint2/melee_attack_320x160.png");
    atkHeavySheet = loadImage("sprites/sprint2/heavy_melee_atk_320x320.png");
  } else {
    atkLightSheet = loadImage("sprites/sprint2/light_spell_atk_320x320.png");
    atkHeavySheet = loadImage("sprites/sprint2/heavy_spell_atk_320x320.png");
  }

  attackType = "";
  attackFrame = 0;
  attackTimer = 0;

  isCharging = false;
  chargeTime = 0;
  mageProjectiles = [];
  meleeAttacks = [];
  wasWalking = false;
  if (sfxWalking && sfxWalking.isPlaying()) sfxWalking.stop();
  if (sfxTextLoop && sfxTextLoop.isPlaying()) sfxTextLoop.stop();

  
}

function resetAttackStuff() {
  attackType = "";
  attackFrame = 0;
  attackTimer = 0;

  isCharging = false;
  chargeTime = 0;
  mageProjectiles = [];
  meleeAttacks = [];
}

function decrementHealth() {
  //it hurts!!
  console.log("ow");
  HP -= random(5, 20);
  if (HP <= 0) {
    playerDie();
  }
}

function decrementHealthBy(amount) {
  if (isRageMode) amount = Math.ceil(amount * 0.5);
  HP -= amount;
  if (HP <= 0) {
    playerDie();
  }
}

function playerDie() {
  //should do death animation and then change gamestate
  //updateUI();
  gameState = "deathScreen";
  updateUI();
}

function drawHUD() {
  let x = 22;
  let y = 76;

  HP = constrain(HP, 0, maxHP);
  drawBar(x, y, 180, 14, HP, maxHP, color(0, 64, 0), "HP");

  if (selectedClass === "Mage") {
    drawBar(x, y + 26, 180, 14, magic, maxMagic, color(0, 0, 80), "MP");
  } else {
    drawBar(x, y + 26, 180, 14, stamina, maxStamina, color(253, 216, 10), "ST");
  }

  if (mushroomReceived) {
    let barCol = selectedClass === "Mage" ? color(80, 0, 120) : color(160, 0, 0);
    let label  = selectedClass === "Mage" ? "DM" : "RG";
    drawBar(x, y + 52, 180, 14, specialBar, maxSpecialBar, barCol, label);
    if (specialBar >= maxSpecialBar) {
      fill(255, 220, 80, 160 + sin(frameCount * 0.2) * 60);
      textFont("Georgia");
      textSize(10);
      textAlign(CENTER, TOP);
      text("[ G ]  ABILITY READY", x + 90, y + 52 + 18);
    }
  }

  // Rage mode aura
  if (isRageMode) {
    let aura = sin(frameCount * 0.25) * 30;
    fill(200, 40, 0, 40 + aura);
    noStroke();
    let px = playerX - cameraX;
    let py = playerY;
    ellipse(px + drawSize / 2, py + drawSize * 0.6, drawSize * 1.8, drawSize * 0.5);
    fill(255, 100, 0, 60 + aura);
    ellipse(px + drawSize / 2, py + drawSize / 2, drawSize * 1.2, drawSize * 1.4);
  }
}

function drawBar(x, y, w, h, val, maxVal, col, label) {
  let fill_w = (val / maxVal) * w;

  fill(10, 12, 18, 200);
  noStroke();
  rect(x, y, w, h, 4);

  fill(col);
  rect(x, y, fill_w, h, 4);

  fill(255, 255, 255, 22);
  rect(x, y, fill_w, h / 2, 4);

  fill(220, 220, 230);
  textFont("Georgia");
  textSize(12);
  textAlign(LEFT, CENTER);
  text(label, x + w + 8, y + h / 2);
}

function drawFantasyBackground() {
  image(menuBgBuffer, 0, 0);
  drawStars();
  drawMistLayer(GAME_H - 70, 210, 0.12);
  drawMistLayer(GAME_H - 22, 260, 0.20);
  drawParticles();
  image(vignetteBuffer, 0, 0);
}

function drawSkyGradient() {
  for (let y = 0; y < GAME_H; y++) {
    let t = map(y, 0, GAME_H, 0, 1);

    let top = color(13, 14, 28);
    let mid = color(28, 24, 48);
    let bottom = color(70, 52, 92);

    let c;
    if (t < 0.55) {
      c = lerpColor(top, mid, t / 0.55);
    } else {
      c = lerpColor(mid, bottom, (t - 0.55) / 0.45);
    }

    stroke(c);
    line(0, y, GAME_W, y);
  }
  noStroke();
}

function drawBackGlow() {
  let glowX = GAME_W * 0.75;
  let glowY = GAME_H * 0.25;

  noStroke();

  for (let i = 0; i < 10; i++) {
    fill(205, 215, 255, 10 - i * 0.7);
    ellipse(glowX, glowY, 320 - i * 24, 220 - i * 16);
  }

  fill(220, 230, 255, 14);
  ellipse(glowX, glowY, 130, 90);
}

function drawStars() {
  noStroke();
  for (let s of stars) {
    let twinkle = map(sin(frameCount * s.speed), -1, 1, 0.45, 1);
    fill(255, 255, 255, s.alpha * twinkle);
    ellipse(s.x, s.y, s.size, s.size);
  }
}

function drawBackMountains() {
  fill(25, 22, 42);
  beginShape();
  vertex(0, GAME_H * 0.72);
  vertex(GAME_W * 0.06, GAME_H * 0.63);
  vertex(GAME_W * 0.14, GAME_H * 0.68);
  vertex(GAME_W * 0.22, GAME_H * 0.56);
  vertex(GAME_W * 0.30, GAME_H * 0.65);
  vertex(GAME_W * 0.39, GAME_H * 0.50);
  vertex(GAME_W * 0.49, GAME_H * 0.63);
  vertex(GAME_W * 0.58, GAME_H * 0.52);
  vertex(GAME_W * 0.68, GAME_H * 0.66);
  vertex(GAME_W * 0.78, GAME_H * 0.56);
  vertex(GAME_W * 0.88, GAME_H * 0.67);
  vertex(GAME_W, GAME_H * 0.58);
  vertex(GAME_W, GAME_H);
  vertex(0, GAME_H);
  endShape(CLOSE);
}

function drawMidMountains() {
  fill(17, 15, 28);
  beginShape();
  vertex(0, GAME_H * 0.82);
  vertex(GAME_W * 0.08, GAME_H * 0.73);
  vertex(GAME_W * 0.16, GAME_H * 0.79);
  vertex(GAME_W * 0.24, GAME_H * 0.67);
  vertex(GAME_W * 0.33, GAME_H * 0.78);
  vertex(GAME_W * 0.42, GAME_H * 0.69);
  vertex(GAME_W * 0.52, GAME_H * 0.83);
  vertex(GAME_W * 0.61, GAME_H * 0.70);
  vertex(GAME_W * 0.71, GAME_H * 0.81);
  vertex(GAME_W * 0.81, GAME_H * 0.69);
  vertex(GAME_W * 0.91, GAME_H * 0.80);
  vertex(GAME_W, GAME_H * 0.73);
  vertex(GAME_W, GAME_H);
  vertex(0, GAME_H);
  endShape(CLOSE);
}

function drawCastleSilhouette() {
  push();

  let s = GAME_H / 900;
  let castleX = GAME_W * 0.67;
  let castleY = GAME_H * 0.52;

  translate(castleX, castleY);
  fill(9, 9, 15);

  rect(-36*s, 95*s,  170*s, 170*s);
  rect( 18*s, 18*s,   32*s, 247*s);
  rect( 82*s, 52*s,   36*s, 213*s);
  rect(-74*s, 46*s,   34*s, 219*s);

  triangle(-74*s, 46*s, -57*s,  6*s, -40*s, 46*s);
  triangle( 18*s, 18*s,  34*s, -28*s,  50*s, 18*s);
  triangle( 82*s, 52*s, 100*s,  10*s, 118*s, 52*s);

  rect(17*s, 176*s, 40*s, 89*s, 13);

  fill(255, 210, 50, 32);
  rect(-24*s, 130*s, 12*s, 18*s);
  rect( 66*s, 118*s, 12*s, 18*s);
  rect( 92*s, 128*s, 12*s, 18*s);

  pop();
}

function drawMistLayer(yBase, h, driftSpeed) {
  push();
  noStroke();

  for (let i = -2; i < 9; i++) {
    let offset = (frameCount * driftSpeed + i * 140) % (GAME_W + 280) - 140;
    fill(220, 225, 255, 16);
    ellipse(offset, yBase, 250, h * 0.65);
    ellipse(offset + 55, yBase - 20, 210, h * 0.55);
    ellipse(offset - 55, yBase + 12, 230, h * 0.60);
  }

  pop();
}

function drawParticles() {
  noStroke();
  for (let p of particles) {
    fill(230, 235, 255, p.alpha);
    ellipse(p.x, p.y, p.size, p.size);

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.y < -10) {
      p.y = GAME_H + random(10, 80);
      p.x = random(GAME_W);
    }

    if (p.x < -10) p.x = GAME_W + 10;
    if (p.x > GAME_W + 10) p.x = -10;
  }
}

function drawForegroundVignette() {
  noFill();
  for (let i = 0; i < 78; i++) {
    stroke(0, 0, 0, 3);
    rect(-i, -i, GAME_W + i * 2, GAME_H + i * 2);
  }
  noStroke();
}

function drawRetryScreen() {
  pauseSnapshot = null;
  pauseCheck();

  
  fill(0, 0, 0, retryScreenOpacity);
  
  retryScreenOpacity += 2;
  retryScreenOpacity = constrain(retryScreenOpacity, 0, 140);
  rect(0, 0, GAME_W, GAME_H);

  for (i = 0; i < entityCount; i++) {
    if (entities[i].isAlive() && entities[i].constructor === Enemy) {
        if (entities[i].spawnedIn) {
            entities[i].health = 0;
            entities[i].load_enemies();

        }
    }
    entities[i].frameChange();
  }
  fill(245);
  textSize(100);
  text("YOU DIED", GAME_W / 2 - textSize() * 2.55, GAME_H * 0.33);
  retryButton.position(toScreenX(GAME_W * 0.45), toScreenY(GAME_H * 0.66));
  retryButton.size(GAME_W * 0.1 * scaleFactor, GAME_H * 0.1 * scaleFactor);
}

function drawMenuPanel() {
  let x = menuPanel.x;
  let y = menuPanel.y;
  let w = menuPanel.w;
  let h = menuPanel.h;

  fill(7, 8, 12, 180);
  rect(x, y, w, h, 22);

  fill(255, 255, 255, 10);
  rect(x + 6, y + 6, w - 12, h - 12, 20);

  stroke(190, 195, 225, 36);
  noFill();
  rect(x + 12, y + 12, w - 24, h - 24, 20);

  stroke(255, 255, 255, 10);
  line(x + 42, y + 195, x + w - 42, y + 195);
  line(x + 42, y + h - 80, x + w - 42, y + h - 80);
  noStroke();

  drawMenuDecoration(x, y, w, h);
}

function drawMenuDecoration(x, y, w, h) {
  push();
  noFill();
  stroke(180, 190, 230, 18);
  strokeWeight(1.2);

  arc(x + 74, y + 84, 64, 64, PI * 0.15, PI * 1.15);
  arc(x + w - 74, y + h - 84, 64, 64, PI * 1.15, PI * 2.15);

  stroke(255, 255, 255, 8);
  line(x + 42, y + h - 108, x + w - 42, y + h - 108);

  pop();
}

function drawSubScreenPanel() {
  let panelW = 590;
  let panelH = 470;
  let panelX = GAME_W * 0.5 - panelW * 0.5;
  let panelY = GAME_H * 0.04;

  fill(7, 8, 12, 176);
  rect(panelX, panelY, panelW, panelH, 18);

  fill(255, 255, 255, 10);
  rect(panelX + 6, panelY + 6, panelW - 12, panelH - 12, 16);

  stroke(190, 195, 225, 32);
  noFill();
  rect(panelX + 12, panelY + 12, panelW - 24, panelH - 24, 16);

  return { x: panelX, y: panelY, w: panelW, h: panelH };
}

function drawTitle() {
  let centerX = menuPanel.x + menuPanel.w / 2;
  let y = menuPanel.y + menuPanel.h * 0.06;

  let bigFont = menuPanel.h * 0.056;
  let smallFont = menuPanel.h * 0.030;

  let bigGap = bigFont * 1.05;
  let smallGap = smallFont * 1.1;

  let subX = menuPanel.x + menuPanel.w * 0.12;

  textAlign(CENTER, TOP);
  textFont("Georgia");

  fill(165, 175, 220, 28);
  textStyle(BOLD);
  textSize(bigFont);
  text("That Time I Was", centerX + 3, y + 3);
  text("An Office Worker", centerX + 3, y + bigGap + 3);

  fill(245, 245, 250);
  text("That Time I Was", centerX, y);
  text("An Office Worker", centerX, y + bigGap);

  fill(206, 206, 220);
  textStyle(NORMAL);
  textSize(smallFont);
  let subY = y + bigGap + bigFont + smallFont * 0.8;
  textAlign(LEFT, TOP);
  text("and Was Put in a Coma by a", subX, subY);
  text("Demon Sleep God", subX, subY + smallGap);
  textAlign(CENTER, TOP);
}

function layoutMenuButtons() {
  let buttonW = menuPanel.w * 0.82;
  let buttonH = menuPanel.h * 0.078;

  let startY = menuPanel.y + menuPanel.h * 0.52;
  let gap = menuPanel.h * 0.152;
  let buttonX = menuPanel.x + (menuPanel.w - buttonW) / 2;

  startButton.size(buttonW * scaleFactor, buttonH * scaleFactor);
  settingsButton.size(buttonW * scaleFactor, buttonH * scaleFactor);
  quitButton.size(buttonW * scaleFactor, buttonH * scaleFactor);

  startButton.position(toScreenX(buttonX), toScreenY(startY));
  settingsButton.position(toScreenX(buttonX), toScreenY(startY + gap));
  quitButton.position(toScreenX(buttonX), toScreenY(startY + gap * 2));

  if (devSkipBarButton) {
    let devW = 180;
    let devH = 28;
    devSkipBarButton.size(devW * scaleFactor, devH * scaleFactor);
    devSkipBarButton.position(toScreenX(GAME_W - devW - 12), toScreenY(GAME_H - devH - 12));
  }
}

function layoutVolumeSliders() {
  let sliderW = 220 * scaleFactor;

  let panelY = GAME_H * 0.04;
  let panelH = 470;
  let startY = panelY + panelH * 0.42;
  let gap = panelH * 0.11;

  masterVolumeSlider.size(sliderW);
  musicVolumeSlider.size(sliderW);
  sfxVolumeSlider.size(sliderW);

  masterVolumeSlider.position(toScreenX(GAME_W / 2) - sliderW / 2, toScreenY(startY));
  musicVolumeSlider.position(toScreenX(GAME_W / 2) - sliderW / 2,  toScreenY(startY + gap));
  sfxVolumeSlider.position(toScreenX(GAME_W / 2) - sliderW / 2,    toScreenY(startY + gap * 2));

  if (keyMappingButton) {
    let buttonW = 200;
    let buttonH = 30;
    let buttonY = startY + gap * 2 + panelH * 0.155;
    keyMappingButton.size(buttonW * scaleFactor, buttonH * scaleFactor);
    keyMappingButton.position(
      toScreenX(GAME_W / 2 - buttonW / 2),
      toScreenY(buttonY)
    );
  }
}

function volumeSliderY(index) {
  let panelY = GAME_H * 0.04;
  let panelH = 470
  return panelY + panelH * 0.42 + index * panelH * 0.11;
}

function layoutClassButtons() {
  let panelW = 590;
  let panelH = 470;
  let panelX = GAME_W * 0.5 - panelW * 0.5;
  let panelY = GAME_H * 0.04;

  let titleY = panelY + panelH * 0.18;
  let descY  = panelY + panelH * 0.82;
  let midY   = (titleY + descY) / 2;

  mageButton.size(200 * scaleFactor, 62 * scaleFactor);
  meleeButton.size(200 * scaleFactor, 62 * scaleFactor);
  mageButton.position(toScreenX(panelX + panelW / 2 - 100), toScreenY(midY - 72));
  meleeButton.position(toScreenX(panelX + panelW / 2 - 100), toScreenY(midY + 10));
}

function createMusicButton(label, x, y, action) {
  let button = createButton(label);
  button.size(300, 100);
  button.position(toScreenX(GAME_W / 2 - 150), toScreenY(GAME_H / 2 - 50));
  styleMainButton(button);
  button.mousePressed(action);
  return button;
}

function createMainMenuButton(label, x, y, action) {
  let button = createButton(label);
  button.size(250, 56);
  button.position(x, y);
  styleMainButton(button);
  button.mousePressed(action);
  return button;
}

function createRetryButton(label, x, y, action) {
  let button = createButton(label);
  button.size(300, 100);
  button.position(x, y);
  styleMainButton(button);
  button.mousePressed(action);
  return button;
}

function styleMainButton(button) {
  button.style("background", "rgba(20, 21, 31, 0.92)");
  button.style("color", "#f2f2f7");
  button.style("border", "1px solid rgba(210, 216, 240, 0.18)");
  button.style("font-family", "Georgia");
  button.style("font-size", "clamp(14px, 1.6vw, 26px)");
  button.style("letter-spacing", "0.4px");
  button.style("border-radius", "10px");
  button.style("box-shadow", "0 0 0 rgba(0,0,0,0)");
  button.style("cursor", "pointer");
  button.style("text-align", "center");
  button.style("transition" , "all 0.18s ease");

  button.mouseOver(function() {
    button.style("background", "rgba(34, 36, 52, 0.98)");
    button.style("border", "1px solid rgba(230, 235, 255, 0.32)");
    button.style("box-shadow", "0 0 20px rgba(160, 170, 220, 0.12)");
    button.style("transform", "translateY(-1px)");
  });

  button.mouseOut(function() {
    button.style("background", "rgba(20, 21, 31, 0.92)");
    button.style("border", "1px solid rgba(210, 216, 240, 0.18)");
    button.style("box-shadow", "0 0 0 rgba(0,0,0,0)");
    button.style("transform", "translateY(0px)");
  });
}

function styleSecondaryButton(button) {
  button.style("background", "rgba(14, 15, 24, 0.92)");
  button.style("color", "#f2f2f7");
  button.style("border", "1px solid rgba(205, 210, 235, 0.18)");
  button.style("font-family", "Georgia");
  button.style("font-size", "18px");
  button.style("border-radius", "8px");
  button.style("box-shadow", "0 0 0 rgba(0,0,0,0)");
  button.style("cursor", "pointer");
  button.style("text-align", "center");
  button.style("transition", "all 0.16s ease");

  button.mouseOver(function() {
    button.style("background", "rgba(32, 34, 48, 0.96)");
    button.style("border", "1px solid rgba(225, 230, 255, 0.30)");
    button.style("box-shadow", "0 0 18px rgba(160, 170, 220, 0.10)");
  });

  button.mouseOut(function() {
    button.style("background", "rgba(14, 15, 24, 0.92)");
    button.style("border", "1px solid rgba(205, 210, 235, 0.18)");
    button.style("box-shadow", "0 0 0 rgba(0,0,0,0)");
  });
}

function updateUI() {
  musicButton.hide();
  startButton.hide();
  settingsButton.hide();
  quitButton.hide();
  backButton.hide();
  pauseMenuButton.hide();
  pauseResumeButton.hide();
  pauseSettingsButton.hide();
  pauseQuitButton.hide();
  masterVolumeSlider.hide();
  musicVolumeSlider.hide();
  sfxVolumeSlider.hide();
  if (keyMappingButton) keyMappingButton.hide();
  mageButton.hide();
  meleeButton.hide();
  if (barNextButton) barNextButton.hide();
  if (barMuteButton) barMuteButton.hide();
  if (devSkipBarButton) devSkipBarButton.hide();

  retryButton.hide();

  if (gameState === "music") {
    musicButton.show();
  } else if (gameState === "menu") {
    startButton.show();
    settingsButton.show();
    quitButton.show();
    if (devSkipBarButton) devSkipBarButton.show();
  } else if (gameState === "poem") {
    backButton.show();
  } else if (gameState === "classSelect") {
    backButton.show();
    mageButton.show();
    meleeButton.show();
  } else if (gameState === "introLevel" || gameState === "introForest" || gameState === "townLevel" || gameState === "bossLevel" || gameState === "tavernLevel" || gameState === "dungeonLevel") {
    if (isPaused) {
      if (pauseSubScreen === "main") {
        pauseResumeButton.show();
        pauseSettingsButton.show();
        pauseQuitButton.show();
      } else if (pauseSubScreen === "settings") {
        backButton.show();
        masterVolumeSlider.show();
        musicVolumeSlider.show();
        sfxVolumeSlider.show();
        if (keyMappingButton) keyMappingButton.show();
      } else if (pauseSubScreen === "keymap") {
        backButton.show();
      }
    } else {
      pauseMenuButton.show();
      if (gameState === "tavernLevel") {
        barNextButton.position(toScreenX(GAME_W - 250), toScreenY(GAME_H - 60));
        barNextButton.show();
        barMuteButton.position(toScreenX(GAME_W - 120), toScreenY(GAME_H - 60));
        barMuteButton.show();
      }
    }
  } else if (gameState === "settings") {
    backButton.show();
    masterVolumeSlider.show();
    musicVolumeSlider.show();
    sfxVolumeSlider.show();
    if (keyMappingButton) keyMappingButton.show();
  } else if (gameState === "keyMapping") {
    backButton.show();
  } else if (gameState === "quit") {
    backButton.show();
  } else if (gameState === "deathScreen") {
    retryButton.show();
    console.log("should be deathscreen");
  }
  // creditsScreen — all DOM hidden, canvas-only rendering
}

function drawPoemScreen() {

  drawSubScreenPanel();

  fill(244, 244, 248);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textStyle(BOLD);
  textHeight = 70;
  textSize(15);
  lineLength = 60;
  for (let x of poemLines) {

    textHeight = printByWord(x, GAME_W / 2, textHeight, lineLength, 15);
    textHeight += 10;

  }
  fill(100, 100, 100);
  text("Click to continue", GAME_W / 2, GAME_H - 60)
  if (mouseIsPressed) {

    if (mouseReleased) {

      gameState = "classSelect";
      updateUI();

    }

  } else {

    mouseReleased = true;

  }

}

function drawClassSelectScreen() {
  let p = drawSubScreenPanel();

  fill(244, 244, 248);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textStyle(BOLD);
  textSize(34);
  text("Select a Class", p.x + p.w / 2, p.y + p.h * 0.18);

  textStyle(NORMAL);
  textSize(18);
  fill(214, 214, 226);
  text("Mage uses spell power and ranged magic.", p.x + p.w / 2, p.y + p.h * 0.82);
  text("Melee focuses on close combat and raw strength.", p.x + p.w / 2, p.y + p.h * 0.90);
}

function drawSettingsScreen() {
  drawSubScreenPanel();

  fill(244, 244, 248);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textStyle(BOLD);
  textSize(34);
  text("Settings", GAME_W / 2, GAME_H * 0.04 + 470 * 0.13);

  textStyle(NORMAL);
  textSize(22);
  fill(214, 214, 226);
  text("Volume", GAME_W / 2, GAME_H * 0.04 + 470 * 0.27);

  textSize(16);
  textAlign(CENTER, BOTTOM);
  text("Main",  GAME_W / 2, volumeSliderY(0) - 4);
  text("Music", GAME_W / 2, volumeSliderY(1) - 4);
  text("SFX",   GAME_W / 2, volumeSliderY(2) - 4);

  textAlign(CENTER, CENTER);
  textSize(16);

  text("Main: "  + masterVolumeSlider.value() +
      "   Music: " + musicVolumeSlider.value() +
      "   SFX: "   + sfxVolumeSlider.value(),
      GAME_W / 2, volumeSliderY(2) + 470 * 0.11);
}

function drawPauseScreen() {
  // dim
  fill(0, 0, 0, 140);
  rect(0, 0, GAME_W, GAME_H);

  if (pauseSubScreen === "main") {
    drawSubScreenPanel();

    fill(244, 244, 248);
    textAlign(CENTER, CENTER);
    textFont("Georgia");
    textStyle(BOLD);
    textSize(34);
    text("Paused", GAME_W / 2, GAME_H * 0.04 + 470 * 0.20);
    textStyle(NORMAL);
  } else if (pauseSubScreen === "settings") {
    drawSettingsScreen();
  } else if (pauseSubScreen === "keymap") {
    drawKeyMappingScreen();
  }
}

function layoutPauseButtons() {
  let buttonW = 220 * scaleFactor;
  let buttonH = 50 * scaleFactor;

  let panelY = GAME_H * 0.04;
  let panelH = 470;
  let startY = panelY + panelH * 0.40;
  let gap    = panelH * 0.15;

  pauseResumeButton.size(buttonW, buttonH);
  pauseSettingsButton.size(buttonW, buttonH);
  pauseQuitButton.size(buttonW, buttonH);

  pauseResumeButton.position(toScreenX(GAME_W / 2) - buttonW / 2, toScreenY(startY));
  pauseSettingsButton.position(toScreenX(GAME_W / 2) - buttonW / 2, toScreenY(startY + gap));
  pauseQuitButton.position(toScreenX(GAME_W / 2) - buttonW / 2, toScreenY(startY + gap * 2));
}

function drawQuitScreen() {
  let p = drawSubScreenPanel();

  fill(244, 244, 248);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textStyle(BOLD);
  textSize(34);
  text("Return to Sleep", p.x + p.w / 2, p.y + p.h * 0.35);

  textStyle(NORMAL);
  textSize(20);
  fill(214, 214, 226);
  text("Leave this screen and return to the title menu.", p.x + p.w / 2, p.y + p.h * 0.55);
  text("Press Back to continue.", p.x + p.w / 2, p.y + p.h * 0.65);
}

function pauseCheck() {
  if (pauseSnapshot) {
      image(pauseSnapshot, 0, 0, GAME_W, GAME_H);
    } else {
      // first paused frame, draw world, including enemies, then snapshot
      drawIntroWorld();
      drawPlayer();
      drawMageProjectiles();
      drawIntroTopUI();
      drawHUD();
      if (isDialogue) drawIntroDialogueBox();
      frameCalls();
      // capture the actual game region in screen pixels, not the whole window
      pauseSnapshot = get(scaleOffsetX, scaleOffsetY, GAME_W * scaleFactor, GAME_H * scaleFactor);
    }

}

function drawLevelUpdates() {
  if (!mouseIsPressed) {
    mouseReleased = true;
  }

  if (isPaused) {
    pauseCheck();
    drawPauseScreen();
    return;
  }
  

  if (!isDialogue) {
    /*if (!forestEnemiesSpawned && gameState === "introForest") {
      forestEnemiesSpawned = true;
      spawnEnemy("sml", "right-ish");
      spawnEnemy("sml", "right");
      spawnEnemy("sml", "left");
      spawnEnemy("med", "middle");

    }*/
    updatePlayer();
    updateMageProjectiles();
    updateMeleeAttacks();
  }
}

function drawIntroLevelScreen() {

  drawLevelUpdates();
  if (isPaused) return;
  drawIntroWorld();
  drawPlayer();

  drawMageProjectiles();
  drawRageProjectiles();
  drawIntroTopUI();
  drawHUD();
  if (fadingFromBlack) {
    skipDialogueButton.hide();
    pauseMenuButton.hide();
    
    return;
  }
  if (isDialogue) drawIntroDialogueBox();
  
  frameCalls();
  
}

function drawIntroForestScreen() {
  drawLevelUpdates();
  if (isPaused) return;
  drawIntroForest();
  drawPlayer();
  drawMageProjectiles();
  drawRageProjectiles();
  drawIntroTopUI();
  drawHUD();
  drawEnemyCounter();
  if (isDialogue) drawIntroDialogueBox();
  frameCalls();
}

function drawEnemyCounter() {
  let panelW = 140;
  let panelH = 38;
  let x = GAME_W / 2 - panelW / 2;
  let y = 18;

  fill(10, 12, 18, 190);
  rect(x, y, panelW, panelH, 10);

  fill(255, 255, 255, 10);
  rect(x + 3, y + 3, panelW - 6, panelH - 6, 8);

  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textSize(14);
  fill(240, 240, 246);
  text("Goblins Alive: " + enemiesAlive, GAME_W / 2, y + panelH / 2);
}

function drawBossLevel() {
  drawLevelUpdates();
  if (isPaused) return;
  bossRoom();
  drawPlayer();
  drawMageProjectiles();
  drawRageProjectiles();
  drawIntroTopUI();
  drawHUD();
  if (isDialogue) drawIntroDialogueBox();
  frameCalls();
}

function drawTownLevel() {
  drawLevelUpdates();
  if (isPaused) return;
  drawVillageWorld();
  push();
  translate(-cameraX, 0);
  if (playerX < 2560) {
    image(town1Sprite, 0, 0) 
  }
  if (playerX < 3840) {
    image(town2Sprite, 1280, 0)
  }
  if (playerX > 1500) {
    image(town3Sprite, 2560, 0)
    image(town4Sprite, 3840, 0)
  }
  pop();
  //drawVillageWorld();
  //drawVillageSky();
  drawPlayer();
  drawMageProjectiles();
  drawRageProjectiles();
  drawIntroTopUI();
  drawHUD();
  if (havingNightmare) {
    fill(0, 0, 0)
    rect(0, 0, GAME_W, GAME_H)
  }
  if (isDialogue) drawIntroDialogueBox();
  frameCalls();

}


function drawTavernLevel() {
  drawLevelUpdates();
  if (isPaused) return;
  drawTavernRoom();
  drawPlayer();
  drawRageProjectiles();
  drawIntroTopUI();
  drawHUD();
  if (isDialogue) drawIntroDialogueBox();
  frameCalls();

  // exit to dungeon trigger: right side of the tavern (blocked during dialogue / popup)
  if (!isDialogue && !showMushroomPopup && mushroomReceived && playerX > worldWidth - drawSize - 20) {
    for (let s of barPlaylist) s.stop();
    initDungeonLevel();
  }
}

function drawTavernRoom() {
  push();
  // floor and ceiling
  background(28, 20, 14);
  fill(40, 28, 18);
  rect(0, 0, GAME_W, GAME_H);

  // gradient ceiling beams
  for (let bx = 0; bx < GAME_W + cameraX; bx += 160) {
    fill(22, 15, 10, 200);
    rect(bx - cameraX, 0, 30, groundY + drawSize, 0, 0, 4, 4);
  }

  // back wall
  fill(55, 38, 22);
  rect(-cameraX, 0, worldWidth, groundY + drawSize);

  // brick pattern on back wall
  stroke(35, 25, 14, 120);
  strokeWeight(1);
  for (let row = 0; row < 10; row++) {
    let rowY = row * 54;
    let offset = (row % 2) * 80;
    for (let col = -1; col < 18; col++) {
      rect(col * 160 + offset - cameraX, rowY, 150, 48, 2);
    }
  }
  noStroke();

  // floor boards
  fill(60, 40, 20);
  rect(0, groundY + drawSize * 0.55, GAME_W, GAME_H);
  stroke(40, 28, 12, 100);
  strokeWeight(1);
  for (let fx = 0; fx < GAME_W + cameraX; fx += 60) {
    line(fx - cameraX, groundY + drawSize * 0.55, fx - cameraX, GAME_H);
  }
  noStroke();

  // bar counter on right side
  let barX = worldWidth - 350 - cameraX;
  fill(80, 55, 28);
  rect(barX, groundY - 60, 340, 60 + drawSize * 0.55, 4, 4, 0, 0);
  fill(100, 70, 35);
  rect(barX, groundY - 68, 340, 14, 4);
  // kegs
  for (let k = 0; k < 3; k++) {
    fill(90, 60, 25);
    ellipse(barX + 40 + k * 80, groundY - 90, 44, 60);
    fill(70, 45, 18);
    rect(barX + 20 + k * 80, groundY - 120, 44, 30, 3);
    fill(160, 120, 60, 180);
    ellipse(barX + 42 + k * 80, groundY - 105, 20, 8);
  }

  // candles on tables
  let tablePositions = [180, 400, 650];
  for (let tx of tablePositions) {
    let realTx = tx - cameraX;
    // table
    fill(70, 48, 24);
    rect(realTx - 50, groundY - 30, 100, 30 + drawSize * 0.55, 3, 3, 0, 0);
    fill(85, 60, 30);
    rect(realTx - 60, groundY - 38, 120, 12, 3);
    // candle
    fill(240, 235, 200);
    rect(realTx - 6, groundY - 68, 12, 30, 2);
    // flame
    let flicker = sin(frameCount * 0.15 + tx) * 3;
    fill(255, 200, 80, 220);
    ellipse(realTx, groundY - 72 + flicker, 8, 14);
    fill(255, 240, 180, 160);
    ellipse(realTx, groundY - 74 + flicker, 5, 9);
    // candle glow
    fill(255, 180, 60, 18);
    ellipse(realTx, groundY - 60, 60, 60);

    // Patron — use varied sprites
    let patronSprites = [npc2Sprite, npc4Sprite, npc3Sprite];
    let pSpr = patronSprites[tablePositions.indexOf(tx) % patronSprites.length];
    if (pSpr) {
      let npcSize = drawSize * 0.7;
      tint(255, 255);
      image(pSpr, realTx - npcSize * 0.5, groundY - drawSize * 0.6 - npcSize, npcSize, npcSize);
    }
    // beer mug on table
    fill(220, 180, 60, 200);
    rect(realTx + 20, groundY - 50, 14, 18, 2);
    fill(255, 255, 255, 80);
    ellipse(realTx + 27, groundY - 50, 14, 6);
  }

  // barkeeper NPC behind bar
  if (npc5Sprite) {
    let npcSize = drawSize * 0.85;
    tint(255, 255);
    image(npc5Sprite, worldWidth - 220 - cameraX, groundY - npcSize - 60, npcSize, npcSize);
  }
  tint(255, 255);
  // Talk hint near bar
  if (!mushroomReceived && playerX > worldWidth - 520) {
    fill(255, 240, 160, 200);
    textAlign(CENTER, CENTER);
    textFont("Georgia");
    textSize(13);
    text("[ Hold S to talk ]", worldWidth - 160 - cameraX, groundY - drawSize * 0.85 - drawSize - 20);
  }

  // "EXIT →" sign on right wall
  fill(180, 140, 60, 200);
  rect(worldWidth - 60 - cameraX, groundY - 110, 55, 34, 4);
  fill(240, 220, 160);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textSize(11);
  text("EXIT →", worldWidth - 32 - cameraX, groundY - 93);

  // "TAVERN" sign above bar
  fill(100, 70, 30);
  rect(worldWidth - 370 - cameraX, 30, 200, 48, 4);
  fill(240, 210, 120);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textSize(20);
  text("THE WEARY SWORD", worldWidth - 270 - cameraX, 54);

  // bottom ground rect
  fill(50, 34, 18);
  rect(0, groundY + drawSize * 0.55, GAME_W, GAME_H);

  pop();
}

function drawDungeonLevelScreen() {
  drawLevelUpdates();
  if (isPaused) return;
  bossRoom();
  drawPlayer();
  drawMageProjectiles();
  drawRageProjectiles();
  drawIntroTopUI();
  drawHUD();
  drawEnemyCounter();
  if (isDialogue) drawIntroDialogueBox();
  frameCalls();
}

function updatePlayer() {
  // Special ability timers
  if (isTimeStop) {
    timeStopTimer--;
    if (timeStopTimer <= 0) {
      isTimeStop = false; timeStopTimer = 0;
      if (specialMusicRef) { specialMusicRef.play(); specialMusicRef = null; }
    }
  }
  if (isRageMode) {
    rageModeTimer--;
    if (rageModeTimer <= 0) {
      isRageMode = false; rageModeTimer = 0;
      if (specialMusicRef) { specialMusicRef.play(); specialMusicRef = null; }
    }
  }
  updateRageProjectiles();

  let moving = false;
  if (!(sprinting)) {
    if (!playerLaunched) {
      if (!isFocusing) {
        if (isBindingDown("moveRight")) { playerX += 5; moving = true; facingLeft = false; isFocusing = false; if (chargingSound) chargingSound.stop() }
        if (isBindingDown("moveLeft"))  { playerX -= 5; moving = true; facingLeft = true; isFocusing = false; if (chargingSound) chargingSound.stop() }
      }
    } else {
      if (!(canSprint) && velY >= 0 && !(canFindTimer("sprintCool"))) {
        canSprint = true
      }
      if (onGround || abs(launchAmount) < 2) {
        playerLaunched = false;
      } else {
        if (isBindingDown("moveRight")) {
          if (launchAmount > 0) {
            launchAmount += 0.1
          } else {
            launchAmount += 0.5
          }
        }
        if (isBindingDown("moveLeft")) {
          if (launchAmount > 0) {
            launchAmount -= 0.5
          } else {
            launchAmount -= 0.1
          }
        }
      }
      moving = true
      playerX += launchAmount
    }
  }
  let prevY = playerY;
  
  // clamp to world bounds (no walking off-screen)
  playerX = constrain(playerX, 0, worldWidth - drawSize);

  
  if (!(sprinting) && (!isFocusing || selectedClass === "Melee")) {
    
    velY += gravity;
    playerY += velY;
  
    let playerFootPrev = prevY + playerFootOffset;
    let playerFootNow = playerY + playerFootOffset;
    let playerLeft = playerX + 8;
    let playerRight = playerX + drawSize - 8;
    if (gameState === "bossLevel") {
      onGround = false;
      if (velY >= 0) {
        for (let p of dungeonPlatforms) {
          let top = p.y;
          let overlapsX = playerRight > p.x + 6 && playerLeft < p.x + p.w - 6;
          if (overlapsX && playerFootPrev <= top + 2 && playerFootNow >= top) {
            playerY = top - playerFootOffset;
            velY = 0;
            onGround = true;
            if (waitingToLand) {
              waitingToLand = false
              playerJustLanded = true;
            }
            if (!(canSprint) && !(canFindTimer("sprintCool"))) canSprint = true;
            break;
          }
        }
      }
      if (!onGround && playerY >= groundY) {
        playerY = groundY;
        velY = 0;
        onGround = true;
        if (waitingToLand) {
          waitingToLand = false
          playerJustLanded = true;
        }
        if (!(canSprint) && !(canFindTimer("sprintCool"))) canSprint = true;
      }
    } else if (playerY >= groundY) {
      playerY = groundY;
      velY = 0;
      if (waitingToLand) {
        waitingToLand = false
        playerJustLanded = true;
      }
      onGround = true;
      if (!(canSprint) && !(canFindTimer("sprintCool"))) canSprint = true;
    } else {
      onGround = false;
    }

    if (!onGround) {
      currentFrame = 1;
    } else if (moving) {
      animTimer++;
      if (animTimer % 8 === 0) moveFrameIndex = (moveFrameIndex + 1) % 3;
      currentFrame = 2 + moveFrameIndex;
    } else {
      currentFrame = 0;
      moveFrameIndex = 0;
      animTimer = 0;
    }
  } else {
    if (sprinting) {
      playerX += sprintVel;
    } else if (!onGround) {
      playerY += sin(frameCount * 0.3)
    }
  }

  // camera follows player, clamped to world
  cameraX = constrain(playerX - GAME_W / 2, 0, worldWidth - GAME_W);

  // advance attack animation
  if (attackType !== "") {
    attackTimer++;
    if (attackTimer % attackFrameSpeed === 0) {
      attackFrame++;
      if (attackFrame >= getAtkInfo(attackType).frames) {
        attackType = "";
        attackFrame = 0;
        attackTimer = 0;
      }
    }
  }

  // hollow purple charge tick
  if (isCharging && selectedClass === "Mage") {
    chargeTime = min(chargeTime + 1, maxChargeTime);
    magic = max(0, magic - 0.25);
    if (maxChargeTime == chargeTime) {
      magic = 0;
    }
    if (magic <= 0) {
      fireHeavyMageProjectile();
      isCharging = false;
      chargeTime = 0;
    }
  }

  // gradual regen
  if (!isCharging) {
    if (selectedClass === "Mage") {
      let prev = magic;
      if (isFocusing) {
        magic = min(maxMagic, magic + 0.4);
        if (gameState === "bossLevel") {
          magic = min(maxMagic, magic + 0.5);
        }
        if (magic == maxMagic) {
          isFocusing = false;
          if (chargingSound) chargingSound.stop()
        }
      } else {
        magic = min(maxMagic, magic + 0.05);
        if (gameState === "bossLevel") {
          magic = min(maxMagic, magic + 0.05);
        }
      }
      if (prev < maxMagic && magic >= maxMagic && sfxBarFull) sfxBarFull.play();
    } else {
      let prev = stamina;
      if (isFocusing) {
        stamina = min(maxStamina, stamina + 0.4);
        if (gameState === "bossLevel") {
          stamina = min(maxStamina, stamina + 0.5);
        }
        if (stamina == maxStamina) {
          isFocusing = false;
          if (chargingSound) chargingSound.stop()
        }
      } else {
        stamina = min(maxStamina, stamina + 0.05);
        if (gameState === "bossLevel") {
          stamina = min(maxStamina, stamina + 0.05);
        }
        
      }
      if (prev < maxStamina && stamina >= maxStamina && sfxBarFull) sfxBarFull.play();
    }
  }

  if (HP < maxHP) {
      let prevHP = HP;
      HP = min(maxHP, HP + 0.03);
      if (gameState === "bossLevel") HP = min(maxHP, HP + 0.02)
      if (prevHP < maxHP && HP >= maxHP && sfxBarFull) sfxBarFull.play();
  }

  // footstep SFX
  let isWalking = moving && onGround;
  if (isWalking && !wasWalking && sfxWalking) {
    sfxWalking.loop();
  } else if (!isWalking && wasWalking && sfxWalking) {
    sfxWalking.stop();
  }
  wasWalking = isWalking;
}

// returns { frames, srcH, drawW, drawH } for current class + attack type
function getAtkInfo(type) {
  if (selectedClass === "Melee") {
    if (type === "light") return { frames: 4, srcH: 160, drawW: 160, drawH: 80  };
    else                  return { frames: 5, srcH: 320, drawW: 160, drawH: 160 };
  } else {
    if (type === "light") return { frames: 3, srcH: 320, drawW: 120, drawH: 120 };
    else                  return { frames: 3, srcH: 320, drawW: 160, drawH: 160 };
  }
}

function drawPlayer() {
  
  if (!spriteSheet) return;
  //if (gameState === "townLevel") return;
  let screenX = playerX - cameraX;
  fill(255, 255, 255)
  text(entities.length + ", " + entityCount + " used.", screenX, playerY - 150)
  let sx = currentFrame * frameWidth;
  fill(255, 255, 255)
  textSize(30)
  //text(entities.length, playerX - cameraX, playerY - 50 - drawSize)
  push();
  if (!(playerCanBeHurt) && hurtFrameCounter < 10) {
    tint(255, 100, 100)
  }
  if (facingLeft) {
    translate(screenX + drawSize, playerY);
    scale(-1, 1);
    image(spriteSheet, 0, 0, drawSize, drawSize, sx, 0, frameWidth, frameHeight);
  } else {
    image(spriteSheet, screenX, playerY, drawSize, drawSize, sx, 0, frameWidth, frameHeight);
  }
  pop();

  if (selectedClass === "Mage") {
    drawChargeEffect();
  } else {
    drawAttack();
  }
  //text(playerX, screenX, playerY + 20);
}

function drawAttack() {
  if (attackType === "" || !atkLightSheet || !atkHeavySheet) return;

  let info = getAtkInfo(attackType);
  let sheet = attackType === "light" ? atkLightSheet : atkHeavySheet;
  let screenX = playerX - cameraX;
  let sx = attackFrame * frameWidth;

  // center effect vertically on the player, push it in front
  let effW = info.drawW;
  let effH = info.drawH;
  let effY = playerY + drawSize / 2 - effH / 2;

  // melee overlaps the player body; mage pushes clearly in front for a casting feel
  let xOff = selectedClass === "Mage" ? drawSize + 20 : drawSize * .8;

  push();
  if (facingLeft) {
    // mirror xOff to the left: translate to the right edge of the effect then flip
    translate(screenX + xOff - effW / 4, effY);
    scale(-1, 1);
    image(sheet, 0, 0, effW, effH, sx, 0, frameWidth, info.srcH);
  } else {
    image(sheet, screenX + xOff, effY, effW, effH, sx, 0, frameWidth, info.srcH);
  }
  pop();
}

function spawnLightMageProjectile() {
  let dir = facingLeft ? -1 : 1;
  mageProjectiles.push({
    x: playerX + drawSize / 2 + dir * (drawSize / 2 + 10),
    y: playerY + drawSize / 2,
    velX: dir * 9,
    type: "light",
    damage: 15,
    drawW: 80,
    drawH: 80,
    maxDist: 340,
    distTraveled: 0,
    frame: 0,
    animTimer: 0,
    hitEnemies: []
  });
}ƒ

function fireHeavyMageProjectile() {
  if (chargeTime <= 0) return;
  let ratio = chargeTime / maxChargeTime;
  let damage = lerp(30, 150, ratio);
  if (ratio >= 1.0) {
    damage = 200;
  }
  let radius = lerp(18, 55, ratio);
  let dir = facingLeft ? -1 : 1;
  if (sfxHeavyMage) sfxHeavyMage.play();
  mageProjectiles.push({
    x: playerX + drawSize / 2 + dir * (drawSize / 2 + 10),
    y: playerY + drawSize / 2,
    velX: dir * 11,
    type: "heavy",
    damage: damage,
    radius: radius,
    maxDist: Infinity,
    distTraveled: 0,
    frame: 0,
    animTimer: 0,
    ratio: ratio,
    hitEnemies: []
  });
}

function spawnLightMeleeAttack() {
  let dir = facingLeft ? -1 : 1;
  let info = getAtkInfo("light");
  meleeAttacks.push({
    type: "light",
    damage: isRageMode ? 15 * 1.45 : 15,
    dir: dir,
    x: playerX + (dir > 0 ? drawSize * 0.4 : -(info.drawW + drawSize * 0.4)),
    y: playerY + drawSize / 2 - info.drawH / 2,
    hitW: info.drawW,
    hitH: info.drawH,
    hitEnemies: []
  });
  attackType = "light";
  attackFrame = 0;
  attackTimer = 0;
  if (sfxLightMelee) sfxLightMelee.play();
  stamina = max(0, stamina - (isRageMode ? 18 * 0.3 : 18));
}

function spawnHeavyMeleeAttack() {
  let dir = facingLeft ? -1 : 1;
  let info = getAtkInfo("heavy");
  meleeAttacks.push({
    type: "heavy",
    damage: isRageMode ? 40 * 1.45 : 40,
    dir: dir,
    x: playerX + (dir > 0 ? drawSize * 0.4 : -(info.drawW + drawSize * 0.4)),
    y: playerY + drawSize / 2 - info.drawH / 2,
    hitW: info.drawW,
    hitH: info.drawH,
    hitEnemies: []
  });
  attackType = "heavy";
  attackFrame = 0;
  attackTimer = 0;
  if (sfxHeavyMelee) sfxHeavyMelee.play();
  stamina = max(0, stamina - (isRageMode ? 32 * 0.3 : 32));
}

function updateMeleeAttacks() {
  for (let i = meleeAttacks.length - 1; i >= 0; i--) {
    let a = meleeAttacks[i];
    // keep hitbox anchored to player position each frame
    let xOff = a.dir > 0 ? drawSize * 0.4 : -(a.hitW + drawSize * 0.4);
    a.x = playerX + xOff;
    a.y = playerY + drawSize / 2 - a.hitH / 2;
    // expire when animation finishes (attackType cleared by updatePlayer)
    if (attackType === "") meleeAttacks.splice(i, 1);
  }
}

function updateMageProjectiles() {
  for (let i = mageProjectiles.length - 1; i >= 0; i--) {
    let p = mageProjectiles[i];
    p.x += p.velX;
    p.distTraveled += abs(p.velX);
    p.animTimer++;
    if (p.animTimer % 5 === 0) p.frame++;

    if (p.type === "heavy" && p.hitEnemies.length > 5) mageProjectiles.splice(i, 1)
    // when enemies are added: light stops on first hit (hit=true; break),
    // heavy pierces all — do NOT break, let it continue through every enemy

    let screenX = p.x - cameraX;
    let offScreen = screenX < -120 || screenX > GAME_W + 120;
    let expired = p.distTraveled >= p.maxDist;
    if (offScreen || expired) mageProjectiles.splice(i, 1);
  }
}

function drawMageProjectiles() {
  for (let p of mageProjectiles) {
    let screenX = p.x - cameraX;
    if (p.type === "light") drawLightProjectile(p, screenX);
    else drawHeavyProjectile(p, screenX);
  }
}

function drawLightProjectile(p, screenX) {
  if (!atkLightSheet) return;
  let alpha = 255;
  let remaining = p.maxDist - p.distTraveled;
  if (remaining < 60) alpha = map(remaining, 0, 60, 0, 255);

  let sx = (p.frame % 3) * frameWidth;
  let goingLeft = p.velX < 0;

  push();
  tint(255, alpha);
  if (goingLeft) {
    translate(screenX, p.y - p.drawH / 2);
    scale(-1, 1);
    image(atkLightSheet, -p.drawW / 2, 0, p.drawW, p.drawH, sx, 0, frameWidth, 320);
  } else {
    image(atkLightSheet, screenX - p.drawW / 2, p.y - p.drawH / 2, p.drawW, p.drawH, sx, 0, frameWidth, 320);
  }
  noTint();
  pop();
}

function drawHeavyProjectile(p, screenX) {
  if (!atkHeavySheet) return;
  let drawSize = lerp(100, 300, p.ratio);
  let sx = (p.frame % 3) * frameWidth;
  let goingLeft = p.velX < 0;

  push();
  if (goingLeft) {
    translate(screenX, p.y - drawSize / 2);
    scale(-1, 1);
    image(atkHeavySheet, -drawSize / 2, 0, drawSize, drawSize, sx, 0, frameWidth, 320);
  } else {
    image(atkHeavySheet, screenX - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize, sx, 0, frameWidth, 320);
  }
  pop();
}

function drawChargeEffect() {
  if (!isCharging) return;
  let ratio = chargeTime / maxChargeTime;
  let r = lerp(6, 28, ratio);
  let pulse = sin(frameCount * 0.22) * 3;
  let screenX = playerX - cameraX + (facingLeft ? -r - 8 : drawSize + r + 8);
  let ey = playerY + drawSize / 2;

  push();
  noStroke();
  fill(180, 60, 240, 30);
  ellipse(screenX, ey, (r + pulse) * 4, (r + pulse) * 4);
  fill(210, 100, 255, 60);
  ellipse(screenX, ey, (r + pulse) * 2.5, (r + pulse) * 2.5);
  fill(240, 160, 255, 140);
  ellipse(screenX, ey, (r + pulse) * 1.4, (r + pulse) * 1.4);
  fill(255, 240, 255, 220);
  ellipse(screenX, ey, r * 0.7, r * 0.7);

  if (ratio > 0.85) {
    fill(255, 235, 100);
    textAlign(CENTER, BOTTOM);
    textFont("Georgia");
    textSize(13);
    text("MAX", screenX, ey - r - 10);
  }
  pop();
}

function mousePressed() {
  if (gameState == "introForest") {
    console.log(mouseX);
    console.log(mouseY);
  }

  // 1. keymap screen swallows clicks before anything else
  let inKeyMapping = (gameState === "keyMapping") || (isPaused && pauseSubScreen === "keymap");
  if (inKeyMapping) {
    handleKeyMapClick();
    return;
  }

  if (showMushroomPopup) {
    showMushroomPopup = false;
    return;
  }

  if (gameState === "creditsScreen") {
    // Only return to menu once the scrolling credits have finished
    let totalH = 0;
    for (let line of CREDITS_ROLL) totalH += (line.size || 14) * 1.4 + (line.gap || 10);
    if (creditsScrollY + totalH < 20) {
      stopMusic();
      gameState = "menu";
      updateUI();
    }
    return;
  }

  if (gameState !== "introLevel" && gameState !== "introForest" && gameState !== "townLevel" && gameState !== "bossLevel" && gameState !== "tavernLevel" && gameState !== "dungeonLevel") return;
  if (isPaused) return;
  // ignore clicks on the back button area (top-left)
  if (mouseX < 140 && mouseY < 70) return;
  if (!mouseReleased) return;
  if (isDialogue) return;

  if (mousePressMatches("lightAttack", mouseButton)) {
    triggerLightAttack();
    return;
  }
  if (mousePressMatches("heavyAttack", mouseButton)) {
    if (attackType === "" && !isCharging) triggerHeavyAttack();
    return;
  }
  if (mousePressMatches("jump", mouseButton)) {
    tryJump();
    return;
  }
}

function updateIntroLevel() {
  introPrompt = "";

  if (introStage === 0) {
    introObjective = "Speak with the fairy";
    introDialogue = "A strange presence lingers in the air...";
    introPrompt = "Click to continue";
  } else if (introStage === 1) {
    introObjective = "Explore the area";
    introDialogue = "Move right and get a feel for your abilities.";
    introPrompt = "Click to continue";
  } else if (introStage === 2) {
    introObjective = "Defeat enemies";
    introDialogue = "Enemies approach from the forest ahead. Stand your ground!";
    introPrompt = "Click to continue";
  } else if (introStage === 3) {
    introObjective = "Go right to continue";
    introDialogue = "The path ahead leads deeper into the forest.";
    introPrompt = "Click to continue";
  } else {
    introObjective = "Go right to continue";
    introDialogue = "";
  }
}

function drawIntroWorld() {
  drawIntroSky();
  drawIntroParallaxBack();

  push();
  translate(-cameraX, 0);
  drawIntroGround();
  drawIntroPondArea();
  drawIntroForestArea();
  //drawIntroVillagePathArea();
  drawAmbientFireflies();
  drawIntroStaticGrass();
  pop();
}

function drawIntroForest() {
  drawIntroSky();
  drawIntroParallaxBack();

  push();
  translate(-cameraX, 0);
  drawIntroGround();
  //drawIntroPondArea();
  //drawIntroForestArea();
  //drawIntroVillagePathArea();
  // -22 offsets the sprite up so its grass line aligns with groundY + drawSize = GAME_H * 3/4
  const forestSpriteY = -100;
  if (playerX < 3200) {
    image(forestSprite, 0, forestSpriteY)
  }

  if (playerX > 1600) {
    image(forestSprite, 2489, forestSpriteY)
  }
  drawAmbientFireflies();
  drawIntroStaticGrass();
  pop();
}

function drawIntroSky() {
  image(introSkyBuffer, 0, 0);
}

function drawIntroParallaxBack() {
  push();

  let p1 = -cameraX * 0.18;
  let p2 = -cameraX * 0.34;

  noStroke();

  fill(28, 30, 40, 180);
  beginShape();
  vertex(p1, 350);
  vertex(p1 + 120, 290);
  vertex(p1 + 260, 340);
  vertex(p1 + 420, 260);
  vertex(p1 + 620, 350);
  vertex(p1 + 820, 270);
  vertex(p1 + 1080, 360);
  vertex(p1 + 1400, 260);
  vertex(p1 + 1800, 350);
  vertex(p1 + 1800, GAME_H);
  vertex(p1, GAME_H);
  endShape(CLOSE);

  fill(18, 20, 28, 210);
  beginShape();
  vertex(p2, 390);
  vertex(p2 + 140, 320);
  vertex(p2 + 270, 390);
  vertex(p2 + 420, 300);
  vertex(p2 + 630, 400);
  vertex(p2 + 850, 320);
  vertex(p2 + 1120, 410);
  vertex(p2 + 1420, 310);
  vertex(p2 + 1760, 410);
  vertex(p2 + 1760, GAME_H);
  vertex(p2, GAME_H);
  endShape(CLOSE);

  pop();
}

function drawIntroGround() {
  noStroke();
  let gY = (3 * GAME_H) / 4;

  fill(42, 54, 40);
  rect(0, gY, worldWidth, (GAME_H * 19) / 80);

  fill(26, 33, 27);
  rect(0, (7 * GAME_H) / 8, worldWidth, GAME_H / 8);

  fill(60, 82, 59);
  ellipse(270, gY - 17, 560, 125);
  ellipse(980, gY - 15, 680, 138);
  ellipse(1710, gY - 12, 700, 138);
  ellipse(2200, gY - 10, 420, 113);
}

function drawIntroPondArea() {
  noStroke();
  let gY = (3 * GAME_H) / 4;

  fill(48, 63, 44);
  ellipse(320, gY - 25, 360, 115);

  fill(35, 45, 33);
  ellipse(320, gY - 17, 325, 88);

  fill(62, 125, 150, 220);
  ellipse(320, gY - 50, 270, 103);

  fill(105, 180, 205, 55);
  ellipse(285, gY - 62, 125 + sin(frameCount * 0.03) * 6, 28);

  fill(145, 215, 235, 30);
  ellipse(350, gY - 46, 150 + sin(frameCount * 0.025) * 5, 23);

  fill(82, 95, 78);
  ellipse(210, gY - 34, 28, 18);
  ellipse(238, gY - 22, 18, 13);
  ellipse(430, gY - 27, 34, 20);
  ellipse(458, gY - 35, 24, 15);

  fill(92, 132, 86);
  ellipse(255, gY - 44, 18, 13);
  ellipse(274, gY - 37, 14, 10);
  ellipse(388, gY - 42, 20, 14);

}

function drawGrassClump(x, y, s) {
  push();
  translate(x, y);
  scale(s);

  fill(76, 116, 74);
  triangle(-8, 0, -2, -20, 2, 0);
  triangle(-2, 0, 4, -25, 8, 0);
  triangle(4, 0, 10, -18, 14, 0);

  pop();
}

function drawIntroForestArea() {
  let gY = (3 * GAME_H) / 4;
  for (let i = 0; i < 24; i++) {
    let tx = 760 + i * 68;
    let sway = sin(frameCount * 0.01 + i) * 2;

    fill(50, 34, 30);
    quad(tx, gY - 2, tx + 16, gY - 2, tx + 10 + sway, gY - 152, tx - 6 + sway, gY - 152);

    fill(34, 66, 45);
    ellipse(tx + 6, gY - 175, 78, 90);
    ellipse(tx - 10, gY - 159, 52, 58);
    ellipse(tx + 22, gY - 159, 52, 58);

    fill(20, 30, 25, 80);
    ellipse(tx + 6, gY - 109, 70, 25);
  }

  for (let i = 0; i < 18; i++) {
    let mx = 780 + i * 84;
    fill(110, 70, 130);
    ellipse(mx, gY - 6, 12, 10);
    ellipse(mx + 6, gY - 12, 10, 10);
  }
}

function drawIntroVillagePathArea() {
  let gY = (3 * GAME_H) / 4;
  fill(130, 112, 84);
  rect(1880, gY - 27, 300, 23, 9);

  fill(228, 220, 190);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("Path", 2030, gY - 162);

  fill(235, 200, 110, 70);
  ellipse(2060, gY - 90, 60, 75);
}

function drawAmbientFireflies() {
  noStroke();
  for (let f of fireflies) {
    let bobX = sin(frameCount * 0.02 + f.offset) * 10;
    let bobY = cos(frameCount * 0.03 + f.offset) * 8;
    let glow = map(sin(frameCount * 0.05 + f.offset), -1, 1, 20, 90);

    fill(255, 235, 170, glow * 0.2);
    ellipse(f.x + bobX, f.y + bobY, f.size * 4, f.size * 4);

    fill(255, 235, 170, glow);
    ellipse(f.x + bobX, f.y + bobY, f.size, f.size);
  }
}

function drawIntroStaticGrass() {
  let gY = (3 * GAME_H) / 4;
  noStroke();
  for (let i = 0; i < GAME_W + 32; i += 24) {
    let gx = i - 8;
    let h1 = 16 + (i % 5) * 2;
    let h2 = 20 + (i % 7);
    let h3 = 14 + (i % 4) * 2;

    fill(28, 64, 32, 170);
    triangle(gx, gY + 3, gx + 5, gY - h1, gx + 10, gY + 3);

    fill(36, 84, 42, 175);
    triangle(gx + 7, gY + 3, gx + 13, gY - h2, gx + 19, gY + 3);

    fill(48, 104, 52, 160);
    triangle(gx + 14, gY + 3, gx + 18, gY - h3, gx + 22, gY + 3);
  }
}

function drawIntroTopUI() {
  let panelW = 220;
  let panelH = 90;
  let x = GAME_W - panelW - 22;
  let y = 25;

  fill(10, 12, 18, 190);
  //rect(x, y, panelW, panelH, 12);

  fill(255, 255, 255, 10);
  //rect(x + 4, y + 4, panelW - 8, panelH - 8, 10);

  fill(240, 240, 246);
  textAlign(LEFT, TOP);
  textFont("Georgia");
  textSize(16);
  //text("Objective", x + 16, y + 12);

  fill(214, 214, 226);
  textSize(14);
  //text(introObjective, x + 16, y + 36);
}

function drawIntroDialogueBox() {
  let boxX = GAME_W / 4;
  let boxY = GAME_H - 153;
  let boxW = GAME_W / 2;
  let boxH = 120;

  fill(9, 11, 18, 210);
  rect(boxX, boxY, boxW, boxH, 14);

  fill(255, 255, 255, 8);
  rect(boxX + 5, boxY + 5, boxW - 10, boxH - 10, 12);

  fill(240, 240, 246);
  textAlign(LEFT, TOP);
  textFont("Georgia");
  textSize(16);
  //text("Intro Sketch", boxX + 18, boxY + 14);

  fill(214, 214, 226);
  textSize(15);
  if (isDialogue) {
    textAlign(LEFT, TOP);
    printByWord(dialogue.getText(), boxX + 18, boxY + 40, 45, 18);
    if (!dialogue.finished && sfxTextLoop && !sfxTextLoop.isPlaying()) sfxTextLoop.loop();
    else if (dialogue.finished && sfxTextLoop && sfxTextLoop.isPlaying()) sfxTextLoop.stop();
  }
  //text(introDialogue, boxX + 18, boxY + 40, boxW - 150, 60);

  if (introPrompt !== "") {
    textAlign(RIGHT, BOTTOM);
    fill(255, 235, 180);
    textSize(14);
    text(introPrompt, boxX + boxW - 18, boxY + boxH - 14);
  }
   if (!(showDiaSprite)) {
    fill(0, 0, 0)
    rect(boxX + ((boxW * 47) / 56) - 10, boxY + (boxH / 5) - 10, 70, 70)
    fill(50, 50, 50)
    rect(boxX + ((boxW * 47) / 56) - 5, boxY + (boxH / 5) - 5, 60, 60)
    image(dialogueSprite, boxX + ((boxW * 47) / 56), boxY + (boxH / 5), 50, 50);
  }
  
}

function printByWord(lineText, x, y, maxLength, textSpace) {

    words = lineText.split(" ")
    textY = y;
    charCount = 0;
    currLine = "";
    if (lineText.length > maxLength) {

        for (word of words) {

            currLine += word + " ";
            charCount += word.length + 1;
            if (charCount > maxLength) {

                text(currLine, x, textY);
                textY += textSpace;
                currLine = "";
                charCount = 0;

            }

        }
        if (currLine !== "") {

            text(currLine, x, textY)
            textY += textSpace;

        }


    } else {

        text(lineText, x, textY);
        textY += textSpace;

    }

    return textY;

}

// ===== keybind system =====

function getDefaultKeybinds() {
  return {
    jump:        { type: "key",   code: 87, label: "W" },
    moveLeft:    { type: "key",   code: 65, label: "A" },
    moveRight:   { type: "key",   code: 68, label: "D" },
    heavyAttack: { type: "key",   code: 75, label: "K" },
    //lightAttack: { type: "mouse", button: LEFT, label: "Left Click" },
    lightAttack: { type: "key", code: 74, label: "J" },
    sprint:      { type: "key", code: 16, label: "Shift"},
    focus:       { type: "key", code: 76, label: "L"},
    interact:    { type: "key", code: 83, label: "S"},
    special:     { type: "key", code: 71, label: "G"}
  };
}

function makeKeyBinding(kc) {
  return { type: "key", code: kc, label: keyCodeToLabel(kc) };
}

function makeMouseBinding(btn) {
  return { type: "mouse", button: btn, label: mouseButtonToLabel(btn) };
}

function sameBinding(a, b) {
  if (!a || !b) return false;
  if (a.type !== b.type) return false;
  if (a.type === "key")   return a.code === b.code;
  if (a.type === "mouse") return a.button === b.button;
  return false;
}

// assigning a binding to one action clears it from any other action that had it
function setBinding(action, newBinding) {
  for (let k in keybinds) {
    if (k === action) continue;
    if (sameBinding(keybinds[k], newBinding)) {
      keybinds[k] = { type: "none", label: "Unbound" };
    }
  }
  keybinds[action] = newBinding;
}

function keyPressMatches(action, kc) {
  let b = keybinds && keybinds[action];
  return !!(b && b.type === "key" && b.code === kc);
}

function mousePressMatches(action, btn) {
  let b = keybinds && keybinds[action];
  return !!(b && b.type === "mouse" && b.button === btn);
}

function isBindingDown(action) {
  let b = keybinds && keybinds[action];
  if (!b) return false;
  if (b.type === "key")   return keyIsDown(b.code);
  if (b.type === "mouse") return mouseIsPressed && mouseButton === b.button;
  return false;
}

function keyCodeToLabel(kc) {
  if (kc === 32)  return "Space";
  if (kc === 13)  return "Enter";
  if (kc === 9)   return "Tab";
  if (kc === 8)   return "Backspace";
  if (kc === 16)  return "Shift";
  if (kc === 17)  return "Ctrl";
  if (kc === 18)  return "Alt";
  if (kc === 37)  return "Left Arrow";
  if (kc === 38)  return "Up Arrow";
  if (kc === 39)  return "Right Arrow";
  if (kc === 40)  return "Down Arrow";
  if (kc === 27)  return "ESC";
  if (kc === 191) return "/";
  if (kc === 190) return ".";
  if (kc === 188) return ",";
  if (kc === 189) return "-";
  if (kc === 187) return "=";
  if (kc === 186) return ";";
  if (kc === 222) return "'";
  if (kc === 219) return "[";
  if (kc === 221) return "]";
  if (kc === 220) return "\\";
  if (kc === 192) return "`";
  if (kc >= 65 && kc <= 90)  return String.fromCharCode(kc);
  if (kc >= 48 && kc <= 57)  return String.fromCharCode(kc);
  if (kc >= 96 && kc <= 105) return "Numpad " + (kc - 96);
  if (kc >= 112 && kc <= 123) return "F" + (kc - 111);
  return "Key " + kc;
}

function mouseButtonToLabel(btn) {
  if (btn === LEFT)   return "Left Click";
  if (btn === RIGHT)  return "Right Click";
  if (btn === CENTER) return "Middle Click";
  return "Mouse";
}

// ===== shared action triggers (called from key + mouse handlers) ===========

function tryJump() {
  if (onGround) velY = jumpForce;
}

function triggerLightAttack() {
  if ((selectedClass === "Melee" && stamina <= 5) || (magic <= 5 && selectedClass === "Mage")) return;
  if (isCharging) return;
  if (isDialogue) return;
  if (attackType !== "") return;

  if (selectedClass === "Mage") {
    spawnLightMageProjectile();
    if (sfxLightMage) sfxLightMage.play();
    magic = max(0, magic - 18);
  } else {
    spawnLightMeleeAttack();
  }
}

function triggerHeavyAttack() {
  if (attackType !== "" || isCharging) return;
  if ((selectedClass === "Melee" && stamina <= 15) || (magic <= 15 && selectedClass === "Mage")) return;

  if (selectedClass === "Mage") {
    magic = max(0, magic - 30)
    isCharging = true;
    chargeTime = 0;
  } else if (isRageMode) {
    spawnGetsugatensho();
  } else {
    spawnHeavyMeleeAttack();
  }
}

function triggerSpecialAbility() {
  specialBar = 0;
  // Pause whatever music is currently playing
  specialMusicRef = null;
  for (let t of musicTrack) {
    if (t.sound && t.sound.isPlaying()) {
      specialMusicRef = t.sound;
      t.sound.pause();
      break;
    }
  }
  if (selectedClass === "Mage") {
    isTimeStop = true;
    timeStopTimer = 420;
    if (sfxZaWarudo) { sfxZaWarudo.stop(); sfxZaWarudo.play(); }
  } else {
    isRageMode = true;
    rageModeTimer = 420;
    if (sfxSaiyan) { sfxSaiyan.stop(); sfxSaiyan.play(); }
  }
}

function spawnGetsugatensho() {
  let dir = facingLeft ? -1 : 1;
  let dmg = 40 * 1.45;
  rageProjectiles.push({
    x: playerX + drawSize / 2 + dir * (drawSize / 2),
    y: playerY + drawSize * 0.4,
    velX: dir * 13,
    dir: dir,
    damage: dmg,
    w: 120,
    h: 28,
    distTraveled: 0,
    maxDist: 900,
    frame: 0,
    hitEnemies: []
  });
  stamina = max(0, stamina - (isRageMode ? 32 * 0.3 : 32));
  attackType = "heavy";
  attackFrame = 0;
  attackTimer = 0;
  if (sfxHeavyMelee) sfxHeavyMelee.play();
}

function updateRageProjectiles() {
  for (let i = rageProjectiles.length - 1; i >= 0; i--) {
    let p = rageProjectiles[i];
    p.x += p.velX;
    p.distTraveled += abs(p.velX);
    p.frame++;

    // hit detection against enemies
    for (let j = 0; j < entityCount; j++) {
      if (entities[j].constructor !== Enemy) continue;
      let e = entities[j];
      if (p.hitEnemies.includes(e)) continue;
      let info = e.sprite_info;
      let ew = info["sprite_size"][0] * info["scale"];
      let ex = e.x;
      let ey = e.y - info["walk_pos_delta"];
      let px = p.x - p.w / 2;
      let py = p.y - p.h / 2;
      if (rectsOverlap(ex, ey, ew, ew, px, py, p.w, p.h)) {
        e.health -= p.damage;
        if (typeof specialBar !== 'undefined' && mushroomReceived) specialBar = min(maxSpecialBar, specialBar + p.damage * 0.5);
        p.hitEnemies.push(e);
      }
    }

    let screenX = p.x - cameraX;
    if (p.distTraveled >= p.maxDist || screenX < -150 || screenX > GAME_W + 150) {
      rageProjectiles.splice(i, 1);
    }
  }
}

function drawRageProjectiles() {
  if (!atkHeavySheet || rageProjectiles.length === 0) return;
  for (let p of rageProjectiles) {
    let screenX = p.x - cameraX;
    if (screenX < -drawSize || screenX > GAME_W + drawSize) continue;
    let animFrame = floor(p.frame / 8) % 3;
    let sx = animFrame * frameWidth;
    push();
    if (p.dir < 0) {
      translate(screenX, p.y - drawSize / 2);
      scale(-1, 1);
      image(atkHeavySheet, -drawSize / 2, 0, drawSize, drawSize, sx, 0, frameWidth, 320);
    } else {
      image(atkHeavySheet, screenX - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize, sx, 0, frameWidth, 320);
    }
    pop();
  }
}

// ===== keymap screen =======================================================

function enterKeyMapping() {
  rebindingAction = null;
  keyMapInputArmed = false;
  if (isPaused) {
    pauseSubScreen = "keymap";
  } else {
    gameState = "keyMapping";
  }
  mouseReleased = false;
  updateUI();
}

function startRebind(action) {
  rebindingAction = action;
  rebindArmed = false;
  mouseReleased = false;
}

function getKeyMapRowRect(index) {
  let panelW = 590;
  let panelX = GAME_W * 0.5 - panelW * 0.5;
  let panelY = GAME_H * 0.04;
  let panelH = 470;
  let startY = panelY + panelH * 0.30;
  let rowH = 25;
  let rowGap = 5;
  let rowW = panelW - 80;
  let rowX = panelX + 40;
  return { x: rowX, y: startY + index * (rowH + rowGap), w: rowW, h: rowH };
}

function getKeyMapResetRect() {
  let panelW = 590;
  let panelH = 470;
  let panelX = GAME_W * 0.5 - panelW * 0.5;
  let panelY = GAME_H * 0.04;
  let w = 200;
  let h = 32;
  return {
    x: panelX + panelW / 2 - w / 2,
    y: panelY + panelH - h - 22,
    w: w,
    h: h
  };
}

function isPointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function drawKeyMappingScreen() {
  drawSubScreenPanel();

  let panelY = GAME_H * 0.04;
  let panelH = 470;

  fill(244, 244, 248);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  textStyle(BOLD);
  textSize(32);
  text("Key Mapping", GAME_W / 2, panelY + panelH * 0.13);

  textStyle(NORMAL);
  textSize(14);
  fill(180, 184, 204);
  if (rebindingAction) {
    text("Press any key or click a mouse button to bind, ESC to cancel", GAME_W / 2, panelY + panelH * 0.21);
  } else {
    text("Click a row to rebind it", GAME_W / 2, panelY + panelH * 0.21);
  }

  for (let i = 0; i < KEYMAP_ACTIONS.length; i++) {
    let act = KEYMAP_ACTIONS[i];
    let r = getKeyMapRowRect(i);
    let hovering = isPointInRect(gameMX(), gameMY(), r);
    let isThisRebinding = rebindingAction === act.id;

    noStroke();
    if (isThisRebinding) {
      fill(70, 52, 110, 220);
    } else if (hovering) {
      fill(40, 42, 58, 220);
    } else {
      fill(20, 22, 32, 200);
    }
    rect(r.x, r.y, r.w, r.h, 8);

    noFill();
    if (isThisRebinding) {
      stroke(220, 200, 255, 140);
    } else if (hovering) {
      stroke(210, 215, 240, 70);
    } else {
      stroke(180, 184, 220, 32);
    }
    strokeWeight(1);
    rect(r.x, r.y, r.w, r.h, 8);
    noStroke();

    fill(232, 232, 240);
    textAlign(LEFT, CENTER);
    textStyle(NORMAL);
    textSize(16);
    text(act.label, r.x + 18, r.y + r.h / 2);

    textAlign(RIGHT, CENTER);
    if (isThisRebinding) {
      fill(255, 230, 140);
      textStyle(ITALIC);
      textSize(15);
      text("Press a key or click...", r.x + r.w - 18, r.y + r.h / 2);
      textStyle(NORMAL);
    } else {
      let b = keybinds[act.id];
      if (b && b.type === "none") {
        fill(180, 130, 130);
      } else {
        fill(220, 222, 232);
      }
      textSize(15);
      text(b ? b.label : "Unbound", r.x + r.w - 18, r.y + r.h / 2);
    }
  }

  // reset button
  let rb = getKeyMapResetRect();
  let resetHover = isPointInRect(gameMX(), gameMY(), rb);
  noStroke();
  fill(resetHover ? color(54, 32, 36, 230) : color(28, 18, 22, 190));
  rect(rb.x, rb.y, rb.w, rb.h, 8);
  noFill();
  stroke(220, 140, 150, resetHover ? 110 : 60);
  strokeWeight(1);
  rect(rb.x, rb.y, rb.w, rb.h, 8);
  noStroke();
  fill(240, 222, 226);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(14);
  text("Reset to Defaults", rb.x + rb.w / 2, rb.y + rb.h / 2);
}

function handleKeyMapClick() {
  // ignore clicks on the back button area (top-left) — backButton handles itself
  if (mouseX < 140 && mouseY < 70) return;

  // capturing for an active rebind
  if (rebindingAction) {
    if (!rebindArmed) return;
    setBinding(rebindingAction, makeMouseBinding(mouseButton));
    rebindingAction = null;
    return;
  }

  // wait until the click that opened the screen has been released
  if (!keyMapInputArmed) return;

  for (let i = 0; i < KEYMAP_ACTIONS.length; i++) {
    let r = getKeyMapRowRect(i);
    if (isPointInRect(gameMX(), gameMY(), r)) {
      startRebind(KEYMAP_ACTIONS[i].id);
      return;
    }
  }

  let rb = getKeyMapResetRect();
  if (isPointInRect(gameMX(), gameMY(), rb)) {
    keybinds = getDefaultKeybinds();
    rebindingAction = null;
  }
}