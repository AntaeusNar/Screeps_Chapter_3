

//Add the local area controller (LAC) as accessible through the creep
Object.defineProperty(Creep.prototype, 'LAC', {
    get: function() {
      return Game.rooms[this.memory.home].controller;
    }
});

Object.defineProperty(Creep.prototype, 'moveSpeed', {
    get: function() {
      if (!this._moveSpeed) {
        if (!this.memory.moveSpeed) {
          this.memory.moveSpeed = this.body.filter(part => part != MOVE).length/this.body.filter(part => part == MOVE).length;
        }
        this._moveSpeed = this.memory.moveSpeed;
      }
      return this._moveSpeed;
    }
  });