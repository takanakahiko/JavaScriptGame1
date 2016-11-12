var Position = function(x, y){
    this.x = x;
    this.y = y;
    this.equals = function(position){
      return (position.x == this.x) && (position.y == this.y);
    };
    this.add = function(position){
      return new Position(this.x + position.x,this.y + position.y);
    };
    this.sub = function(position){
      return new Position(this.x - position.x,this.y - position.y);
    };
    this.magnitude = function(){
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };
};

var direction = {
  "left":   new Position(-1, 0),
  "right":  new Position( 1, 0),
  "up":     new Position( 0,-1),
  "down":   new Position( 0, 1)
};
