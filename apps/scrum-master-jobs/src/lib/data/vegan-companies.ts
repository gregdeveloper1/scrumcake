/**
 * Vegan Companies Data
 * ====================
 *
 * Mock data for 50 vegan/plant-based companies
 * Used for the data table demonstration
 */

export interface VeganCompany {
	id: string;
	name: string;
	category: 'Food & Beverage' | 'Fashion' | 'Beauty' | 'Tech' | 'Lifestyle' | 'Health';
	founded: number;
	headquarters: string;
	employees: string;
	revenue: string;
	description: string;
	website: string;
	certifications: string[];
	status: 'Active' | 'Acquired' | 'IPO';
}

export const veganCompanies: VeganCompany[] = [
	{
		id: '1',
		name: 'Beyond Meat',
		category: 'Food & Beverage',
		founded: 2009,
		headquarters: 'El Segundo, CA',
		employees: '1,000+',
		revenue: '$400M+',
		description: 'Plant-based meat products including burgers, sausages, and ground meat.',
		website: 'beyondmeat.com',
		certifications: ['Non-GMO', 'Kosher', 'No Soy'],
		status: 'IPO'
	},
	{
		id: '2',
		name: 'Impossible Foods',
		category: 'Food & Beverage',
		founded: 2011,
		headquarters: 'Redwood City, CA',
		employees: '700+',
		revenue: '$500M+',
		description: 'Plant-based meat using heme protein for authentic meat taste.',
		website: 'impossiblefoods.com',
		certifications: ['Kosher', 'Halal', 'Gluten-Free'],
		status: 'Active'
	},
	{
		id: '3',
		name: 'Oatly',
		category: 'Food & Beverage',
		founded: 1994,
		headquarters: 'Malmö, Sweden',
		employees: '1,500+',
		revenue: '$700M+',
		description: 'Oat-based dairy alternatives including milk, ice cream, and yogurt.',
		website: 'oatly.com',
		certifications: ['Vegan', 'Non-GMO'],
		status: 'IPO'
	},
	{
		id: '4',
		name: 'Violife',
		category: 'Food & Beverage',
		founded: 1990,
		headquarters: 'Thessaloniki, Greece',
		employees: '500+',
		revenue: '$200M+',
		description: 'Coconut oil-based vegan cheese alternatives.',
		website: 'violifefoods.com',
		certifications: ['Vegan', 'Non-GMO', 'Soy-Free'],
		status: 'Acquired'
	},
	{
		id: '5',
		name: 'Stella McCartney',
		category: 'Fashion',
		founded: 2001,
		headquarters: 'London, UK',
		employees: '1,000+',
		revenue: '$1.5B+',
		description: 'Luxury fashion brand committed to sustainability and no leather/fur.',
		website: 'stellamccartney.com',
		certifications: ['PETA-Approved', 'B-Corp'],
		status: 'Active'
	},
	{
		id: '6',
		name: 'Kat Von D Beauty',
		category: 'Beauty',
		founded: 2008,
		headquarters: 'Los Angeles, CA',
		employees: '200+',
		revenue: '$100M+',
		description: '100% vegan and cruelty-free makeup and skincare.',
		website: 'kvdveganbeauty.com',
		certifications: ['Leaping Bunny', 'PETA', 'Vegan'],
		status: 'Active'
	},
	{
		id: '7',
		name: 'Alpro',
		category: 'Food & Beverage',
		founded: 1980,
		headquarters: 'Ghent, Belgium',
		employees: '2,000+',
		revenue: '$800M+',
		description: 'Plant-based dairy alternatives from soy, almond, oat, and coconut.',
		website: 'alpro.com',
		certifications: ['Vegan', 'Non-GMO', 'Rainforest Alliance'],
		status: 'Acquired'
	},
	{
		id: '8',
		name: 'Veja',
		category: 'Fashion',
		founded: 2004,
		headquarters: 'Paris, France',
		employees: '200+',
		revenue: '$150M+',
		description: 'Sustainable sneaker brand using organic cotton and wild rubber.',
		website: 'veja-store.com',
		certifications: ['B-Corp', 'Fair Trade'],
		status: 'Active'
	},
	{
		id: '9',
		name: 'Lush',
		category: 'Beauty',
		founded: 1995,
		headquarters: 'Poole, UK',
		employees: '10,000+',
		revenue: '$1B+',
		description: 'Fresh handmade cosmetics with vegetarian/vegan products.',
		website: 'lush.com',
		certifications: ['Leaping Bunny', 'Vegetarian Society'],
		status: 'Active'
	},
	{
		id: '10',
		name: 'Miyoko\'s Creamery',
		category: 'Food & Beverage',
		founded: 2014,
		headquarters: 'Petaluma, CA',
		employees: '200+',
		revenue: '$50M+',
		description: 'Artisan vegan cheese and butter made from cashews.',
		website: 'miyokos.com',
		certifications: ['Organic', 'Non-GMO', 'B-Corp'],
		status: 'Active'
	},
	{
		id: '11',
		name: 'Patagonia',
		category: 'Fashion',
		founded: 1973,
		headquarters: 'Ventura, CA',
		employees: '3,000+',
		revenue: '$1.5B+',
		description: 'Outdoor clothing brand focused on sustainability and vegan options.',
		website: 'patagonia.com',
		certifications: ['B-Corp', 'Fair Trade', '1% for Planet'],
		status: 'Active'
	},
	{
		id: '12',
		name: 'The Honest Company',
		category: 'Beauty',
		founded: 2011,
		headquarters: 'Los Angeles, CA',
		employees: '500+',
		revenue: '$300M+',
		description: 'Safe, eco-friendly baby, personal care, and beauty products.',
		website: 'honest.com',
		certifications: ['Leaping Bunny', 'B-Corp'],
		status: 'IPO'
	},
	{
		id: '13',
		name: 'Ripple Foods',
		category: 'Food & Beverage',
		founded: 2014,
		headquarters: 'Emeryville, CA',
		employees: '100+',
		revenue: '$50M+',
		description: 'Pea protein-based dairy alternatives with high protein content.',
		website: 'ripplefoods.com',
		certifications: ['Non-GMO', 'Vegan'],
		status: 'Active'
	},
	{
		id: '14',
		name: 'Matt & Nat',
		category: 'Fashion',
		founded: 1995,
		headquarters: 'Montreal, Canada',
		employees: '100+',
		revenue: '$40M+',
		description: 'Vegan leather bags and accessories using recycled materials.',
		website: 'mattandnat.com',
		certifications: ['PETA-Approved', 'Vegan'],
		status: 'Active'
	},
	{
		id: '15',
		name: 'Pacifica Beauty',
		category: 'Beauty',
		founded: 1996,
		headquarters: 'Portland, OR',
		employees: '150+',
		revenue: '$75M+',
		description: '100% vegan beauty and skincare products.',
		website: 'pacificabeauty.com',
		certifications: ['Leaping Bunny', 'Vegan', 'PETA'],
		status: 'Active'
	},
	{
		id: '16',
		name: 'Califia Farms',
		category: 'Food & Beverage',
		founded: 2010,
		headquarters: 'Bakersfield, CA',
		employees: '400+',
		revenue: '$200M+',
		description: 'Plant-based beverages including almond milk and cold brew coffee.',
		website: 'califiafarms.com',
		certifications: ['Non-GMO', 'Kosher', 'B-Corp'],
		status: 'Active'
	},
	{
		id: '17',
		name: 'Allbirds',
		category: 'Fashion',
		founded: 2016,
		headquarters: 'San Francisco, CA',
		employees: '800+',
		revenue: '$300M+',
		description: 'Sustainable footwear using natural materials like wool and eucalyptus.',
		website: 'allbirds.com',
		certifications: ['B-Corp', 'Carbon Neutral'],
		status: 'IPO'
	},
	{
		id: '18',
		name: 'Herbivore Botanicals',
		category: 'Beauty',
		founded: 2011,
		headquarters: 'Seattle, WA',
		employees: '100+',
		revenue: '$30M+',
		description: 'Natural, vegan skincare using plant-based ingredients.',
		website: 'herbivorebotanicals.com',
		certifications: ['Leaping Bunny', 'Vegan'],
		status: 'Active'
	},
	{
		id: '19',
		name: 'Daiya Foods',
		category: 'Food & Beverage',
		founded: 2008,
		headquarters: 'Vancouver, Canada',
		employees: '300+',
		revenue: '$150M+',
		description: 'Dairy-free cheese, pizza, and desserts.',
		website: 'daiyafoods.com',
		certifications: ['Non-GMO', 'Gluten-Free', 'Vegan'],
		status: 'Acquired'
	},
	{
		id: '20',
		name: 'Thought Clothing',
		category: 'Fashion',
		founded: 1995,
		headquarters: 'London, UK',
		employees: '50+',
		revenue: '$20M+',
		description: 'Sustainable fashion using bamboo, organic cotton, and hemp.',
		website: 'wearethought.com',
		certifications: ['GOTS', 'Fair Trade'],
		status: 'Active'
	},
	{
		id: '21',
		name: 'Youth to the People',
		category: 'Beauty',
		founded: 2015,
		headquarters: 'Los Angeles, CA',
		employees: '100+',
		revenue: '$50M+',
		description: 'Superfood-based vegan skincare products.',
		website: 'youthtothepeople.com',
		certifications: ['Leaping Bunny', 'Vegan', 'B-Corp'],
		status: 'Acquired'
	},
	{
		id: '22',
		name: 'Gardein',
		category: 'Food & Beverage',
		founded: 2003,
		headquarters: 'Vancouver, Canada',
		employees: '200+',
		revenue: '$100M+',
		description: 'Plant-based meat alternatives for everyday cooking.',
		website: 'gardein.com',
		certifications: ['Non-GMO', 'Vegan'],
		status: 'Acquired'
	},
	{
		id: '23',
		name: 'Will\'s Vegan Store',
		category: 'Fashion',
		founded: 2012,
		headquarters: 'London, UK',
		employees: '25+',
		revenue: '$10M+',
		description: 'Vegan shoes, boots, and accessories for men and women.',
		website: 'wills-vegan-store.com',
		certifications: ['PETA-Approved', 'Vegan Society'],
		status: 'Active'
	},
	{
		id: '24',
		name: 'Cover FX',
		category: 'Beauty',
		founded: 2000,
		headquarters: 'Toronto, Canada',
		employees: '75+',
		revenue: '$40M+',
		description: 'Vegan, cruelty-free complexion products.',
		website: 'coverfx.com',
		certifications: ['Leaping Bunny', 'Vegan'],
		status: 'Active'
	},
	{
		id: '25',
		name: 'Tofurky',
		category: 'Food & Beverage',
		founded: 1980,
		headquarters: 'Hood River, OR',
		employees: '200+',
		revenue: '$50M+',
		description: 'Plant-based deli slices, sausages, and holiday roasts.',
		website: 'tofurky.com',
		certifications: ['Non-GMO', 'Vegan', 'Kosher'],
		status: 'Active'
	},
	{
		id: '26',
		name: 'Reformation',
		category: 'Fashion',
		founded: 2009,
		headquarters: 'Los Angeles, CA',
		employees: '500+',
		revenue: '$200M+',
		description: 'Sustainable women\'s fashion with eco-friendly practices.',
		website: 'thereformation.com',
		certifications: ['Climate Neutral', 'B-Corp'],
		status: 'Active'
	},
	{
		id: '27',
		name: 'e.l.f. Cosmetics',
		category: 'Beauty',
		founded: 2004,
		headquarters: 'Oakland, CA',
		employees: '300+',
		revenue: '$500M+',
		description: 'Affordable, cruelty-free and vegan makeup.',
		website: 'elfcosmetics.com',
		certifications: ['PETA', 'Leaping Bunny', 'Vegan'],
		status: 'IPO'
	},
	{
		id: '28',
		name: 'NotCo',
		category: 'Food & Beverage',
		founded: 2015,
		headquarters: 'Santiago, Chile',
		employees: '300+',
		revenue: '$100M+',
		description: 'AI-powered plant-based food company creating milk, meat, and mayo.',
		website: 'notco.com',
		certifications: ['B-Corp', 'Non-GMO'],
		status: 'Active'
	},
	{
		id: '29',
		name: 'Rothy\'s',
		category: 'Fashion',
		founded: 2012,
		headquarters: 'San Francisco, CA',
		employees: '500+',
		revenue: '$140M+',
		description: 'Sustainable shoes made from recycled plastic bottles.',
		website: 'rothys.com',
		certifications: ['Carbon Neutral'],
		status: 'Active'
	},
	{
		id: '30',
		name: 'Drunk Elephant',
		category: 'Beauty',
		founded: 2012,
		headquarters: 'Houston, TX',
		employees: '150+',
		revenue: '$300M+',
		description: 'Clean skincare brand with many vegan options.',
		website: 'drunkelephant.com',
		certifications: ['Leaping Bunny', 'Clean Beauty'],
		status: 'Acquired'
	},
	{
		id: '31',
		name: 'JUST Egg',
		category: 'Food & Beverage',
		founded: 2011,
		headquarters: 'San Francisco, CA',
		employees: '200+',
		revenue: '$100M+',
		description: 'Plant-based egg alternative made from mung beans.',
		website: 'ju.st',
		certifications: ['Non-GMO', 'Vegan'],
		status: 'Active'
	},
	{
		id: '32',
		name: 'Native Shoes',
		category: 'Fashion',
		founded: 2009,
		headquarters: 'Vancouver, Canada',
		employees: '150+',
		revenue: '$60M+',
		description: 'Lightweight, animal-free, and recyclable footwear.',
		website: 'nativeshoes.com',
		certifications: ['PETA-Approved', 'Vegan'],
		status: 'Active'
	},
	{
		id: '33',
		name: 'Milk Makeup',
		category: 'Beauty',
		founded: 2016,
		headquarters: 'New York, NY',
		employees: '100+',
		revenue: '$50M+',
		description: '100% vegan makeup brand with multi-use products.',
		website: 'milkmakeup.com',
		certifications: ['PETA', 'Leaping Bunny', 'Vegan'],
		status: 'Active'
	},
	{
		id: '34',
		name: 'Lightlife',
		category: 'Food & Beverage',
		founded: 1979,
		headquarters: 'Turner Falls, MA',
		employees: '300+',
		revenue: '$150M+',
		description: 'Plant-based meat alternatives including tempeh and hot dogs.',
		website: 'lightlife.com',
		certifications: ['Non-GMO', 'Certified Vegan'],
		status: 'Acquired'
	},
	{
		id: '35',
		name: 'ABLE',
		category: 'Fashion',
		founded: 2010,
		headquarters: 'Nashville, TN',
		employees: '100+',
		revenue: '$15M+',
		description: 'Ethical fashion brand creating jobs for women.',
		website: 'ableclothing.com',
		certifications: ['B-Corp', 'Fair Trade'],
		status: 'Active'
	},
	{
		id: '36',
		name: 'Bite Beauty',
		category: 'Beauty',
		founded: 2012,
		headquarters: 'Toronto, Canada',
		employees: '50+',
		revenue: '$25M+',
		description: 'Clean, vegan lip products with food-grade ingredients.',
		website: 'bitebeauty.com',
		certifications: ['Leaping Bunny', 'Vegan'],
		status: 'Active'
	},
	{
		id: '37',
		name: 'Quorn',
		category: 'Food & Beverage',
		founded: 1985,
		headquarters: 'Stokesley, UK',
		employees: '1,000+',
		revenue: '$300M+',
		description: 'Mycoprotein-based meat alternatives.',
		website: 'quorn.com',
		certifications: ['Vegetarian Society', 'Vegan Society'],
		status: 'Acquired'
	},
	{
		id: '38',
		name: 'Noize',
		category: 'Fashion',
		founded: 2008,
		headquarters: 'Montreal, Canada',
		employees: '50+',
		revenue: '$20M+',
		description: 'Vegan outerwear including winter coats and jackets.',
		website: 'noize.com',
		certifications: ['PETA-Approved', 'Vegan'],
		status: 'Active'
	},
	{
		id: '39',
		name: 'Osea',
		category: 'Beauty',
		founded: 1996,
		headquarters: 'Malibu, CA',
		employees: '75+',
		revenue: '$20M+',
		description: 'Seaweed-based vegan skincare and body care.',
		website: 'oseamalibu.com',
		certifications: ['Leaping Bunny', 'Vegan', 'Climate Neutral'],
		status: 'Active'
	},
	{
		id: '40',
		name: 'Heura Foods',
		category: 'Food & Beverage',
		founded: 2017,
		headquarters: 'Barcelona, Spain',
		employees: '150+',
		revenue: '$50M+',
		description: 'Mediterranean plant-based meat from Spain.',
		website: 'heurafoods.com',
		certifications: ['B-Corp', 'Vegan'],
		status: 'Active'
	},
	{
		id: '41',
		name: 'Everlane',
		category: 'Fashion',
		founded: 2010,
		headquarters: 'San Francisco, CA',
		employees: '300+',
		revenue: '$200M+',
		description: 'Transparent pricing and ethical factories with vegan options.',
		website: 'everlane.com',
		certifications: ['Climate Neutral'],
		status: 'Active'
	},
	{
		id: '42',
		name: 'Fenty Beauty',
		category: 'Beauty',
		founded: 2017,
		headquarters: 'San Francisco, CA',
		employees: '150+',
		revenue: '$600M+',
		description: 'Inclusive beauty brand by Rihanna with vegan products.',
		website: 'fentybeauty.com',
		certifications: ['Leaping Bunny'],
		status: 'Active'
	},
	{
		id: '43',
		name: 'Silk',
		category: 'Food & Beverage',
		founded: 1977,
		headquarters: 'Broomfield, CO',
		employees: '500+',
		revenue: '$400M+',
		description: 'Plant-based milk, yogurt, and creamers.',
		website: 'silk.com',
		certifications: ['Non-GMO', 'Vegan'],
		status: 'Acquired'
	},
	{
		id: '44',
		name: 'Nuuwaï',
		category: 'Fashion',
		founded: 2017,
		headquarters: 'Berlin, Germany',
		employees: '25+',
		revenue: '$5M+',
		description: 'Apple leather bags and accessories.',
		website: 'nuuwai.com',
		certifications: ['PETA-Approved', 'Vegan'],
		status: 'Active'
	},
	{
		id: '45',
		name: 'Ere Perez',
		category: 'Beauty',
		founded: 2002,
		headquarters: 'Sydney, Australia',
		employees: '40+',
		revenue: '$15M+',
		description: 'Natural, vegan makeup using rice bran and quandong.',
		website: 'ereperez.com',
		certifications: ['Choose Cruelty Free', 'Vegan'],
		status: 'Active'
	},
	{
		id: '46',
		name: 'Upside Foods',
		category: 'Food & Beverage',
		founded: 2015,
		headquarters: 'Berkeley, CA',
		employees: '200+',
		revenue: '$0 (Pre-revenue)',
		description: 'Cultivated meat grown from animal cells.',
		website: 'upsidefoods.com',
		certifications: ['FDA Approved'],
		status: 'Active'
	},
	{
		id: '47',
		name: 'Deadwood Leather',
		category: 'Fashion',
		founded: 2012,
		headquarters: 'Stockholm, Sweden',
		employees: '15+',
		revenue: '$3M+',
		description: 'Upcycled leather jackets and vegan alternatives.',
		website: 'deadwoodstudios.com',
		certifications: ['PETA-Approved'],
		status: 'Active'
	},
	{
		id: '48',
		name: 'Tower 28',
		category: 'Beauty',
		founded: 2019,
		headquarters: 'Los Angeles, CA',
		employees: '30+',
		revenue: '$20M+',
		description: 'Clean, vegan beauty safe for sensitive skin.',
		website: 'tower28beauty.com',
		certifications: ['Leaping Bunny', 'Vegan'],
		status: 'Active'
	},
	{
		id: '49',
		name: 'Forager Project',
		category: 'Food & Beverage',
		founded: 2013,
		headquarters: 'Kirkland, WA',
		employees: '100+',
		revenue: '$30M+',
		description: 'Organic plant-based dairy alternatives and snacks.',
		website: 'foragerproject.com',
		certifications: ['USDA Organic', 'Non-GMO', 'Vegan'],
		status: 'Active'
	},
	{
		id: '50',
		name: 'By Humankind',
		category: 'Lifestyle',
		founded: 2018,
		headquarters: 'New York, NY',
		employees: '25+',
		revenue: '$10M+',
		description: 'Refillable personal care products reducing plastic waste.',
		website: 'byhumankind.com',
		certifications: ['B-Corp', 'Vegan', 'Plastic Neutral'],
		status: 'Active'
	}
];

/**
 * Get unique categories from all companies
 */
export function getCategories(): string[] {
	return [...new Set(veganCompanies.map((c) => c.category))];
}

/**
 * Get unique statuses from all companies
 */
export function getStatuses(): string[] {
	return [...new Set(veganCompanies.map((c) => c.status))];
}

/**
 * Filter companies by various criteria
 */
export function filterCompanies(options: {
	search?: string;
	category?: string;
	status?: string;
	minFounded?: number;
	maxFounded?: number;
}): VeganCompany[] {
	return veganCompanies.filter((company) => {
		// Search filter
		if (options.search) {
			const searchLower = options.search.toLowerCase();
			const matchesSearch =
				company.name.toLowerCase().includes(searchLower) ||
				company.description.toLowerCase().includes(searchLower) ||
				company.headquarters.toLowerCase().includes(searchLower);
			if (!matchesSearch) return false;
		}

		// Category filter
		if (options.category && options.category !== 'all') {
			if (company.category !== options.category) return false;
		}

		// Status filter
		if (options.status && options.status !== 'all') {
			if (company.status !== options.status) return false;
		}

		// Founded year filters
		if (options.minFounded && company.founded < options.minFounded) {
			return false;
		}
		if (options.maxFounded && company.founded > options.maxFounded) {
			return false;
		}

		return true;
	});
}
