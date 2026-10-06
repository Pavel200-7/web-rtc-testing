// src/composables/useConnector.ts
import { ref } from 'vue';
import { getConnectionToken } from '@/services/connector';
import type { TokenResponse } from '@/types/TokenResponse';

export function useConnector() {
    // Состояния
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const token = ref<string | null>(null);

    /**
     * Получить токен для подключения к комнате
     */
    const fetchToken = async (roomName: string): Promise<string | null> => {
        isLoading.value = true;
        error.value = null;

        try {
            const response: TokenResponse = await getConnectionToken(roomName);
            token.value = response.body;
            return token.value;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Неизвестная ошибка при получении токена';
            console.error('Ошибка получения токена:', err);
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * Сбросить состояние
     */
    const reset = () => {
        token.value = null;
        error.value = null;
        isLoading.value = false;
    };

    return {
        // Состояния
        isLoading,
        error,
        token,
        // Методы
        fetchToken,
        reset,
    };
}