import * as blessed from 'blessed'
import * as contrib from 'blessed-contrib'
import { Application, Phase } from '@pomoguru/client'

export class BlessedApp {
  private app: Application
  private screen: blessed.Widgets.Screen

  private grid: contrib.grid

  private log: contrib.Widgets.LogElement
  private timer: contrib.Widgets.DonutElement

  private startPomodoroButton: blessed.Widgets.BoxElement
  private pausePomodoroButton: blessed.Widgets.BoxElement
  private skipPomodoroButton: blessed.Widgets.BoxElement
  private skipBreakButton: blessed.Widgets.BoxElement
  private fastForwardButton: blessed.Widgets.BoxElement

  constructor (app: Application) {
    this.app = app
    this.screen = blessed.screen()
    this.grid = new contrib.grid({ rows: 12, cols: 12, screen: this.screen })

    this.createTimer()
    this.createButtons()
    this.createDebugLog()

    this.attachHandlers()

    this.screen.render()
  }

  createDebugLog () {
    this.log = this.grid.set(5, 1, 4, 4, contrib.log, {
      fg: 'green',
      selectedFg: 'green',
      label: 'Debug Log',
      draggable: true
    })

    this.log.log(['Phase', 'Time Left', 'Progress'].join('\t\t'))
  }

  createTimer () {
    this.timer = this.grid.set(1, 1, 4, 2, contrib.donut, {
      radius: 16,
      arcWidth: 4,
      yPadding: 2
    })
  }

  createButtons () {
    this.startPomodoroButton = this.grid.set(0, 1, 1, 1, blessed.box, {
      content: 'Start'
    })
    this.pausePomodoroButton = this.grid.set(0, 2, 1, 1, blessed.box, {
      content: 'Pause'
    })
    this.skipPomodoroButton = this.grid.set(0, 3, 1, 1, blessed.box, {
      content: 'Skip Pomodoro'
    })
    this.skipBreakButton = this.grid.set(0, 4, 1, 1, blessed.box, {
      content: 'Skip Break'
    })
    this.fastForwardButton = this.grid.set(0, 5, 1, 1, blessed.box, {
      content: 'Fast Forward'
    })

    this.startPomodoroButton.on('click', () => this.app.startPomodoro())
    this.pausePomodoroButton.on('click', () => this.app.pausePomodoro())
    this.skipPomodoroButton.on('click', () => this.app.skipPomodoro())
    this.skipBreakButton.on('click', () => this.app.skipBreak())
    this.fastForwardButton.on('click', () => this.app.fastForward())
  }

  attachHandlers () {
    this.screen.on('resize', () => {
      this.log.emit('attach')
      this.timer.emit('attach')
    })

    this.screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0)
    })

    this.app.subscribeToGetTimers(timers => {
      const { progress, phase, timeLeft } = timers

      this.log.log([phase, timeLeft, progress.toFixed(2)].join('\t\t'))

      this.timer.setLabel(phase)
      this.timer.setData([
        {
          percent: String(progress),
          label: timeLeft,
          color: this.getPrimaryColor(phase)
        }
      ])

      this.render(phase)
    })
  }

  render (phase: Phase) {
    const allElements = [
      this.startPomodoroButton,
      this.pausePomodoroButton,
      this.skipPomodoroButton,
      this.skipBreakButton
    ]
    const visibleElements = []

    allElements.forEach(element => {
      element.hide()
    })

    switch (phase) {
      case 'idle':
        visibleElements.push(this.startPomodoroButton)
        break

      case 'work':
        visibleElements.push(this.pausePomodoroButton, this.fastForwardButton)
        break

      case 'paused':
        visibleElements.push(this.startPomodoroButton, this.pausePomodoroButton)
        break

      case 'break':
        visibleElements.push(this.skipBreakButton)
        break
    }

    visibleElements.forEach(element => {
      element.show()
    })

    this.screen.render()
  }

  getPrimaryColor (phase: Phase) {
    const phaseToColors: Record<Phase, string> = {
      work: 'red',
      break: 'green',
      paused: 'blue',
      idle: 'blue'
    }

    return phaseToColors[phase]
  }
}
