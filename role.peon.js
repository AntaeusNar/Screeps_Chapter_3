//The Peon is a general worker. Capable of the logic of many tasks, but not very good at all of them, this is the jack of all trades.

let Tasks = require('creep-tasks');

let rolePeon = {
    newTask: function (creep) {
        if (creep.carry.energy == 0) {
            //when completely out of energy...
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
            let spreadsource = _.sortBy(sources, [function(s) {return s.targetedBy.length}])[0];
            creep.task = Tasks.harvest(spreadsource, options);
            /**
            let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
            if (unattendedSource) {
                creep.task = Tasks.harvest(unattendedSource, options);
            } else {
                creep.task = Tasks.harvest(sources[0], options);
            } 
            */           
        } else {
            //lets find something to do!
            let spawn = Game.spawns['Spawn1'];
            if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                creep.task = Tasks.transfer(spawn);
            } else {
                creep.task = Tasks.upgrade(creep.room.controller);
            }
        }
    }

};

module.exports = rolePeon;