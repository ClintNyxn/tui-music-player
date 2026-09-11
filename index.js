const os = require("os");
const fs = require("fs");
const path = require("path");
const process = require("process");
const { spawn } = require("child_process");

const path_to_music = path.join(os.homedir(), "Music");
const music_files = fs
  .readdirSync(path_to_music)
  .filter((i) => i.endsWith(".mp3"));
console.log(music_files);

let song_names = music_files.map((i) => i.split(".")[0]);

function main() {
  console.log("Select a song\n");
  console.log(song_names);

  let i = 0;
  let paused = false 
  let curr_play = null;

  function play_this(i){
    console.log(`playing ${song_names[i]}`);
    const song_path = path.join(path_to_music, music_files[i]);
    let program = os.platform() == "darwin" ? "afplay" : "mpv";

    if (curr_play) { curr_play.kill()}

    curr_play = spawn(program, [song_path]);
    curr_play.stdout.on("data", (i) => {
      console.log(i.toString())
    })
  }

  function kill_this(curr_play){
    if (paused){
      curr_play.kill("SIGCONT")
      paused = false
    }else{
      curr_play.kill("SIGSTOP") 
      paused = true
    }
  }


  process.stdin.on("data", (chunk) => {
    let user_input = chunk.toString().trim();

    if (user_input === "j" && i < song_names.length - 1) {
      i += 1;
    } else if (user_input === "k" && i > 0) {
      i -= 1;
    } else if (user_input == "p") {
      play_this(i)
    }

    else if (user_input == "P"){ // no functionality for linux yet
      kill_this(curr_play)
    }

    else if (user_input == "L"){
      if (curr_play) {
        curr_play.kill();
        i += 1;
        play_this(i)
      }
    }
    else if (user_input == "H"){
      if (curr_play) {
        curr_play.kill();
        i -= 1;
        play_this(i)
      }
    }
    else if (user_input == "q"){
      console.log("Exited Player")
      curr_play.kill();
      process.exit(0);
    }
    else{
      console.log("That isn't a command")
    }
  });
}
main();
