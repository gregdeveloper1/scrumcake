#!/usr/bin/env node
/**
 * Image Migration Script
 * ======================
 * Migrates images from Unsplash to Supabase Storage.
 *
 * Usage:
 *   node scripts/migrate-images.js
 *
 * Prerequisites:
 *   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment
 *   - Supabase Storage buckets created (script will create if missing)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://rptregzonzdcnaheupcp.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
	console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable required');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Bucket configuration
const BUCKETS = {
	avatars: { name: 'avatars', public: true },
	covers: { name: 'covers', public: true },
	thumbnails: { name: 'thumbnails', public: true },
	restaurants: { name: 'restaurants', public: true },
	icons: { name: 'icons', public: true }
};

// Track URL mappings for updating mock data
const urlMappings = new Map();

/**
 * Create storage buckets if they don't exist
 */
async function createBuckets() {
	console.log('\n📦 Creating storage buckets...');

	for (const [key, config] of Object.entries(BUCKETS)) {
		const { data: existing } = await supabase.storage.getBucket(config.name);

		if (existing) {
			console.log(`  ✓ Bucket '${config.name}' already exists`);
			continue;
		}

		const { error } = await supabase.storage.createBucket(config.name, {
			public: config.public,
			fileSizeLimit: 5242880 // 5MB
		});

		if (error) {
			console.error(`  ✗ Failed to create '${config.name}':`, error.message);
		} else {
			console.log(`  ✓ Created bucket '${config.name}'`);
		}
	}
}

/**
 * Download image from URL
 */
async function downloadImage(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download: ${response.status}`);
	}
	return Buffer.from(await response.arrayBuffer());
}

/**
 * Upload image to Supabase Storage
 */
async function uploadImage(bucket, filename, buffer, contentType = 'image/jpeg') {
	const { data, error } = await supabase.storage.from(bucket).upload(filename, buffer, {
		contentType,
		upsert: true
	});

	if (error) {
		throw error;
	}

	// Get public URL
	const {
		data: { publicUrl }
	} = supabase.storage.from(bucket).getPublicUrl(filename);

	return publicUrl;
}

/**
 * Extract photo ID from Unsplash URL
 */
function getPhotoId(url) {
	const match = url.match(/photo-([a-zA-Z0-9_-]+)/);
	return match ? match[1] : null;
}

/**
 * Process a batch of images
 */
async function processImages(images, bucket, category) {
	console.log(`\n🖼️  Processing ${images.length} ${category} images...`);

	let success = 0;
	let failed = 0;

	for (const { url, name } of images) {
		try {
			const photoId = getPhotoId(url);
			if (!photoId) {
				console.log(`  ⚠ Skipping invalid URL: ${url.substring(0, 50)}...`);
				failed++;
				continue;
			}

			const filename = `${name || photoId}.jpg`;
			const buffer = await downloadImage(url);
			const newUrl = await uploadImage(bucket, filename, buffer);

			urlMappings.set(url, newUrl);
			success++;
			process.stdout.write(`  ✓ ${success}/${images.length} uploaded\r`);
		} catch (error) {
			failed++;
			console.log(`  ✗ Failed: ${error.message}`);
		}

		// Rate limit: 100ms between uploads
		await new Promise((r) => setTimeout(r, 100));
	}

	console.log(`  ✓ ${success} uploaded, ${failed} failed`);
}

/**
 * Parse mock data file and extract Unsplash URLs
 */
function extractUnsplashUrls(content, fieldName) {
	const urls = [];
	const regex = new RegExp(`${fieldName}:\\s*['"\`](https://images\\.unsplash\\.com/[^'"\`]+)['"\`]`, 'g');

	let match;
	while ((match = regex.exec(content)) !== null) {
		urls.push(match[1]);
	}

	return urls;
}

/**
 * Update mock data file with new URLs
 */
async function updateMockDataFile(filePath) {
	let content = await fs.readFile(filePath, 'utf-8');
	let replacements = 0;

	for (const [oldUrl, newUrl] of urlMappings) {
		if (content.includes(oldUrl)) {
			content = content.split(oldUrl).join(newUrl);
			replacements++;
		}
	}

	if (replacements > 0) {
		await fs.writeFile(filePath, content);
		console.log(`  ✓ Updated ${path.basename(filePath)}: ${replacements} URLs replaced`);
	}

	return replacements;
}

/**
 * Main migration function
 */
async function migrate() {
	console.log('🚀 Starting image migration to Supabase Storage\n');
	console.log(`   Supabase URL: ${SUPABASE_URL}`);

	// Step 1: Create buckets
	await createBuckets();

	// Step 2: Read mock data files
	const dataDir = path.join(__dirname, '../src/lib/data');

	const files = {
		users: path.join(dataDir, 'users.ts'),
		articles: path.join(dataDir, 'articles.ts'),
		videos: path.join(dataDir, 'videos.ts'),
		restaurants: path.join(dataDir, 'vegan-restaurants.ts'),
		communities: path.join(dataDir, 'communities.ts')
	};

	// Step 3: Extract and process images by category
	const imageCollections = [];

	// Users (avatars)
	const usersContent = await fs.readFile(files.users, 'utf-8');
	const avatarUrls = extractUnsplashUrls(usersContent, 'avatar');
	imageCollections.push({
		urls: avatarUrls.map((url, i) => ({ url, name: `user-${i + 1}` })),
		bucket: 'avatars',
		category: 'user avatars'
	});

	// Articles (covers)
	const articlesContent = await fs.readFile(files.articles, 'utf-8');
	const coverUrls = extractUnsplashUrls(articlesContent, 'coverImage');
	imageCollections.push({
		urls: coverUrls.map((url, i) => ({ url, name: `article-${i + 1}` })),
		bucket: 'covers',
		category: 'article covers'
	});

	// Videos (thumbnails + creator avatars)
	const videosContent = await fs.readFile(files.videos, 'utf-8');
	const thumbnailUrls = extractUnsplashUrls(videosContent, 'thumbnail');
	const creatorAvatarUrls = extractUnsplashUrls(videosContent, 'avatar');
	imageCollections.push({
		urls: thumbnailUrls.map((url, i) => ({ url, name: `video-${i + 1}` })),
		bucket: 'thumbnails',
		category: 'video thumbnails'
	});
	imageCollections.push({
		urls: creatorAvatarUrls.map((url, i) => ({ url, name: `creator-${i + 1}` })),
		bucket: 'avatars',
		category: 'creator avatars'
	});

	// Restaurants (photos)
	const restaurantsContent = await fs.readFile(files.restaurants, 'utf-8');
	const restaurantPhotoUrls = extractUnsplashUrls(restaurantsContent, 'images');
	// Also check for direct image URL patterns in arrays
	const arrayImageRegex = /['"`](https:\/\/images\.unsplash\.com\/[^'"`]+)['"`]/g;
	let restaurantMatch;
	const allRestaurantUrls = new Set(restaurantPhotoUrls);
	while ((restaurantMatch = arrayImageRegex.exec(restaurantsContent)) !== null) {
		allRestaurantUrls.add(restaurantMatch[1]);
	}
	imageCollections.push({
		urls: Array.from(allRestaurantUrls).map((url, i) => ({ url, name: `restaurant-${i + 1}` })),
		bucket: 'restaurants',
		category: 'restaurant photos'
	});

	// Communities (icons)
	const communitiesContent = await fs.readFile(files.communities, 'utf-8');
	const iconUrls = extractUnsplashUrls(communitiesContent, 'icon');
	imageCollections.push({
		urls: iconUrls.map((url, i) => ({ url, name: `community-${i + 1}` })),
		bucket: 'icons',
		category: 'community icons'
	});

	// Step 4: Process all images
	for (const collection of imageCollections) {
		if (collection.urls.length > 0) {
			await processImages(collection.urls, collection.bucket, collection.category);
		}
	}

	// Step 5: Update mock data files
	console.log('\n📝 Updating mock data files...');
	for (const filePath of Object.values(files)) {
		try {
			await updateMockDataFile(filePath);
		} catch (error) {
			console.log(`  ✗ Failed to update ${path.basename(filePath)}: ${error.message}`);
		}
	}

	// Summary
	console.log('\n✅ Migration complete!');
	console.log(`   Total images migrated: ${urlMappings.size}`);
	console.log(`   Storage URL pattern: ${SUPABASE_URL}/storage/v1/object/public/<bucket>/<file>`);
}

// Run migration
migrate().catch((error) => {
	console.error('\n❌ Migration failed:', error);
	process.exit(1);
});
