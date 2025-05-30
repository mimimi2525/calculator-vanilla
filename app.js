const ids = [
  "AC",
  "smash",
  "seven",
  "eight",
  "nine",
  "cross",
  "four",
  "five",
  "six",
  "minus",
  "one",
  "two",
  "three",
  "plus",
  "zero",
  "dot",
  "reset",
  "equal",
];
const el = ids.reduce(function (mii, id) {
  // reduceはただただリストに繰り返し代入してるだけ
  mii[id] = document.getElementById(id);
  return mii;
  // １つidを追加したmiiを返しているのがreturn
  // miiが必要な理由は前のループで作ったものを次のループでも使うため
}, {});
// これでいちいち電卓のボタンをgetelementbyidで取得してこなくても良い
// 最後の{}が空のオブジェクト　これにどんどん入っていく

let sound = document.getElementById("sound");
let buttons = document.querySelectorAll("button");
let output_text = document.getElementsByClassName("output_text")[0];
// この[0]が重要
// classは複数に他にも存在するかも知れないから0が必要idはいらない
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    sound.currentTime = 0;
    //   連続クリックしても音がなるようにしている
    sound.play();
  });
});
// forEachを使って各ボタンにイベントを発生させている
// buttonのような複数存在するものにはonclickだとだめ

function appendToOutput(text) {
  output_text.textContent += text;
}
// appendToOutputという関数を用意、textを受け取ってoutputに渡す

const buttonMap = {
  AC: null,
  smash: "÷",
  seven: "7",
  eight: "8",
  nine: "9",
  cross: "×",
  four: "4",
  five: "5",
  six: "6",
  minus: "-",
  one: "1",
  two: "2",
  three: "3",
  plus: "+",
  zero: "0",
  dot: ".",
  reset: "C",
  equal: "=",
};

let calcFormula = ""; // ← 計算用
let lastKey = ""; //直前のキーを記録
function isOperator(id) {
  return ["plus", "minus", "cross", "smash"].includes(id);
}
// たくさんあるidのなかでどれが演算子か判断するもの

Object.entries(buttonMap).forEach(function ([id, value]) {
  el[id].addEventListener("click", function () {
    if (id === "dot" && lastKey === "dot") {
      return;
    }
    //演算子のあとに演算子が入力されたら削除
    if (isOperator(lastKey) && isOperator(id)) {
      output_text.textContent = output_text.textContent.slice(0, -1);
      calcFormula = calcFormula.slice(0, -1);
    }
    if (id === "cross") {
      appendToOutput("×"); // 表示用
      calcFormula += "*"; // 計算用
      lastKey = "cross";
    } else if (id === "smash") {
      appendToOutput("÷");
      calcFormula += "/";
      lastKey = "smash";
    } else if (id === "equal") {
      try {
        const result = eval(calcFormula);
        output_text.textContent = result;
        calcFormula = result.toString(); // 次の計算に備える
      } catch {
        output_text.textContent = "エラー";
        calcFormula = "";
      }
      lastKey = "equal"; // ★追加：記録
    } else if (id === "AC") {
      output_text.textContent = "";
      calcFormula = "";
      lastKey = "AC";
    } else if (id === "reset") {
      output_text.textContent = output_text.textContent.slice(0, -1);
      calcFormula = calcFormula.slice(0, -1);
      lastKey = "reset";
    } else {
      appendToOutput(value);
      calcFormula += value;
      lastKey = id; // ← 追加
    }
  });
});
