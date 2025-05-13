import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx';
import ThemeProvider from './components/ThemeProvider.jsx';
import './index.css';
import { persistor, store } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<PersistGate persistor={persistor}>
			{/* Provider component makes the Redux store available to all components */}
			<Provider store={store}>
				{/* ThemeProvider is used to provide global theme settings to the app */}
				<ThemeProvider>
					{/* App is the root component of the application */}
					<QueryClientProvider client={queryClient}>
						<App />
					</QueryClientProvider>
				</ThemeProvider>
			</Provider>
		</PersistGate>
	</StrictMode>
);
