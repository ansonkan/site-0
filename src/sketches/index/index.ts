export function sketch() {
  const init = () => {
    console.log('init...')
  }

  const render = () => {
    console.log('render...')
  }

  const animate = () => {
    console.log('render...')
  }

  const pause = () => {
    console.log('pause...')
  }

  return { init, render, animate, pause }
}
