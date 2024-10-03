async function songs(){
    let song = await fetch('http://192.168.1.23:5500/songs/')
    let res = await song.text();
        console.log(res);
}
songs();