
function celebrate() {
  //Person
  var person = document.getElementById('winner');
  //Legs
  var leg_1 = document.getElementById("leg-1");
  var leg_2 = document.getElementById("leg-2");
  //Hands
  var hand_1 = document.getElementById("hand-1");
  var hand_2 = document.getElementById("hand-2");

  //Medal
  var medal = document.getElementById("medal-1");

  //Setting animation for legs
  leg_1.setAttribute("style", "animation-name : anim-leg-1;  animation-fill-mode: forwards");
  leg_2.setAttribute("style", "animation-name : anim-leg-2; animation-fill-mode: forwards");

  //Setting animation for hands
  hand_1.setAttribute("style", "animation-name : anim-hand-1;  animation-fill-mode: forwards");
  hand_2.setAttribute("style", "animation-name : anim-hand-2;  animation-fill-mode: forwards");


  console.log("Mouse Over");
}

function normal() {
  //Legs
  var leg_1 = document.getElementById("leg-1");
  var leg_2 = document.getElementById("leg-2");

  //Hands
  var hand_1 = document.getElementById("hand-1");
  var hand_2 = document.getElementById("hand-2");

  //Setting animation for legs
  leg_1.setAttribute("style", "animation-name : anim-out-leg-1;");
  leg_2.setAttribute("style", "animation-name : anim-out-leg-2;");

  //Setting animation for hands
  hand_1.setAttribute("style", "animation-name: anim-out-hand-1; ");
  hand_2.setAttribute("style", "animation-name: anim-out-hand-2; ");
  console.log("Mouse Out");
}

function runner_1_celebrate() {
  var runner_main = document.getElementById("runner-1-main");
  runner_main.setAttribute("style", "cursor: pointer; transform: translateY(-50px);");

  //Setting animation for hands
  var runner = document.getElementById('runner-1-hand');
  runner.setAttribute("style", "animation-name: anim-runner-1-celebrate; animation-fill-mode: forwards;");

  //Settings animation for legs
  var runner_leg_1 = document.getElementById("runner-1-leg-1");
  var runner_leg_2 = document.getElementById("runner-1-leg-2");
  runner_leg_1.setAttribute("style", "animation-name: anim-runner-1-leg-1; animation-fill-mode: forwards;");
  runner_leg_2.setAttribute("style", "animation-name: anim-runner-1-leg-2; animation-fill-mode: forwards;");

}

function runner_1_normal() {
  var runner_main = document.getElementById("runner-1-main");
  runner_main.setAttribute("style", "cursor: pointer; transform: translateY(0px);");

  //Setting animation for hands
  var runner = document.getElementById("runner-1-hand");
  runner.setAttribute("style", "animation-name: runner-1-normal; animation-fill-mode: forwards;");

  //Settings animation for legs
  var runner_leg_1 = document.getElementById("runner-1-leg-1");
  var runner_leg_2 = document.getElementById("runner-1-leg-2");
  runner_leg_1.setAttribute("style", "animation-name: anim-out-runner-1-leg-1;");
  runner_leg_2.setAttribute("style", "animation-name: anim-out-runner-1-leg-2;");
}

function runner_2_celebrate() {
  var runner = document.getElementById("runner-2-main");
  var runner_hand = document.getElementById("runner-2-hand-1");
  var runner_leg_1 = document.getElementById("runner-2-leg-1");
  var runner_leg_2 = document.getElementById("runner-2-leg-2");

  runner_hand.setAttribute("style", "animation-name: runner-2-hand-celebrate; animation-fill-mode: forwards;");
  runner.setAttribute("style", "cursor: pointer; transform: translateY(-50px);");
  runner_leg_1.setAttribute("style", "animation-name: runner-2-leg-1; animation-fill-mode: forwards");
  runner_leg_2.setAttribute("style", "animation-name: runner-2-leg-2; animation-fill-mode: forwards");
}

function runner_2_normal() {
  var runner = document.getElementById("runner-2-main");
  var runner_hand = document.getElementById("runner-2-hand-1");
  var runner_leg_1 = document.getElementById("runner-2-leg-1");
  var runner_leg_2 = document.getElementById("runner-2-leg-2");

  runner.setAttribute("style", "cursor: pointer; transform: translateY(0px);");
  runner_hand.setAttribute("style", "animation-name: runner-2-normal; animation-fill-mode: forwards;");
  runner_leg_1.setAttribute("style", "animation-name: runner-2-leg-1-normal; animation-fill-mode: forwards;");
  runner_leg_2.setAttribute("style", "animation-name: runner-2-leg-2-normal; animation-fill-mode: forwards;");
}
