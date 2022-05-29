import { Howl } from 'howler'
import { SoundService } from '@pomoguru/client'

// @TODO: How to properly host sound files?
const breakEndSound = new Howl({
  src: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-marimba-2820.mp3'
})

const workEndSound = new Howl({
  src:
    'https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-up-alert-notification-2357.mp3'
})

export class NodeSoundService implements SoundService {
  playWorkEndSound () {
    workEndSound.play()
  }

  playBreakEndSound () {
    console.log('playing break sound from node')
    breakEndSound.play()
  }
}
