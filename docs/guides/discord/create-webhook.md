---
aside: false
sidebar: false
prev:
  text: 'Guides'
  link: '/guides'
next: false
---

# Creating a Discord webhook

Discord has a [Webhooks](https://discord.com/developers/docs/resources/webhook) feature that allows you to create a webhook that can be used to send messages to a Discord channel. This is an easy way to get notifications from Lunalytics straight to your Discord server.

## How to create a webhook

::: warning
In order to create a webhook, you need to have `Manage Webhooks` permission in the server.
:::

1. Open the server settings and head to the `Integrations` tab.
2. Click on the webhooks tab, this will open a list of currently available webhooks.

![Discord Integration](/guides/Discord_Integration.webp 'Discord Integration')

3.  Click on the `New Webhook` button and this will create a new webhook for you. (You can update the name, avatar, and channel for the webhook)

4.  Click on the `Copy Webhook URL` button to copy the webhook URL.

![Discord Webhook](/guides/Discord_Webhook.webp 'Discord Webhook')

## Adding Webhook to Lunalytics

Once you have created the webhook in Discord, you will need to create a new notification in Lunalytics. This will allow you to send notifications to the webhook you just created.

1. Go to the Lunalytics home page and click the notifications icon in the left sidebar
2. Click the `New` button on the top right

![Lunalytics Create Notification](/guides/Lunalytics_Create_Notification.webp 'Lunalytics Create Notification')

3. Paste the webhook URL you previous copied into the `Webhook URL` field
4. Input any extra information you want to send to the webhook
5. Click the `Create` button

![Lunalytics Discord Create Notification](/guides/Lunalytics_Discord_Create_Notification.webp 'Lunalytics Discord Create Notification')

## Adding a Webhook to a monitor

Once you've created a notification, you can add the notification to a monitor. This will automatically send notifications using the webhook to the channel you specified in the Discord webhook about when the monitor has any outages and recovers from outages.

1. Go to the Lunalytics homepage, and click the `New` button on the top right (Or edit an existing monitor)

![Lunalytics Create Monitor](/guides/Lunalytics_Create_Monitor.webp 'Lunalytics Create Monitor')

2. In this modal enter the information about your monitor, and then click the `Advanced Settings` button
3. Here click on the dropdown for the `Notifications` field and select the notification you just created
4. Update any extra information you want to add for the monitor
5. Click the `Create` button

![Lunalytics Add Monitor Notification](/guides/Lunalytics_Add_Monitor_Notification.webp 'Lunalytics Add Monitor Notification')
