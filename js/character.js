var Character = function(pos){
  this.pos = pos;

  this.draw = function(){
    ctx.fillStyle = "black";
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
      var moveX = direction[this.moveDirection].x / 5.0;
      var moveY = direction[this.moveDirection].y / 5.0;
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
