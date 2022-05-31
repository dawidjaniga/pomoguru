import { BrowserApplication } from '@pomoguru/browser-application'

export const app = new BrowserApplication()

import './app.element.scss'
import 'aframe'
import { ANode } from 'aframe'
import 'aframe-environment-component'
import './mirror-component'
class AframeApp {
  private sceneEl: ANode

  constructor () {
    this.createScene()
    this.createEnvironment()
    this.createStartButton()
    this.createPauseButton()
    this.createTimer()
    this.createAvatar()
    this.createFloor()

    console.log('A-Frame Application initialized')
  }

  createScene () {
    this.sceneEl = document.createElement('a-scene')
    this.sceneEl.setAttribute('cursor', 'rayOrigin: mouse')
    document.body.appendChild(this.sceneEl)
  }

  createStartButton () {
    const startPomodoroEl = document.createElement('a-box')
    startPomodoroEl.setAttribute('color', 'green')
    startPomodoroEl.setAttribute('scale', '2 2 2')
    startPomodoroEl.setAttribute('position', '-4 1 -10')

    // startPomodoroEl.setAttribute(
    //   'animation',
    //   'property: position; from: -4 -1 -10; to: -4 1 -10; dur: 2000; easing: easeInCirc'
    // )

    startPomodoroEl.addEventListener('click', function () {
      app.startPomodoro()
    })
    this.sceneEl.appendChild(startPomodoroEl)
  }

  createPauseButton () {
    const element = document.createElement('a-box')
    element.setAttribute('color', 'yellow')
    element.setAttribute('position', '-4 1 -13')
    element.setAttribute('scale', '2 2 2')
    // element.setAttribute(
    //   'animation',
    //   'property: position; from: -4 -1 -10; to: -4 1 -13; dur: 2500; easing: easeInCirc'
    // )

    element.addEventListener('click', function () {
      app.pausePomodoro()
    })
    this.sceneEl.appendChild(element)
  }

  async createTimer () {
    const timerEl = document.createElement('a-box')
    timerEl.setAttribute('color', 'red')
    timerEl.setAttribute('position', '0 1 -20')
    timerEl.setAttribute('scale', '2 0 2')
    // timerEl.setAttribute(
    //   'animation',
    //   'property: position; from: 0 -1 -20; to: 0 1 -20; dur: 1000; delay: 500; easing: easeInCirc'
    // )
    this.sceneEl.appendChild(timerEl)
    const maxTimerWidth = 20

    const timeLeftEl = document.createElement('a-text')

    timeLeftEl.setAttribute('scale', '11.61044 13.14882 11.61044')
    timeLeftEl.setAttribute('position', '-1.53731 4.9242 -24.16562')
    // timeLeftEl.setAttribute(
    //   'animation',
    //   'property: position; from: -1.53731 -4.9242 -24.16562; to: -1.53731 4.9242 -24.16562; dur: 2400; delay: 200; easing: easeInCirc'
    // )
    this.sceneEl.appendChild(timeLeftEl)

    app.subscribeToGetTimers(timers => {
      const { timeLeft, progress } = timers

      timeLeftEl.setAttribute('value', timeLeft)

      const timerWidth = maxTimerWidth * progress
      timerEl.object3D.scale.x = timerWidth
    })
  }

  createAvatar () {
    const element = document.createElement('a-image')
    element.setAttribute('position', '0 1 -10')
    this.sceneEl.appendChild(element)

    app.subscribeToGetUser(user => {
      if (user.authenticated) {
        // @ts-ignore
        const { avatarUrl } = user
        element.setAttribute('src', avatarUrl)
      }
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
