import { ref } from 'vue'

export function useCamera() {
  const stream = ref<MediaStream | null>(null)
  const isActive = ref(false)

  async function startCamera() {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })
      stream.value = mediaStream
      isActive.value = true
    } catch (err) {
      console.error('Ошибка доступа к камере:', err)
      throw err
    }
  }

  function stopCamera() {
    stream.value?.getTracks().forEach((track) => track.stop())
    stream.value = null
    isActive.value = false
  }

  return {
    stream,
    isActive,
    startCamera,
    stopCamera,
  }
}
