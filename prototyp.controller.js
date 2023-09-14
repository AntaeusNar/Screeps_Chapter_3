/** Controllers */

//First memory
if(Memory.controllers == undefined) {
    Memory.controllers = {};
}

/** Prototype Changes */

//Add memory
Object.defineProperty(StructureController.prototype, 'memory', {
    get: function() {
      return Memory.controllers[this.name] = Memory.controllers[this.name] || {};
    },
    set: function(value) {
      Memory.controllers[this.name] = value;
    },
});
  
//Add a name
Object.defineProperty(StructureController.prototype, 'name', {
    get: function() {
      if(!this._name) {
        this._name = this.room.name;
      }
      return this._name;
    }
});

//Find/build list of room in active area of control
Object.defineProperty(StructureController.prototype, '_roomList', {
    get: function() {
        //check to see if it is in memory
        if(!this.memory.roomList) {
          //build a list of all rooms that has a pathing distance of 9 or less
          //using Game.map.findRoute(home, targetRoom).
          let rooms = roomMapper(this.name, 9, false, true);
          this.memory.roomList = rooms.toString();
        }
        let roomArray = this.memory.roomList;
        return roomArray.split(',');
      }
});

//Returns an Object of rooms, with room.name as keys
Object.defineProperty(StructureController.prototype, 'rooms', {
    get: function() {
        if(!this._rooms) {
            let rooms = {};
            for (let roomName of this._roomList) {
              rooms[roomName] = Game.rooms[roomName];
            }
            this._rooms = rooms;
        }
        return this.rooms
    },
});

//Returns an array of rooms that are within range, but not in memory
Object.defineProperty(StructureController.prototype, 'scoutableRooms', {
    get: function() {
      if(!this._scoutableRooms){
        let rooms = [];
        //run through every room in roomList
        for (let room of this.roomList){
          //if that room is not found in memory add to list
          if(!Object.keys(Memory.rooms).includes(room)){
            rooms.push(room);
          }
        }
        this._scoutableRooms = rooms;
      }
      return this._scoutableRooms;
    }
});

//Find replacement based on room.find
Controller.prototype.find = function() {
    let results = [];
    for (let room of this.rooms) {
        results = results.concat(room.find(arguments));
    }
    return results;
}
  









/** Given a roomName and a maxDistance from roomName, generates a array of room names within the maxDistance
    * @param {string} roomName
    * @param {number} maxDistance
    * @param {boolean} [countSK = false]
    * @param {boolean} [countHighway = false]
    * @returns {array} array of roomNames
    */
function roomMapper(roomName, maxDistance, countSK = false, countHighway = false) {
    //this function builds an array of rooms that are pathable with
    //a distance <= maxDistance.
    let roomList = [];
    let currentDistance = 0;
    let startingRoom = roomName;
    roomList.push(roomName);

    function scanning(roomName, maxDistance, currentDistance, startingRoom, countSK, countHighway) {
      //this recursive function is going to use an the passed currentDistance
      //until that distance == maxDistance, then it is going to recheck the
      //distance to see if there is a closer path
      currentDistance++;
      //check to see if we are at max distance
      if (currentDistance == maxDistance) {
        //get the path from startingRoom to this room
        let path = Game.map.findRoute(startingRoom, roomName);
        let pathDistance;
        //max sure we got a path
        if (path != -2) {
          //get the path distance
          pathDistance = path.length;
          //check to see if the path to this room is less then the tracked distance
          if (pathDistance < currentDistance) {
            //if the path distance is less then the current distance, reset currentDistance
            //to pathDistance
            currentDistance = pathDistance;
          }
        }
      }

      //now make sure we can reach the next rooms
      if (currentDistance < maxDistance) {
        //get the exits
        let adjacentExits = Game.map.describeExits(roomName);
        //convert exits to room names
        let currentScan = Object.keys(adjacentExits)
                                .map(function(key) {
                                  return adjacentExits[key];
                                });

        //for each name found, add the room
        currentScan.forEach(roomName => {
          //checks to make sure it is not in the list, and it is a normal room
          let count = false
          let roomType = getRoomType(roomName);
          if (!roomList.includes(roomName) && Game.map.getRoomStatus(roomName).status == 'normal') {
            count = true;
          }
          if (count && !countSK && roomType == ROOM_SOURCE_KEEPER) {
            count = false;
          }
          if (count && !countHighway && (roomType == ROOM_CROSSROAD || roomType == ROOM_HIGHWAY)) {
            count = false;
          }
          if (count) {
            //add the room to the list
            roomList.push(roomName);
            //scan the room
            scanning(roomName, maxDistance, currentDistance, startingRoom, countSK, countHighway);
          }
        });
      }
    }//end of scanning

    scanning(roomName, maxDistance, currentDistance, startingRoom, countSK, countHighway);
    return roomList;
};//end of room mapper

//get room type based on name
function getRoomType(roomName) {
    const [EW, NS] = roomName.match(/\d+/g)
    if (EW%10 == 0 && NS%10 == 0) {
      return ROOM_CROSSROAD
    }
      else if (EW%10 == 0 || NS%10 == 0) {
      return ROOM_HIGHWAY
    }
    else if (EW%5 == 0 && NS%5 == 0) {
      return ROOM_CENTER
    }
    else if (Math.abs(5 - EW%10) <= 1 && Math.abs(5 - NS%10) <= 1) {
      return ROOM_SOURCE_KEEPER
    }
    else {
      return ROOM_STANDARD
    }
};//end of getRoomType