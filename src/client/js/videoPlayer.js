const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlay = () => {
  if (video.paused) video.play();
  else video.pause();

  playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = () => {
  if (video.muted) video.muted = false;
  else video.muted = true;

  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (Number(value) === 0) {
    video.muted = true;
    muteBtn.innerText = "Unmute";
  } else {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }

  //   if (Number(value) === 0 && !video.muted) {
  //     video.muted = true;
  //     muteBtn.innerText = "Unmute";
  //   }
  //   if (Number(value) !== 0 && video.muted) {
  //     video.muted = false;
  //     muteBtn.innerText = "Mute";
  //   }

  volumeValue = value;
  video.volume = volumeValue;
};

const handleLoadedMetaData = () => {
  totalTime.innerText = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = Math.floor(video.currentTime);
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);