import { useCaseProvider } from '@pomoguru/client'
import * as blessed from 'blessed'
import * as contrib from 'blessed-contrib'

const screen = blessed.screen()

//create layout and widgets

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

/**
 * Donut Options
  self.options.radius = options.radius || 14; // how wide is it? over 5 is best
  self.options.arcWidth = options.arcWidth || 4; //width of the donut
  self.options.yPadding = options.yPadding || 2; //padding from the top
 */
const donut = grid.set(8, 8, 4, 2, contrib.donut, {
  label: 'Time Left',
  radius: 16,
  arcWidth: 4,
  yPadding: 2,
  data: [{ label: 'Storage', percent: 87 }]
})

donut.setData([{ percent: 20, label: 'Work', color: 'green' }])

useCaseProvider['ешьукюПуеЕшьук']

// const latencyLine = grid.set(8, 8, 4, 2, contrib.line,
//   { style:
//     { line: "yellow"
//     , text: "green"
//     , baseline: "black"}
//   , xLabelPadding: 3
//   , xPadding: 5
//   , label: 'Network Latency (sec)'})

const gauge = grid.set(8, 10, 2, 2, contrib.gauge, {
  label: 'Storage',
  percent: [80, 20]
})
const gauge_two = grid.set(2, 9, 2, 3, contrib.gauge, {
  label: 'Deployment Progress',
  percent: 80
})

const sparkline = grid.set(10, 10, 2, 2, contrib.sparkline, {
  label: 'Throughput (bits/sec)',
  tags: true,
  style: { fg: 'blue', titleFg: 'white' }
})

const bar = grid.set(4, 6, 4, 3, contrib.bar, {
  label: 'Server Utilization (%)',
  barWidth: 4,
  barSpacing: 6,
  xOffset: 2,
  maxHeight: 9
})

const table = grid.set(4, 9, 4, 3, contrib.table, {
  keys: true,
  fg: 'green',
  label: 'Active Processes',
  columnSpacing: 1,
  columnWidth: [24, 10, 10]
})

/*
 *
 * LCD Options
//these options need to be modified epending on the resulting positioning/size
  options.segmentWidth = options.segmentWidth || 0.06; // how wide are the segments in % so 50% = 0.5
  options.segmentInterval = options.segmentInterval || 0.11; // spacing between the segments in % so 50% = 0.5
  options.strokeWidth = options.strokeWidth || 0.11; // spacing between the segments in % so 50% = 0.5
//default display settings
  options.elements = options.elements || 3; // how many elements in the display. or how many characters can be displayed.
  options.display = options.display || 321; // what should be displayed before anything is set
  options.elementSpacing = options.spacing || 4; // spacing between each element
  options.elementPadding = options.padding || 2; // how far away from the edges to put the elements
//coloring
  options.color = options.color || "white";
*/

const errorsLine = grid.set(0, 6, 4, 3, contrib.line, {
  style: { line: 'red', text: 'white', baseline: 'black' },
  label: 'Errors Rate',
  maxY: 60,
  showLegend: true
})

const transactionsLine = grid.set(0, 0, 6, 6, contrib.line, {
  showNthLabel: 5,
  maxY: 100,
  label: 'Buttons',
  showLegend: true,
  legend: { width: 10 }
})

const map = grid.set(6, 0, 6, 6, contrib.map, { label: 'Servers Location' })

const log = grid.set(8, 6, 4, 2, contrib.log, {
  fg: 'green',
  selectedFg: 'green',
  label: 'Server Log'
})

const box = grid.set(4, 4, 1, 1, blessed.box, { content: 'Start' })
box.on('click', (...args) => {
  box.setContent(JSON.stringify(args))
})

//dummy data
const servers = ['US1', 'US2', 'EU1', 'AU1', 'AS1', 'JP1']
const commands = [
  'grep',
  'node',
  'java',
  'timer',
  '~/ls -l',
  'netns',
  'watchdog',
  'gulp',
  'tar -xvf',
  'awk',
  'npm install'
]

//set dummy data on gauge
let gauge_percent = 0
setInterval(function () {
  gauge.setData([gauge_percent, 100 - gauge_percent])
  gauge_percent++
  if (gauge_percent >= 100) gauge_percent = 0
}, 200)

let gauge_percent_two = 0
setInterval(function () {
  gauge_two.setData(gauge_percent_two)
  gauge_percent_two++
  if (gauge_percent_two >= 100) gauge_percent_two = 0
}, 200)

//set dummy data on bar chart
function fillBar () {
  const arr = []
  for (let i = 0; i < servers.length; i++) {
    arr.push(Math.round(Math.random() * 10))
  }
  bar.setData({ titles: servers, data: arr })
}
fillBar()
setInterval(fillBar, 2000)

//set dummy data for table
function generateTable () {
  const data = []

  for (let i = 0; i < 30; i++) {
    const row = []
    row.push(commands[Math.round(Math.random() * (commands.length - 1))])
    row.push(Math.round(Math.random() * 5))
    row.push(Math.round(Math.random() * 100))

    data.push(row)
  }

  table.setData({ headers: ['Process', 'Cpu (%)', 'Memory'], data: data })
}

generateTable()
table.focus()
setInterval(generateTable, 3000)

//set log dummy data
setInterval(function () {
  const rnd = Math.round(Math.random() * 2)
  if (rnd == 0)
    log.log(
      'starting process ' +
        commands[Math.round(Math.random() * (commands.length - 1))]
    )
  else if (rnd == 1)
    log.log(
      'terminating server ' +
        servers[Math.round(Math.random() * (servers.length - 1))]
    )
  else if (rnd == 2) log.log('avg. wait time ' + Math.random().toFixed(2))
  screen.render()
}, 500)

//set spark dummy data
const spark1 = [
  1,
  2,
  5,
  2,
  1,
  5,
  1,
  2,
  5,
  2,
  1,
  5,
  4,
  4,
  5,
  4,
  1,
  5,
  1,
  2,
  5,
  2,
  1,
  5,
  1,
  2,
  5,
  2,
  1,
  5,
  1,
  2,
  5,
  2,
  1,
  5
]
const spark2 = [
  4,
  4,
  5,
  4,
  1,
  5,
  1,
  2,
  5,
  2,
  1,
  5,
  4,
  4,
  5,
  4,
  1,
  5,
  1,
  2,
  5,
  2,
  1,
  5,
  1,
  2,
  5,
  2,
  1,
  5,
  1,
  2,
  5,
  2,
  1,
  5
]

refreshSpark()
setInterval(refreshSpark, 1000)

function refreshSpark () {
  spark1.shift()
  spark1.push(Math.random() * 5 + 1)
  spark2.shift()
  spark2.push(Math.random() * 5 + 1)
  sparkline.setData(['Server1', 'Server2'], [spark1, spark2])
}

//set line charts dummy data

const transactionsData = {
  title: 'USA',
  style: { line: 'red' },
  x: [
    '00:00',
    '00:05',
    '00:10',
    '00:15',
    '00:20',
    '00:30',
    '00:40',
    '00:50',
    '01:00',
    '01:10',
    '01:20',
    '01:30',
    '01:40',
    '01:50',
    '02:00',
    '02:10',
    '02:20',
    '02:30',
    '02:40',
    '02:50',
    '03:00',
    '03:10',
    '03:20',
    '03:30',
    '03:40',
    '03:50',
    '04:00',
    '04:10',
    '04:20',
    '04:30'
  ],
  y: [
    0,
    20,
    40,
    45,
    45,
    50,
    55,
    70,
    65,
    58,
    50,
    55,
    60,
    65,
    70,
    80,
    70,
    50,
    40,
    50,
    60,
    70,
    82,
    88,
    89,
    89,
    89,
    80,
    72,
    70
  ]
}

const transactionsData1 = {
  title: 'Europe',
  style: { line: 'yellow' },
  x: [
    '00:00',
    '00:05',
    '00:10',
    '00:15',
    '00:20',
    '00:30',
    '00:40',
    '00:50',
    '01:00',
    '01:10',
    '01:20',
    '01:30',
    '01:40',
    '01:50',
    '02:00',
    '02:10',
    '02:20',
    '02:30',
    '02:40',
    '02:50',
    '03:00',
    '03:10',
    '03:20',
    '03:30',
    '03:40',
    '03:50',
    '04:00',
    '04:10',
    '04:20',
    '04:30'
  ],
  y: [
    0,
    5,
    5,
    10,
    10,
    15,
    20,
    30,
    25,
    30,
    30,
    20,
    20,
    30,
    30,
    20,
    15,
    15,
    19,
    25,
    30,
    25,
    25,
    20,
    25,
    30,
    35,
    35,
    30,
    30
  ]
}

const errorsData = {
  title: 'server 1',
  x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:25'],
  y: [30, 50, 70, 40, 50, 20]
}

const latencyData = {
  x: ['t1', 't2', 't3', 't4'],
  y: [5, 1, 7, 5]
}

setLineData([transactionsData, transactionsData1], transactionsLine)
setLineData([errorsData], errorsLine)
// setLineData([latencyData], latencyLine)

setInterval(function () {
  setLineData([transactionsData, transactionsData1], transactionsLine)
  screen.render()
}, 500)

setInterval(function () {
  setLineData([errorsData], errorsLine)
}, 1500)

function setLineData (mockData, line) {
  for (let i = 0; i < mockData.length; i++) {
    const last = mockData[i].y[mockData[i].y.length - 1]
    mockData[i].y.shift()
    const num = Math.max(last + Math.round(Math.random() * 10) - 5, 10)
    mockData[i].y.push(num)
  }

  line.setData(mockData)
}

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

// fixes https://github.com/yaronn/blessed-contrib/issues/10
screen.on('resize', function () {
  donut.emit('attach')
  gauge.emit('attach')
  gauge_two.emit('attach')
  sparkline.emit('attach')
  bar.emit('attach')
  table.emit('attach')

  errorsLine.emit('attach')
  transactionsLine.emit('attach')
  map.emit('attach')
  log.emit('attach')
})

screen.render()
