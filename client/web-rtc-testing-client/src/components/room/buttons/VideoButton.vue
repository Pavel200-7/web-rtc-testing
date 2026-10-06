<template>
    <button v-if="!isPublished" class="btn-control btn-video-off" @click="handlePublish" :disabled="isLoading">
        <span v-if="isLoading">⏳</span>
        <span v-else>📷 Включить камеру</span>
    </button>
    <button v-else class="btn-control btn-video-on" @click="handleUnpublish" :disabled="isLoading">
        <span v-if="isLoading">⏳</span>
        <span v-else>📷 Выключить камеру</span>
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

.btn-video-off {
    background: #2d2d44;
    color: #ffffff;
}

.btn-video-off:hover:not(:disabled) {
    background: #3d3d5a;
}

.btn-video-on {
    background: #6c5ce7;
    color: #ffffff;
}

.btn-video-on:hover {
    background: #5f3dc4;
}
</style>