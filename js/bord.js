var Cell = function(pos){
  this.pos = pos;
  this.cost = -1;
  this.itemCost = -1;
  this.isWall = false;

  this.draw = function(){
    var r = 255 - Math.floor(this.itemCost * 255);
    var g = 0;
    var b = Math.floor(this.itemCost * 255);

    if(this.isWall){
      r = g = b = 255;
    }

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

  this.cells[2][2].isWall = true;
  this.cells[2][3].isWall = true;
  this.cells[2][4].isWall = true;
  this.cells[2][5].isWall = true;
  this.cells[2][6].isWall = true;
  this.cells[2][7].isWall = true;
  this.cells[2][8].isWall = true;
  this.cells[2][9].isWall = true;
  this.cells[3][2].isWall = true;
  this.cells[3][3].isWall = true;
  this.cells[3][4].isWall = true;
  this.cells[3][5].isWall = true;
  this.cells[4][2].isWall = true;
  this.cells[4][3].isWall = true;
  this.cells[5][2].isWall = true;
  this.cells[5][3].isWall = true;
  this.cells[6][2].isWall = true;
  this.cells[6][3].isWall = true;
  this.cells[7][2].isWall = true;
  this.cells[7][3].isWall = true;

  this.items = [];
  this.items[0] = new Item(new Position(5,5));
  this.items[1] = new Item(new Position(7,18));

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
  };

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
      itemCosts.push(costs.slice());
    }
    for(i=0; i<ROWS; i++){
      for(j=0; j<COLS; j++){
        var min = ROWS*COLS;
        for(var k in this.items){
          min = Math.min(itemCosts[k][i][j],min);
        }
        this.cells[i][j].itemCost = min;
      }
    }
    this.normalizationItemCost();
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

};

// x, yの部分へマスを描画する処理
function drawBlock( pos ) {
  var x = pos.x;
  var y = pos.y;
  ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}
