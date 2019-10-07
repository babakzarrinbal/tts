window.onload = () => {
  "use strict";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
};

var playingta = document.getElementById("playing");
var playedta = document.getElementById("played");
var playingtext;
var toplaytext;
var rate;
var stoppedplayback = false;
var selectedvoice;
var clicked = 0;
var voices = [];
var stories = [];
var userstories = [];

var play = function() {
  if (stoppedplayback) {
    speechSynthesis.cancel();
    stoppedplayback = false;
    return;
  }
  playingta = document.getElementById("playing");
  playedta = document.getElementById("played");
  if (!playingta.value.length) return;
  var msg = new SpeechSynthesisUtterance();
  rate = document.getElementById("speakrate").value;

  let firstsentence = Math.min(
    playingta.value.indexOf("."),
    playingta.value.indexOf("\n")
  );

  while (firstsentence != -1 && firstsentence < 15) {
    firstsentence = Math.min(
      playingta.value.indexOf(".", firstsentence + 1),
      playingta.value.indexOf("\n", firstsentence + 1)
    );
  }
  if (firstsentence > 500) {
    firstsentence = playingta.value.indexOf(" ", 500);
  }
  firstsentence =
    firstsentence == -1 ? playingta.value.length : firstsentence + 1;
  msg.text = playingta.value.slice(0, firstsentence);
  if (selectedvoice) msg.voice = selectedvoice;
  msg.rate = rate;
  msg.onend = function(ev) {
    if (!stoppedplayback) {
      playedta.value =
        playingta.value.slice(0, firstsentence) + "\n\n" + playedta.value;
      playingta.value = playingta.value.slice(firstsentence);
    }
    return play();
  };
  speechSynthesis.speak(msg);
};
var loadprev = function() {
  let ev = document.getElementById("storyval").value;
  playingta.value = window.localStorage.getItem("playingta_" + ev);
  playedta.value = window.localStorage.getItem("playedta_" + ev);
};
var savecur = function(hidden) {
  let ev = document.getElementById("storyval").value;
  window.localStorage.setItem("playingta_" + ev, playingta.value);
  window.localStorage.setItem("playedta_" + ev, playedta.value);
  !hidden && alert("saved");
};
var clearall = function() {
  playingta.value = "";
  playedta.value = "";
};
var reset = function() {
  if (!confirm("sure to reset this text?")) return;
  let id = document.getElementById("storyval").value;
  playingta.value = (
    (stories.find(s => s.id == id || "") || {}).text || ""
  ).toString();
  playedta.value = "";
  window.localStorage.setItem("playingta_" + id, "");
  window.localStorage.setItem("playedta_" + id, "");
};
var savenewstory = function() {};
savedstories = function(id) {
  playingta.value = window.localStorage.getItem("playingta_" + id) || "";
  playedta.value = window.localStorage.getItem("playedta_" + id) || "";
  if (!playingta.value.length) {
    playingta.value = (
      (stories.find(s => s.id == id || "") || {}).text || ""
    ).toString();
    playedta.value = "";
    window.localStorage.setItem("playingta_" + id, playingta.value);
    window.localStorage.setItem("playedta_" + id, "");
  }
  localStorage.setItem("userstories", JSON.stringify(userstories || []));
};
userstories = JSON.parse(localStorage.getItem("userstories") || "[]");
stories = [...stories, ...userstories];

fetch("/tts/resource/stories.json")
  .then(res => res.json())
  .then(r =>
    Promise.all(
      r.map(
        (title, id) =>
          new Promise(resolve =>
            fetch("/tts/resource/stories/" + title)
              .then(res => res.text())
              .then(text =>
                resolve(stories.push({ id, type: "server", title, text }))
              )
          )
      )
    ).then(() => {
      stories.sort((a, b) => (a.id > b.id ? 1 : -1));
      let sel2 = document.getElementById("storyval");
      stories.forEach(v => {
        var opt = document.createElement("option");
        opt.appendChild(document.createTextNode(v.title));
        opt.value = v.id;
        sel2.appendChild(opt);
      });
    })
  );

window.onload = () => {
  getvoicesinterval = setInterval(function() {
    voices = speechSynthesis.getVoices();
    if (voices.length) {
      listvoices();
      clearInterval(getvoicesinterval);
    }
  }, 500);

  var listvoices = function() {
    var sel = document.getElementById("voiceselect");
    voices.forEach(function(v, i) {
      var opt = document.createElement("option");
      opt.appendChild(document.createTextNode(v.name));
      opt.value = i;
      sel.appendChild(opt);
    });
  };

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
};
