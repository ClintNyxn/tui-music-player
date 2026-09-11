const blessed = require("blessed")
// const song_names = require("./index.js")

const screen = blessed.screen({
  smartCSR: true,
  title: "Forlorn",
})

const songs = blessed.list({
  top: 0, left: 0, right:0, bottom:0,
  widthblue: "50%",
  height: "100%",

  label: "Songs",

  keys: true,

  border: {
    type: "line",
  },

  style: {
    selected: {
      fg: "white",
      bg: "red",
    },
    item: {
      fg: "white",
    },
    border: {
      fg: "red",
    },
  },

  items: ['1','2','3'],
})

const player = blessed.list({
  top: 0, left: 0, right:0, bottom:0,
  widthblue: "50%",
  height: "100%",

  label: "Songs",

  keys: true,
  mouse: false,
  
  border: {
    type: "line",
  },

  style: {
    selected: {
      fg: "white",
      bg: "red",
    },
    item: {
      fg: "white",
    },
    border: {
      fg: "red",
    },
  },

  items: ['1','2','3'],
})

// screen.append(songs)
screen.append(player)

screen.key("q", () => {
  process.exit(0)
})

screen.render()
