import { Drop } from '../types/drop'

export class World {
  drops: Drop[]
  spawnRangeArea: { left: number; right: number; top: number }

  constructor() {
    this.drops = []
    this.spawnRangeArea = {
      left: 0,
      right: 0,
      top: 0,
    }
  }

  maxWindForce() {
    return 6
  }

  updateSpawnRangeArea(width: number, height: number) {
    this.spawnRangeArea.left = -width / 2
    this.spawnRangeArea.right = width * 1.5
    this.spawnRangeArea.top = -height * 2
  }
}
