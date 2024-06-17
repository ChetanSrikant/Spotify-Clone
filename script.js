console.log("JS time")

let currentSong = new Audio();

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

const playMusic = (track)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/"+track
    currentSong.play()
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main(){

    

    let songs = await getSongs()
    console.log(songs)

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

}

main()