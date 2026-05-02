<script module lang="ts">

  // https://stackoverflow.com/questions/4455282/call-a-javascript-function-at-a-specific-time-of-day

  
  import { db } from '../../db/db';
  import { get } from 'svelte/store';
  import type Taskie from '../../db/taskie';
  import { getMonth, getWeek } from 'date-fns';
  import { lastResetDate, resetTime, type HourMinuteTime } from './SettingsStore.svelte';

  
  // Reset the timer on reset time update
  resetTime.subscribe(() => { startResetTimer(); });


  export class ResetDate {
    // Time here is a verb :>
    private static timeDate(time: HourMinuteTime, date: Date = new Date()) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(), 
        time.hour,
        time.minute,
        0, 0
      );
    }

    static future(time: HourMinuteTime): Date {
      return ResetDate.timeDate(time);
    }

    static tomorrow(time: HourMinuteTime): Date {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return ResetDate.timeDate(time, tomorrow);
    }
  }
  

  let timerId: number|null = null;


  // Resets taskies of a specific folder
  async function resetState(folderId: number) {
    const array: Taskie[] = await db.taskies
      .where('folderId').equals(folderId)
      .and(
        (t) => (t.state > 0) || (t.repeatCounter > 0)
      ).toArray();

    array.forEach(t => {
      t.resetState();
      t.resetRepeatCounter();
    });
  }

  function reset() {
    const now: Date = new Date(); // Date now
    const resetDate: Date = new Date(get(lastResetDate).current);

    // Day passed
    resetState(1);

    // Week passed
    // TODO: make weekStartsOn a setting
    const nowWeek: number = getWeek(now, {weekStartsOn: 1}); 
    const resetWeek: number = getWeek(resetDate, {weekStartsOn: 1});
    if (nowWeek > resetWeek) { resetState(2); }

    // Month passed
    const nowMonth: number = getMonth(now); 
    const resetMonth: number = getMonth(resetDate);
    if (nowMonth > resetMonth) { resetState(3); }

    get(lastResetDate).current = now.toISOString(); // Set to now
  }

  function timer(nextResetDate: Date) {
    if (new Date().getTime() >= nextResetDate.getTime()) { reset(); startResetTimer(); }
    else { timerId = window.setTimeout(() => {timer(nextResetDate)}, 5000); } /* Every 5 seconds should be fine */
  }
  
  export function startResetTimer() {
    if (timerId != null) { clearTimeout(timerId); } // Just in case

    const resetDate: Date = new Date(get(lastResetDate).current);
    const time: HourMinuteTime = get(resetTime).toScheduleTime();
    
    const now: Date = new Date(); // Date now
    const potentialFuture: Date = ResetDate.future(time); // Might've actually already happened today
    const futureFlag: boolean = potentialFuture.getTime() > now.getTime(); // Indicates that it didn't happen yet

    // Check if it should have happened already today
    if (!futureFlag) {
      // Check if last recorded reset was before the actual latest one
      const resetFlag: boolean = resetDate.getTime() <= potentialFuture.getTime();
      if (resetFlag) { reset(); }
    }

    // Check if it actually is future and set to tomorrow if not
    timer(futureFlag ? potentialFuture : ResetDate.tomorrow(time));
  }

</script>