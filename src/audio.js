let audioBuffer
let isAudioPlaying = false
let audioElement
let audioElement2

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton')

    // Create an audio element
    audioElement = new Audio('waterSounds.wav')
    audioElement.loop = true
    // audioElement.volume = 0.2 // Set the volume to 20%

    // Create an audio element
    audioElement2 = new Audio('lofi.mp3')
    audioElement2.loop = true
    // audioElement2.volume = 0.8 // Set the volume to 80%

    // Add click event listener to the button
    playButton.addEventListener('click', () => {
        if (isAudioPlaying) {
            // If audio is playing, pause it and change button text to "Play Audio"
            audioElement.pause()
            audioElement2.pause()
            isAudioPlaying = false;
            playButton.innerText = 'Play Audio'
        } else {
            // If audio is not playing, play it and change button text to "Mute"
            audioElement.play()
            audioElement2.play()
            isAudioPlaying = true
            playButton.innerText = 'Mute'
        }
    })
})