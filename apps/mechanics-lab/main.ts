import { Runner } from '@ascean/core';
import { mount } from '../shared/view';
mount(document.querySelector<HTMLElement>('#app')!, new Runner(), 'Mechanics Lab');
