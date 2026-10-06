<template>
    <div class="room-view">
        <div class="room-container">
            <!-- Верхняя панель управления -->
            <div class="control-bar">
                <div class="room-info">
                    <span class="room-code">🏠 Комната: {{ roomCode }}</span>
                    <span class="participant-count">👥 {{ participantsInfo.size }} участников</span>
                </div>

                <div class="control-buttons">
                    <AudioButton :is-published="isAudioPublished" :is-loading="isPublishingAudio || isUnpublishingAudio"
                        @publish="handlePublishAudio" @unpublish="handleUnpublishAudio" />
                    <VideoButton :is-published="isVideoPublished" :is-loading="isPublishingVideo || isUnpublishingVideo"
                        @publish="handlePublishVideo" @unpublish="handleUnpublishVideo" />
                    <DisconnectButton @disconnect="handleDisconnect" />
                </div>
            </div>

            <!-- Сетка участников -->
            <div class="participants-grid">
                <!-- Локальный участник -->
                <LocalParticipant v-if="localParticipantInfo" :info="localParticipantInfo" />

                <!-- Удаленные участники -->
                <RemoteParticipant v-for="[identity, info] in remoteParticipants" :key="identity" :info="info" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoom } from '@/composables/useRoom';
import { Track } from 'livekit-client';

// Компоненты
import AudioButton from '@/components/room/buttons/AudioButton.vue';
import VideoButton from '@/components/room/buttons/VideoButton.vue';
import DisconnectButton from '@/components/room/buttons/DisconnectButton.vue';
import LocalParticipant from '@/components/room/participants/LocalParticipant.vue';
import RemoteParticipant from '@/components/room/participants/RemoteParticipant.vue';

const route = useRoute();
const router = useRouter();

const {
    participantsInfo,
    connect,
    disconnect,
    publishAudio,
    unpublishAudio,
    publishVideo,
    unpublishVideo,
    roomInstance,
    isLocalAudioPublished,
    isLocalVideoPublished,
} = useRoom();

const roomCode = computed(() => route.params.roomCode as string || '');
const token = computed(() => route.query.token as string || '');

// --- СОСТОЯНИЕ ---
const isAudioPublished = ref(false);
const isVideoPublished = ref(false);
const isPublishingAudio = ref(false);
const isUnpublishingAudio = ref(false);
const isPublishingVideo = ref(false);
const isUnpublishingVideo = ref(false);

// --- РЕАКТИВНЫЕ ДАННЫЕ ИЗ ParticipantsInfo ---

const localParticipantInfo = computed(() => {
    return participantsInfo.reactive.getLocal();
});

const remoteParticipants = computed(() => {
    return participantsInfo.reactive.getRemote();
});

// --- МЕТОДЫ ---

const handlePublishAudio = async () => {
    if (isPublishingAudio.value) return;
    isPublishingAudio.value = true;
    try {
        await publishAudio();
        isAudioPublished.value = true;
    } catch (err) {
        console.error('Ошибка включения микрофона:', err);
    } finally {
        isPublishingAudio.value = false;
    }
};

const handleUnpublishAudio = async () => {
    if (isUnpublishingAudio.value) return;
    isUnpublishingAudio.value = true;
    try {
        await unpublishAudio();
        isAudioPublished.value = false;
    } catch (err) {
        console.error('Ошибка выключения микрофона:', err);
    } finally {
        isUnpublishingAudio.value = false;
    }
};

const handlePublishVideo = async () => {
    if (isPublishingVideo.value) return;
    isPublishingVideo.value = true;
    try {
        await publishVideo();
        isVideoPublished.value = true;
    } catch (err) {
        console.error('Ошибка включения камеры:', err);
    } finally {
        isPublishingVideo.value = false;
    }
};

const handleUnpublishVideo = async () => {
    if (isUnpublishingVideo.value) return;
    isUnpublishingVideo.value = true;
    try {
        await unpublishVideo();
        isVideoPublished.value = false;
    } catch (err) {
        console.error('Ошибка выключения камеры:', err);
    } finally {
        isUnpublishingVideo.value = false;
    }
};

const handleDisconnect = () => {
    disconnect();
    router.push({ name: 'join' });
};

// --- ОТСЛЕЖИВАНИЕ ---

// Состояние публикаций через методы
watch(
    () => roomInstance.value,
    () => {
        isAudioPublished.value = isLocalAudioPublished();
        isVideoPublished.value = isLocalVideoPublished();
    },
    { immediate: true }
);

// --- LIFECYCLE ---
onMounted(async () => {
    if (token.value) {
        await connect(token.value);
        isAudioPublished.value = false;
        isVideoPublished.value = false;
    } else {
        router.push({ name: 'join' });
    }
});
</script>

<style scoped>
.room-view {
    min-height: 100vh;
    background: #0a0a0f;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.room-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 16px;
    background: #0a0a0f;
}

.control-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #1a1a2e;
    border-radius: 16px;
    margin-bottom: 16px;
    flex-shrink: 0;
}

.room-info {
    display: flex;
    gap: 24px;
    font-size: 14px;
    color: #a0a0b8;
}

.room-info .room-code {
    font-weight: 600;
    color: #ffffff;
}

.control-buttons {
    display: flex;
    gap: 12px;
}

.participants-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    align-content: start;
    overflow-y: auto;
    padding: 4px;
}

@media (max-width: 768px) {
    .control-bar {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }

    .room-info {
        justify-content: center;
    }

    .control-buttons {
        justify-content: center;
        flex-wrap: wrap;
    }

    .participants-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 480px) {
    .participants-grid {
        grid-template-columns: 1fr;
    }
}
</style>