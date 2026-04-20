<script module lang="ts">

  import { get } from 'svelte/store';
  import { m } from '../../paraglide/messages';
  import { mobile } from './CapacitorStore.svelte';
  import { LocalNotifications, type PendingResult } from '@capacitor/local-notifications';
  import { dailyNotifications, dailyTime, persistentNotifications } from './SettingsStore.svelte';


  // Gets all notification messages by matching regex
  // https://stackoverflow.com/questions/44282777/using-regex-when-searching-in-the-object-key-values-in-javascript
  const dailyNotificationMessages: string[] = Object.keys(m).filter(key => /^dailyNotification\d+$/.test(key));

  
  class DailyMessages {
    static getRandom(): string {
      const random: string = dailyNotificationMessages[
        Math.floor(Math.random() * dailyNotificationMessages.length)
      ];

      // Kinda ugly but it's peak typescript
      return m[random as keyof typeof m]();
    }    
  }

  // Schedule notification if it's on but not scheduled
  export async function scheduleDailyNotificationOnStart() {
    if (get(mobile) && get(dailyNotifications).current) {
      let flag: boolean = true;
      const pending: PendingResult = await LocalNotifications.getPending();
      pending.notifications.forEach(el => { if (el.id == 1) { flag = false; } });
      if (flag) { scheduleDailyNotification(); }
    }
  }

  export async function cancelDailyNotification() {
    await LocalNotifications.cancel({
      notifications: [{ id: 1 }],
    });
  }

  export async function scheduleDailyNotification() {
    if (get(mobile) && get(dailyNotifications).current) {
      // Request notification permissions
      await LocalNotifications.requestPermissions();

      // Schedule
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: '',
            body: `${DailyMessages.getRandom()}`,
            ongoing: get(persistentNotifications).current,
            schedule: {
              on: get(dailyTime).toScheduleTime(),
            }
          }
        ]
      });
    }
  }
  
</script>