<template>
    <div class="participant-tile">
        <div class="video-container">
            <!-- Видео -->
            <video v-if="info.reactive.getVideoTrack().track" ref="videoElement" autoplay muted playsinline
                class="participant-video" />
            <div v-else class="avatar-placeholder">
                <div class="avatar-initials">{{ info.reactive.getShortIdentity() }}</div>
                <div class="avatar-icon">📹</div>
            </div>

            <!-- Аудио (невидимый элемент для звука) -->
            <audio ref="audioElement" autoplay playsinline style="display: none;" />

            <!-- Индикатор аудио -->
            <div class="audio-indicator" :class="{ active: info.reactive.hasAudio() }">
                {{ info.reactive.hasAudio() ? '🎤' : '🔇' }}
            </div>

            <!-- Индикатор говорящего -->
            <div v-if="info.reactive.isSpeaking()" class="speaking-indicator">
                🔊 Говорит
            </div>

            <!-- Имя -->
            <div class="participant-name" :title="info.reactive.getIdentityString()">
                {{ info.reactive.getShortIdentity() }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { ParticipantInfo } from '@/types/room/ParticipantInfo';
import type { Track } from 'livekit-client';

const props = defineProps<{
    info: ParticipantInfo;
}>();

const videoElement = ref<HTMLVideoElement | null>(null);
const audioElement = ref<HTMLAudioElement | null>(null);

// Прикрепляем видео при появлении трека
watch(
    () => props.info.reactive.getVideoTrack().track,
    (track) => {
        nextTick(() => {
            if (track && videoElement.value) {
                track.attach(videoElement.value);
                console.log('📷 Видео прикреплено для:', props.info.reactive.getIdentityString());
            }
        });
    },
    { immediate: true }
);

// Прикрепляем аудио при появлении трека
watch(
    () => props.info.reactive.getAudioTrack().track,
    (track) => {
        nextTick(() => {
            if (track && audioElement.value) {
                track.attach(audioElement.value);
                console.log('🎤 Аудио прикреплено для:', props.info.reactive.getIdentityString());
            }
        });
    },
    { immediate: true }
);
</script>
<style scoped>
.participant-tile {
    aspect-ratio: 16 / 9;
    background: #12121f;
    border-radius: 14px;
    overflow: hidden;
    position: relative;
    border: 2px solid #1a1a2e;
    transition: border-color 0.3s ease;
}

.participant-tile:hover {
    border-color: #2a2a44;
}

.video-container {
    width: 100%;
    height: 100%;
    position: relative;
    background: #0a0a12;
}

.participant-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #0a0a12;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(145deg, #1a1a2e, #12121f);
}

.avatar-initials {
    font-size: 48px;
    font-weight: 700;
    color: #6c5ce7;
    margin-bottom: 8px;
}

.avatar-icon {
    font-size: 32px;
    opacity: 0.3;
}

.audio-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 14px;
    color: #a0a0b8;
    transition: all 0.3s ease;
}

.audio-indicator.active {
    color: #00b894;
    background: rgba(0, 184, 148, 0.2);
    box-shadow: 0 0 20px rgba(0, 184, 148, 0.1);
}

.speaking-indicator {
    position: absolute;
    top: 12px;
    left: 12px;
    background: rgba(0, 184, 148, 0.3);
    backdrop-filter: blur(4px);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    color: #00b894;
    border: 1px solid rgba(0, 184, 148, 0.3);
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }
}

.participant-name {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    color: #e0e0f0;
    max-width: calc(100% - 40px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: default;
    transition: all 0.2s ease;
}

/* Анимация при наведении для плавного раскрытия */
.participant-name:hover {
    max-width: calc(100% - 20px);
    background: rgba(0, 0, 0, 0.8);
}

/* Подсказка при наведении (title) */
.participant-name[title] {
    border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
}
</style>