import { ref } from 'vue'

export function useScreen() {
  const stream = ref<MediaStream | null>(null)
  const isActive = ref(false)

  async function startScreenShare() {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      })

      stream.value = mediaStream
      isActive.value = true

      mediaStream.getVideoTracks()[0]?.addEventListener('ended', () => {
        stopScreenShare()
      })
    } catch (err) {
      console.error('Ошибка доступа к экрану:', err)
      throw err
    }
  }

  function stopScreenShare() {
    stream.value?.getTracks().forEach((track) => track.stop())
    stream.value = null
    isActive.value = false
  }

  return {
    stream,
    isActive,
    startScreenShare,
    stopScreenShare,
  }
}
