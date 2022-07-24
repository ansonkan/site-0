export interface Sketch {
  render: () => void
  animate: () => void
  start: () => void
  pause: () => void
  destroy: () => void
}
