/** Empire Is. Empire Was. Empire Will Be.  Empire is Light.  Empire is Just.
 * It is these great truths that drive us forward.
 */

/** Requires */
const Dominion = require('class.02Dominion');

/** Global Rest Checks */
//Memory
if (Memory.Empire == undefined) {
    Memory.Empire = {};
    Memory.Empire.Dominions = {};
}

/** Class Defining Empire: if such a thing could be done. */
class Empire {
    /** Creates Empire
     * @returns {Object} Empire
     */
    constructor() {
        // The Empire has Dominions
        this.dominions = {};

        // The Empire has a start, although none may know.  Empire Was.
        this.foundationEpoc = Game.time;
    }


    /** Empire works for the people */
    run() {
        //Empire moves Dominions
        for (let dominion in this.dominions) {
            this.dominions[dominion].run();
        }
    }

    /** Get Empire's memory
     * @returns {Object} Empire's memory
     */
    get memory() {
        return Memory.Empire;
    }

    /** Sets Empire's Memory
     * @param {*} value
     */
    set memory(value) {
        Memory.Empire = value;
    }

    /**Empire gives Life to Dominions */
    constructDominions() {
        let knownDominions = [];
        //Empire knows its own
        if (this.memory.Dominions) {
            for (let dominion of this.memory.dominions.split(',')) {
                knownDominions.push(dominion);
            }
        }
        //Empire Welcomes All
        for (let room in Game.rooms) {
            let evalRoom = Game.rooms[room];
            if (evalRoom.controller != undefined && evalRoom.controller.my) {
                if (!knownDominions.includes(room)) {
                    knownDominions.push(room);
                }
            }
        }

        //Empire breathes Life
        for (let capitalRoomName of knownDominions) {
            this.Dominions[capitalRoomName] = new Dominion(capitalRoomName);
        }

    } //End of constructDominions
}//End of Empire

module.exports = Empire;