console.log("JS time")

let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    let songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        

        if(element.href.endsWith(".mp3")){
            songs.push(element.title)
        }
        
    }
    return songs

}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/"+track

    if(!pause){
        currentSong.play()
        play.src = "pause.svg";
    }    
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main(){

    

    songs = await getSongs()
    console.log(songs)
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg">
                            <div class="info">
                                <div>${song}</div>
                                <div>Chetan</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                            
                        </li>`;
    }

    // attach an eventlistner for each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        // console.log(e)
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    // attach an event listner of playbar buttons

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for the time update event

    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    // add event listner to seekbar
    
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let precent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = precent + "%";
        currentSong.currentTime = ((currentSong.duration)*precent)/100;
    })

    // adding event istner for hamburger

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = 0;
    })

    // adding event listner to close

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-100%"
    })

    document.getElementById("previous").addEventListener("click", () => {
        console.log("previous");
    
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs, index);
    
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });
    
    document.getElementById("next").addEventListener("click", () => {
        console.log("next");
    
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs, index);
    
        if (index + 1 < songs.length) { // Corrected the condition here
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("setting volume")
        currentSong.volume = parseInt(e.target.value)/100;
    })
    


}

main()