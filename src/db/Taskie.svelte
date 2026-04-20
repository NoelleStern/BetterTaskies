<script module lang="ts">

  // It's rune reactive so that live-editing is a breeze


  import type Taskie from './taskie';


  export class TaskieEditData {
    title: string;
    description: string;
    descriptionText: string = $state('');
    repeatAmount: number;

    constructor(
      title: string = '',
      description: string = '',
      repeatAmount: number = 0
    ) {
      this.title = $state(title);
      this.description = $state(description);
      this.repeatAmount = $state(repeatAmount);
    }

    // User-viewable variable
    get userRepeatAmount(): number {
      return this.repeatAmount+1;
    }
    set userRepeatAmount(value: number) {
      this.repeatAmount = value-1;
    }

    static fromTaskie(t: Taskie): TaskieEditData {
      return new TaskieEditData(
        t.title,
        t.description,
        t.repeatAmount
      );
    }
  }

</script>