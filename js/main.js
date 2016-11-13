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
    bord.setCost(new Cell(new Position(chara.pos.x,chara.pos.y)));
  };
  chara.moveFinish();
}

function tick(){
  ctx.clearRect( 0, 0, W, H );  // 一度キャンバスを真っさらにする

  if(input_key_buffer[keys["left"]] ) chara.moveStart("left",bord);
  if(input_key_buffer[keys["right"]]) chara.moveStart("right",bord);
  if(input_key_buffer[keys["up"]]) chara.moveStart("up",bord);
  if(input_key_buffer[keys["down"]]) chara.moveStart("down",bord);

  chara.update();
  bord.update();

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
