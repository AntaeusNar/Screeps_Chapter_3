//Returns the number of accessable squares
Object.defineProperty(Source.prototype, 'accessableSquares', {
    get: function () {
      if (!this._accessableSquares) {
        let squares = this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y-1,this.pos.x-1,this.pos.y+1,this.pos.x+1,true);
        squares = _.filter(squares, s => s.terrain != 'wall');
        this._accessableSquares = squares.length;
      }
  
      return this._accessableSquares;
    }
  }); //end of accessableSquares