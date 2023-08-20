/** The Main Code Run for the Game
 * 
 */



/** The Main Loop */
function mainLoop() {


    /** Added simply to allow for unused CPU to get converted into ingame credits */
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
}

/** This export gives the main loop over to the game for execution. */
modules.exports.loop = mainLoop;