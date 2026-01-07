/**
 * Vegan Restaurant Data
 * Mock data for Austin, TX vegan restaurants
 */

export interface VeganRestaurant {
	id: string;
	name: string;
	slug: string;
	lat: number;
	lng: number;
	address: string;
	cuisine: string;
	priceRange: '$' | '$$' | '$$$';
	rating: number;
	reviewCount: number;
	images: string[];
	features: string[];
	isNew?: boolean;
	hours: string;
	phone: string;
	website: string;
	description: string;
}

export const veganRestaurants: VeganRestaurant[] = [
	{
		id: 'vr-001',
		name: 'Counter Culture',
		slug: 'counter-culture',
		lat: 30.2672,
		lng: -97.7431,
		address: '2337 E Cesar Chavez St, Austin, TX 78702',
		cuisine: 'American',
		priceRange: '$$',
		rating: 4.8,
		reviewCount: 342,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-1.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-2.jpg'
		],
		features: ['Outdoor Seating', 'Takeout', 'Delivery'],
		isNew: false,
		hours: '11:00 AM - 10:00 PM',
		phone: '(512) 555-0101',
		website: 'https://counterculture.com',
		description:
			'Creative vegan comfort food in a trendy East Austin setting. Known for their famous burgers and loaded fries.'
	},
	{
		id: 'vr-002',
		name: 'Arlo Grey',
		slug: 'arlo-grey',
		lat: 30.2602,
		lng: -97.7506,
		address: '111 E Cesar Chavez St, Austin, TX 78701',
		cuisine: 'Italian',
		priceRange: '$$$',
		rating: 4.9,
		reviewCount: 521,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-3.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-4.jpg'
		],
		features: ['Fine Dining', 'Lake View', 'Full Bar'],
		isNew: false,
		hours: '5:00 PM - 11:00 PM',
		phone: '(512) 555-0102',
		website: 'https://arlogrey.com',
		description:
			'Upscale Italian-inspired vegan cuisine with stunning views of Lady Bird Lake. Celebrity chef driven.'
	},
	{
		id: 'vr-003',
		name: 'Bouldin Creek Cafe',
		slug: 'bouldin-creek-cafe',
		lat: 30.2489,
		lng: -97.7621,
		address: '1900 S 1st St, Austin, TX 78704',
		cuisine: 'Breakfast',
		priceRange: '$',
		rating: 4.6,
		reviewCount: 892,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-5.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-6.jpg'
		],
		features: ['Breakfast All Day', 'Pet Friendly', 'Wifi'],
		isNew: false,
		hours: '7:00 AM - 9:00 PM',
		phone: '(512) 555-0103',
		website: 'https://bouldincreek.com',
		description:
			'Austin institution serving hearty vegetarian and vegan breakfast since 2000. Cozy coffee shop vibes.'
	},
	{
		id: 'vr-004',
		name: 'The Vegan Yacht',
		slug: 'the-vegan-yacht',
		lat: 30.2955,
		lng: -97.7392,
		address: '1601 E 6th St, Austin, TX 78702',
		cuisine: 'Mexican',
		priceRange: '$',
		rating: 4.7,
		reviewCount: 445,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-7.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-8.jpg'
		],
		features: ['Food Truck', 'Tacos', 'Late Night'],
		isNew: false,
		hours: '11:00 AM - 2:00 AM',
		phone: '(512) 555-0104',
		website: 'https://veganyacht.com',
		description:
			'Legendary vegan food truck serving the best plant-based tacos in Austin. Open late for the bar crowd.'
	},
	{
		id: 'vr-005',
		name: 'Thai Fresh',
		slug: 'thai-fresh',
		lat: 30.2398,
		lng: -97.7755,
		address: '909 W Mary St, Austin, TX 78704',
		cuisine: 'Thai',
		priceRange: '$$',
		rating: 4.5,
		reviewCount: 678,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-9.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-10.jpg'
		],
		features: ['Cooking Classes', 'Market', 'Catering'],
		isNew: false,
		hours: '11:00 AM - 9:00 PM',
		phone: '(512) 555-0105',
		website: 'https://thai-fresh.com',
		description:
			'Authentic Thai cuisine with extensive vegan options. Also offers cooking classes and a specialty market.'
	},
	{
		id: 'vr-006',
		name: 'Citizen Eatery',
		slug: 'citizen-eatery',
		lat: 30.3082,
		lng: -97.7389,
		address: '5011 Burnet Rd, Austin, TX 78756',
		cuisine: 'American',
		priceRange: '$$',
		rating: 4.7,
		reviewCount: 234,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-11.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-12.jpg'
		],
		features: ['Gluten-Free Options', 'Brunch', 'Cocktails'],
		isNew: true,
		hours: '9:00 AM - 10:00 PM',
		phone: '(512) 555-0106',
		website: 'https://citizeneatery.com',
		description:
			'Modern plant-based restaurant focusing on local ingredients and creative seasonal menus.'
	},
	{
		id: 'vr-007',
		name: "Uchi (Vegan Menu)",
		slug: 'uchi-vegan',
		lat: 30.2551,
		lng: -97.7533,
		address: '801 S Lamar Blvd, Austin, TX 78704',
		cuisine: 'Japanese',
		priceRange: '$$$',
		rating: 4.9,
		reviewCount: 1203,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-13.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-14.jpg'
		],
		features: ["Omakase", "Chef's Table", 'Reservations Required'],
		isNew: false,
		hours: '5:00 PM - 10:00 PM',
		phone: '(512) 555-0107',
		website: 'https://uchirestaurants.com',
		description:
			'Award-winning Japanese restaurant with an extensive vegan omakase experience. World-class dining.'
	},
	{
		id: 'vr-008',
		name: 'Juiceland',
		slug: 'juiceland-downtown',
		lat: 30.2686,
		lng: -97.7416,
		address: '1625 E 6th St, Austin, TX 78702',
		cuisine: 'Juice Bar',
		priceRange: '$',
		rating: 4.4,
		reviewCount: 567,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-15.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-16.jpg'
		],
		features: ['Smoothie Bowls', 'Cleanses', 'Quick Service'],
		isNew: false,
		hours: '7:00 AM - 8:00 PM',
		phone: '(512) 555-0108',
		website: 'https://juiceland.com',
		description:
			'Austin-born juice and smoothie chain with creative blends and superfood bowls. Perfect post-workout fuel.'
	},
	{
		id: 'vr-009',
		name: 'Mother Clucker',
		slug: 'mother-clucker',
		lat: 30.2723,
		lng: -97.7398,
		address: '2027 E Cesar Chavez St, Austin, TX 78702',
		cuisine: 'Southern',
		priceRange: '$$',
		rating: 4.6,
		reviewCount: 289,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-17.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-18.jpg'
		],
		features: ['Fried Chicken', 'Mac & Cheese', 'Comfort Food'],
		isNew: true,
		hours: '11:00 AM - 9:00 PM',
		phone: '(512) 555-0109',
		website: 'https://motherclucker.com',
		description:
			"The best vegan fried chicken in Texas! Southern comfort classics made entirely plant-based."
	},
	{
		id: 'vr-010',
		name: 'Arlos',
		slug: 'arlos',
		lat: 30.2679,
		lng: -97.7513,
		address: '1500 Red River St, Austin, TX 78701',
		cuisine: 'American',
		priceRange: '$',
		rating: 4.8,
		reviewCount: 756,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-19.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-20.jpg'
		],
		features: ['Burgers', 'Food Truck', 'Late Night'],
		isNew: false,
		hours: '5:00 PM - 3:00 AM',
		phone: '(512) 555-0110',
		website: 'https://arlosfoodtruck.com',
		description:
			'Iconic vegan burger truck at Cheer Up Charlies. The Bac\'n Cheezy is legendary in the Austin vegan scene.'
	},
	{
		id: 'vr-011',
		name: 'Kerby Lane Cafe',
		slug: 'kerby-lane',
		lat: 30.2935,
		lng: -97.7415,
		address: '3704 Kerbey Ln, Austin, TX 78731',
		cuisine: 'Diner',
		priceRange: '$',
		rating: 4.3,
		reviewCount: 1456,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-21.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-22.jpg'
		],
		features: ['24/7', 'Pancakes', 'Family Friendly'],
		isNew: false,
		hours: 'Open 24 Hours',
		phone: '(512) 555-0111',
		website: 'https://kerbylane.com',
		description:
			'Austin landmark diner open 24/7 with excellent vegan options including their famous pancakes.'
	},
	{
		id: 'vr-012',
		name: "Sala and Betty",
		slug: 'sala-and-betty',
		lat: 30.2612,
		lng: -97.7224,
		address: '2000 E 3rd St, Austin, TX 78702',
		cuisine: 'Mediterranean',
		priceRange: '$$',
		rating: 4.7,
		reviewCount: 198,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-23.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-24.jpg'
		],
		features: ['Seasonal Menu', 'Wine Bar', 'Private Events'],
		isNew: true,
		hours: '11:00 AM - 10:00 PM',
		phone: '(512) 555-0112',
		website: 'https://salaandbetty.com',
		description:
			'Mediterranean-inspired plant-forward cuisine with a focus on fresh, seasonal ingredients.'
	},
	{
		id: 'vr-013',
		name: 'Veracruz All Natural',
		slug: 'veracruz-all-natural',
		lat: 30.2845,
		lng: -97.7221,
		address: '1704 E Cesar Chavez St, Austin, TX 78702',
		cuisine: 'Mexican',
		priceRange: '$',
		rating: 4.6,
		reviewCount: 923,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-25.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-1.jpg'
		],
		features: ['Migas Tacos', 'Breakfast', 'Food Truck'],
		isNew: false,
		hours: '7:00 AM - 3:00 PM',
		phone: '(512) 555-0113',
		website: 'https://veracruzallnatural.com',
		description:
			'Famous Austin taco trailer with excellent vegetarian options. Their migas tacos are must-try.'
	},
	{
		id: 'vr-014',
		name: 'Rebel Cheese',
		slug: 'rebel-cheese',
		lat: 30.2567,
		lng: -97.7489,
		address: '2200 S Lamar Blvd, Austin, TX 78704',
		cuisine: 'Specialty',
		priceRange: '$$',
		rating: 4.8,
		reviewCount: 312,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-27.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-28.jpg'
		],
		features: ['Artisan Cheese', 'Wine Pairing', 'Cheese Boards'],
		isNew: false,
		hours: '11:00 AM - 9:00 PM',
		phone: '(512) 555-0114',
		website: 'https://rebelcheese.com',
		description:
			'Artisan vegan cheese shop and restaurant. House-made cheeses that rival the real thing.'
	},
	{
		id: 'vr-015',
		name: 'Beet Box',
		slug: 'beet-box',
		lat: 30.2756,
		lng: -97.7325,
		address: '979 Springdale Rd, Austin, TX 78702',
		cuisine: 'Health Food',
		priceRange: '$$',
		rating: 4.5,
		reviewCount: 187,
		images: [
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-29.jpg',
			'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/restaurants/restaurant-30.jpg'
		],
		features: ['Meal Prep', 'Catering', 'Organic'],
		isNew: false,
		hours: '10:00 AM - 8:00 PM',
		phone: '(512) 555-0115',
		website: 'https://beetboxatx.com',
		description:
			'Health-focused vegan cafe with colorful, nutrient-dense meals. Perfect for the wellness-minded.'
	}
];

/**
 * Get unique cuisines from restaurant data
 */
export function getCuisines(): string[] {
	const cuisines = new Set(veganRestaurants.map((r) => r.cuisine));
	return Array.from(cuisines).sort();
}

/**
 * Get unique price ranges from restaurant data
 */
export function getPriceRanges(): ('$' | '$$' | '$$$')[] {
	return ['$', '$$', '$$$'];
}

/**
 * Get restaurant by ID
 */
export function getRestaurantById(id: string): VeganRestaurant | undefined {
	return veganRestaurants.find((r) => r.id === id);
}

/**
 * Get restaurant by slug
 */
export function getRestaurantBySlug(slug: string): VeganRestaurant | undefined {
	return veganRestaurants.find((r) => r.slug === slug);
}
