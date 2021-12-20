const COLOUR = ['#B3FFB5', '#FF9B99', '#B9AEFF']
const chartMax = new Date()
const chartMin = chartMax - 86400000

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
  pan: { enabled: true, mode: 'x' },
  zoom: {
    wheel: { enabled: true },
    pinch: { enabled: true },
    mode: 'x'
  },
  limits: {
    x: { min: chartMin, max: chartMax }
  }
}
const decimation = {
  enabled: true,
  algorithm: 'lttb',
  samples: 288,
  threshold: 256
}
const scales = {
  x: {
    type: 'time',
    round: 'minute',
    min: chartMin,
    max: chartMax,
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
        label: '/skip',
        data: data.skipTime,
      }, {
        label: '/status',
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
      }
    }
  }
  new Chart(ctx, config)
}