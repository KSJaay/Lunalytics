<template>
  <div class="kanban-task">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <badge v-if="task.type" :color="badgeColor">{{ task.type }}</badge>
      <a v-if="task.link" class="link-container" :href="task.link">🔗</a>
    </div>

    <div class="kanban-title">
      {{ task.title }}
    </div>

    <div class="kanban-description">
      {{ task.description }}
    </div>

    <div
      :style="{
        display: 'flex',
        justifyContent: 'flex-end',
        color: '#a5a5a5',
      }"
    >
      📅 {{ task.date }}
    </div>
  </div>
</template>

<script>
import Badge from './badge.vue';
export default {
  components: {
    Badge,
  },
  props: {
    task: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    badgeColor() {
      const mappings = {
        Low: { background: '#6d6d6d', color: 'white' },
        Medium: { background: '#e9c739', color: '#222222' },
        High: { background: '#d92f20', color: 'white' },
        Bug: { background: '#fb8a31', color: '#222222' },
        Design: { background: '#8f44e1', color: 'white' },
        Complete: { background: '#00b846', color: 'white' },
        default: { background: '#8f44e1', color: 'white' },
      };
      return mappings[this.task.type] || mappings.default;
    },
  },
};
</script>

<style scoped>
.kanban-task {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 12px;
  background-color: var(--vp-c-brand-dimm);
}

.kanban-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
  padding: 0;
  text-align: left;
  margin: 6px 0 4px 0;
}

.kanban-description {
  font-size: 14px;
  font-weight: 400;
  color: #bbbbbb;
  margin: 0;
  padding: 0;
  text-align: left;
}

.link-container {
  display: flex;
  padding: 4px;
  align-items: center;
  gap: 4px;
  background-color: var(--vp-c-brand-dimm);
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
}

.link-container:hover {
  background-color: var(--vp-c-brand-darker);
}
</style>
