import { NodeApplication } from '@pomoguru/node-application'
import * as blessed from 'blessed'
import * as contrib from 'blessed-contrib'
import { Phase } from '@pomoguru/client'

export class BlessedApp {
  private app: NodeApplication
  private screen: blessed.Widgets.Screen

  private grid: contrib.grid

  private log: contrib.Widgets.LogElement
  private timer: contrib.Widgets.DonutElement
  private buttons: contrib.Widgets.LineElement

  constructor (app: NodeApplication) {
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
    this.log = this.grid.set(5, 1, 4, 6, contrib.log, {
      fg: 'green',
      selectedFg: 'green',
      label: 'Debug Log',
      draggable: true
    })
  }

  createTimer () {
    this.timer = this.grid.set(8, 8, 4, 2, contrib.donut, {
      radius: 16,
      arcWidth: 4,
      yPadding: 2
    })
  }

  createButtons () {
    this.buttons = this.grid.set(0, 0, 6, 6, contrib.line, {
      showNthLabel: 5,
      maxY: 100,
      label: 'Buttons',
      showLegend: true,
      legend: { width: 10 }
    })

    const box = this.grid.set(4, 4, 1, 1, blessed.box, { content: 'Start' })
    box.on('click', () => {
      console.log('box clicked')
      this.app.startPomodoro()
    })
  }

  attachHandlers () {
    this.screen.on('resize', () => {
      this.log.emit('attach')
      this.timer.emit('attach')
      this.buttons.emit('attach')
    })

    this.screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0)
    })

    this.app.subscribeToGetTimers(timers => {
      const { progress, phase, timeLeft } = timers

      this.log.log(['timers', phase, timeLeft, progress].join('\t'))

      this.timer.setLabel(phase)
      this.timer.setData([
        {
          percent: String(progress),
          label: timeLeft,
          color: this.getPrimaryColor(phase)
        }
      ])
      this.screen.render()
    })
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
