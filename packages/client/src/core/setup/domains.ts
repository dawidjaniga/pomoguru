import { UserDomain } from '../../domain/user/setup'
import { TimerDomain } from '../../domain/timer/setup'

export default function setup () {
  new TimerDomain()
  new UserDomain()
}
