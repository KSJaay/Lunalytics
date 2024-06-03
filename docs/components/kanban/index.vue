<!--
  Type: Low, Medium, High, Bug, Design, Complete
-->

<template>
  <div id="app" class="kanban-container">
    <div v-for="column in columns" :key="column.title" class="kanban-column">
      <div class="kanban-column-container">
        {{ column.title }}
        <span class="kanban-column-content">
          {{ column.tasks.length }}
        </span>
      </div>
      <TaskCard v-for="task in column.tasks" :key="task.title" :task="task" />
    </div>
  </div>
</template>

<script>
import TaskCard from './taskCard.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: { TaskCard },
  data() {
    return {
      columns: [],
    };
  },
  mounted() {
    axios
      .get('https://demo.lunalytics.xyz/api/kanban')
      .then((response) => (this.columns = response));
  },
};
</script>

<style scoped>
.kanban-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
}

.kanban-column {
  background-color: var(--vp-c-brand-dimm);
  padding: 8px 10px 16px 10px;
  border-radius: 12px;
  flex: 1;
}

.kanban-column-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.kanban-column-content {
  font-weight: 600;
  color: var(--vp-c-brand);
  background-color: var(--vp-c-brand-light);
  border-radius: 100%;
  text-align: center;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: black;
}

@media only screen and (min-width: 1100px) {
  .kanban-container {
    flex-direction: row;
    gap: 16px;
  }
}
</style>
