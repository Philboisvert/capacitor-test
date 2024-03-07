<script lang="ts">
  import ClickOutside from '$lib/ClickOutside.svelte';
  import ChevronDown from '$lib/svg/heroicons/chevron-down.svelte';
  import XMark from '$lib/svg/heroicons/x-mark.svelte';
  import {
    Pause,
    Play,
    SeekBackward,
    SeekForward,
    SpeakerOff,
    SpeakerOn
  } from '$lib/svg/index';
  import { MediaSession } from '@jofr/capacitor-media-session';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  interface MediaSessionMetadata {
    title: string;
    artwork: string;
    url: string;
  }

  export { className as class };
  let mediaMetadata: MediaSessionMetadata | undefined;

  const defaultSkipTime = 10;
  let className = '';
  let timelineProgress = 0;
  let playbackStopped = true;
  let isMobilePlayerOpen = false;
  let audioElement: HTMLAudioElement | undefined;
  let OS = 'unknown';
  let duration: number;
  let currentTime: number;
  let playbackRate: number;
  let isPaused: boolean | undefined = true;
  let volume: number;
  let seeking: boolean;
  let hasEnded: boolean;
  let isMuted: boolean;

  onMount(() => {
    const userAgent = navigator.userAgent;
    OS = /android/i.test(userAgent)
      ? 'android'
      : /iPad|iPhone|iPod/.test(userAgent)
        ? 'ios'
        : 'web';
  });

  // Android initialization of handlers for controls
  if (audioElement && OS === 'android') {
    void MediaSession.setActionHandler({ action: 'play' }, handlePlay);
    void MediaSession.setActionHandler({ action: 'pause' }, handlePause);
    void MediaSession.setActionHandler({ action: 'stop' }, handlePause);

    void MediaSession.setActionHandler(
      { action: 'seekto' },
      // @ts-expect-error - ActionDetails of ActionHandlers are not accessible in the MediaSession API
      (details: { seekTime: number }) => {
        currentTime = details.seekTime;
      }
    );

    void MediaSession.setActionHandler(
      { action: 'seekforward' },
      // @ts-expect-error - ActionDetails of ActionHandlers are not accessible in the MediaSession API
      (details: { seekOffset?: number }) => {
        const seekOffset = details.seekOffset ?? 30;
        currentTime = currentTime + seekOffset;
      }
    );

    void MediaSession.setActionHandler(
      { action: 'seekbackward' },
      // @ts-expect-error - ActionDetails of ActionHandlers are not accessible in the MediaSession API
      (details: { seekOffset?: number }) => {
        const seekOffset = details.seekOffset ?? 30;
        currentTime = currentTime - seekOffset;
      }
    );
  }

  // IOS & Web initialization of handlers for controls
  if (audioElement && 'mediaSession' in navigator && OS !== 'android') {
    navigator.mediaSession.setActionHandler('play', handlePlay);
    navigator.mediaSession.setActionHandler('pause', handlePause);
    navigator.mediaSession.setActionHandler('stop', handlePause);

    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset ?? defaultSkipTime;
      currentTime = Math.max(currentTime - skipTime, 0);
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset ?? defaultSkipTime;
      currentTime = Math.min(currentTime + skipTime, duration);
    });
  }

  //Android: Update if the player is playing or paused
  function updatePlayBackState() {
    const playbackState = playbackStopped
      ? 'none'
      : isPaused
        ? 'paused'
        : 'playing';
    void MediaSession.setPlaybackState({
      playbackState
    });
  }

  function handlePlay() {
    if (!audioElement) return;
    audioElement
      .play()
      .then(() => {
        updateMetadata();
        if (OS === 'ios') navigator.mediaSession.playbackState = 'playing';
        isPaused = false;
      })
      .catch((error) => console.error(error));
  }

  function updateMetadata() {
    if (!mediaMetadata) return;
    const metaData = {
      title: mediaMetadata.title,
      artwork: [
        { src: mediaMetadata.artwork, sizes: '128x128', type: 'image/png' }
      ]
    };

    if (OS === 'android') {
      playbackStopped = false;
      updatePlayBackState();
      void MediaSession.setMetadata(metaData);
    } else {
      navigator.mediaSession.metadata = new MediaMetadata(metaData);
    }
  }

  function handlePause() {
    if (!audioElement) return;
    audioElement.pause();
    isPaused = true;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'paused';
    } else {
      updatePlayBackState();
    }
  }

  function changeSeek(
    event:
      | (MouseEvent & { currentTarget: EventTarget & HTMLInputElement })
      | (TouchEvent & { currentTarget: EventTarget & HTMLInputElement })
  ) {
    if (!event.target) return;
    const percentagePosition = Number((event.target as HTMLInputElement).value);
    timelineProgress = percentagePosition;
    currentTime = duration * (percentagePosition / 100);
  }

  function handleMute() {
    if (!audioElement) return;
    audioElement.muted = !audioElement.muted;
  }

  function handleSeekForward() {
    currentTime = Math.min(currentTime + 30, duration);
    timelineProgress = (100 * currentTime) / duration;
  }

  function handleSeekBackward() {
    currentTime = Math.max(currentTime - 30, duration);
    timelineProgress = (100 * currentTime) / duration;
  }

  function toggleBiggerMediaModal() {
    isMobilePlayerOpen = !isMobilePlayerOpen;
  }

  function closeMedia() {
    mediaMetadata = undefined;
  }

  function formatTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  //Updates the position state on every action
  $: if (seeking && audioElement) {
    duration;
    currentTime;
    playbackRate;
    updatePlayBackState();
    //Android
    void MediaSession.setPositionState({
      position: currentTime,
      duration,
      playbackRate
    });
    //IOS & Web
    if ('setPositionState' in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate,
        position: currentTime
      });
    }
  }

  $: if (hasEnded) {
    currentTime = 0;
    timelineProgress = 0;

    void MediaSession.setPositionState({
      position: currentTime,
      duration,
      playbackRate
    });

    if ('setPositionState' in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate,
        position: currentTime
      });
    }
  }

  $: formatedCurrentTime = currentTime ? `${formatTime(currentTime)}` : `00:00`;
  $: formatedDuration = duration
    ? `${formatTime(duration - currentTime)}`
    : `00:00`;
  $: if (!seeking) {
    timelineProgress = (100 * currentTime) / duration;
  }
</script>

{#if mediaMetadata}
  <audio
    controlslist="nodownload"
    src={mediaMetadata.url}
    on:play={handlePlay}
    on:pause={handlePause}
    bind:this={audioElement}
    bind:duration
    bind:currentTime
    bind:playbackRate
    bind:paused={isPaused}
    bind:volume
    bind:seeking
    bind:ended={hasEnded}
    bind:muted={isMuted}
  />
  <!-- Mobile/Tablet -->
  {#if isMobilePlayerOpen}
    <div
      class="sticky bottom-0 z-20 h-fit w-full bg-surface p-4 text-on-surface sm:hidden"
      transition:fly={{ y: '100%', duration: 300 }}
    >
      <ClickOutside on:clickoutside={toggleBiggerMediaModal}>
        <div class="flex justify-between">
          <button on:click={toggleBiggerMediaModal}>
            <ChevronDown class="mx-auto h-8 w-8" />
          </button>
          {#if isPaused}
            <button on:click={closeMedia}>
              <XMark class="mx-auto h-8 w-8" />
            </button>
          {/if}
        </div>
        <div class="flex h-full flex-col gap-10 rounded-md pb-4">
          <div class="mx-auto">
            <img
              src={mediaMetadata.artwork}
              alt={mediaMetadata.title}
              class="w-36 rounded-lg object-cover"
            />
          </div>
          <div>
            <p>
              {mediaMetadata.title}
            </p>

            <div class="flex w-full flex-col gap-3">
              <div class="grid grid-flow-col grid-cols-12">
                {#if formatedCurrentTime}
                  <div class="col-span-2 mr-auto">
                    {formatedCurrentTime}
                  </div>
                {/if}
                <input
                  type="range"
                  min="0"
                  max="100"
                  bind:value={timelineProgress}
                  on:touchstart={() => (seeking = true)}
                  on:touchend={(event) => {
                    seeking = false;
                    changeSeek(event);
                  }}
                  on:mousedown={() => (seeking = true)}
                  on:mouseup={(event) => {
                    seeking = false;
                    changeSeek(event);
                  }}
                  class="col-span-8"
                />
                {#if formatedDuration}
                  <div class="col-span-2 ml-auto">
                    {formatedDuration}
                  </div>
                {/if}
              </div>
              <div class="flex w-full">
                <div class="w-1/4" />
                <div class="flex w-1/2">
                  <button class="mx-auto" on:click={handleSeekBackward}>
                    <SeekBackward class="h-8 w-8" />
                  </button>
                  {#if isPaused}
                    <button on:click={handlePlay}>
                      <Play class="mx-auto h-8 w-8" />
                    </button>
                  {:else}
                    <button on:click={handlePause}>
                      <Pause class="mx-auto h-8 w-8" />
                    </button>
                  {/if}
                  <button class="mx-auto" on:click={handleSeekForward}>
                    <SeekForward class="h-8 w-8" />
                  </button>
                </div>
                <div class="flex w-1/4 justify-end">
                  {#if isMuted || volume == 0}
                    <button on:click={handleMute}>
                      <SpeakerOff class="h-8 w-8" />
                    </button>
                  {:else}
                    <button on:click={handleMute}>
                      <SpeakerOn class="h-8 w-8" />
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClickOutside>
    </div>
  {:else}
    <button
      on:click={toggleBiggerMediaModal}
      class="{className} sticky bottom-0 z-10 w-full sm:hidden"
    >
      <div class="mt-10 rounded-md px-2 pt-9">
        <div
          class="flex flex-col gap-2 rounded-md bg-surface p-3 text-on-surface shadow-lg"
        >
          <div class="mx-auto flex items-center gap-4">
            <img
              src={mediaMetadata.artwork}
              alt={mediaMetadata.title}
              class="w-20 rounded-lg object-cover max-sm:w-12"
            />
            <div>
              <div class="flex flex-row items-center gap-2">
                <p>
                  {mediaMetadata.title}
                </p>
                <div class="flex pl-4">
                  {#if isPaused}
                    <button on:click|stopPropagation={handlePlay} id="play">
                      <Play class="mx-auto h-8 w-8" />
                    </button>
                  {:else}
                    <button on:click|stopPropagation={handlePause} id="pause">
                      <Pause class="mx-auto h-8 w-8" />
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  {/if}

  <!-- Desktop -->
  <div
    class="bg-surface text-on-surface {className} sticky bottom-0 max-sm:hidden"
  >
    {#if isPaused}
      <button on:click={closeMedia} class="absolute right-0 top-0 p-2">
        <XMark class="mx-auto h-8 w-8" />
      </button>
    {/if}
    <div class="container flex w-full flex-row gap-4 p-4">
      <img
        src={mediaMetadata.artwork}
        alt={mediaMetadata.title}
        class="aspect-square w-24 rounded-lg object-cover"
      />
      <div class="grow">
        <div class="flex flex-row items-center gap-2 pb-2">
          <p>
            {mediaMetadata.title}
          </p>
        </div>
        <div class="flex w-full flex-col gap-4">
          <div class="grid grid-flow-col grid-cols-12">
            {#if formatedCurrentTime}
              <div class="col-span-1 mr-auto">
                {formatedCurrentTime}
              </div>
            {/if}
            <input
              type="range"
              min="0"
              max="100"
              bind:value={timelineProgress}
              on:touchstart={() => (seeking = true)}
              on:touchend={(event) => {
                seeking = false;
                changeSeek(event);
              }}
              on:mousedown={() => (seeking = true)}
              on:mouseup={(event) => {
                seeking = false;
                changeSeek(event);
              }}
              class="col-span-10"
            />
            {#if formatedDuration}
              <div class="col-span-1 ml-auto">
                {formatedDuration}
              </div>
            {/if}
          </div>
          <div class="flex w-full">
            <div class="w-1/4" />
            <div class="flex w-1/2">
              <button class="mx-auto" on:click={handleSeekBackward}>
                <SeekBackward class="h-8 w-8" />
              </button>
              {#if isPaused}
                <button on:click={handlePlay}>
                  <Play class="mx-auto h-8 w-8" />
                </button>
              {:else}
                <button on:click={handlePause}>
                  <Pause class="mx-auto h-8 w-8" />
                </button>
              {/if}
              <button class="mx-auto" on:click={handleSeekForward}>
                <SeekForward class="h-8 w-8" />
              </button>
            </div>
            <div class="flex w-1/4 justify-end">
              {#if isMuted || volume == 0}
                <button on:click={handleMute}>
                  <SpeakerOff class="h-8 w-8" />
                </button>
              {:else}
                <button on:click={handleMute}>
                  <SpeakerOn class="h-8 w-8" />
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
