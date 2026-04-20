<script module lang="ts">

  import Taskie from '../../db/taskie';
  import type { Component } from 'svelte';

  export class Category {
    public name: string;
    public icon: string;
    public underlay: Underlay;
    public crossOut: boolean;
    public iconOnClear: string;
    public sortingFunction: Function|null;

    public taskies: Taskie[] = $state([]);
    
    constructor(
      name: string, icon: string, underlay: Underlay,
      crossOut: boolean = false, iconOnClear: string = '',
      sortingFunction: Function|null = null
    ) {
      this.name = name;
      this.icon = icon;
      this.underlay = underlay;
      this.crossOut = crossOut;
      this.iconOnClear = iconOnClear;
      this.sortingFunction = sortingFunction
    }
  }

  export class Underlay {
    public icon: Component;
    public style: string;

    constructor(icon: Component, style: string) {
      this.icon = icon;
      this.style = style;
    }
  }

</script>