<script module lang="ts">

  // https://vite.dev/guide/features#custom-queries
  const STICKERS_GLOB: Record<string, string> = 
    import.meta.glob('@assets/yrellis/stickers/*', {query: '?url', import: 'default', eager: true});
  const EMOTES_GLOB: Record<string, string> = 
    import.meta.glob('@assets/yrellis/emotes/*', {query: '?url', import: 'default', eager: true});

  // Paths
  const STICKERS_PATH: string = '/src/assets/yrellis/stickers/';
  const EMOTES_PATH: string = '/src/assets/yrellis/emotes/';

  export class YrellisImage {
    public name: string;
    public fullName: string;
    public extension: string;
    public path: string;

    constructor(globPath: string, realPath: string) {
      const [fullName, extension]: string[] = removePrefix(
        globPath, [STICKERS_PATH, EMOTES_PATH]
      ).split('.');

      this.path = realPath;
      this.fullName = fullName;
      this.extension = extension;
      this.name = fullName.toLowerCase();
    }
  }
  export class YrellisCombined {
    public sticker: YrellisImage;
    public emote: YrellisImage;

    constructor(sticker: YrellisImage, emote: YrellisImage) {
      this.sticker = sticker;
      this.emote = emote;
    }
  }

  // Map properly
  const STICKERS: Map<string, YrellisImage> = reduce(STICKERS_GLOB);
  const EMOTES: Map<string, YrellisImage> = reduce(EMOTES_GLOB);
  const INTERSECTION: Map<string, YrellisCombined> = intersect(); // Just in case
  
  function reduce(glob: Record<string, string>): Map<string, YrellisImage> {
    let result: Map<string, YrellisImage> = new Map();

    Object.entries(glob).forEach(([k, v]) => {
      let image: YrellisImage = new YrellisImage(k, v);
      result.set(image.name, image);
    });

    return result;
  }
  function intersect(): Map<string, YrellisCombined> {
    let result: Map<string, YrellisCombined> = new Map();

    EMOTES.forEach((k) => {
      const value: YrellisImage = EMOTES.get(k.name)!;
      const image: YrellisImage|undefined = STICKERS.get(k.name);
      if (image) { result.set(k.name, new YrellisCombined(image, value)); }
    });

    return result;
  }
  function removePrefix(str: string, prefix: string[]): string {
    prefix.forEach(p => {
      str = str.startsWith(p) ? str.slice(p.length) : str;
    });
    return str;
  }

  // Handy exports
  export class Stickers {
    public static get(name: string) {
      return STICKERS.get(name.toLowerCase());
    }
  }
  export class Emotes {
    public static get(name: string) {
      return EMOTES.get(name.toLowerCase());
    }
  }
  export class YrellisIntersection {
    public static get(name: string) {
      return INTERSECTION.get(name.toLowerCase());
    }

    public static get all(): Map<string, YrellisCombined> {
      return INTERSECTION;
    }
  }
  
</script>