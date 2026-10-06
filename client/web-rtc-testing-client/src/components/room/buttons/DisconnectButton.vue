<template>
    <button class="btn-control btn-disconnect" @click="handleDisconnect">
        📞 Завершить
    </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: 'disconnect'): void;
}>();

const handleDisconnect = () => emit('disconnect');
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

.btn-disconnect {
    background: #e17055;
    color: #ffffff;
}

.btn-disconnect:hover {
    background: #d63031;
}
</style>