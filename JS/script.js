console.log("JS time")

let currentSong = new Audio();
let songs;
let currentFolder;

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


async function getSongs(folder) {

    currentFolder = folder

    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        

        if(element.href.endsWith(".mp3")){
            songs.push(element.title)
        }
        
    }
    
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="SVGs/music.svg">
                            <div class="info">
                                <div>${song}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="SVGs/play.svg" alt="">
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

    return songs

}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = `/${currentFolder}/`+track

    if(!pause){
        currentSong.play()
        play.src = "SVGs/pause.svg";
    }    
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    try {
        let a = await fetch(`/songs/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;

        let anchors = div.getElementsByTagName("a");
        let array = Array.from(anchors);
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = ""; // Clear existing content

        for (let index = 0; index < array.length; index++) {
            const e = array[index];

            if (e.href.includes("/songs")) {
                let folder = e.href.split("/").slice(-1)[0];

                try {
                    let albumResponse = await fetch(`/songs/${folder}/info.json`);
                    let albumInfo = await albumResponse.json();

                    let card = document.createElement("div");
                    card.className = "card";
                    card.dataset.folder = folder;

                    card.innerHTML = `
                        <div class="play">
                            <svg class="icon-container" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="black">
                                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${albumInfo.title}</h2>
                        <p>${albumInfo.description}</p>
                    `;

                    cardContainer.appendChild(card);
                } catch (error) {
                    console.error(`Failed to fetch album info for folder ${folder}:`, error);
                }
            }
        }

        // Load the playlist whenever the card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async (item) => {
                console.log(item, item.currentTarget.dataset);
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0])
            });
        });
    } catch (error) {
        console.error('Failed to fetch albums:', error);
    }
}

console.log("hi")



async function main(){    

    await getSongs("songs/Aavesham")
    console.log(songs)
    playMusic(songs[0], true)

    // display all the ablums 

    displayAlbums()

    // attach an event listner of playbar buttons

    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "SVGs/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "SVGs/play.svg"
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
        if(currentSong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("SVGs/mute.svg", "SVGs/volume.svg")
        }
    })

    // add event listner to volume button
    
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("SVGs/volume.svg")){
            e.target.src = e.target.src.replace("SVGs/volume.svg", "SVGs/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("SVGs/mute.svg", "SVGs/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


}

main()





// -------------------------------------------------------------------------------------------------


// backup code 



