import './app/app.element.ts';

import { LINEUP_NODE } from './app/app.element';
import { setup } from './app/lineup-setup';

const node = LINEUP_NODE();

if (node) {
  setup(node);
} else {
  document.body.innerHTML = 'Something went wrong';
}
