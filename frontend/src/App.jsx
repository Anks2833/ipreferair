import { HashRouter as Router, useLocation } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Help from './components/Help';
import ScrollToTop from './components/ScrollToTop';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const BackendUrl = "https://ipreferstay.onrender.com";

const App = () => {
	const location = useLocation();

	// Define paths where you want to hide the Navbar and Footer
	const noHeaderFooterPaths = ['/signin', '/signup'];

	// Check if the current path is in the list of paths to hide Navbar and Footer
	const isNavbarVisible = !noHeaderFooterPaths.includes(location.pathname);

	return (
		<>
			{/* Render Navbar only on specified routes */}
			{isNavbarVisible && <Navbar />}

			<ScrollToTop />

			<AnimatedRoutes />

			{/* Render Footer only when it's visible */}
			{isNavbarVisible && <Footer />}
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</>
	);
};

// Wrap App in Router to allow useLocation to work
const AppWithRouter = () => (
	<Router>
		<Help />
		<App />
	</Router>
);

export default AppWithRouter;
