//The Peon is a general worker. Capable of the logic of many tasks, but not very good at all of them, this is the jack of all trades.

let Tasks = require('creep-tasks');

let rolePeon = {
    newTask: function (creep) {
        if (creep.carry.energy == 0) {
            //when completely out of energy...
            
            //Look for dropped?
            let pickup = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY
            });
            if (pickup != undefined) {
                creep.task = Tasks.pickup(pickup, RESOURCE_ENERGY);
            } else {
                //or rob a grave?
                let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                    filter: t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                });

                if (tombstone != undefined) {
                    creep.task = Tasks.withdraw(tombstone);
                } else {
                    //plunder a ruin?
                    let ruin = creep.pos.findClosestByPath(FIND_RUINS, {
                        filter: t => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                    });
                    if (ruin != undefined) {
                        creep.task = Tasks.withdraw(ruin);
                    } else {
                        //empty a container?
                        let container = _.sortBy(creep.room.find(FIND_STRUCTURES, {
                            filter: s => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                        }), [function(s) {return s.targetedBy.length}])[0];
                        if (container != undefined) {
                            creep.task = Task.withdraw(container);
                        } else {
                            //mine some energy....
                            let source = _.sortBy(creep.room.find(FIND_SOURCES), (s) => s.targetedBy.length)[0];
                            creep.task = Tasks.harvest(source);
                        }
                    }
                }
            }
        } else {
            //lets find something to do!
            //fill towers, extensions, spawns?
            let fill = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_TOWER || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) &&
                    s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && s.targetedBy.length <= 2
            });
            if (fill != undefined) {
                creep.task = Tasks.transfer(fill);
            } else {
                //lets build some things?
                let build = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                if (build != undefined) {
                    creep.task = Tasks.build(build);
                } else {
                    //upgrade that tower...
                    creep.task = Tasks.upgrade(creep.room.controller);                    
                }

            }
        }
    }

};

module.exports = rolePeon;