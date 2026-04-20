import './styles/app.css';
import './styles/app.scss';
import App from './App.svelte';
import { mount } from 'svelte';


// Mount the rest of the app
const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;