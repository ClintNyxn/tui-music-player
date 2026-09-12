const os = require("os");
const fs = require("fs");
const path = require("path");
const process = require("process");
const { spawn } = require("child_process");

const path_to_music = path.join(os.homedir(), "Music");
const music_files = fs
  .readdirSync(path_to_music)
  .filter((i) => i.endsWith(".mp3"));

let song_names = music_files.map((i) => i.split(".")[0]);

function main() {

  let i = 0;
  let paused = false;
  let curr_play = null;
  let playing_index;
  let wrong_cmd = false;

  function intro(){
    console.clear()
    console.log("j ↓    k ↑   p play    P play/pause    L next    H prev    q quit\n");
    console.log("Select a song from:\n");

    for (let j in song_names) {
      console.log(`${i==j? '->':Number(j) + 1+"."} ${song_names[j]}`);
    }
    console.log("\n");

    console.log(curr_play? `Now playing: ${song_names[playing_index]}`:'Now playing: -') 
    console.log(paused?"paused\n":"\n");

    if (wrong_cmd){
      console.log('Invalid command\n')
      setTimeout(() => {
        wrong_cmd = false
        intro()
      }, 1000);
    }
  }

  intro()

  // business logic page??

  function play_this(i) {
    const song_path = path.join(path_to_music, music_files[i]);

    let program = os.platform() == "darwin" ? "afplay" : "mpv";

    if (curr_play) {
      curr_play.kill();
    }
    curr_play = spawn(program, [song_path]);
    curr_play.stdout.on("data", (i) => { console.log(i.toString()); });
    paused = false
    playing_index = i
    intro()
  }

  function kill_this(curr_play) {
    if (paused) {
      curr_play.kill("SIGCONT");
      paused = false;
      intro()
    } else {
      curr_play.kill("SIGSTOP");
      paused = true;
      intro()
    }
  }

  process.stdin.setEncoding('utf-8')
  process.stdin.setRawMode(true)

  process.stdin.on("data", (chunk) => {
    let user_input = chunk.toString().trim();

    if (Number.isInteger(Number(user_input))) {
      const num = Number(user_input);

      if (num > 0 && num <= song_names.length) {
        i = num - 1;
        intro()
        // console.log( `Selected Song : ${song_names[i]}\npress p and enter to play\n`,);
      } else {
        // console.log("Select from available list\n");
      }
    } else if (user_input === "j") {
      if (i < song_names.length - 1) {
        i += 1;
        process.stdout.write(`\x1b[${song_names.length}A`)
        intro()
        // console.log( `Selected Song : ${song_names[i]}\npress p and enter to play\n`,);
      }
    } else if (user_input === "k") {
      if (i > 0) {
        i -= 1;
        process.stdout.write('\x1b[2K')
        process.stdout.write(`\x1b[${song_names.length}B`)
        intro()
        // console.log( `Selected Song : ${song_names[i]}\npress p and enter to play\n`,);
      }      
    } else if (user_input == "p") {
      play_this(i);

    } else if (user_input == "P") {
      // no functionality for linux yet
      kill_this(curr_play);

    } else if (user_input == "L") {
      if (i < song_names.length-1) {
        i += 1;
        play_this(i);
      }
    } else if (user_input == "H") {
      if (i > 0) {
        i -= 1;
        play_this(i);
      }

    } else if (user_input == "q") {
      console.log("Exited Player");
      curr_play.kill();
      process.exit(0);

    } else {
      wrong_cmd = true
      intro()
    }
  });
}
main();
