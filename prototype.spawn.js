

//replace spawn to make sure that home is added
if (!Spawn.prototype._spawnCreep) {
    Spawn.prototype._spawnCreep = Spawn.prototype.spawnCreep;

    Spawn.prototype.spawnCreep = function() {
        if (arguments[3] == undefined || arguments[3].memory == undefined || arguments[3].memory.home == undefined) {
            arguments[3].memory.home = this.room.name;
        }

        return this._spawnCreep.apply(this, arguments);
    }
}