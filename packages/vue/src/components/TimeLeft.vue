<script lang="ts">
import { controller, model, TimeLeft } from '@pomoguru/client'

// export default function TimeLeft () {
//   const { percentCompleted, formattedSeconds } = useTimeLeft()
//   const phase = model.get('phase')
//   const percent = percentCompleted * 100

//   return (
//     <div>
//       <Progress
//         type='circle'
//         percent={percent}
//         status={status}
//         width={240}
//         format={() => formattedSeconds}
//       />
//     </div>
//   )
// }

export default {
  data: () => ({
    timeLeft: model.get('timeLeft')
  }),
  methods: {
    startWork () {
      controller.startWork()
    }
  },
  mounted () {
    model.subscribe('timeLeft:changed', (timeLeft: TimeLeft) => {
      // @ts-ignore
      this.timeLeft = timeLeft
    })
  }
}
</script>
<template>
  <div>TimeLeft: {{ timeLeft.formattedSeconds }}</div>
  <button @click="startWork">Start Work</button>
</template>
