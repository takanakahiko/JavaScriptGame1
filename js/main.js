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
var bord;

function init(){
  chara = new Character(new Position(0,0));
  bord = new Bord();

  chara.moveFinish = function(){
    console.log(""+chara.pos.x+","+chara.pos.y)
    bord.setCost(new Cell(new Position(chara.pos.x,chara.pos.y)));
    bord.removeItem(new Position(chara.pos.x,chara.pos.y));
  };
  chara.moveFinish();
}

function tick(){
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする

  bord.update();
  var min = bord.cells[chara.pos.y][chara.pos.x].itemCost;
  for (var key in direction) {
    if (!direction.hasOwnProperty(key)) continue;
    var vec = direction[key];
    var pos2 = chara.pos.add(vec);
    if(!bord.isMovable(pos2)) continue;
    var x = pos2.x;
    var y = pos2.y;
    min = Math.min(bord.cells[y][x].itemCost,min);
  }
  /*
  if(input_key_buffer[keys["left"]] ) chara.moveStart("left",bord);
  if(input_key_buffer[keys["right"]]) chara.moveStart("right",bord);
  if(input_key_buffer[keys["up"]]) chara.moveStart("up",bord);
  if(input_key_buffer[keys["down"]]) chara.moveStart("down",bord);
  */

  for (var key in direction) {
    if(bord.cells[chara.pos.y][chara.pos.x].itemCost==min) break;
    if (!direction.hasOwnProperty(key)) continue;
    var vec = direction[key];
    var pos2 = chara.pos.add(vec);
    if(!bord.isMovable(pos2)) continue;
    var x = pos2.x;
    var y = pos2.y;
    if(bord.cells[y][x].itemCost==min ) chara.moveStart(key,bord);
  }

  chara.update();
  //bord.update();

  bord.draw();
  chara.draw();
}


// キーボードが押された時に呼び出される関数
function keyPress( key ) {
}

var interval;  // ゲームタイマー保持用変数
function newGame() {
  clearInterval(interval);  // ゲームタイマーをクリア
  init();  // 盤面をまっさらにする
  //newShape();  // 新しい
  //lose = false;
  interval = setInterval( tick, 30 );  // 250ミリ秒ごとにtickという関数を呼び出す
}

newGame();  // ゲームを開始する
