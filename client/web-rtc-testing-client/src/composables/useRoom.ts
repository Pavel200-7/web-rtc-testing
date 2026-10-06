import {
    Participant,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent,
    Track,
    VideoPresets,
    createLocalAudioTrack,
    createLocalVideoTrack,
    LocalTrack,
    TrackPublication,
} from 'livekit-client';

import { ref, type Ref } from 'vue';
import { ParticipantsInfo } from '@/types/room/ParticipantsInfo';

const url: string = import.meta.env.VITE_API_SFU_URL;

interface UseRoomReturn {
    localParticipantIdentity: Ref<string | null>
    participantsInfo: ParticipantsInfo;
    isConnected: Ref<boolean>;
    roomInstance: Ref<Room | null>;
    connect: (token: string) => Promise<Room>;
    disconnect: () => void;
    publishAudio: () => Promise<void>;
    unpublishAudio: () => Promise<void>;
    publishVideo: () => Promise<void>;
    unpublishVideo: () => Promise<void>;
    getLocalVideoTrack: () => Track | null,
    getLocalAudioTrack: () => Track | null,
    isLocalAudioPublished: () => boolean,
    isLocalVideoPublished: () => boolean,
}

export function useRoom(): UseRoomReturn {
    const localParticipantIdentity = ref<string | null>(null);
    const participantsInfo: ParticipantsInfo = new ParticipantsInfo();
    const roomInstance = ref<Room | null>(null);
    const isConnected: Ref<boolean> = ref<boolean>(false);

    const connect = async (token: string): Promise<Room> => {
        const room: Room = new Room({
            adaptiveStream: true,
            dynacast: true,
            videoCaptureDefaults: {
                resolution: VideoPresets.h720.resolution,
            },
        });

        roomInstance.value = room;

        room.prepareConnection(url, token);

        room
            .on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant): RemoteParticipant => {
                participantsInfo.addNewParticipant(participant.identity, false);
                return participant;
            })
            .on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant): void => {
                participantsInfo.deleteParticipant(participant.identity);
            })
            .on(RoomEvent.TrackSubscribed, (
                track: RemoteTrack,
                publication: RemoteTrackPublication,
                participant: RemoteParticipant
            ): void => {
                const existing = participantsInfo.get(participant.identity);
                if (!existing) return;
                existing.addTrack(track);
            })
            .on(RoomEvent.TrackUnsubscribed, (
                track: RemoteTrack,
                publication: RemoteTrackPublication,
                participant: RemoteParticipant
            ): void => {
                const existing = participantsInfo.get(participant.identity);
                if (!existing) return;
                existing.removeTrack(track.kind);
            })
            .on(RoomEvent.ActiveSpeakersChanged, (speakers: Participant[]): void => {
                participantsInfo.resetSpeakers();
                for (const speaker of speakers) {
                    const info = participantsInfo.get(speaker.identity);
                    if (info) {
                        info.setIsSpeaking(true);
                    }
                }
            })
            .on(RoomEvent.Disconnected, (): void => {
                isConnected.value = false;
                participantsInfo.clear();
                console.log('Отключено от комнаты');
            });

        await room.connect(url, token);

        localParticipantIdentity.value = room.localParticipant?.identity;

        if (localParticipantIdentity.value) {
            participantsInfo.addNewParticipant(localParticipantIdentity.value, true);
        }

        addExistingParticipants();

        isConnected.value = true;
        console.log('Подключено к комнате:', room.name);
        return room;
    };

    const addExistingParticipants = (): void => {
        if (!roomInstance.value) return;

        for (const [identity, participant] of roomInstance.value.remoteParticipants) {
            if (identity === localParticipantIdentity.value) {
                continue;
            }

            let videoTrack: RemoteTrack | null = null;
            let audioTrack: RemoteTrack | null = null;

            for (const [trackId, publication] of participant.videoTrackPublications) {
                if (publication.track) {
                    videoTrack = publication.track as RemoteTrack;
                    break;
                }
            }

            for (const [trackId, publication] of participant.audioTrackPublications) {
                if (publication.track) {
                    audioTrack = publication.track as RemoteTrack;
                    break;
                }
            }

            participantsInfo.addExistingParticipant(
                identity,
                videoTrack,
                audioTrack,
                false
            );
        }
    };

    const publishAudio = async (): Promise<void> => {
        if (!roomInstance.value) {
            console.error('Сначала подключитесь к комнате');
            return;
        }

        try {
            const audioTrack: LocalTrack = await createLocalAudioTrack({
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            });

            await roomInstance.value.localParticipant.publishTrack(audioTrack, {
                source: Track.Source.Microphone,
                name: 'microphone',
            });

            const local = participantsInfo.getLocal();
            if (!local) return;
            local.addTrack(audioTrack)

            console.log('🎤 Микрофон включен');
        } catch (err) {
            console.error('Ошибка публикации аудио:', err);
        }
    };

    const unpublishAudio = async (): Promise<void> => {
        if (!roomInstance.value) {
            console.warn('Нет подключения к комнате');
            return;
        }

        const micPublication: TrackPublication | undefined = roomInstance.value.localParticipant.getTrackPublication(Track.Source.Microphone);
        if (micPublication && micPublication.track) {
            try {
                const local = participantsInfo.getLocal();
                if (!local) return;
                local.removeTrack(Track.Kind.Audio)

                const track = micPublication.track as LocalTrack;
                track.detach();
                await roomInstance.value.localParticipant.unpublishTrack(track);
                if (track) {
                    track.stop();
                }
                console.log('🔇 Микрофон выключен');
            } catch (err) {
                console.error('Ошибка при выключении микрофона:', err);
            }
        } else {
            console.log('ℹ️ Микрофон уже выключен');
        }
    };

    const publishVideo = async (): Promise<void> => {
        if (!roomInstance.value) {
            console.error('Сначала подключитесь к комнате');
            return;
        }

        try {
            console.log("Все норм")
            const videoTrack: LocalTrack = await createLocalVideoTrack({
                resolution: VideoPresets.h720.resolution,
            });
            console.log("Все еще норм")


            await roomInstance.value.localParticipant.publishTrack(videoTrack, {
                source: Track.Source.Camera,
                name: 'camera',
            });
            console.log("и теперь")


            const local = participantsInfo.getLocal();
            if (!local) return;
            local.addTrack(videoTrack)

            console.log('📷 Камера включена');
        } catch (err) {
            console.error('Ошибка публикации видео:', err);
        }
    };

    const unpublishVideo = async (): Promise<void> => {
        if (!roomInstance.value) {
            console.warn('Нет подключения к комнате');
            return;
        }

        const camPublication: TrackPublication | undefined = roomInstance.value.localParticipant.getTrackPublication(Track.Source.Camera);
        if (camPublication && camPublication.track) {
            try {
                const local = participantsInfo.getLocal();
                if (!local) return;
                local.removeTrack(Track.Kind.Video)

                const track = camPublication.track as LocalTrack;
                track.detach();
                await roomInstance.value.localParticipant.unpublishTrack(track);
                if (track) {
                    track.stop();
                }
                console.log('📷 Камера выключена');
            } catch (err) {
                console.error('Ошибка при выключении камеры:', err);
            }
        } else {
            console.log('ℹ️ Камера уже выключена');
        }
    };

    const getLocalVideoTrack = (): Track | null => {
        if (!roomInstance.value) return null;
        const local = participantsInfo.getLocal();
        return local?.getVideoTrack().track ?? null;
    };

    const getLocalAudioTrack = (): Track | null => {
        if (!roomInstance.value) return null;
        const local = participantsInfo.getLocal();
        return local?.getAudioTrack().track ?? null;
    };

    const isLocalAudioPublished = (): boolean => {
        if (!roomInstance.value) return false;
        const local = participantsInfo.getLocal();
        return local?.getAudioTrack().track !== null;
    };

    const isLocalVideoPublished = (): boolean => {
        if (!roomInstance.value) return false;
        const local = participantsInfo.getLocal();
        return local?.getVideoTrack().track !== null;
    };

    const disconnect = (): void => {
        if (roomInstance.value) {
            localParticipantIdentity.value = null;
            roomInstance.value.disconnect();
            isConnected.value = false;
            participantsInfo.clear();
            console.log('🔌 Отключено от комнаты');
        }
    };

    return {
        localParticipantIdentity,
        participantsInfo,
        isConnected,
        roomInstance: roomInstance as Ref<Room | null>,
        connect,
        disconnect,
        publishAudio,
        unpublishAudio,
        publishVideo,
        unpublishVideo,
        getLocalVideoTrack,
        getLocalAudioTrack,
        isLocalAudioPublished,
        isLocalVideoPublished
    };
}