<!-- <script lang="ts">
	import mp3 from '$lib/assets/30minutesrandomsong.mp3';
	import { MediaSession } from '@jofr/capacitor-media-session';


let audioElement: HTMLAudioElement
let playbackStopped: boolean = true
let duration: number;
let buffered: TimeRanges;
let played: TimeRanges;
let seekable: TimeRanges;
let seeking: boolean;
let ended: boolean;
let readyState: number;
let currentTime: number;
let playbackRate: number;
let paused: boolean;
let volume: number;


MediaSession.setActionHandler({ action: 'seekto' }, (details: { seekTime: number }) => {
    if (audioElement) audioElement.currentTime = details.seekTime;
});

MediaSession.setActionHandler({ action: 'seekforward' }, (details: { seekOffset?: number }) => {
    const seekOffset = details.seekOffset ?? 30;
    if (audioElement) audioElement.currentTime = audioElement.currentTime + seekOffset;
});

MediaSession.setActionHandler({ action: 'seekbackward' }, (details: { seekOffset?: number }) => {
    const seekOffset = details.seekOffset ?? 30;
    if (audioElement) audioElement.currentTime = audioElement.currentTime - seekOffset;
});

MediaSession.setActionHandler({ action: 'stop' }, () => {
    if (audioElement) audioElement.pause()
});

MediaSession.setActionHandler({ action: 'play' }, () => {
    audioElement.play();
});

MediaSession.setActionHandler({ action: 'pause' }, () => {
    audioElement.pause();
});

function handlePlay() {
  playbackStopped = false
  updatePlayBackState()

   MediaSession.setMetadata({
    title: 'Sandstorm',
    artist: 'Darude',
    album: 'Big Buck Bunny',
    artwork: [
      { src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
      { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
      { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
      { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
      { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
      { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
  ]
  });
}

// Updates if player is playing or paused
const updatePlayBackState = () => {
  const playbackState = playbackStopped ? 'none' : (audioElement.paused ? 'paused' : 'playing');
  MediaSession.setPlaybackState({
      playbackState: playbackState
  });
}

// Updates the position state on every action
$: if(played, paused, playbackRate, seeking, duration) {
  if(played){
    playbackStopped = false
  }
  updatePlayBackState()
  MediaSession.setPositionState({
        position: audioElement.currentTime,
        duration: audioElement.duration,
        playbackRate: audioElement.playbackRate
    });
}

</script>

  <div class='container pt-9 mt-10'>
   asd


  <h1>Dummy mp3</h1>
  <audio controls src={mp3} on:play={handlePlay}
  on:pause={updatePlayBackState} bind:this={audioElement} bind:duration={duration} bind:buffered={buffered} bind:played={played} bind:seekable={seekable} bind:seeking={seeking} bind:ended={ended} bind:readyState={readyState} bind:currentTime={currentTime} bind:playbackRate={playbackRate} bind:paused={paused} bind:volume={volume}/>
  </div>  -->



  <!-- Start for IOS -->


  <script lang="ts">
  let audioElement: HTMLAudioElement
  let duration: number;
  let buffered: TimeRanges;
  let played: TimeRanges;
  let seekable: TimeRanges;
  let seeking: boolean;
  let ended: boolean;
  let readyState: number;
  let currentTime: number;
  let playbackRate: number;
  let paused: boolean;
  let volume: number;
  const defaultSkipTime = 10
  let bingo : string = ''


  $: if (audioElement && 'mediaSession' in navigator) { 

    navigator.mediaSession.setActionHandler('play', () => {
    audioElement.play()
  });

  navigator.mediaSession.setActionHandler('pause', () => {
    audioElement.pause();
  });

  navigator.mediaSession.setActionHandler('previoustrack', () => { null });

  navigator.mediaSession.setActionHandler('nexttrack', () => { null });

  navigator.mediaSession.setActionHandler('stop', () => { audioElement.pause() });

  navigator.mediaSession.setActionHandler('seekbackward', (details) => {
    const skipTime = details.seekOffset || defaultSkipTime;
    audioElement.currentTime = Math.max(audioElement.currentTime - skipTime, 0);
  });

  navigator.mediaSession.setActionHandler('seekforward', (details) => {
    const skipTime = details.seekOffset || defaultSkipTime;
    audioElement.currentTime = Math.min(audioElement.currentTime + skipTime, audioElement.duration);
  });

  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    album: 'Whenever You Need Somebody',
    artwork:  [{ src: "https://dummyimage.com/128x128", sizes: "128x128", type: "image/png", }]
  }); 
}
  
$: if(audioElement && played) {
    navigator.mediaSession.playbackState = 'playing';
}

$: if(audioElement && paused) {
  navigator.mediaSession.playbackState = 'paused';
}

$: if(audioElement && (played || paused || playbackRate || seeking || duration)){
  if ('setPositionState' in navigator.mediaSession) {
    navigator.mediaSession.setPositionState({
      duration: audioElement.duration,
      playbackRate: audioElement.playbackRate,
      position: audioElement.currentTime,
    });
  } 
}

$:if(audioElement && ended){
  navigator.mediaSession.setPositionState({
      duration: audioElement.duration,
      playbackRate: audioElement.playbackRate, 
      position: 0,
    });
}
</script>

 <div class='container pt-9 mt-10'>
  {bingo}
  <div>
   asd

  </div>
  <audio controls src='https://track.podcastics.com/6957/275568.mp3' bind:this={audioElement} bind:duration={duration} bind:buffered={buffered} bind:played={played} bind:seekable={seekable} bind:seeking={seeking} bind:ended={ended} bind:readyState={readyState} bind:currentTime={currentTime} bind:playbackRate={playbackRate} bind:paused={paused} bind:volume={volume}/>
</div> 

<!-- End for IOS -->


<!-- tests -->
<!-- <script lang='ts'>
let audioElement: HTMLAudioElement
let duration: number;
let buffered: TimeRanges;
let played: TimeRanges;
let seekable: TimeRanges;
let seeking: boolean;
let ended: boolean;
let readyState: number;
let currentTime: number;
let playbackRate: number;
let paused: boolean;
let volume: number;
let index = 0;

function onPlayButtonClick() {
  playAudio();
}

function playAudio() {
  audioElement.src = playlist[index].src;
  audioElement.play()
  .then(_ => updateMetadata())
  .catch(error => console.log(error));
}

function updateMetadata() {
  let track = playlist[index];

  console.log('Playing ' + track.title + ' track...');
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: track.album,
    artwork: track.artwork
  });

  // Media is loaded, set the duration.
  updatePositionState();
}

/* Position state (supported since Chrome 81) */

function updatePositionState() {
  if ('setPositionState' in navigator.mediaSession) {
    console.log('Updating position state...');
    navigator.mediaSession.setPositionState({
      duration: audioElement.duration,
      playbackRate: audioElement.playbackRate,
      position: audioElement.currentTime
    });
  }
}

/* Previous Track & Next Track */

navigator.mediaSession.setActionHandler('previoustrack', function() {
  console.log('> User clicked "Previous Track" icon.');
  index = (index - 1 + playlist.length) % playlist.length;
  playAudio();
});

navigator.mediaSession.setActionHandler('nexttrack', function() {
  console.log('> User clicked "Next Track" icon.');
  index = (index + 1) % playlist.length;
  playAudio();
});

$: if(ended){
  index = (index - 1 + playlist.length) % playlist.length;
  playAudio();
}

/* Seek Backward & Seek Forward */

let defaultSkipTime = 10; /* Time to skip in seconds by default */

navigator.mediaSession.setActionHandler('seekbackward', function(event) {
  console.log('> User clicked "Seek Backward" icon.');
  const skipTime = event.seekOffset || defaultSkipTime;
  audioElement.currentTime = Math.max(audioElement.currentTime - skipTime, 0);
  updatePositionState();
});

navigator.mediaSession.setActionHandler('seekforward', function(event) {
  console.log('> User clicked "Seek Forward" icon.');
  const skipTime = event.seekOffset || defaultSkipTime;
  audioElement.currentTime = Math.min(audioElement.currentTime + skipTime, audioElement.duration);
  updatePositionState();
});

/* Play & Pause */

navigator.mediaSession.setActionHandler('play', async function() {
  console.log('> User clicked "Play" icon.');
  await audioElement.play();
  // Do something more than just playing audio...
});

navigator.mediaSession.setActionHandler('pause', function() {
  console.log('> User clicked "Pause" icon.');
  audioElement.pause();
  // Do something more than just pausing audio...
});

$: if(played) {
    navigator.mediaSession.playbackState = 'playing';
}

$: if(paused) {
  navigator.mediaSession.playbackState = 'paused';
}

try {
  navigator.mediaSession.setActionHandler('stop', function() {
    console.log('> User clicked "Stop" icon.');
    // TODO: Clear UI playback...
  });
} catch(error) {
  console.log('Warning! The "stop" media session action is not supported.');
}

try {
  navigator.mediaSession.setActionHandler('seekto', function(event) {
    if(!event.seekTime){
        return
    }
    if (event.fastSeek && ('fastSeek' in audioElement)) {
      audioElement.fastSeek(event.seekTime);
      return;
    }
    audioElement.currentTime = event.seekTime;
    updatePositionState();
  });
} catch(error) {
  console.log('Warning! The "seekto" media session action is not supported.');
}
</script>

 <div class='container pt-9 mt-10'>
 <audio controls src='https://track.podcastics.com/6957/275568.mp3' on:play={onPlayButtonClick}
  bind:this={audioElement} bind:duration={duration} bind:buffered={buffered} bind:played={played} bind:seekable={seekable} bind:seeking={seeking} bind:ended={ended} bind:readyState={readyState} bind:currentTime={currentTime} bind:playbackRate={playbackRate} bind:paused={paused} bind:volume={volume}/>
  </div> -->
