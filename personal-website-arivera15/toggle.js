function toggle() {
  if (
    document.getElementById("curStyleSheet").getAttribute("href") ===
    "first_version.css"
  ) {
    document
      .getElementById("curStyleSheet")
      .setAttribute("href", "second_version.css");
    localStorage.setItem("style", "second_version.css");
  } else {
    document
      .getElementById("curStyleSheet")
      .setAttribute("href", "first_version.css");
    localStorage.setItem("style", "first_version.css");
  }
}

window.onload = function () {
  document
    .getElementById("curStyleSheet")
    .setAttribute("href", localStorage.getItem("style"));
};

function openResume() {
  document.getElementById("resume").classList.toggle("show");
  if (document.getElementById("closer").innerHTML === "Open Me") {
    document.getElementById("closer").innerHTML = "Close Me";
  } else {
    document.getElementById("closer").innerHTML = "Open Me";
  }
}

colors = ["#078D70", "#26CEAA", "#98E8C1", "#7BADE2", "#5049CC", "#3D1A78"];

function colorFast() {
  color = Math.floor(Math.random() * 6);
  document.getElementById("fast").style.backgroundColor = colors[color];
  document.getElementById("fast").innerHTML = "";
}

function colorSlow() {
  color = Math.floor(Math.random() * 6);
  document.getElementById("slow").style.backgroundColor = colors[color];
  document.getElementById("slow").innerHTML = "";
}

function dropclass() {
  document.getElementById("classwork").classList.toggle("showlist")
  if(document.getElementById("arrow1").classList.contains("right")){
    document.getElementById("arrow1").classList.remove("right")
    document.getElementById("arrow1").classList.add("down")
  } else {
    document.getElementById("arrow1").classList.remove("down")
    document.getElementById("arrow1").classList.add("right")
  }
}

function dropskill() {
  document.getElementById("skills").classList.toggle("showlist")
  if(document.getElementById("arrow2").classList.contains("right")){
    document.getElementById("arrow2").classList.remove("right")
    document.getElementById("arrow2").classList.add("down")
  } else {
    document.getElementById("arrow2").classList.remove("down")
    document.getElementById("arrow2").classList.add("right")
  }
}

function dropinterest() {
  document.getElementById("interest").classList.toggle("showlist")
  if(document.getElementById("arrow3").classList.contains("right")){
    document.getElementById("arrow3").classList.remove("right")
    document.getElementById("arrow3").classList.add("down")
  } else {
    document.getElementById("arrow3").classList.remove("down")
    document.getElementById("arrow3").classList.add("right")
  }
}

function portDrop1() {
  document.getElementById("c4").classList.toggle("port-show")
}

function portDrop2() {
  document.getElementById("Inter").classList.toggle("port-show")
}

function portDrop3() {
  document.getElementById("Team").classList.toggle("port-show")
}