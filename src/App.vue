<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { Drop } from './types/drop'
  import { map, random } from './scripts/utils'
  import { useDebug } from './composables/debug'
  import { World } from './types/world'

  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight
  const MAX_DROPS = 500

  const canvas = ref<HTMLCanvasElement>()
  const ctx = ref<CanvasRenderingContext2D>()

  const debug = useDebug()
  const isRunning = ref(true)
  const slowmotionMultiplier = ref(1)
  const mousePos = reactive({
    x: 0,
    y: 0,
  })

  const world = reactive(new World())
  world.updateSpawnRangeArea(WIDTH, HEIGHT)

  const wind = ref(0)

  for (let i = 0; i < MAX_DROPS; i++) {
    const drop = new Drop()
    drop.x = random(world.spawnRangeArea.left, world.spawnRangeArea.right)
    drop.y = random(0, world.spawnRangeArea.top)
    world.drops.push(drop)
  }

  const updateWind = () => {
    wind.value = map(
      mousePos.x,
      0,
      window.innerWidth,
      -world.maxWindForce(),
      world.maxWindForce(),
      true
    )
  }

  const render = () => {
    if (!canvas.value || !ctx.value || !isRunning.value) return
    debug.frames.start()

    updateWind()

    ctx.value.save()
    ctx.value.clearRect(0, 0, WIDTH, HEIGHT)

    world.drops.forEach((drop) => {
      drop.y += drop.velocity * slowmotionMultiplier.value
      drop.x += wind.value * slowmotionMultiplier.value

      drop.draw(ctx.value as CanvasRenderingContext2D, { wind: wind.value })

      if (drop.y > HEIGHT) {
        drop.x = random(world.spawnRangeArea.left, world.spawnRangeArea.right)
        drop.y = random(0, world.spawnRangeArea.top)
        drop.regen()
      }
    })

    ctx.value.restore()
    debug.frames.end()
    window.requestAnimationFrame(render)
  }

  const updateMousePositionEvent = (e: MouseEvent) => {
    mousePos.x = e.clientX
    mousePos.y = e.clientY
  }
  const pauseEvent = (e: KeyboardEvent) => {
    if (e.code != 'KeyP') return
    isRunning.value = !isRunning.value
    if (isRunning.value) window.requestAnimationFrame(render)
  }
  const slowmotionEvent = (e: KeyboardEvent) => {
    if (e.code != 'Space') return
    slowmotionMultiplier.value = slowmotionMultiplier.value === 1 ? 0.1 : 1
  }

  onMounted(() => {
    if (canvas.value) {
      const context = canvas.value.getContext('2d')
      if (context) {
        ctx.value = context
        window.requestAnimationFrame(render)
      }
      window.addEventListener('mousemove', updateMousePositionEvent)
      window.addEventListener('keydown', pauseEvent, true)
      window.addEventListener('keydown', slowmotionEvent, true)
    }
  })

  document.addEventListener('contextmenu', (event) => event.preventDefault())
</script>

<template>
  <main>
    <canvas ref="canvas" :width="WIDTH" :height="HEIGHT"></canvas>
    <div class="ui-hotkeys ui-card">
      <p><b>mouse x:</b> wind direction</p>
      <p><b>p:</b> toggle pause</p>
      <p><b>space:</b> toggle slowmotion</p>
    </div>
    <div class="ui-debug ui-card">
      <p>FPS: {{ debug.frames.fps.toFixed(0) }}</p>
      <p>Frametime: {{ debug.frames.frameTime.toFixed(0) }} ms</p>
    </div>
  </main>
</template>

<style scoped>
  .ui-hotkeys {
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }
  .ui-debug {
    font-family: monospace;
    left: 0.5rem;
    line-height: 1;
    top: 0.5rem;
  }
  .ui-card {
    border-radius: 10px;
    border: 1px solid #404040;
    padding: 0.5rem;
    position: absolute;
  }
</style>
