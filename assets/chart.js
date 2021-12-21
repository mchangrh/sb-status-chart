const COLOUR = ['#B3FFB5', '#FF9B99', '#B9AEFF']
const minRange = 1000 * 60 * 5
const max = new Date()
const min = chartMax - 86400000
const enabled = true

// helpers
const getColor = (c) => COLOUR[c.datasetIndex]

function processChart(data) {
  const sorted = data.sort((a, b) => a.time - b.time);
  const processTime = []
  const statusTime = []
  const skipTime = []
  sorted.forEach((val) => {
    processTime.push({ x: val.time, y: val.pt })
    statusTime.push({ x: val.time, y: val.status })
    skipTime.push({ x: val.time, y: val.skip })
  })
  return {
    processTime,
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
const scales = {
  x: {
    type: 'time',
    round: 'minute',
    min, max,
    time: { minUnit },
    title: {
      display: true,
      text: 'Time',
      color: '#000'
    }
  },
  y: {
    type: 'logarithmic',
    min: 1,
    title: {
      display: true,
      text: 'Response Time (ms)',
      color: '#000'
    }
  }
}
const annotation = {
  annotations: {
    ping: {
      scaleID: 'y',
      type: 'line',
      value: 25,
      borderColor: "#FFAEDD",
    }
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
        annotation
      }
    }
  }
  const statusChart = new Chart(ctx, config)
}