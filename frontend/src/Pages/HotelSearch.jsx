// Importing necessary libraries and components
import {
	ExternalLink,
	LucideMessageSquareWarning,
	MapPin,
	Star,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { locations, placesToVisit } from '../Data/Locations.jsx';
import DestinationInput from '../Components/Common/Inputs/DestinationInput';
import TravelersInput from '../Components/Common/Inputs/TravelerInput';
import DateRangePicker from '../Components/Common/Date Picker/DateRangePicker';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import HotelList from '../Components/Common/HotelList';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

function HotelSearch() {
	const location = useLocation();
	const { currentUser } = useSelector((state) => state.user);

	// State variables
	const [error, setError] = useState(null);
	const [errors, setErrors] = useState({ origin: '', destination: '' });
	const [triggerSearch, setTriggerSearch] = useState(false);
	const [formData, setFormData] = useState({
		destination: '',
		departureDate: dayjs().format('YYYY-MM-DD'),
		returnDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
		adults: 1,
		rooms: 1,
	});

	// TanStack Query mutation for hotel search
	const searchHotelsMutation = useMutation({
		mutationFn: async (payload) => {
			const response = await axios.post('/api/flight/search-hotels', payload);
			return response.data;
		},
		onMutate: () => setError(null),
		onError: (error) => {
			const errorMessage =
				error.response?.data?.message ||
				'Failed to fetch hotels. Please try again.';
			setError(errorMessage);
		},
	});

	useEffect(() => {
		if (location.state) {
			setFormData({
				destination: location.state.destination,
				departureDate: location.state.departureDate,
				returnDate: location.state.returnDate,
				adults: location.state.adults,
				rooms: location.state.rooms,
			});
			setTriggerSearch(true);
		}
	}, [location.state]);

	useEffect(() => {
		if (triggerSearch && formData.destination) {
			handleSubmit();
			setTriggerSearch(false);
		}
	}, [triggerSearch]);

	const handleDateChange = ([startDate, endDate]) => {
		setFormData((prev) => ({
			...prev,
			departureDate: startDate.format('YYYY-MM-DD'),
			returnDate: endDate.format('YYYY-MM-DD'),
		}));
	};

	const handleSubmit = (e) => {
		e?.preventDefault();

		// Validation
		let hasError = false;
		const newErrors = { destination: '' };

		if (!formData.destination) {
			newErrors.destination = 'Please select a destination.';
			hasError = true;
		}

		if (hasError) {
			setErrors(newErrors);
			return;
		}

		// Prepare payload
		const payload = {
			userId: currentUser._id,
			destination: formData.destination,
			checkInDate: formData.departureDate,
			checkOutDate: formData.returnDate,
			adults: parseInt(formData.adults, 10),
			rooms: parseInt(formData.rooms, 10),
		};

		// Trigger search mutation
		searchHotelsMutation.mutate(payload);
	};

	const formatTime = (date) =>
		new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		}).format(new Date(date));

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.5, ease: 'easeInOut' }}
			className='flex flex-col gap-5 px-4 sm:px-6 lg:px-20 pt-28 md:pt-36 pb-10 bg-white'>
			<div>
				<form
					onSubmit={handleSubmit}
					className='xl:flex xl:gap-3 xl:justify-between grid gap-4 md:gap-6 md:grid-cols-3 items-center'>
					<div className='relative flex-1'>
						<DestinationInput
							formData={formData}
							setFormData={setFormData}
							locations={locations}
						/>
						{errors.destination && (
							<p className='text-red-500 text-[0.7rem] absolute mt-1'>
								{errors.destination}
							</p>
						)}
					</div>

					<DateRangePicker
						onDateChange={handleDateChange}
						defaultDates={[
							dayjs(formData.departureDate),
							dayjs(formData.returnDate),
						]}
					/>

					<TravelersInput
						formData={formData}
						setFormData={setFormData}
					/>

					<button
						type='submit'
						className='bg-[#48aadf] rounded-full font-semibold text-white cursor-pointer px-8 py-3 h-fit w-fit self-center'>
						Search
					</button>
				</form>

				<Tabs
					defaultValue='hotels'
					className='mt-10'>
					<TabsList className='w-full'>
						<TabsTrigger
							value='hotels'
							className='text-2xl'>
							Hotels
						</TabsTrigger>
						<TabsTrigger
							value='packages'
							className='text-2xl'>
							Packages
						</TabsTrigger>
					</TabsList>

					<TabsContent value='hotels'>
						<div>
							{searchHotelsMutation.isLoading ? (
								<div className='min-h-64 w-full flex items-center justify-center'>
									<BounceLoader color='#48aadf' />
								</div>
							) : error ? (
								<motion.div
									initial={{ opacity: 0, y: -50 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -50 }}
									transition={{ duration: 0.5, ease: 'easeInOut' }}
									className='flex flex-col gap-5 items-center font-semibold min-h-64 w-full justify-center'>
									<div className='flex flex-col gap items-center'>
										<LucideMessageSquareWarning />
										<p className='text-lg'>{error}</p>
										<p className='font-normal font-sans'>
											Please try again later
										</p>
									</div>
								</motion.div>
							) : (
								<HotelList
									hotels={searchHotelsMutation.data}
									formatTime={formatTime}
								/>
							)}
						</div>
					</TabsContent>
					<TabsContent value='packages'>
						<div className='container mx-auto p-4'>
							<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
								{placesToVisit
									.find((place) => place.city === formData.destination)
									?.placesToVisit.map((place) => {
										return (
											<Card
												key={place.name}
												className='overflow-hidden'>
                                                <div className='relative h-1/2'>
													<img
														src={place.image || '/placeholder.svg'}
														alt={place.name}
														className='h-full w-full object-cover'
													/>
												</div>
												<CardHeader>
													<CardTitle className='flex items-start justify-between'>
														<span>{place.name}</span>
														<div className='flex items-center gap-1 text-yellow-500'>
															<Star className='h-4 w-4 fill-current' />
															<span className='text-sm'>{place.rating}</span>
														</div>
													</CardTitle>
												</CardHeader>
												<CardContent>
													<p className='text-sm text-muted-foreground line-clamp-3'>
														{place.description}
													</p>
													<div className='mt-4 flex items-center gap-2 text-sm text-muted-foreground'>
														<MapPin className='h-4 w-4' />
														<span>
															{place.coordinates.latitude},{' '}
															{place.coordinates.longitude}
														</span>
													</div>
												</CardContent>
												<CardFooter className='w-fit h-fit'>
													<a
														href={place.website}
														target='_blank'
														rel='noopener noreferrer'
														className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline'>
														Visit Website
														<ExternalLink className='h-4 w-4' />
													</a>
												</CardFooter>
											</Card>
										);
									})}
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</motion.div>
	);
}

export default HotelSearch;
