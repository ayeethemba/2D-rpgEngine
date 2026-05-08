let fairyDia;
let traderDia;
let nextDialogueReady = false;
let diaIndex = 0;
let nextDiaLine = 0;
let currDiaFile;
let leftRight;
let leaderDia
let helpDia = ["#???: HEEEEELLLLLLLPP!!!!", "~"]
let havingNightmare = false;


// indicates whether or not there should be a image loaded for speaker
// false means there should be an image loaded
let showDiaSprite = false;

function initDiaFile(person) {
    diaIndex = 0;
    nextDiaLine = 0;
    currDiaFile = ""
    nextDialogueReady = false;
    if (person === "fairy") {
        isDialogue = true;
        currDiaFile = fairyDia;
        printDialogue(currDiaFile[0], 0);
    } else if (person === "trader") {
        isDialogue = true;
        currDiaFile = traderDia;
        printDialogue(currDiaFile[0], 0);
    } else if (person === "help") {
        isDialogue = true;
        currDiaFile = helpDia;
        printDialogue(currDiaFile[0], 0);
    } else if (person === "leader") {
        isDialogue = true;
        currDiaFile = leaderDia
        printDialogue(currDiaFile[0], 0)
    } else if (person === "bartender") {
        isDialogue = true;
        currDiaFile = bartenderDia;
        printDialogue(currDiaFile[0], 0);
    }
}

function printDialogue(line, lineNumber) {

    // Guard: undefined or empty line — end dialogue cleanly rather than crash
    if (line === undefined || line === null || line.length === 0) {
        isDialogue = false;
        nextDiaLine = 0;
        if (typeof skipDialogueButton !== 'undefined') skipDialogueButton.hide();
        return;
    }

    //reads the first char of the dialogue file line to see what the command is
    marker = line[0]

    // # marks that someone is talking
    if (marker === "#") {

        //splits the speaker name and the dialogue
        let splitLine = line.split(": ")

        // Guard: malformed line with no ": " separator — skip silently
        if (splitLine.length < 2 || !splitLine[1]) {
            nextDiaLine++;
            return;
        }

        // #N indicates that the narrator is talking
        if (splitLine[0][0] === '#' && splitLine[0][1] == 'N') {
            showDiaSprite = true;
            if (splitLine[0].length == 3) {
                if (splitLine[0][2] === '0') {
                    stopMusic()
                    nightmareSong.loop()
                    havingNightmare = true
                } else if (splitLine[0][2] === '1') {
                    stopMusic()
                    musicTown.loop()
                    havingNightmare = false
                }
            }
            dialogue = new Dialogue(splitLine[1], "", false);
        } else {
            let personTalking = splitLine[0].substring(1);
            if (personTalking === "Fairy") {
                showDiaSprite = false;
                dialogueSprite = fairySprite;
            } else if (personTalking === "Player") {
                showDiaSprite = false;
                dialogueSprite = playerTalkSprite;
            } else if (personTalking === "Trader") {
                showDiaSprite = false;
                dialogueSprite = traderSprite;
            } else if (personTalking === "Town Leader") {
                showDiaSprite = false;
                dialogueSprite = leaderSprite;
            } else if (personTalking === "Bartender") {
                dialogueSprite = npc5Sprite || traderSprite;
                showDiaSprite = false;
            } else {
                showDiaSprite = true;
            }
            if (personTalking === "Player") {
                dialogue = new Dialogue(splitLine[1], "", false);
            } else {
                dialogue = personDialogue(personTalking + ": ", splitLine[1]);
            }
        }
    }

    // indicates dialogue choices
    if (marker === "=") {
        workingString = line.substring(line.indexOf("["), line.indexOf("]"))
        splitLine = workingString.split("|");
        leftOption = createMainMenuButton(splitLine[0].substring(1), (width / 8) - 125, (height * 5) / 6, function() {
            leftRight = "left";
            mouseReleased = false;
            updateUI();
            let targetLine = currDiaFile[lineNumber + 1];
            if (targetLine === undefined) { leftOption.hide(); rightOption.hide(); return; }
            nextDiaLine = int(targetLine) - 1;
            if (nextDiaLine < 0 || nextDiaLine >= currDiaFile.length) { leftOption.hide(); rightOption.hide(); return; }
            printDialogue(currDiaFile[nextDiaLine], nextDiaLine)
            leftOption.hide();
            rightOption.hide();
        });
        leftOption.style('font-size', '12px');
        rightOption = createMainMenuButton(splitLine[1], ((width * 7) / 8) - 125, (height * 5) / 6, function() {
            leftRight = "right";
            mouseReleased = false;
            updateUI();
            let targetLine = currDiaFile[lineNumber + 2];
            if (targetLine === undefined) { leftOption.hide(); rightOption.hide(); return; }
            nextDiaLine = int(targetLine) - 1;
            if (nextDiaLine < 0 || nextDiaLine >= currDiaFile.length) { leftOption.hide(); rightOption.hide(); return; }
            printDialogue(currDiaFile[nextDiaLine], nextDiaLine);
            leftOption.hide();
            rightOption.hide();
        });
        rightOption.style('font-size', '12px');
    }

    // indicates that the dialogue should skip to a certain line
    if (marker === "%") {
        nextDiaLine = int(line.substring(1)) - 1;
        if (nextDiaLine >= 0 && nextDiaLine < currDiaFile.length) {
            printDialogue(currDiaFile[nextDiaLine], nextDiaLine);
        } else {
            isDialogue = false;
            if (typeof skipDialogueButton !== 'undefined') skipDialogueButton.hide();
        }
    } else if (marker !== "=" && marker !== "~") {
        nextDiaLine++;
    }

    // indicates that the dialogue file should stop being read
    if (marker === "~") {
        if (currDiaFile === leaderDia) {
            enemyGameState = "raid"
        }
        if (typeof bartenderDia !== 'undefined' && currDiaFile === bartenderDia) {
            mushroomReceived = true;
            showMushroomPopup = true;
            specialBar = 0;
        }
        diaIndex = 0;
        nextDiaLine = 0;
        isDialogue = false;
        if (typeof skipDialogueButton !== 'undefined') skipDialogueButton.hide();
    }
}

function personDialogue(name, dialogue) {
    return new Dialogue(dialogue, name, false)
}
