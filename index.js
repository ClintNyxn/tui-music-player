const os = require("os")
const fs = require("fs")
const path = require("path")
const process = require("process")
const {spawn} = require("child_process")

const path_to_music = path.join(os.homedir(), 'Music')
const music_files = fs.readdirSync(path_to_music).filter(i => i.endsWith('.mp3'))
console.log(music_files)

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
    else if(user_input == 'p'){
      console.log(`playing ${song_names[i]}`)
      const song_path = path.join(path_to_music,music_files[i])

      let program;

      if (os.platform() == 'linux'){
        program = 'mpv'
      }else if (os.platform() == "darwin"){
        program = 'afplay'
      }else if( os.platform() == "win32"){
        console.log("you dont deserve music")
      }

      const cmd = spawn(program, [song_path])
      cmd.stdout.on('data', (i)=>{console.log(i.toString())})
    }
  })
}
main()
