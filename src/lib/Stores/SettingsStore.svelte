<script module lang="ts">

  import * as themesToml from '../../styles/themes.toml';
  
  import { PersistedState } from 'runed';
  import { get, writable, type Writable } from 'svelte/store';
  import type { WritablePersisted } from '../Utils/Types.svelte';
  import { locales, setLocale, type Locale } from '../../paraglide/runtime';
  import { cancelDailyNotification, scheduleDailyNotification } from './NotificationStore.svelte';
  import { YrellisImage, YrellisIntersection, type YrellisCombined } from '../Utils/Yrellis.svelte';


  class TimeInputValue {
    public value: PersistedState<string>;

    constructor(name: string, value: string) {
      this.value = new PersistedState<string>(name, value);
    }

    public toScheduleTime(): HourMinuteTime {
      const split: string[] = this.value.current.split(':');
      const hours: number = Number(split[0]);
      const minutes: number = Number(split[1]);
      return new HourMinuteTime(hours, minutes);
    }
  }

  export class HourMinuteTime {
    hour: number;
    minute: number;

    constructor(hour: number, minute: number) {
      this.hour = hour;
      this.minute = minute;
    }
  }

  export class Themes {
    public light: string[];
    public dark: string[];
    
    constructor(light: string[], dark: string[]) {
      this.light = light;
      this.dark = dark;
    }
  }

  export class YrellisIcon {
    private iconValue: YrellisCombined;
    private state: PersistedState<string>;

    constructor(name: string, value: string) {
      this.state = new PersistedState<string>(name, value);
      this.iconValue = YrellisIntersection.get(this.state.current)!;
    }

    public set icon(name: string) {
      this.state.current = name;
      this.iconValue = YrellisIntersection.get(name)!;
    }
    public get icon(): YrellisCombined {
      return this.iconValue;
    }
    public get emote(): YrellisImage {
      return this.iconValue.emote;
    }
    public get sticker(): YrellisImage {
      return this.iconValue.sticker;
    }
  }


  // Language stuff
  const displayNames = new Intl.DisplayNames(locales, { type: 'language' });
  export const languageTags: string[] = locales.map(tag => tag);
  export const languageNames: string[] = locales.map(tag => displayNames.of(tag)!);
  export const reverseLanguageTags: Map<string, number> = new Map([...languageTags.entries()].map(([k, v]) => [v, k]));

  // Theming
  export const themes: Themes = new Themes(themesToml.default.light, themesToml.default.dark);

  // Writables
  export const appLanguage: WritablePersisted<string> = writable<PersistedState<string>>(new PersistedState<string>('AppLanguage', 'en'));
  export const resetTime: Writable<TimeInputValue> = writable<TimeInputValue>(new TimeInputValue('ResetTime', '03:00'));
  export const lastResetDate: WritablePersisted<string> = writable<PersistedState<string>>(new PersistedState<string>('LastResetDate', new Date().toISOString()));
  export const dailyNotifications: WritablePersisted<boolean> = writable<PersistedState<boolean>>(new PersistedState<boolean>('DailyNotifications', true));
  export const persistentNotifications: Writable<PersistedState<boolean>> = writable<PersistedState<boolean>>(new PersistedState<boolean>('PersistentNotification', false));
  export const dailyTime: Writable<TimeInputValue> = writable<TimeInputValue>(new TimeInputValue('DailyTime', '11:00'));
  export const yrellisTodoIcon: Writable<YrellisIcon> = writable<YrellisIcon>(new YrellisIcon('YrellisTodoIcon', 'YrellisBlush'));
  export const yrellisDoneIcon: Writable<YrellisIcon> = writable<YrellisIcon>(new YrellisIcon('YrellisDoneIcon', 'YrellisYay'));
  export const isLightTheme: WritablePersisted<boolean> = writable<PersistedState<boolean>>(new PersistedState('IsLightTheme', false));
  export const currentDarkTheme: WritablePersisted<string> = writable<PersistedState<string>>(new PersistedState('DarkThemeName', 'catppuccin'));
  export const currentLightTheme: WritablePersisted<string> = writable<PersistedState<string>>(new PersistedState('LightThemeName', 'latte'));
  export const taskieCheckHaptics: WritablePersisted<boolean> = writable<PersistedState<boolean>>(new PersistedState('TaskieCheckHaptics', false));
  export const taskieIncreaseHaptics: WritablePersisted<boolean> = writable<PersistedState<boolean>>(new PersistedState('TaskieIncreaseHaptics', true));


  export function getFullAppLanguage(): string {
    return languageNames[reverseLanguageTags.get(get(appLanguage).current) as number];
  }


  appLanguage.subscribe(() => {
    const tag: string = get(appLanguage).current;
    document.documentElement.lang = tag; // Update the html tag
    setLocale(tag as Locale); // Update the paraglide
    
    scheduleDailyNotification(); // Re-schedule daily so that it's in a new language
  });

  isLightTheme.subscribe(() => {
    const value: boolean =  get(isLightTheme).current;
    const mode: string = value ? 'light' : 'dark';
    const theme: string = value ? get(currentLightTheme).current : get(currentDarkTheme).current;
    document.documentElement.setAttribute('data-mode', mode);
    document.documentElement.setAttribute('data-theme', theme);
  });
  currentDarkTheme.subscribe(() => {
    if (!get(isLightTheme).current) {
      const theme: string = get(currentDarkTheme).current;
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
  currentLightTheme.subscribe(() => {
    if (get(isLightTheme).current) {
      const theme: string = get(currentLightTheme).current;
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
  
  dailyNotifications.subscribe(async () => {
    if (get(dailyNotifications).current) {
      scheduleDailyNotification();
    } else {
      cancelDailyNotification();
    }
  });
  // Reset scheduled time on update
  dailyTime.subscribe(async () => {
    await scheduleDailyNotification();
  });
  // Reset scheduled notification type on update
  persistentNotifications.subscribe(async () => {
    await scheduleDailyNotification();
  });

</script>