// Example Screeps bot built using creep-tasks

require('creep-tasks');
require('prototype.tower');
let rolePeon = require('role.peon');


/** Global Restart Event Logic */
console.log('<<<< Global Restart Event >>>>');

module.exports.loop = function () {

    //Clean memory
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('INFO: Clearing non-existing creep memory:', name);
        }
    } // end of creep cleaning
    
    //run towers
    let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        tower.run();
    }

    let spawn = Game.spawns['Spawn1'];
    let creeps = _.values(Game.creeps);

    // Separate creeps by role
    let peons = _.filter(creeps, creep => creep.name.includes("Peon"));

    // Spawn creeps as needed
    if (peons.length < 6) {
        let maxEnergy = spawn.room.energyAvailable;
        let bodyunit = [WORK, CARRY, MOVE, MOVE];
        let bodyunitcost = 250;
        let bodysize = Math.floor(maxEnergy/bodyunitcost);
        let realbody = [];
        for (let i = 0; i < bodysize; i++) {
            realbody = realbody.concat(bodyunit);
        }
        spawn.spawnCreep(realbody, "Peon" + Game.time);
    }

    // Handle all roles, assigning each creep a new task if they are currently idle
    for (let peon of peons) {
        if (peon.isIdle) {
            rolePeon.newTask(peon);
        }
    }

    // Now that all creeps have their tasks, execute everything
    for (let creep of creeps) {
        creep.run();
    }

    /** Added simply to allow for unused CPU to get converted into in game credits */
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
        console.log("To much brain power.");
    }

};