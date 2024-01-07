// Example Screeps bot built using creep-tasks

require('creep-tasks');
require('prototype.tower');
require('prototype.spawn');
const rolePeon = require('role.peon');


/** Global Restart Event Logic */
console.log('<<<< Global Restart Event >>>>');
if (Memory.CpuData == undefined) {
    Memory.CpuData = [];
}
if (Memory.Status == undefined) {
    Memory.Status = {};
}
if (Memory.Status.Message == undefined) {
    Memory.Status.Message = "";
}

module.exports.loop = function () {
    let startcpu = Game.cpu.getUsed();

    //Clean memory
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('INFO: Clearing non-existing creep memory:', name);
        }
    } // end of creep cleaning

    //Target Number of creeps based on CPU usage
    let sum = Memory.CpuData.reduce((partialSum, a) => partialSum + a, 0);
    let rollingAvg = sum/30;
    let targetNumberCreeps = Math.max(1, Math.floor(15/(rollingAvg/Object.keys(Game.creeps).length)));

    //run towers
    let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let tower of towers) {
        tower.run();
    }

    let spawn = Game.spawns['Spawn1'];
    let creeps = _.values(Game.creeps);

    // Separate creeps by role
    let peons = _.filter(creeps, creep => creep.name.includes("Peon"));
    // Get idle Peons
    let idlePeons = peons.filter((p) => p.isIdle).length;
    // Get maxEnergy
    let maxEnergy = spawn.room.energyAvailable;

    //some messaging
    let spawnPeon = false;
    let spawnMessage = "";


    //Spawning Control Logic
    if (creeps.length < targetNumberCreeps) {
        //Can have more creeps based on left over cpu
        spawnMessage = "CPU can support more Creeps,";
        if (spawn.spawning == null) {
            //Spawner is ready
            spawnMessage = spawnMessage + " spawner is ready,";
            if (idlePeons == null | idlePeons == 0) {
                //All Peons are busy
                spawnMessage = spawnMessage + " there is more work then Peons,";
                if (maxEnergy >= 250) {
                    spawnMessage = spawnMessage + " and we have enough energy for a basic Peon.";
                    spawnPeon = true;
                } else {
                    spawnMessage = spawnMessage + " but there is not enough energy.";
                }
            } else {
                spawnMessage = spawnMessage + " but there idle Peons.";
            }
        } else {
            spawnMessage = spawnMessage + " but the Spawner is busy.";
        }
    }

    if (Memory.Status.Message =! spawnMessage) {
        console.log(spawnMessage);
        Memory.Status.Message = spawnMessage;
    }

    if (spawnPeon) {
        let bodyunit = [WORK, CARRY, MOVE, MOVE];
        let bodyunitcost = 250;
        let bodysize = Math.min(Math.floor(maxEnergy/bodyunitcost), 12);
        let realbody = [];
        for (let i = 0; i < bodysize; i++) {
            realbody = realbody.concat(bodyunit);
        }
        let name = 'Peon' + Game.time;
        console.log("Spawning " + name + " with a body size of " + realbody.length)
        spawn.spawnCreep(realbody, name);
    }
    //End of Spawning logic

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
        console.log("Extra CPU, Generating Pixel.");
    }

    let endcpu = Game.cpu.getUsed();
    let length = Memory.CpuData.push(endcpu - startcpu);
    if (length > 30) {
        Memory.CpuData.shift();
    }
    //console.log('Used CPU: ' + (endcpu - startcpu) + " Moving Average: " + rollingAvg + " Target # Creeps: " + targetNumberCreeps);

};