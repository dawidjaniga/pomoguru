import './app.element.scss'
import 'aframe'
import { ANode } from 'aframe'
import 'aframe-environment-component'
import './mirror-component'
import { controller, model, TimeLeft } from '@pomoguru/client'
class AframeApp {
  private sceneEl: ANode

  constructor () {
    this.createScene()
    this.createEnvironment()
    this.createButtons()
    this.createTimer()
    this.createFloor()

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
      'property: position; from: 0 -1 -20; to: 0 1 -20; dur: 1000; delay: 500; easing: easeInCirc'
    )
    this.sceneEl.appendChild(timerEl)
    const maxTimerWidth = 20

    const timeLeftEl = document.createElement('a-text')
    timeLeftEl.setAttribute('value', model.get('timeLeft').formattedSeconds)
    timeLeftEl.setAttribute('scale', '11.61044 13.14882 11.61044')
    timeLeftEl.setAttribute('position', '-1.53731 4.9242 -24.16562')
    timeLeftEl.setAttribute(
      'animation',
      'property: position; from: -1.53731 -4.9242 -24.16562; to: -1.53731 4.9242 -24.16562; dur: 2400; delay: 200; easing: easeInCirc'
    )
    this.sceneEl.appendChild(timeLeftEl)

    model.subscribe('timeLeft:changed', (timeLeft: TimeLeft) => {
      console.log('time left changed', timeLeft)
      timeLeftEl.setAttribute('value', timeLeft.formattedSeconds)

      const timerWidth = maxTimerWidth * timeLeft.percentCompleted
      timerEl.object3D.scale.x = timerWidth
    })
  }

  createFloor () {
    const floor = document.createElement('a-plane')
    floor.setAttribute('color', '#ffff00')
    floor.setAttribute('position', '0 0.07372 0')
    floor.setAttribute('scale', '100 100 100')
    floor.setAttribute('rotation', '-90 0 0')
    floor.setAttribute('mirror', 'true')

    this.sceneEl.appendChild(floor)
  }

  createEnvironment () {
    const environment = document.createElement('a-entity')
    environment.setAttribute('environment', 'preset: goldmine')
    this.sceneEl.appendChild(environment)
  }
}

window.addEventListener('DOMContentLoaded', () => new AframeApp())
