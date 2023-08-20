let Tasks = require('creep-tasks');

let roleHarvester = {

    // Harvesters harvest from sources, preferring unattended ones and deposit to Spawn1
    // This module demonstrates the RoomObject.targetedBy functionality

    newTask: function (creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            // Harvest from an empty source if there is one, else pick any source
            let options = {
                moveOptions: {
                    visualizePathStyle: {
                        stroke: '#00ff00', 
                        opacity: .5, 
                        strokeWidth: .1},
                    },
                }
            let sources = creep.room.find(FIND_SOURCES);
            let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
            if (unattendedSource) {
                creep.task = Tasks.harvest(unattendedSource, options);
            } else {
                creep.task = Tasks.harvest(sources[0], options);
            }
        } else {
            let spawn = Game.spawns['Spawn1'];
            creep.task = Tasks.transfer(spawn);
        }
    }

};

module.exports = roleHarvester;
