const {spawn} = require("node:child_process")

const cmd = (spawn('ls'))

cmd.stdout.on('data',(i)=>{
  console.log(i.toString())
})
const {spawn} = require("node:child_process")

const cmd = (spawn('ls'))

cmd.stdout('data',(i)=>{
  console.log(i)
})
