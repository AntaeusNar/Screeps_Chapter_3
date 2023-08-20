/** The Director is the doer.  Everything comes to The Director and The Director dispatches all work based on priority and time in que.
 * All Requests will include a priority, each Priority will need to be addressed within a target number of cycles.  If the number of cycles passes, the priority will be increased.
 * All tasks will be handled by priority, in order of time in que (first in first out), doing as much as can be done either with tools available or inside CPU cycles.
 */


class TheDirector {
    /** Creates TheDirector object
     * @returns {Object} a director
      */
    constructor() {
        if (Memory.Director == undefined) {
            Memory.Director = {};
        }

    }

    /** Gets the Director memory
    * @returns {object} Director memory
    */
    get memory() {
        return Memory.Director;
    }

    /** Sets the Director Memory
    * @param {*} value
    */
    set memory(value) {
        Memory.Director = value;
    }
}

module.exports = TheDirector;