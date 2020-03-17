const path = require('path')
const notifier = require('node-notifier');
const createSlack = require('./slack')

const { ipcRenderer } = require('electron')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

window.addEventListener('DOMContentLoaded', () => {
  const slack = createSlack()
  const timer = createTimer()
  const pomodoro = createPomodoro({
    slack,
    timer
  })
});


function createTimer() {
  const oneSecond = 1000
  const onePomodoroInSeconds = 2 * 60
  let timerHandler
  let timeLeft = onePomodoroInSeconds
  let onTimeChangeListener

  function start() {
    console.log('start')
    if (!timerHandler) {
      timerHandler = setInterval(tickInterval, oneSecond)
    }
  }

  function pause() {
    console.log('pause')
    clearTickInterval()
  }

  function stop() {
    console.log('stop')
    clearTickInterval()
    changeTime(onePomodoroInSeconds)
  }

  function tickInterval() {
    changeTime(timeLeft - 1)

    if (timeLeft === 0) {
      console.log('Pomodoro ends')
      stop()
      notifier.notify({
        title: 'PomoGuru',
        icon: path.join(__dirname, 'icon.png'),
        message: 'Great job! Now take a break :)'
      });
    }
  }

  function clearTickInterval() {
    clearInterval(timerHandler)
    timerHandler = null
  }

  function changeTime(value) {
    timeLeft = value

    if (onTimeChangeListener) {
      const progress = 1 - (timeLeft / onePomodoroInSeconds)
      onTimeChangeListener({ timeLeft, progress })
    }
  }

  function onTimeChange(listener) {
    onTimeChangeListener = listener
  }

  function getTimeLeft() {
    return timeLeft
  }

  return {
    start,
    pause,
    stop,
    onTimeChange,
    getTimeLeft,
  }
}

function createPomodoro({
  slack,
  timer
}) {
  const startButton = document.querySelector('#start')
  const pauseButton = document.querySelector('#pause')
  const stopButton = document.querySelector('#stop')
  const timeLeftElement = document.querySelector('#timeLeft')
  console.log('create Pomodoro')

  setTimeLeft(timer.getTimeLeft())
  hideElement(pauseButton)

  startButton.addEventListener('click', () => {
    hideElement(startButton)
    showElement(pauseButton)
    timer.start()
    slack.focusStart()
    notifier.notify({
      title: 'PomoGuru',
      icon: path.join(__dirname, 'icon.png'),
      message: 'All set! Focus time is on'
    })
  })

  pauseButton.addEventListener('click', () => {
    hideElement(pauseButton)
    showElement(startButton)
    timer.pause()
    slack.focusEnd()
  })

  stopButton.addEventListener('click', () => {
    hideElement(pauseButton)
    showElement(startButton)
    timer.stop()
    slack.focusEnd()
    notifier.notify({
      title: 'PomoGuru',
      icon: path.join(__dirname, 'icon.png'),
      message: 'Notifications turned on'
    });
  })

  timer.onTimeChange(({ timeLeft, progress }) => {
    setTimeLeft(timeLeft)
    ipcRenderer.send('time-change', progress)
  })

  function setTimeLeft(value) {
    timeLeftElement.innerHTML = formatTime(value)
  }

  function hideElement(element) {
    element.classList.add('hidden')
  }

  function showElement(element) {
    element.classList.remove('hidden')
  }

  function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes}:${addLeadingZero(seconds)}`
  }

  function addLeadingZero(value) {
    return value < 10 ? `0${value}` : value
  }
}
