/// <reference types='svelte' />
/// <reference types='vite/client' />
/// <reference types='unplugin-icons/types/svelte' />

declare module '*/themes.toml' {
  const value: {
    light: string[];
    dark:  string[];
  }
  export default value;
}