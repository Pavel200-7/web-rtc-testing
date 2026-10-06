import client from '@/services/client/client'
import { type TokenResponse } from "@/types/TokenResponse"  // <-- Используем фигурные скобки

export const getConnectionToken = async (roomName: string): Promise<TokenResponse> => {
    const response = await client.get(`/api/v1/connector/token/${roomName}`)
    return response.data
}
