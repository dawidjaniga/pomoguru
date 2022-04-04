import './app.element.scss'
import 'aframe'
import 'aframe-environment-component'
import { controller, model, TimeLeft } from '@pomoguru/client'

class AframeApp {
  private sceneEl: HTMLElement

  constructor () {
    this.createScene()
    this.createEnvironment()
    this.createButtons()
    this.createTimer()

    console.log('A-Frame Application initialized')
  }

  createScene () {
    this.sceneEl = document.createElement('a-scene')
    this.sceneEl.setAttribute('cursor', 'rayOrigin: mouse')
    document.body.appendChild(this.sceneEl)
  }

  createButtons () {
    const startTimerEl = document.createElement('a-box')
    startTimerEl.setAttribute('color', 'green')
    startTimerEl.setAttribute('position', '-4 1 -10')
    startTimerEl.setAttribute('scale', '2 2 2')
    startTimerEl.setAttribute(
      'animation',
      'property: position; from: -4 -1 -10; to: -4 1 -10; dur: 2000; easing: easeInCirc'
    )

    startTimerEl.addEventListener('click', function () {
      console.log('start timer clicked')
      controller.startWork()
    })
    this.sceneEl.appendChild(startTimerEl)
  }

  createTimer () {
    const timerEl = document.createElement('a-box')
    timerEl.setAttribute('color', 'red')
    timerEl.setAttribute('position', '0 1 -20')
    timerEl.setAttribute('scale', '2 0 2')
    timerEl.setAttribute(
      'animation',
      'property: position; from: 0 -1 -20; to: 0 1 -20; dur: 1000; dealy: 500; easing: easeInCirc'
    )
    this.sceneEl.appendChild(timerEl)
    const maxTimerWidth = 20

    const timeLeftEl = document.createElement('a-text')
    timeLeftEl.setAttribute('value', model.get('timeLeft').formattedSeconds)
    timeLeftEl.setAttribute('scale', '11.61044 13.14882 11.61044')
    timeLeftEl.setAttribute('position', '-1.53731 4.9242 -24.16562')
    timeLeftEl.setAttribute(
      'animation',
      'property: position; from: -1.53731 -4.9242 -24.16562; to: -1.53731 4.9242 -24.16562; dur: 2400; dealy: 200; easing: easeInCirc'
    )
    this.sceneEl.appendChild(timeLeftEl)

    model.subscribe('timeLeft:changed', (timeLeft: TimeLeft) => {
      console.log('time left changed', timeLeft)
      timeLeftEl.setAttribute('value', timeLeft.formattedSeconds)

      const timerWidth = maxTimerWidth * timeLeft.percentCompleted

      console.log(timerWidth)
      //@ts-ignore
      timerEl.object3D.scale.y = timerWidth
    })
  }

  createEnvironment () {
    const environment = document.createElement('a-entity')
    environment.setAttribute('environment', 'preset: goldmine')
    this.sceneEl.appendChild(environment)
  }
}

window.addEventListener('DOMContentLoaded', () => new AframeApp())
