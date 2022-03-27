<template>
  <div class="home">
    Timer
    <TimeLeft />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import TimeLeft from '../components/TimeLeft.vue';

export default defineComponent({
  name: 'Timer',
  components: {
    TimeLeft
  }
});
</script>
