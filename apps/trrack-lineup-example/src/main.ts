import './app/app.element.ts';

import { setup } from './app/lineup-setup';

const lineupRootSelector = 'lineup-root';
const node1 = document.getElementById(`${lineupRootSelector}-1`);
const node2 = document.getElementById(`${lineupRootSelector}-2`);

if (node1 && node2) {
  setup([node1, node2]);
} else {
  document.body.innerHTML = 'Something went wrong';
}
