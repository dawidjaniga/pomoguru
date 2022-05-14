import { Howl } from 'howler'
import { Service } from 'typedi'
import { SoundSerivce } from '../interfaces/SoundService'

// @TODO: How to properly host sound files?
const breakEndSound = new Howl({
  src: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-marimba-2820.mp3'
})

const workEndSound = new Howl({
  src:
    'https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-up-alert-notification-2357.mp3'
})

@Service()
export class BrowserSoundService implements SoundSerivce {
  playWorkEndSound () {
    workEndSound.play()
  }

  playBreakEndSound () {
    breakEndSound.play()
  }
}
