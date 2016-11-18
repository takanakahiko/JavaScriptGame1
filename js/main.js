//テスト
var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];  // キャンバス
var ctx = canvas.getContext( '2d' ); // コンテクスト
var W = 300, H = 600;  // キャンバスのサイズ
var COLS = 10, ROWS = 20;  // 盤面のマスの数
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;  // マスの幅を設定

// x, yの部分へマスを描画する処理
function drawBlock( pos ) {
  var x = pos.x;
  var y = pos.y;
  ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
  ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

var chara;
var enemy;
var bord;

function init(){
  chara = new Character(new Position(0,0),5.0);
  enemy = new Character(new Position(9,19),4.8);
  bord = new Bord();

  chara.color = "green";
  enemy.color = "black";

  chara.moveFinish = function(){
    console.log(""+chara.pos.x+","+chara.pos.y)
    bord.removeItem(new Position(chara.pos.x,chara.pos.y));
  };
  enemy.moveFinish = function(){
    bord.setCost(new Cell(new Position(enemy.pos.x,enemy.pos.y)));
  };
  chara.moveFinish();
}

function tick(){
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする

  if(input_key_buffer[keys["left"]] ) enemy.moveStart("left",bord);
  if(input_key_buffer[keys["right"]]) enemy.moveStart("right",bord);
  if(input_key_buffer[keys["up"]]) enemy.moveStart("up",bord);
  if(input_key_buffer[keys["down"]]) enemy.moveStart("down",bord);

  var min = bord.cells[chara.pos.y][chara.pos.x].costSum;
  var f = false;
  for (var key in direction) {
    if (!direction.hasOwnProperty(key)) continue;
    var vec = direction[key];
    var pos2 = chara.pos.add(vec);
    if(!bord.isMovable(pos2)) continue;
    var x = pos2.x;
    var y = pos2.y;
    if ( min != bord.cells[y][x].costSum) f = true;
    min = Math.min(bord.cells[y][x].costSum,min);
  }

  for (var key in direction) {
    if(bord.cells[chara.pos.y][chara.pos.x].costSum==min) break;
    if(!f) break;
    if (!direction.hasOwnProperty(key)) continue;
    var vec = direction[key];
    var pos2 = chara.pos.add(vec);
    if(!bord.isMovable(pos2)) continue;
    var x = pos2.x;
    var y = pos2.y;
    if(bord.cells[y][x].costSum==min ) chara.moveStart(key,bord);
  }

  bord.update();
  chara.update();
  enemy.update();
  //bord.update();

  bord.draw();
  chara.draw();
  enemy.draw();
}


// キーボードが押された時に呼び出される関数
function keyPress( key ) {
}

function addItem(){
  var x = Math.floor(Math.random() * COLS);
  var y = Math.floor(Math.random() * ROWS);

  if(bord.items.length < 4) bord.addItem(x,y);
}

var interval;  // ゲームタイマー保持用変数
function newGame() {
  clearInterval(interval);  // ゲームタイマーをクリア
  init();  // 盤面をまっさらにする
  //newShape();  // 新しい
  //lose = false;
  bord.update();
  interval = setInterval( tick, 30 );  // 250ミリ秒ごとにtickという関数を呼び出す
  setInterval(addItem,1000);
}

newGame();  // ゲームを開始する
