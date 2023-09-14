

//replace spawn to make sure that home is added
if (!Spawn.prototype._spawnCreep) {
    Spawn.prototype._spawnCreep = Spawn.prototype.spawnCreep;

    Spawn.prototype.spawnCreep = function(...theArgs) {
        if(theArgs.length < 3) {
           theArgs.push({memory: {home: this.room.name}});
        } else {
            if (theArgs[3].memory == undefined) {
                theArgs[3].memory = {home: this.room.name};
            } else {
                if (theArgs[3].memory.home == undefined) {
                    theArgs[3].memory.home = this.room.name;
                }
            }
        }

        return this._spawnCreep.apply(this, theArgs);
    }
}