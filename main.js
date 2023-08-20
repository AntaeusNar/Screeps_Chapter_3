// Example Screeps bot built using creep-tasks

require('creep-tasks');
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let rolePeon = require('role.peon');


/** Global Restart Event Logic */
console.log('<<<< Global Restart Event >>>>');

module.exports.loop = function () {

    let spawn = Game.spawns['Spawn1'];
    let creeps = _.values(Game.creeps);

    // Separate creeps by role
    let harvesters = _.filter(creeps, creep => creep.name.includes("Harvester"));
    let upgraders = _.filter(creeps, creep => creep.name.includes("Upgrader"));
    let peons = _.filter(creeps, creep => creep.name.includes("Peon"));

    // Spawn creeps as needed
    if (peons.length < 3) {
        spawn.spawnCreep([WORK, CARRY, MOVE], "Peon" + Game.time);
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
    }

};