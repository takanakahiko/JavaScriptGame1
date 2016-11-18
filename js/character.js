var Character = function(pos,speed){
  this.pos = pos;
  this.speed = speed;
  this.color = "black";

  this.draw = function(){
    ctx.fillStyle = this.color;
    drawBlock(this.pos.add(this.movePos));
  }

  this.moveFlag = false;
  this.movePos = new Position(0,0);
  this.moveDirection = "";

  this.moveStart = function(command,bord){
    var dir = direction[command];
    if(!bord.isMovable(this.pos.add(dir))) return;
    if(this.moveFlag) return;

    var dir = direction[command];
    this.moveDirection = command;
    this.moveFlag = true;
  }

  this.moveFinish = function(){};

  this.move = function(){
    if(this.moveFlag){
      var moveX = direction[this.moveDirection].x / speed;
      var moveY = direction[this.moveDirection].y / speed;
      var moveDifference = new Position(moveX,moveY);
      this.movePos = this.movePos.add(moveDifference);
      if(this.movePos.magnitude() >= direction[this.moveDirection].magnitude() ){
        this.pos = this.pos.add(direction[this.moveDirection]);
        this.movePos = new Position(0,0);
        this.moveFlag = false;
        this.moveFinish();
      }
    }
  }

  this.update = function(){
    this.move();
  }

}
