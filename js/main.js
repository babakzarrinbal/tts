window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}

var playingta = document.getElementById("playing");
    var playedta = document.getElementById("played");
    var playingtext;
    var toplaytext;
    var rate;
    var stoppedplayback = false;

    var play = function(frombegining) {
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

      firstsentence =
        firstsentence == -1 ? playingta.value.length : firstsentence + 1;
      msg.text = playingta.value.slice(0, firstsentence);
      msg.rate = rate;
      msg.onend = function(ev) {
        if (!stoppedplayback) {
          playedta.value += playingta.value.slice(0, firstsentence);
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
      let ev = document.getElementById("storyval").value;
      playingta.value = (stories[ev] || "").toString();
      playedta.value = "";
      window.localStorage.setItem("playingta_" + ev, "");
      window.localStorage.setItem("playedta_" + ev, "");
    };
    savedstories = function(ev) {
      playingta.value = window.localStorage.getItem("playingta_" + ev) || "";
      playedta.value = window.localStorage.getItem("playedta_" + ev) || "";
      if (!playingta.value.length) {
        playingta.value = (stories[ev] || "").toString();
        playedta.value = "";
        window.localStorage.setItem("playingta_" + ev, playingta.value);
        window.localStorage.setItem("playedta_" + ev, "");
      }
    };
    var stories = [];
    for (let i = 0; i < 18; i++) {
      window
        .fetch("resource/stories/" + i + ".txt")
        .then(res => res.text())
        .then(r => (stories[i] = r));
    }

    window.onload = () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js");
      }
    };