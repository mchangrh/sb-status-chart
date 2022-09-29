const COLOUR = ['#B3FFB5', '#FFE18F', '#FF9B99', '#B9AEFF' ]
const minRange = 1000 * 60 * 5
const max = new Date()
const min = max - 86400000
const enabled = true
const dark = "#111"
const light = "#ddd"

// helpers
const getColor = (c) => COLOUR[c.datasetIndex]

function processChart(data) {
  const sorted = data.sort((a, b) => a.time - b.time);
  const processTime = []
  const redisTime = []
  const statusTime = []
  const skipTime = []
  sorted.forEach((val) => {
    processTime.push({ x: val.time, y: val.pt })
    redisTime.push({ x: val.time, y: val.rt })
    statusTime.push({ x: val.time, y: val.status })
    skipTime.push({ x: val.time, y: val.skip })
  })
  return {
    processTime,
    redisTime,
    statusTime,
    skipTime
  }
}

// plugin confirmation
const zoom = {
  pan: { mode: 'x', enabled },
  zoom: {
    mode: 'x',
    wheel: { enabled },
    pinch: { enabled }
  },
  limits: {
    x: { min, max, minRange }
  }
}
const decimation = {
  enabled,
  algorithm: 'lttb',
  samples: 288,
  threshold: 256
}
const grid = {
  color: "#444"
}
const scales = {
  x: {
    type: 'time',
    round: 'minute',
    min, max,
    time: { minUnit: "minute" },
    title: {
      display: true,
      text: 'Time',
      color: light
    },
    grid
  },
  y: {
    type: 'logarithmic',
    min: 1,
    title: {
      display: true,
      text: 'Response Time (ms)',
      color: light
    },
    grid
  }
}
const annotation = {
  annotations: {
    ping: {
      scaleID: 'y',
      type: 'line',
      value: 1,
      borderColor: "#FFAEDD",
    }
  }
}
const legend = {
  labels: {
    color: light
  }
}

// setup
function createChart(data) {
  const ctx = document.getElementById('chart')
  const config = {
    type: 'line',
    data: {
      datasets: [{
        label: 'Server Process Time',
        data: data.processTime,
      }, {
        label: 'Redis Process Time',
        data: data.redisTime,
      },{
        label: 'Segment Loading Time',
        data: data.skipTime,
      }, {
        label: '/status Loading Time',
        data: data.statusTime,
      }]
    },
    options: {
      normalized: true,
      parsing: false,
      color: getColor,
      backgroundColor: getColor,
      borderColor: getColor,
      scales,
      plugins: {
        decimation,
        zoom,
        annotation,
        legend
      }
    }
  }
  const statusChart = new Chart(ctx, config)
}