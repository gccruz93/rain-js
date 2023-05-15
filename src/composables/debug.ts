import { reactive } from 'vue'

export const useDebug = () => {
  const frames = reactive({
    count: 0,
    fps: 0,
    ellapsedTime: 0,
    currentFrameTime: 0,
    frameTime: 0,
    calcFrameTime: false,
    start: () => {
      frames.currentFrameTime = performance.now()
      const dt = frames.currentFrameTime - frames.ellapsedTime
      if (dt > 500) {
        frames.fps = (frames.count * 1000) / dt
        frames.count = 0
        frames.ellapsedTime = frames.currentFrameTime
        frames.calcFrameTime = true
      }
      frames.count++
    },
    end: () => {
      if (frames.calcFrameTime) {
        frames.frameTime = performance.now() - frames.currentFrameTime
        frames.calcFrameTime = false
      }
    },
  })

  return {
    frames,
  }
}
