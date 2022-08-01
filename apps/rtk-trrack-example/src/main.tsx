import { TrrackSliceState } from '@trrack/redux';
import { createContext, StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createSelectorHook, Provider } from 'react-redux';

import App from './app/App';
import { store, trrackStore } from './app/store/store';

const trrackContext = createContext<TrrackSliceState>(undefined!);
export const useTrrackSelector = createSelectorHook(trrackContext as any);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Provider store={trrackStore} context={trrackContext as any}>
      <Provider store={store}>
        <App />
      </Provider>
    </Provider>
  </StrictMode>
);
