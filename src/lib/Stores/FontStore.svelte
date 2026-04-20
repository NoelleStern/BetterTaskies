<script module lang="ts">

  import { PersistedState } from 'runed';
  import { get, writable } from 'svelte/store';
  import type { WritablePersisted } from '../Utils/Types.svelte';


  export type Fonts = 'main' | 'emoji';
  export type FontFaces = 'CustomEmojiFont';
  export const customEmojiFont: WritablePersisted<boolean> = writable<PersistedState<boolean>>(new PersistedState('CustomEmojiFont', false));
  const fontFamilies: string = 'Nunito, CustomEmojiFont';


  export async function loadFonts(): Promise<void> {
    document.body.style.fontFamily = fontFamilies; // Init font families

    // Load emoji font
    if (!get(customEmojiFont).current) { return; }
    const font: ArrayBuffer|undefined = await loadFontOPFS('emoji');
    if (!font) { return; }
    await loadFontFile('CustomEmojiFont', font);
  }

  async function loadFontFile(fontFaceName: string, input: Blob|ArrayBuffer): Promise<void> {
    let myFont: FontFace;

    if (input instanceof File || input instanceof Blob) { 
      myFont = new FontFace(fontFaceName, await input.arrayBuffer()); 
    } else if (input instanceof ArrayBuffer) {
      myFont = new FontFace(fontFaceName, input);
    } else {
      console.log('Font type error');
      return;
    }

    const loadedFont = await myFont.load();
    document.fonts.add(loadedFont);
    document.body.style.fontFamily = fontFamilies; // Doesn't work on mobile without that line
  }
  async function saveFont(fontName: Fonts, file: File): Promise<void> {
    await saveFontOPFS(fontName, file);
  }
  async function removeFont(fontName: Fonts, fontFaceName: FontFaces): Promise<void> {
    // Remove from memory
    removeFontOPFS(fontName);

    // Remove from CSS
    document.fonts.forEach((fontFace) => {
      if (fontFace.family == fontFaceName) {
        document.fonts.delete(fontFace);
      }
    });
  }
  export async function changeEmojiFont(file: File) {
    await saveFont('emoji', file);
    await loadFontFile('CustomEmojiFont', file);
    get(customEmojiFont).current = true;
  }
  export async function removeEmojiFont() {
    await removeFont('emoji', 'CustomEmojiFont');
    get(customEmojiFont).current = false;
  }


  // OPFS operations, it's quite sexy
  // The compatibility of the API commands I use should be pretty widespread:
  //    StorageManager: getDirectory / https://caniuse.com/?search=StorageManager%3A%20getDirectory
  //    FileSystemDirectoryHandle API: getFileHandle / https://caniuse.com/?search=FileSystemDirectoryHandle%20API%3A%20getFileHandle
  //    FileSystemFileHandle: createWritable / https://caniuse.com/?search=FileSystemFileHandle%3A%20createWritable
  async function saveFontOPFS(fontName: Fonts, file: File): Promise<void> {
    const root: FileSystemDirectoryHandle = await navigator.storage.getDirectory();
    const fontFile: FileSystemFileHandle = await root.getFileHandle(`${fontName}-font.generic`, { create: true });
    const writable: FileSystemWritableFileStream = await fontFile.createWritable();

    await writable.write(file);
    await writable.close();
  }
  async function loadFontOPFS(fontName: Fonts): Promise<ArrayBuffer|undefined> {
    const root: FileSystemDirectoryHandle = await navigator.storage.getDirectory();

    try {
      const fontFile = await root.getFileHandle(`${fontName}-font.generic`);
      const file: File = await fontFile.getFile();
      return await file.arrayBuffer();
    } catch (err) { console.log(err); } /*TODO: handle*/
  }
  async function removeFontOPFS(fontName: Fonts): Promise<void> {
    const root: FileSystemDirectoryHandle = await navigator.storage.getDirectory();
    await root.removeEntry(`${fontName}-font.generic`);
  }

  // async function saveFontNative(fontName: Fonts, file: File): Promise<void> {
  //   await Filesystem.writeFile({
  //     data: file,
  //     path: `fonts/${fontName}-font.generic`,
  //     directory: Directory.Data
  //   });
  // }
  // async function loadFontNative(fontName: Fonts): Promise<string> {
  //   const result = await Filesystem.readFile({
  //     path: `fonts/${fontName}-font.generic`,
  //     directory: Directory.Data
  //   });

  //   // Convert base64 to a FontFace
  //   // Blob only returns on web and this function isn't intended for web
  //   return `url(data:font/ttf;base64,${result.data})`;
  // }
  // async function removeFontNative(fontName: Fonts): Promise<void> {
  //   await Filesystem.deleteFile({
  //     path: `fonts/${fontName}-font.generic`,
  //     directory: Directory.Data
  //   });
  // }

</script>


<!-- <style>
  :global {
    html {
      font-family: 'Nunito, CustomEmojiFont';
    }
  }
</style> -->