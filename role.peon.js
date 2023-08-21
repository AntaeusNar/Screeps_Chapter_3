//The Peon is a general worker. Capable of the logic of many tasks, but not very good at all of them, this is the jack of all trades.

let Tasks = require('creep-tasks');

let rolePeon = {
    newTask: function (creep) {
        if (creep.carry.energy == 0) {
            //when completely out of energy...

            let options = {
                moveOptions: {
                    visualizePathStyle: {
                        stroke: '#00ff00', 
                        opacity: .5, 
                        strokeWidth: .1},
                    },
            }
            
            //Selections
            let pickup = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY
            });
            if (pickup != undefined) {
                creep.task = Tasks.pickup(pickup, RESOURCE_ENERGY);
            } else {
                let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                    filter: t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                });

                if (tombstone != undefined) {
                    creep.task = Tasks.withdraw(tombstone);
                } else {
                    let ruin = creep.pos.findClosestByPath(FIND_RUINS, {
                        filter: t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                    });
                    if (ruin != undefined) {
                        creep.task = Tasks.withdraw(ruin)
                    } else {
                        let source = _.sortBy(creep.room.find(FIND_SOURCES), [function(s) {return s.targetedBy.length;}])[0];
                        creep.task = Tasks.harvest(source, options);
                    }
                }
            }
        } else {
            //lets find something to do!
            //fill towers, extensions, spawns
            let fill = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_TOWER || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && s.targetedBy.length <= 1
            });
            if (fill != undefined) {
                creep.task = Tasks.transfer(fill);
            } else {
                creep.task = Tasks.upgrade(creep.room.controller);
            }
        }
    }

};

module.exports = rolePeon;