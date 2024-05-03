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

export default {
  name: 'App',
  components: { TaskCard },
  data() {
    return {
      columns: [
        {
          title: 'Backlog',
          tasks: [
            {
              title: 'Status Pages',
              description:
                'Create a system that allows users to create custom status pages that can be either public or private. Possibly move the home page to a /dashboard domain so users can host the status page on the index page.',
              date: '03/05/24',
              completedDate: '',
              type: 'High',
            },
            {
              title: 'Notifications',
              description:
                'Notification system that allows users to setup notifications to various platforms when the application they are monitoring goes down.',
              link: '/kanban/notifications',
              date: '03/05/24',
              completedDate: '',
              type: 'High',
            },
            {
              title: 'Incidents',
              description:
                'Ability to show incident notice/alerts on the status page. Users will be able to create either live incidents or scheduled for specific dates/timeslots.',
              date: '03/05/24',
              completedDate: '',
              type: 'Medium',
            },
            {
              title: 'API Keys',
              description:
                'Allow admins/owners to create/configure API keys. For the time being limit access of API keys to GET requests and in the future allow POST requests.',
              date: '03/05/24',
              completedDate: '',
              type: 'Medium',
            },
            {
              title: 'Headers, Body, and Authentication',
              description:
                'Adding the ability for users to add Body, Headers, and Authentication to the monitor.',
              link: '/kanban/headers',
              date: '03/05/24',
              completedDate: '',
              type: 'Low',
            },
            {
              title: 'DNS Record',
              description:
                'Add information about DNS Records for a website, when domain is going to expire. This may be displayed on the monitor page.',
              date: '03/05/24',
              completedDate: '',
              type: 'Low',
            },
          ],
        },
        {
          title: 'In Progress',
          tasks: [
            {
              title: 'Overhaul settings page',
              description:
                "The settings page design is decent for PC but for mobile it's pretty unusable. I'll be working on redesigning the settings page so it's a better experience for both mobile and desktop users.",
              date: '06/04/24',
              completedDate: '',
              type: 'High',
            },
            {
              title: 'Create documentation',
              description:
                'There is currently no documentation for anything in this project. Going to setup Vitepress to create documentation about features, endpoints, configuration, and much more! ',
              date: '06/04/24',
              completedDate: '',
              type: 'Medium',
            },
            {
              title: 'Implement e2e tests',
              description:
                "With some previous releases I've over looked some functionalities that were broken due to updates. End to end testing will be used to make sure core functionalities are working as intended. I'll be using Cypress as an e2e testing framework.",
              date: '29/04/24',
              completedDate: '',
              type: 'Medium',
            },
            {
              title: 'Implement unit tests',
              description:
                "Similar to end to end testing, I'll also be writing some unit tests for the server to make sure the endpoints are working as intended.",
              date: '01/05/24',
              completedDate: '',
              type: 'Low',
            },
          ],
        },
        {
          title: 'Review',
          tasks: [],
        },
      ],
    };
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
