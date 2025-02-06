import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useFetchSearchHotels = () => {
	const { currentUser } = useSelector((state) => state.user);
	// can be null | 'loading' | 'error' | 'success'
	const [fetchState, setFetchState] = useState(null);
	const [error, setError] = useState({
		isError: fetchState === 'error',
		message: '',
	});

	const fetchSearchHotels = async ({ formData }, { callbacks }) => {
		setFetchState('loading');
		try {
			const response = await axios.post(
				'/api/flight/search-hotels',
				{
					userId: currentUser._id, // Send user ID from Redux store
					destination: formData.destination, // IATA code or city name
					checkInDate: formData.departureDate,
					checkOutDate: formData.returnDate,
					adults: parseInt(formData.adults, 10),
					rooms: parseInt(formData.rooms, 10),
				},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			);

			setFetchState('success');

			if (callbacks?.onSuccess) callbacks.onSuccess;
		} catch (error) {
			setFetchState('error');
			setError({
				isError: true,
				message: error?.message || 'Some Error Occurred',
			});
			if (callbacks?.onError) callbacks.onError();
		}
	};

	return { fetchState, fetchSearchHotels };
};

export default useFetchSearchHotels;
