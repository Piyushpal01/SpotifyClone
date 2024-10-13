const greeting = document.querySelector(".greeting");
let songs = document.querySelectorAll(".playSong");

const hour = new Date().getHours();
const welcomeTypes = ["Good morning", "Good afternoon", "Good evening"];
let welcomeText = "";

songDict = {
  "Tu Hai Kahan": [
    "Tu Hai Kahan",
    "Aur",
    "Images/tu_hai_kahan.jpg",
    "Music/Tu_Hai_Kahan.mp3",
  ],
  Baller: ["Baller", "Shubh", "Images/baller.jpg", "Music/Baller.mp3"],
  "8 Asle": [
    "8 Asle",
    "Sukha, Chani Nattan, Prodgk, Gurlez Akhtar",
    "Images/8_asle.jpg",
    "Music/8_Asle.mp3",
  ],
  "Wo Noor": [
    "Wo Noor",
    "AP Dhillon",
    "Images/wo_noor.jpg",
    "Music/Wo_Noor.mp3",
  ],
  "With You": [
    "With You",
    "AP Dhillon",
    "Images/With_You.jpg",
    "Music/With_You.mp3",
  ],
  "Dil Nu": ["Dil Nu", "AP Dhillon", "Images/wo_noor.jpg", "Music/Dil_Nu.mp3"],
  Comethru: [
    "Comethru",
    "Jeremy Zucker",
    "Images/comethru.jpg",
    "Music/Comethru.mp3",
  ],
  "Heartbreak Anniversary": [
    "Heartbreak Anniversary",
    "Giveon",
    "Images/heartbreak_anniversary.jpg",
    "Music/Heartbreak_Anniversary.mp3",
  ],
  "Way Down We Go": [
    "Way Down We Go",
    "KALEO",
    "Images/way_down_we_go.jpg",
    "Music/Way_Down_We _Go.mp3",
  ],
  "I Wanna Be Yours": [
    "I Wanna Be Yours",
    "Arctic Monkeys",
    "Images/i_wanna_be_yours.jpg",
    "Music/I_Wanna_Be_Yours.mp3",
  ],
};

let audioTimeline = 0;
let songStatus = false;
let audio = new Audio("Music/Tu_Hai_Kahan.mp3");
let lastStopTime = audio.currentTime; // Store current time when paused
const songlist = getAllSongs();

if (hour < 12) welcomeText = welcomeTypes[0];
else if (hour < 18) welcomeText = welcomeTypes[1];
else welcomeText = welcomeTypes[2];
greeting.innerHTML = welcomeText;

document.getElementById("next").addEventListener("click", nextSong);
document.getElementById("prev").addEventListener("click", prevSong);
// seek-time update
audio.addEventListener("timeupdate", (e) => {
  let currentTime = (e.target.currentTime / e.target.duration) * 100;
  range = document.querySelector("#range");
  range.value = currentTime;
  document.getElementById("initialTime").innerText = secToMin(
    e.target.currentTime
  );
});
document.querySelector("#range").addEventListener("input", seekTo);

audio.onloadedmetadata = function () {
  document.getElementById("finalTime").innerText = secToMin(audio.duration);
};

function setSong(labelName) {
  songTitle = document.querySelector(".song-title");
  songTitle.innerHTML = songDict[labelName][0];
  singerName = document.querySelector(".singer-name");
  singerName.innerHTML = songDict[labelName][1];
  image = document.querySelector(".playImg");
  image.src = songDict[labelName][2];
}

songs.forEach(function (song) {
  song.addEventListener("click", (e) => {
    let labelName = e.target.getAttribute("data-id");
    setSong(labelName);
    document.getElementById("finalTime").innerText = secToMin(audio.duration);
    playSong(e);
  });
});

function playSong(e) {
  let lastStopTime = 0; // New variable to track the last stop time
  songTitle = document.querySelector(".song-title").innerHTML;
  audio.src = songDict[songTitle][3];
  let songTarget;
  if (e.target) {
    songTarget = e.target;
  } else {
    songTarget = e;
  }
  document.getElementById("playBtn").src = "svg's/pause.svg";
  if (songStatus) {
    audio.pause(); // If playing, we need to pause first, then set currentTime
    songStatus = false; // Update status to paused
  } else {
    audio.currentTime = lastStopTime;
    audio.play();
    songStatus = true; // Update status to playing
  }

  audio.onloadedmetadata = function () {
    audioTimeline =
      (document.querySelector("#range").value / 100) * audio.duration;
    audio.currentTime = audioTimeline;
  };
}

function pauseBtn(e) {
  audio.pause();
  document.getElementById("playBtn").src = "svg's/play_song.svg";
  lastStopTime = audio.currentTime; // Track the time when paused
  songStatus = false; // Update status to paused
}

function playSong(e) {
  songTitle = document.querySelector(".song-title").innerHTML;

  // If the song has changed, update the source
  if (audio.src !== songDict[songTitle][3]) {
    audio.src = songDict[songTitle][3];
    audio.load(); // Load the new song
  }

  // Set the current time to the stored 'lastStopTime'
  audio.currentTime = lastStopTime;

  document.getElementById("playBtn").src = "svg's/pause.svg";

  // Play the audio
  audio.play();
  songStatus = true; // Update status to playing
}

document.querySelector("#playBtn").addEventListener("click", (e) => {
  if (songStatus) {
    pauseBtn(); // Pause if it's currently playing
  } else {
    playSong(e); // Play if it's currently paused
  }
});

function secToMin(sec) {
  let min = sec / 60;
  let secs = sec % 60;
  let minute;
  if (secs < 10) {
    secs = `0${secs.toFixed(0)}`;
  } else {
    secs = `${secs.toFixed(0)}`;
  }
  if (min < 1) {
    minute = `00:${secs}`;
  } else {
    minute = `${min.toFixed(0)}:${secs}`;
  }
  return minute;
}

// get Song
function getAllSongs() {
  let songlist = [];
  for (let key in songDict) {
    songlist.push(key);
  }
  // console.log(songlist);
  return songlist;
}

// next-song fn
function nextSong() {
  songTitle = document.querySelector(".song-title").innerHTML;
  songIndex = songlist.indexOf(songTitle);
  let nextsong = songIndex + 1;
  if (nextsong >= songlist.length) {
    nextsong = 0;
  }
  setSong(songlist[nextsong]);
  audio.currentTime = 0;
  lastStopTime = 0;
  audio.src = songDict[songlist[nextsong]][3];
  audio.addEventListener("loadeddata", () => {
    document.querySelector("#range").value = 0;
    document.getElementById("playBtn").src = "svg's/pause.svg";
    audio.play();
  });
}

// prev-song fn
function prevSong() {
  songTitle = document.querySelector(".song-title").innerHTML;
  songIndex = songlist.indexOf(songTitle);
  let prevsong = songIndex - 1;
  if (prevsong < 0) {
    prevsong = songlist.length - 1;
  }
  setSong(songlist[prevsong]);
  audio.currentTime = 0;
  lastStopTime = 0;
  audio.src = songDict[songlist[prevsong]][3];
  audio.addEventListener("loadeddata", () => {
    document.querySelector("#range").value = 0;
    document.getElementById("playBtn").src = "svg's/pause.svg";
    audio.play();
  });
}

function seekTo() {
  let seekto = audio.duration * (document.querySelector("#range").value / 100);
  audio.currentTime = seekto;
  lastStopTime = audio.currentTime;
}
