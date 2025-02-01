import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx';
import ThemeProvider from './Components/ThemeProvider';
import './index.css';
import { persistor, store } from './redux/store';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<PersistGate persistor={persistor}>
			{/* Provider component makes the Redux store available to all components */}
			<Provider store={store}>
				{/* ThemeProvider is used to provide global theme settings to the app */}
				<ThemeProvider>
					{/* App is the root component of the application */}
					<App />
				</ThemeProvider>
			</Provider>
		</PersistGate>
	</StrictMode>
);
