<template>
    <div class="join-view">
        <div class="login-container">
            <div class="login-card">
                <h1>🎙️ Рация</h1>
                <p class="subtitle">Введите код комнаты для подключения</p>

                <div class="input-group">
                    <input v-model="roomCode" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="7"
                        placeholder="Введите 7 цифр" class="room-input"
                        :class="{ 'is-valid': isValidRoomCode, 'is-invalid': roomCode.length > 0 && !isValidRoomCode }"
                        @input="onRoomCodeInput" />
                    <div class="input-hint" v-if="roomCode.length > 0 && !isValidRoomCode">
                        Должно быть ровно 7 цифр
                    </div>
                    <div class="input-hint success" v-else-if="isValidRoomCode">
                        Подключиться
                    </div>
                </div>

                <button class="btn-connect" :disabled="!isValidRoomCode || isLoading" @click="handleConnect">
                    <span v-if="isLoading">⏳ Подключение...</span>
                    <span v-else>🔗 Подключиться</span>
                </button>

                <div v-if="error" class="error-message">
                    Ошибка {{ error }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useConnector } from '@/composables/useConnector';

const router = useRouter();
const { fetchToken, isLoading, error, reset: resetConnector } = useConnector();

const roomCode = ref('');

const isValidRoomCode = computed(() => /^\d{7}$/.test(roomCode.value));

const onRoomCodeInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
    roomCode.value = input.value;
};

const handleConnect = async () => {
    if (!isValidRoomCode.value) return;

    const token = await fetchToken(roomCode.value);
    if (token) {
        // Переходим на страницу комнаты, передавая код комнаты и токен
        router.push({
            name: 'room',
            params: { roomCode: roomCode.value },
            query: { token }
        });
    }
};

resetConnector();
</script>

<style scoped>
.join-view {
    min-height: 100vh;
    background: #0a0a0f;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

.login-card {
    background: #1a1a2e;
    border-radius: 20px;
    padding: 48px 40px;
    max-width: 420px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
    text-align: center;
}

.login-card h1 {
    font-size: 32px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #6c5ce7, #00b894);
    -webkit-text-fill-color: transparent;
}

.login-card .subtitle {
    color: #a0a0b8;
    font-size: 16px;
    margin-bottom: 32px;
}

.input-group {
    margin-bottom: 24px;
}

.room-input {
    width: 100%;
    padding: 16px 20px;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 8px;
    text-align: center;
    background: #12121f;
    border: 2px solid #2a2a44;
    border-radius: 12px;
    color: #ffffff;
    transition: all 0.3s ease;
    outline: none;
}

.room-input:focus {
    border-color: #6c5ce7;
    box-shadow: 0 0 20px rgba(108, 92, 231, 0.15);
}

.room-input.is-valid {
    border-color: #00b894;
    box-shadow: 0 0 20px rgba(0, 184, 148, 0.15);
}

.room-input.is-invalid {
    border-color: #e17055;
    box-shadow: 0 0 20px rgba(225, 112, 85, 0.15);
}

.input-hint {
    font-size: 13px;
    margin-top: 8px;
    color: #e17055;
}

.input-hint.success {
    color: #00b894;
}

.btn-connect {
    width: 100%;
    padding: 16px;
    font-size: 18px;
    font-weight: 600;
    background: linear-gradient(135deg, #6c5ce7, #00b894);
    border: none;
    border-radius: 12px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-connect:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(108, 92, 231, 0.3);
}

.btn-connect:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
}

.error-message {
    margin-top: 16px;
    color: #e17055;
    font-size: 14px;
}
</style>