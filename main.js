// Example Screeps bot built using creep-tasks

require('creep-tasks');
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');


/** Global Restart Event Logic */
console.log('<<<< Global Restart Event >>>>');

module.exports.loop = function () {

    let spawn = Game.spawns['Spawn1'];
    let creeps = _.values(Game.creeps);

    // Separate creeps by role
    let harvesters = _.filter(creeps, creep => creep.name.includes("Harvester"));
    let upgraders = _.filter(creeps, creep => creep.name.includes("Upgrader"));

    // Spawn creeps as needed
    if (harvesters.length < 3) {
        spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester" + Game.time);
    } else if (upgraders.length < 2) {
        spawn.spawnCreep([WORK, CARRY, MOVE], "Upgrader" + Game.time);
    }

    // Handle all roles, assigning each creep a new task if they are currently idle
    for (let harvester of harvesters) {
        if (harvester.isIdle) {
            roleHarvester.newTask(harvester);
        }
    }
    for (let upgrader of upgraders) {
        if (upgrader.isIdle) {
            roleUpgrader.newTask(upgrader);
        }
    }

    // Now that all creeps have their tasks, execute everything
    for (let creep of creeps) {
        creep.run();
    }

    /** Added simply to allow for unused CPU to get converted into in game credits */
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }

};