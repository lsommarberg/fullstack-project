import { render } from '@testing-library/react';
import { Provider } from '@/components/ui/provider';
import { BrowserRouter as Router } from 'react-router-dom';

const customRender = (ui, { ...options } = {}) =>
  render(
    <Provider>
      <Router>{ui}</Router>
    </Provider>,
    options,
  );

export * from '@testing-library/react';
export { customRender as render };
