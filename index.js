const os = require("os")
const fs = require("fs")
const path = require("path")
const process = require("process")

const path_to_music = path.join(os.homedir(), 'Music')
const music_files = fs.readdirSync(path_to_music).filter(i => i.endsWith('.mp3'))

let song_names = music_files.map(i=> i.split('.')[0])

function main(){
  console.log("Select a song\n")
  console.log(song_names)

  let i = 0

  process.stdin.on('data',(chunk)=>{
    let user_input = chunk.toString().trim()

    if (user_input === "j" && i < song_names.length - 1) {
      i += 1
    }
    else if (user_input === "k" && i > 0) {
      i -= 1
    }
    console.log(i)
  })

}
main()
