import './app.element.scss'
import 'aframe'
import 'aframe-environment-component'
import { controller, model, TimeLeft } from '@pomoguru/client'

function init () {
  const body = document.body
  const sceneEl = document.createElement('a-scene')
  sceneEl.setAttribute('cursor', 'rayOrigin: mouse')

  const startTimerEl = document.createElement('a-box')
  startTimerEl.setAttribute('color', 'green')
  startTimerEl.setAttribute('position', '-4 1 -10')
  startTimerEl.setAttribute('scale', '2 2 2')
  startTimerEl.addEventListener('click', function () {
    console.log('start timer clicked')
    controller.startWork()
  })
  sceneEl.appendChild(startTimerEl)

  const timerEl = document.createElement('a-box')
  timerEl.setAttribute('color', 'red')
  timerEl.setAttribute('position', '0 1 -20')
  timerEl.setAttribute('scale', '2 0 2')
  sceneEl.appendChild(timerEl)
  const maxTimerWidth = 20

  const timeLeftEl = document.createElement('a-text')
  timeLeftEl.setAttribute('value', model.get('timeLeft').formattedSeconds)
  timeLeftEl.setAttribute('position', '-1.53731 4.9242 -24.16562')
  timeLeftEl.setAttribute('scale', '11.61044 13.14882 11.61044')
  sceneEl.appendChild(timeLeftEl)

  model.subscribe('timeLeft:changed', (timeLeft: TimeLeft) => {
    console.log('time left changed', timeLeft)
    timeLeftEl.setAttribute('value', timeLeft.formattedSeconds)

    const timerWidth = maxTimerWidth * timeLeft.percentCompleted

    console.log(timerWidth)
    //@ts-ignore
    timerEl.object3D.scale.y = timerWidth
  })

  const environment = document.createElement('a-entity')
  environment.setAttribute('environment', 'preset: goldmine')
  sceneEl.appendChild(environment)

  body.appendChild(sceneEl)

  console.log('Hello, A-Frame!')
}

window.addEventListener('DOMContentLoaded', init)
