/** Serving Empire, as Empire serves the people, Dominions form the backbone of Empire. */

/** Class representing a Dominion */
class Dominion {
    /** Creates a Dominion
     * @param {string} capitalRoomName
     */
    constructor(capitalRoomName) {
        this.name = capitalRoomName;
        return this;
    }

    /** Running the Dominion is where everything get evaluated, and executed. */
    run() {
        //todo: write this...
    }

    /** Gets the Memory of the Dominion.
     * @returns {Object} memory Object
     */
    get memory() {
        return Memory.Empire.Dominions[this.name];
    }

    /** Sets the memory
     * @param {*} value
     */
    set memory(value) {
        Memory.Empire.Dominions[this.name] = value;
    }
}