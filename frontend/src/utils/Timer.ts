import { computed, ref } from 'vue'

export class Timer {
  private intervalId: number | null = null
  public elapsedTime = ref(0)

  start() {
    this.reset()
    this.intervalId = setInterval(() => {
      this.elapsedTime.value += 1
    }, 1000)
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  reset() {
    this.elapsedTime.value = 0
  }

  get formattedElapsedTime() {
    return computed(() => {
      const minutes = Math.floor(this.elapsedTime.value / 60)
      const seconds = this.elapsedTime.value % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    })
  }
}
