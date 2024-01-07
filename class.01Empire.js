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
}