/** The Main Code Run for the Game
 * 
 */

/** Imports */
const TheDirector = require('./class.TheDirector');


/** One-Time Global Effects */
console.log('<<<<< Global Restart >>>>>');
let director = new TheDirector;


/** The Main Loop */
function mainLoop() {


    /** Added simply to allow for unused CPU to get converted into in game credits */
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
}

/** This export gives the main loop over to the game for execution. */
module.exports.loop = mainLoop;