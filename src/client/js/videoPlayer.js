const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlay = () => {
  if (video.paused) video.play();
  else video.pause();

  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = () => {
  if (video.muted) video.muted = false;
  else video.muted = true;

  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeInput = (event) => {
  const {
    target: { value },
  } = event;

  if (Number(value) === 0) {
    video.muted = true;
    muteBtn.classlist = "fas fa-volume-mute";
  } else {
    video.muted = false;
    muteBtn.classlist = "fas fa-volume-up";
  }

  volumeValue = value;
  video.volume = volumeValue;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetaData = () => {
  const duration = Math.floor(video.duration);
  totalTime.innerText = formatTime(duration);
  timeline.max = duration;
};

const handleTimeUpdate = () => {
  const timeNow = Math.floor(video.currentTime);
  currentTime.innerText = formatTime(timeNow);
  timeline.value = timeNow;
};

const handleTimelineInput = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreenBtn = () => {
  const fullScreen = document.fullscreenElement;
  if (!fullScreen) {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  } else {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  }
};

const handleControlsHide = () => {
  controlsTimeout = setTimeout(
    () => videoControls.classList.remove("showing"),
    3000
  );
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  handleControlsHide();
};

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeInput);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineInput);
fullScreenBtn.addEventListener("click", handleFullScreenBtn);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleControlsHide);
