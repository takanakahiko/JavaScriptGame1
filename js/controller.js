var keys = {
  'left':37,
  'right':39,
  'down':40,
  'up':38
};

// キーボードの入力状態を記録する配列
var input_key_buffer = new Array();

// ------------------------------------------------------------
// キーボードを押したときに実行されるイベント
// ------------------------------------------------------------
document.onkeydown = function (e){
	if(!e) e = window.event; // レガシー
	input_key_buffer[e.keyCode] = true;
};

// ------------------------------------------------------------
// キーボードを離したときに実行されるイベント
// ------------------------------------------------------------
document.onkeyup = function (e){
	if(!e) e = window.event; // レガシー

	input_key_buffer[e.keyCode] = false;
};

// ------------------------------------------------------------
// ウィンドウが非アクティブになる瞬間に実行されるイベント
// ------------------------------------------------------------
window.onblur = function (){
	input_key_buffer.length = 0;
};

// ------------------------------------------------------------
// キーボードが押されているか調べる関数
// ------------------------------------------------------------
function KeyIsDown(key_code){
	if(input_key_buffer[key_code])	return true;
	return false;
}


// ---------------------------------------------------------------------------
/// マウス
function onClick(e){
  var rect = e.target.getBoundingClientRect();

  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;

  x = Math.floor(x / BLOCK_W);
  y = Math.floor(y / BLOCK_H);

  bord.addItem(x,y);
}

document.getElementsByTagName( 'canvas' )[ 0 ].addEventListener('click',onClick,false);
