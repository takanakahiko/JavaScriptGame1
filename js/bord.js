var Cell = function(pos){
  this.pos = pos;
  this.cost = -1;
  this.itemCost = -1;
  this.costSum = 0;
  this.isWall = false;

  this.draw = function(){
    var r = 255 - Math.floor(this.costSum * 255);
    var g = 0;
    var b = Math.floor(this.costSum * 255);

    if(this.isWall){
      r = g = b = 255;
    }/*else{
      ctx.fillStyle = 'rgb(0,0,0)';
      drawString(this.pos,this.costSum);
    }*/

    ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
    drawBlock(this.pos);
  }
}

var Item = function(pos){
  this.pos = pos;

  this.draw = function(){
    var r = 255;
    var g = 255;
    var b = 0;

    ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
    drawBlock(this.pos);
  };
}

var Bord = function(){
  this.cells = [];
  for(i=0; i<ROWS; i++){
    this.cells[i] = [];
    for(j=0; j<COLS; j++){
      this.cells[i][j] = new Cell(new Position(j,i));
    }
  }

  this.cells[1][1].isWall = true;
  this.cells[1][2].isWall = true;
  this.cells[1][3].isWall = true;
  this.cells[1][6].isWall = true;
  this.cells[1][7].isWall = true;
  this.cells[1][8].isWall = true;

  for(var i = 2; i <= 7; i++){
    this.cells[i][1].isWall = true;
    this.cells[i][8].isWall = true;
  }

  for(var i = 3; i <= 6; i++){
    this.cells[i][3].isWall = true;
    this.cells[i][4].isWall = true;
    this.cells[i][5].isWall = true;
    this.cells[i][6].isWall = true;
  }


  this.cells[8][1].isWall = true;
  this.cells[8][2].isWall = true;
  this.cells[8][3].isWall = true;
  this.cells[8][6].isWall = true;
  this.cells[8][7].isWall = true;
  this.cells[8][8].isWall = true;

  this.cells[10][1].isWall = true;
  this.cells[10][2].isWall = true;
  this.cells[10][3].isWall = true;
  this.cells[10][6].isWall = true;
  this.cells[10][7].isWall = true;
  this.cells[10][8].isWall = true;

  for(var i = 11; i <= 17; i++){
    this.cells[i][1].isWall = true;
    this.cells[i][8].isWall = true;
  }

  for(var i = 12; i <= 16; i++){
    this.cells[i][3].isWall = true;
    this.cells[i][4].isWall = true;
    this.cells[i][5].isWall = true;
    this.cells[i][6].isWall = true;
  }

  this.cells[18][1].isWall = true;
  this.cells[18][2].isWall = true;
  this.cells[18][3].isWall = true;
  this.cells[18][6].isWall = true;
  this.cells[18][7].isWall = true;
  this.cells[18][8].isWall = true;


  this.items = [];

  this.setCost = function(start){

    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        this.cells[i][j].cost = -1;
      }
    }

    var searchlist = [];
    if(start.pos.x < 0 || start.pos.y < 0) return;
    if(start.pos.x >= COLS || start.pos.y >= ROWS) return;
    var start2 = this.cells[start.pos.y][start.pos.x];
    start2.cost = 0;
    searchlist.push(start2);

    while(searchlist.length){
      var cell = searchlist.shift();

      for (var key in direction) {
        if (!direction.hasOwnProperty(key)) continue;
        var vec = direction[key];
        var pos2 = cell.pos.add(vec);
        if(pos2.x < 0 || pos2.y < 0) continue;
        if(pos2.x >= COLS || pos2.y >= ROWS) continue;

        var serchCell = this.cells[pos2.y][pos2.x];
        if(serchCell.cost!=-1) continue;
        if(serchCell.isWall) continue;

        serchCell.cost = cell.cost+1;
        searchlist.push(serchCell);
      }
    }
    this.normalization();
  }

  this.normalization = function(){
    var max = 0;
    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        max = Math.max(this.cells[i][j].cost,max);
      }
    }
    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        if(this.cells[i][j].cost==-1) this.cells[i][j].cost = max;
        this.cells[i][j].cost = this.cells[i][j].cost / (max + 0.0);
      }
    }
  }

  this.normalizationItemCost = function(){
    var max = 0;
    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        //this.cells[i][j].itemCost = Math.min(this.cells[i][j].itemCost,8);
        max = Math.max(this.cells[i][j].itemCost,max);
      }
    }
    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        if(this.cells[i][j].itemCost==-1) this.cells[i][j].itemCost = max;
        this.cells[i][j].itemCost = this.cells[i][j].itemCost / (max + 0.0);
      }
    }
  }

  this.draw = function(){
    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        this.cells[i][j].draw();
      }
    }
    for(var item in this.items){
      this.items[item].draw();
    }
  };

  this.isMovable = function(pos){
    if(pos.x < 0 || pos.y < 0) return false;
    if(pos.x >= COLS || pos.y >= ROWS) return false;
    return !this.cells[pos.y][pos.x].isWall;
  };

  this.update = function(){
    this.setItemCost();
    this.setCostSum();
  };

  this.setCostSum = function(){
    var max = 0;
    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        var sum = 0;

        var itemRatio = 0.6;
        var enemyRatio = 0.4;

        if(this.cells[i][j].cost<0.3){
          itemRatio = 0.2;
          enemyRatio = 0.8;
        }

        var sum = 0.0;
        sum += (this.cells[i][j].itemCost) * itemRatio;
        sum += ( - this.cells[i][j].cost + 1) * enemyRatio;

        this.cells[i][j].costSum = sum;
      }
    }
  }

  this.setItemCost = function(){

    var itemCosts = [];

    for(var num in this.items){

      var costs = [];
      for(i=0; i<ROWS; i++){
        costs.push([])
        for(j=0; j<COLS; j++){
          costs[i][j] = -1;
        }
      }

      var start = this.items[num];

      var searchlist = [];
      if(start.pos.x < 0 || start.pos.y < 0) return;
      if(start.pos.x >= COLS || start.pos.y >= ROWS) return;
      var start2 = start.pos;
      costs[start2.y][start2.x] = 0;
      searchlist.push(start2);

      while(searchlist.length){
        var basePos = searchlist.shift();
        var baseCosts = costs[basePos.y][basePos.x];

        for (var key in direction) {
          if (!direction.hasOwnProperty(key)) continue;
          var vec = direction[key];
          var pos2 = basePos.add(vec);
          if(!this.inBord(pos2)) continue;

          var serchCell = this.cells[pos2.y][pos2.x];
          if(costs[pos2.y][pos2.x]!=-1) continue;
          if(serchCell.isWall) continue;

          costs[pos2.y][pos2.x] = baseCosts+1;
          searchlist.push(pos2);
        }
      }
      var max = 0;
      for(i=0; i<ROWS; i++){
        for(j=0; j<COLS; j++){
          max = Math.max(costs[i][j],max);
        }
      }
      for(i=0; i<ROWS; i++){
        for(j=0; j<COLS; j++){
          if(costs[i][j]==-1) costs[i][j] = max;
          costs[i][j]= costs[i][j] / (max + 0.0);
        }
      }
      itemCosts.push(costs.slice());
    }
    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        var min = 1;
        for(var k in this.items){
          min = Math.min(itemCosts[k][i][j],min);
        }
        this.cells[i][j].itemCost = min;
      }
    }
    //this.normalizationItemCost();
  }

  this.inBord = function(pos){
    return !(pos.x < 0 || pos.y < 0 || pos.x >= COLS || pos.y >= ROWS)
  };

  this.removeItem = function(pos){
    for(var num in this.items){
      if(this.items[num].pos.equals(pos)){
        this.items.splice( num, 1 ) ;
        break;
      }
    }
  }

  this.addItem = function(x,y){
    var f = true;
    for(var num in this.items){
      var itemPos = this.items[num].pos;
      if(itemPos.x == x && itemPos.y == y) f = false;
    }
    if(this.cells[y][x].isWall) f = false;
    if(f) bord.items.push(new Item(new Position(x,y)));
  }

};

// x, yの部分へマスを描画する処理
function drawBlock( pos ) {
  var x = pos.x;
  var y = pos.y;
  ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

function drawString( pos ,string ) {
  var x = pos.x;
  var y = pos.y;
  ctx.font="10px Georgia";
  ctx.fillText(string,BLOCK_W * x, BLOCK_H * y);
}
