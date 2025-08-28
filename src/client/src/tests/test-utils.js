import { render } from '@testing-library/react';
import { Provider } from '@/components/ui/provider';
import { BrowserRouter as Router } from 'react-router-dom';

const AllTheProviders = ({ children }) => {
  return (
    <Provider>
      <Router>{children}</Router>
    </Provider>
  );
};

const customRender = (ui, { ...options } = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
