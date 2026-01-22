class Media {
  play() {
    console.log("Playing media file...");
  }
}
class Audio extends Media {
  play() {
    console.log("Playing audio file...");
  }
}
class Video extends Media {
  play() {
    console.log("Playing video file...");
  }
}
let media1 = new Media();
let audio1 = new Audio();
let video1 = new Video();

media1.play();   
audio1.play(); 
video1.play(); 
