<template>
    <button v-if="!isPublished" class="btn-control btn-audio-off" @click="handlePublish" :disabled="isLoading">
        <span v-if="isLoading">⏳</span>
        <span v-else>🎤 Включить микрофон</span>
    </button>
    <button v-else class="btn-control btn-audio-on" @click="handleUnpublish" :disabled="isLoading">
        <span v-if="isLoading">⏳</span>
        <span v-else>🔇 Выключить микрофон</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    isPublished: boolean;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'publish'): void;
    (e: 'unpublish'): void;
}>();

const handlePublish = () => emit('publish');
const handleUnpublish = () => emit('unpublish');
</script>

<style scoped>
.btn-control {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-control:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn-audio-off {
    background: #2d2d44;
    color: #ffffff;
}

.btn-audio-off:hover:not(:disabled) {
    background: #3d3d5a;
}

.btn-audio-on {
    background: #e17055;
    color: #ffffff;
}

.btn-audio-on:hover {
    background: #d63031;
}
</style>