<!--
  Type: Low, Medium, High, Bug, Design, Complete
-->

<template>
  <div
    style="
      text-align: center;
      font-size: 3.5em;
      margin: 2.5rem 0px;
      font-weight: 700;
      line-height: 3.5rem;
    "
  >
    Lunalytics Guides
  </div>
  <div id="guide" class="guide">
    <div class="guide-list">
      <a
        v-for="guide in guides"
        :key="guide.title"
        :href="guide.url"
        class="guide-post"
      >
        <div class="guide-post-image">
          <img :src="guide.image" />
        </div>
        <div class="guide-post-content">
          <div class="guide-post-title">{{ guide.title }}</div>
          <div class="guide-post-subtitle">
            {{ guide.description }}
          </div>
        </div>
        <div class="guide-post-author">
          <div>{{ guide.author }}</div>
          <div>•</div>
          <div>{{ guide.date }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Guide',
  data() {
    return {
      guides: [
        {
          image: '/guides/Discord_Webhook.webp',
          url: '/guides/discord/create-webhook',
          title: 'How to create Discord webhook',
          description:
            'A really cool subtitle goes right here and explains what this post is about. You can also add some extra information here. But the maximum length will be limited to 4 lines and no more than that.',
          author: 'KSJaay',
          date: '16/10/2024',
        },
        {
          image: '/guides/Discord_Integration.webp',
          url: '/guides/slack/create-webhook',
          title: 'How to create a Slack webhook',
          description:
            'A really cool subtitle goes right here and explains what this post is about. You can also add some extra information here. But the maximum length will be limited to 4 lines and no more than that.',
          author: 'KSJaay',
          date: '16/10/2024',
        },
        {
          image: '/guides/Lunalytics_Add_Monitor_Notification.webp',
          url: '/guides/telegram/create-bot',
          title: 'How to create Telegram bot',
          description:
            'A really cool subtitle goes right here and explains what this post is about. You can also add some extra information here. But the maximum length will be limited to 4 lines and no more than that.',
          author: 'KSJaay',
          date: '16/10/2024',
        },
        {
          image: '/guides/Lunalytics_Create_Monitor.webp',
          url: '/guides/telegram/find-chat-id',
          title: 'How to find chat ID in Telegram',
          description:
            'A really cool subtitle goes right here and explains what this post is about. You can also add some extra information here. But the maximum length will be limited to 4 lines and no more than that.',
          author: 'KSJaay',
          date: '16/10/2024',
        },
        {
          image: '/guides/Lunalytics_Create_Notification.webp',
          url: '/guides/webhook/services',
          title: 'Setting up webhooks using different services',
          description:
            'A really cool subtitle goes right here and explains what this post is about. You can also add some extra information here. But the maximum length will be limited to 4 lines and no more than that.',
          author: 'KSJaay',
          date: '16/10/2024',
        },
      ],
    };
  },
};
</script>

<style scoped>
.guide {
  max-width: calc(var(--vp-layout-max-width) - 64px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.guide-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 32px;
}

.guide-post {
  display: flex;
  flex-direction: column;

  width: 325px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.guide-post-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-post-image > img {
  width: 100%;
  height: 168px;
}

.guide-post-content {
  font-size: 1.2rem;
  padding: 0 1rem;
  flex: 1;
}

.guide-post-title {
  margin: 0.5rem 0;
  font-weight: 600;
}

.guide-post-subtitle {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  /* Max lines 4 */
  display: -webkit-box;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 100px;
  height: 100px;
}

.guide-post-author {
  display: flex;
  padding: 0 1rem;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}
</style>
