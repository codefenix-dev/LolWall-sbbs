/*

LolWall                        ▄ ▄ ▄
for Synchronet                 █████
Version 0.260502               ▐▄█▄▌ cf
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
by Craig Hendricks
codefenix@conchaos.synchro.net

ConstructiveChaos BBS:
  https://conchaos.synchro.net
 telnet://conchaos.synchro.net
    ssh://conchaos.synchro.net

*/

load("sbbsdefs.js");
load('funclib.js');
load("frame.js");

const EXEC_PATH = backslash(js.exec_dir);
const WALL_FRAME = EXEC_PATH + "lolwall.msg";
const WALL_DATA = EXEC_PATH + "lolwall.dat";
const SETTINGS_FILE = EXEC_PATH + "lolwall.ini";
const ALIAS_LEN = 15;
const X = 2;

// These options are configurable in lolwall.ini
var numberToDisplay = 14;
var startY = 8;
var maxPostLength = 60;
var aliasColor = "|03";
var sysopColor = "|11";
var blankWallString = "The wall is empty! Add something!";
var twits = [];
var minSecurityLevel = 20;

function main() {
    
    var y = startY;
    var startCount = 0;
    var newOneliner = "";
    var lines;
        
    // disable accidentally toggling "raw input/output" modes
    js.on_exit("console.ctrlkey_passthru = " + console.ctrlkey_passthru);
    console.ctrlkey_passthru = "Z";

    var fIn = new File(WALL_DATA);
    if (fIn.open("r", true)) {
        lines = fIn.readAll();        
        fIn.close();
    } else {
        log(LOG_WARNING, "Error " + fIn.error + " opening " + WALL_DATA);
        lines = [blankWallString];
    }
        
    startCount = lines.length > numberToDisplay ? (lines.length - numberToDisplay) : 0;
    console.clear();
    console.printfile(WALL_FRAME, P_NOABORT);
    displayLines(lines, y, startCount);
    console.gotoxy(25, 23);
    if (user.security.level < minSecurityLevel || twits.indexOf(user.alias.toUpperCase()) >= 0) {
        log(LOG_WARNING, "lolwall is view-only for this user.");
        console.pause();
        return;
    } 
    
    if (!console.noyes("Add something")) {
        newOneliner = getInputWithPreview("Let's have it", maxPostLength);
        if ( console.strlen(pipeToCtrlA(newOneliner)) === 0 /*newOneliner == "" */ ) {
            console.print("\x01k\x01h\x01lchickened out...\r\n\x01n");
            log(LOG_INFO, "chickened out...");            
        } 
        else {
            console.print("\x01k\x01h\x01lYou entered:\r\n\x01n");
            console.print("   " + pipeToCtrlA(newOneliner) + "\r\n\r\n");
            if (console.yesno("OK")) {
                fIn = new File(WALL_DATA);
                fIn.open("a", false);
                fIn.writeln((user.number == 1 ? sysopColor : aliasColor) + padLeft(user.alias.toUpperCase(), ALIAS_LEN) + "|08: |07" + newOneliner + "|07|16");
                fIn.close();
                console.down(3);
                console.print("\x01w\x01hAdded!\r\n\x01n");
                log(LOG_INFO, "Added one-liner: '" + newOneliner + "'");
            } else {
                console.down(3);
                console.print("\x01k\x01haborted...\r\n\x01n");
            }
        }
        fIn = new File(WALL_DATA);
        fIn.open("r", false);
        lines = fIn.readAll();
        fIn.close();
        startCount = lines.length > numberToDisplay ? (lines.length - numberToDisplay) : 0;
        console.clear();
        console.printfile(WALL_FRAME, P_NOABORT);
        y = startY;
        displayLines(lines, y, startCount);
        console.gotoxy(30, 23);
        console.pause();
    }    
    console.clear();    
}

function displayLines(lines, y, startCount) {
    const DELAY = 15;
    for (var i = startCount; i < lines.length; i++) {
        console.gotoxy(X, y); // fade in...
        console.print(pipeToCtrlA(dimPipeColor(dimPipeColor(dimPipeColor(lines[i])))) + "\x01n");
        mswait(DELAY);
        console.gotoxy(X, y); // fade in...
        console.print(pipeToCtrlA(dimPipeColor(dimPipeColor(lines[i]))) + "\x01n");
        mswait(DELAY);
        console.gotoxy(X, y); // fade in...
        console.print(pipeToCtrlA(dimPipeColor(lines[i])) + "\x01n");
        mswait(DELAY);
        console.gotoxy(X, y); // "fully lit"
        console.print(pipeToCtrlA(lines[i]) + "\x01n");
        mswait(DELAY);
        y = y + 1;
    }
}

function dimPipeColor(str) {
	str = str.replace(/\|03/g, "|08");
	str = str.replace(/\|05/g, "|04");
    str = str.replace(/\|07/g, "|08");
	str = str.replace(/\|09/g, "|01");
	str = str.replace(/\|10/g, "|02");
	str = str.replace(/\|11/g, "|03");
	str = str.replace(/\|12/g, "|04");
	str = str.replace(/\|13/g, "|05");
	str = str.replace(/\|14/g, "|06");
	str = str.replace(/\|15/g, "|07");
	str = str.replace(/\|17/g, "|16");
	str = str.replace(/\|21/g, "|17");
	str = str.replace(/\|18/g, "|17");
	str = str.replace(/\|19/g, "|17");
	str = str.replace(/\|20/g, "|17");
	str = str.replace(/\|22/g, "|17");
	str = str.replace(/\|23/g, "|17");
    return str;
}

function padLeft(str, len) {
    while (str.length < len) {
        str = " " + str;
    }
    return str;
}

function getInputWithPreview(what, maxLen) {
	console.clear();
    const WIDTH = console.screen_columns - 2;
	const BLINKY_CURSOR = "\x01w\x01h\x01i" + ascii(219);
	var updateFrames = true;
    var inputStr = "";
	var previewStr = "";
	var keyPressed = "";
    
    var borderChars = "-=" + ascii(240) + "=";
    var entryBorder = (new Array((WIDTH+1)).join(borderChars)).substr(0, WIDTH);
    var entryField = new Array(WIDTH).join(" ") + " ";
    var previewBorder = (new Array(maxLen+1).join(borderChars)).substr(0, maxLen);
    var previewField = new Array(maxLen).join(" ") + " ";

    printf("\x1b[?25l"); // hide the blinking cursor
	console.print("  \x01n\x01b\x01h" + what + " \x01k\x01h(\x01n\x01b\x01b" + maxLen + "\x01b chars\x01k\x01h)\x01n...\r\n");
	console.print("\x01k\x01h" + entryBorder + "\x01w|\r\n");
	console.print("\x01k\x01h" + entryField + "\x01w|\r\n");
	console.print("\x01k\x01h" + entryBorder + "\x01w|\r\n");
	console.print("\r\n  \x01n\x01bPreview:\r\n");
	console.print("\x01b\x01h" + previewBorder + "\x01w|\r\n");
	console.print("\x01b\x01h" + previewField + "\x01w|\r\n");
	console.print("\x01b\x01h" + previewBorder + "\x01w|\r\n");
    
	console.print("\r\nPipe colors:");
	console.print("\r\n \x01k\x01hForeground:");    
    for (var i = 1; i < 16; i++) {
        console.print( " \x01n|" +  pipeToCtrlA(format("\x01n|%02d", i)) + format("%02d", i)  );
    }
    console.print("\r\n \x01k\x01hBackground:");
    for (var i = 16; i < 24; i++) {
        console.print( " \x01n|" +  pipeToCtrlA(format("\x01k\x01h|%02d", i)) + format("%02d", i) + "\x01n" );
    }

    var fInput = new Frame(1, 3, WIDTH, 1, BG_BLACK|LIGHTGRAY);
	var fPreview = new Frame(1, 8, maxLen, 1, BG_BLACK|LIGHTGRAY);
	var charsUsed = new Frame(15, 6, 15, 1, BG_BLACK|LIGHTGRAY);
	fInput.open();
	fInput.putmsg(inputStr + BLINKY_CURSOR);
	fInput.cycle();
	fPreview.open();
	charsUsed.open();
	charsUsed.putmsg(format("\x01n\x01k(%s%d of %d\x01n\x01k)", "\x01k\x01h", 0, maxLen));
	charsUsed.cycle();

    while (!js.terminated) {

        keyPressed = console.inkey(K_NOCRLF|K_NOSPIN|K_NOECHO,10000); 

        if (keyPressed == "\r" && console.strlen(previewStr) <= maxLen) {
			break;
		} else if (keyPressed == KEY_DEL || keyPressed == '\b') {
			inputStr = inputStr.substr(0, inputStr.length - 1);
			updateFrames = true;
		} else if (keyPressed == KEY_ESC) {
			inputStr = "";
			previewStr = "";
			break;
		} else {
			if (keyPressed != CTRL_Z) { // disable accidentally typing a CTRL-Z character
				inputStr = inputStr + keyPressed;
				updateFrames = true;
			}
		}

		if (updateFrames) {
			previewStr = pipeToCtrlA(inputStr);

			fInput.clear();
			fInput.putmsg(inputStr + BLINKY_CURSOR);
			fInput.cycle();

			fPreview.clear();
			fPreview.putmsg(previewStr);
			fPreview.cycle();

			charsUsed.clear();
			charsUsed.putmsg( format("\x01n\x01k(%s%d of %d\x01n\x01k)",
									(console.strlen(previewStr) <= maxLen ? "\x01c" : "\x01r"),
									console.strlen(previewStr),
									maxLen) );
			charsUsed.cycle();

			updateFrames = false;
        }
        yield();
    }
	fInput.close();
	fPreview.close();
	charsUsed.close();
    printf("\x1b[?25h"); // show the blinking cursor when done
    return strip_ctrl(inputStr.trim());
}

function loadSettings() {
    var f = new File(SETTINGS_FILE);
    if (f.open('r')) {     
        var settings = f.iniGetObject();
        f.close();
        if (settings.twits) {
            twits = settings.twits.toUpperCase().split(';');
        }
        minSecurityLevel = settings.minSecurityLevel;
        numberToDisplay = settings.numberToDisplay;
        startY = settings.rowStart;
        maxPostLength = settings.maxPostLength;
        aliasColor = settings.aliasColor;
        sysopColor = settings.sysopColor;
        blankWallString = settings.blankWallString;
    }
}

loadSettings();
main();