<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { setActiveSection } from '$lib/stores/navigation.svelte';
	import { cn } from '$lib/utils';
	import {
		veganRestaurants,
		getCuisines,
		getPriceRanges,
		type VeganRestaurant
	} from '$lib/data/vegan-restaurants';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	// Set active section
	setActiveSection('maps');

	// State
	let selectedCuisine = $state('all');
	let selectedPrice = $state('all');
	let showFilters = $state(false);
	let favorites = $state(new Set<string>());
	let hoveredRestaurantId = $state<string | null>(null);
	let selectedRestaurantId = $state<string | null>(null);
	let mapLoaded = $state(false);
	let mapError = $state<string | null>(null);
	let mapContainer: HTMLDivElement;
	let map: google.maps.Map | null = null;
	let overlays: Map<string, any> = new Map();
	let infoWindow: google.maps.InfoWindow | null = null;

	// Derived
	const cuisines = ['all', ...getCuisines()];
	const priceRanges = ['all', ...getPriceRanges()];

	let filteredRestaurants = $derived.by(() => {
		let result = [...veganRestaurants];

		if (selectedCuisine !== 'all') {
			result = result.filter((r) => r.cuisine === selectedCuisine);
		}

		if (selectedPrice !== 'all') {
			result = result.filter((r) => r.priceRange === selectedPrice);
		}

		return result;
	});

	let selectedRestaurant = $derived(
		filteredRestaurants.find((r) => r.id === selectedRestaurantId)
	);

	let hasActiveFilters = $derived(selectedCuisine !== 'all' || selectedPrice !== 'all');

	// Austin, TX center
	const defaultCenter = { lat: 30.2672, lng: -97.7431 };

	// Modern grey/silver map style (like Uber/Airbnb)
	const mapStyles = [
		{ elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
		{ elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
		{ elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
		{ elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
		{ featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
		{ featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
		{ featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
		{ featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
		{ featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
		{ featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
		{ featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
		{ featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
		{ featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
		{ featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
		{ featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
		{ featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
		{ featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
		{ featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }
	];

	// Load Google Maps via script tag
	function loadGoogleMaps(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (typeof google !== 'undefined' && google.maps) {
				resolve();
				return;
			}

			const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
			if (!apiKey) {
				reject(new Error('Google Maps API key not found'));
				return;
			}

			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load Google Maps script'));
			document.head.appendChild(script);
		});
	}

	// Create custom overlay class
	function createOverlayClass() {
		class PriceMarkerOverlay extends google.maps.OverlayView {
			private position: google.maps.LatLng;
			private restaurant: VeganRestaurant;
			private div: HTMLDivElement | null = null;
			private isActive: boolean = false;
			private onClick: () => void;
			private onMouseEnter: () => void;
			private onMouseLeave: () => void;

			constructor(
				position: google.maps.LatLng,
				restaurant: VeganRestaurant,
				onClick: () => void,
				onMouseEnter: () => void,
				onMouseLeave: () => void
			) {
				super();
				this.position = position;
				this.restaurant = restaurant;
				this.onClick = onClick;
				this.onMouseEnter = onMouseEnter;
				this.onMouseLeave = onMouseLeave;
			}

			onAdd() {
				this.div = document.createElement('div');
				this.div.style.position = 'absolute';
				this.div.style.cursor = 'pointer';
				this.div.style.transform = 'translate(-50%, -100%)';
				this.updateContent();

				this.div.addEventListener('click', (e) => {
					e.stopPropagation();
					this.onClick();
				});
				this.div.addEventListener('mouseenter', () => this.onMouseEnter());
				this.div.addEventListener('mouseleave', () => this.onMouseLeave());

				const panes = this.getPanes();
				panes?.overlayMouseTarget.appendChild(this.div);
			}

			draw() {
				if (!this.div) return;
				const overlayProjection = this.getProjection();
				const pos = overlayProjection.fromLatLngToDivPixel(this.position);
				if (pos) {
					this.div.style.left = pos.x + 'px';
					this.div.style.top = pos.y + 'px';
				}
			}

			onRemove() {
				if (this.div) {
					this.div.parentNode?.removeChild(this.div);
					this.div = null;
				}
			}

			setActive(active: boolean) {
				this.isActive = active;
				this.updateContent();
			}

			private updateContent() {
				if (!this.div) return;

				const isActive = this.isActive;
				this.div.style.zIndex = isActive ? '50' : '10';

				this.div.innerHTML = `
					<div style="position: relative;">
						<div style="
							display: flex;
							align-items: center;
							gap: 4px;
							padding: 8px 12px;
							border-radius: 9999px;
							font-weight: 600;
							font-size: 14px;
							font-family: system-ui, -apple-system, sans-serif;
							box-shadow: ${isActive ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.15)'};
							background-color: ${isActive ? '#1a1a1a' : '#ffffff'};
							color: ${isActive ? '#ffffff' : '#1a1a1a'};
							transition: background-color 0.15s, color 0.15s, box-shadow 0.15s;
						">${this.restaurant.priceRange}</div>
						<div style="
							position: absolute;
							left: 50%;
							bottom: -6px;
							transform: translateX(-50%);
							width: 0;
							height: 0;
							border-left: 6px solid transparent;
							border-right: 6px solid transparent;
							border-top: 6px solid ${isActive ? '#1a1a1a' : '#ffffff'};
							transition: border-top-color 0.15s;
						"></div>
					</div>
				`;
			}
		}

		return PriceMarkerOverlay;
	}

	// Initialize map
	async function initMap() {
		if (!browser) return;

		try {
			await loadGoogleMaps();

			const PriceMarkerOverlay = createOverlayClass();

			// Create map
			map = new google.maps.Map(mapContainer, {
				center: defaultCenter,
				zoom: 12,
				styles: mapStyles,
				disableDefaultUI: true,
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.RIGHT_CENTER
				},
				mapTypeControl: false,
				streetViewControl: false,
				fullscreenControl: false,
				clickableIcons: false,
				gestureHandling: 'greedy'
			});

			// Create info window
			infoWindow = new google.maps.InfoWindow();

			// Add click listener to close info window
			map.addListener('click', () => {
				selectedRestaurantId = null;
				infoWindow?.close();
			});

			// Create custom overlay markers for all restaurants
			for (const restaurant of veganRestaurants) {
				const position = new google.maps.LatLng(restaurant.lat, restaurant.lng);

				const overlay = new PriceMarkerOverlay(
					position,
					restaurant,
					() => handleMarkerClick(restaurant),
					() => {
						hoveredRestaurantId = restaurant.id;
						overlay.setActive(true);
					},
					() => {
						if (selectedRestaurantId !== restaurant.id) {
							hoveredRestaurantId = null;
							overlay.setActive(false);
						}
					}
				);

				overlay.setMap(map);
				overlays.set(restaurant.id, overlay);
			}

			mapLoaded = true;
		} catch (error) {
			console.error('Error loading Google Maps:', error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			mapError = `Failed to load Google Maps: ${errorMessage}`;
		}
	}

	// Create info window content
	function createInfoWindowContent(restaurant: VeganRestaurant): string {
		return `
			<div style="width: 280px; font-family: system-ui, -apple-system, sans-serif;">
				<div style="position: relative; height: 120px; width: 100%; overflow: hidden; border-radius: 12px 12px 0 0;">
					<img src="${restaurant.images[0]}" alt="${restaurant.name}" style="width: 100%; height: 100%; object-fit: cover;" />
					${restaurant.isNew ? '<span style="position: absolute; top: 8px; left: 8px; background: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">New</span>' : ''}
				</div>
				<div style="padding: 12px;">
					<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
						<h3 style="font-weight: 600; font-size: 15px; margin: 0;">${restaurant.name}</h3>
						<div style="display: flex; align-items: center; gap: 4px; font-size: 13px;">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
							<span style="font-weight: 500;">${restaurant.rating}</span>
						</div>
					</div>
					<p style="margin: 0 0 8px 0; font-size: 13px; color: #666;">${restaurant.cuisine} · ${restaurant.priceRange}</p>
					<p style="margin: 0 0 8px 0; font-size: 12px; color: #888;">${restaurant.address}</p>
					<div style="display: flex; gap: 6px; flex-wrap: wrap;">
						${restaurant.features
							.slice(0, 3)
							.map(
								(f) =>
									`<span style="background: #f3f4f6; padding: 2px 8px; border-radius: 9999px; font-size: 10px; color: #666;">${f}</span>`
							)
							.join('')}
					</div>
				</div>
			</div>
		`;
	}

	function handleMarkerClick(restaurant: VeganRestaurant) {
		// First deactivate all markers
		overlays.forEach((overlay) => {
			overlay.setActive(false);
		});

		// Then activate the selected one
		const selectedOverlay = overlays.get(restaurant.id);
		if (selectedOverlay) {
			selectedOverlay.setActive(true);
		}

		selectedRestaurantId = restaurant.id;
		panToRestaurant(restaurant);

		if (infoWindow && map) {
			infoWindow.setContent(createInfoWindowContent(restaurant));
			infoWindow.setPosition({ lat: restaurant.lat, lng: restaurant.lng });
			infoWindow.open(map);
		}
	}

	function panToRestaurant(restaurant: VeganRestaurant) {
		if (map) {
			map.panTo({ lat: restaurant.lat, lng: restaurant.lng });
		}
	}

	function handleCardHover(restaurant: VeganRestaurant) {
		hoveredRestaurantId = restaurant.id;

		// Only activate if not already selected
		if (selectedRestaurantId !== restaurant.id) {
			const overlay = overlays.get(restaurant.id);
			if (overlay) {
				overlay.setActive(true);
			}
		}
		panToRestaurant(restaurant);
	}

	function handleCardLeave() {
		const leavingId = hoveredRestaurantId;
		hoveredRestaurantId = null;

		// Only deactivate if this wasn't the selected marker
		if (leavingId && selectedRestaurantId !== leavingId) {
			const overlay = overlays.get(leavingId);
			if (overlay) {
				overlay.setActive(false);
			}
		}
	}

	function handleCardClick(restaurant: VeganRestaurant) {
		handleMarkerClick(restaurant);
	}

	function toggleFavorite(id: string, e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		const newFavorites = new Set(favorites);
		if (newFavorites.has(id)) {
			newFavorites.delete(id);
		} else {
			newFavorites.add(id);
		}
		favorites = newFavorites;
	}

	function clearFilters() {
		selectedCuisine = 'all';
		selectedPrice = 'all';
	}

	function centerOnAustin() {
		if (map) {
			map.panTo(defaultCenter);
			map.setZoom(12);
		}
	}

	// Update overlay visibility when filters change
	$effect(() => {
		const filtered = filteredRestaurants;
		const filteredIds = new Set(filtered.map((r) => r.id));

		overlays.forEach((overlay, id) => {
			overlay.setMap(filteredIds.has(id) ? map : null);
		});
	});

	onMount(() => {
		initMap();

		return () => {
			// Cleanup overlays
			overlays.forEach((overlay) => {
				overlay.setMap(null);
			});
			overlays.clear();
		};
	});
</script>

<svelte:head>
	<title>Vegan Restaurants Map - Austin, TX</title>
	<meta name="description" content="Discover the best vegan and plant-based restaurants in Austin, Texas" />
</svelte:head>

<div class="flex h-full flex-col overflow-hidden">
	<!-- Filter Bar -->
	<div class="shrink-0 border-b border-border bg-card px-4 py-3">
		<div class="mx-auto flex max-w-[1800px] items-center gap-3">
			<!-- Location Badge -->
			<button
				onclick={centerOnAustin}
				class="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm transition-all hover:border-foreground hover:shadow-md"
			>
				<svg class="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
					<circle cx="12" cy="10" r="3" />
				</svg>
				<span class="text-sm font-medium">Austin, TX</span>
			</button>

			<!-- Divider -->
			<div class="h-6 w-px bg-border"></div>

			<!-- Cuisine Pills -->
			<div class="hide-scrollbar flex items-center gap-1.5 overflow-x-auto">
				{#each cuisines.slice(0, 8) as cuisine}
					<button
						onclick={() => (selectedCuisine = cuisine)}
						class={cn(
							'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200',
							selectedCuisine === cuisine
								? 'border-foreground bg-foreground text-background shadow-md'
								: 'border-border bg-background text-foreground hover:border-foreground hover:shadow-sm'
						)}
					>
						{cuisine === 'all' ? 'All Cuisines' : cuisine}
					</button>
				{/each}
			</div>

			<!-- Spacer -->
			<div class="flex-1"></div>

			<!-- Filters Button -->
			<Button
				variant="outline"
				size="sm"
				class="gap-2 rounded-full transition-all hover:shadow-md"
				onclick={() => (showFilters = true)}
			>
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="4" y1="21" x2="4" y2="14" />
					<line x1="4" y1="10" x2="4" y2="3" />
					<line x1="12" y1="21" x2="12" y2="12" />
					<line x1="12" y1="8" x2="12" y2="3" />
					<line x1="20" y1="21" x2="20" y2="16" />
					<line x1="20" y1="12" x2="20" y2="3" />
					<line x1="1" y1="14" x2="7" y2="14" />
					<line x1="9" y1="8" x2="15" y2="8" />
					<line x1="17" y1="16" x2="23" y2="16" />
				</svg>
				Filters
				{#if hasActiveFilters}
					<span class="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
						{(selectedCuisine !== 'all' ? 1 : 0) + (selectedPrice !== 'all' ? 1 : 0)}
					</span>
				{/if}
			</Button>
		</div>
	</div>

	<!-- Main Content: Split View -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Left: Restaurant List -->
		<div class="w-[420px] shrink-0 overflow-y-auto border-r border-border bg-background">
			<div class="sticky top-0 z-10 border-b border-border bg-background/95 p-4 backdrop-blur-sm">
				<p class="text-sm font-medium text-muted-foreground">
					{filteredRestaurants.length} vegan restaurants in Austin
				</p>
			</div>

			<!-- Restaurant List -->
			<div class="divide-y divide-border">
				{#each filteredRestaurants as restaurant (restaurant.id)}
					<div
						class={cn(
							'group cursor-pointer p-4 transition-all duration-200',
							hoveredRestaurantId === restaurant.id && 'bg-muted/60',
							selectedRestaurantId === restaurant.id && 'bg-primary/5 ring-2 ring-inset ring-primary/20'
						)}
						role="button"
						tabindex="0"
						onmouseenter={() => handleCardHover(restaurant)}
						onmouseleave={handleCardLeave}
						onclick={() => handleCardClick(restaurant)}
						onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick(restaurant)}
					>
						<div class="flex gap-4">
							<!-- Image -->
							<div class="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
								<img
									src={restaurant.images[0]}
									alt={restaurant.name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
								<!-- Favorite Button -->
								<button
									onclick={(e) => toggleFavorite(restaurant.id, e)}
									class="absolute right-1.5 top-1.5 z-10 transition-transform hover:scale-110 active:scale-95"
									aria-label={favorites.has(restaurant.id) ? 'Remove from favorites' : 'Add to favorites'}
								>
									<svg
										class={cn(
											'h-5 w-5 drop-shadow-md transition-all',
											favorites.has(restaurant.id)
												? 'fill-red-500 stroke-red-500'
												: 'fill-black/30 stroke-white'
										)}
										viewBox="0 0 24 24"
										stroke-width="2"
									>
										<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
									</svg>
								</button>
								<!-- New Badge -->
								{#if restaurant.isNew}
									<Badge class="absolute left-1.5 top-1.5 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-foreground shadow-sm">
										New
									</Badge>
								{/if}
							</div>

							<!-- Info -->
							<div class="min-w-0 flex-1">
								<div class="mb-0.5 flex items-start justify-between gap-2">
									<h3 class="line-clamp-1 font-semibold leading-tight">
										{restaurant.name}
									</h3>
									<div class="flex shrink-0 items-center gap-1">
										<svg class="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
											<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
										</svg>
										<span class="text-sm font-semibold">{restaurant.rating}</span>
									</div>
								</div>
								<p class="mb-1 text-sm text-muted-foreground">
									{restaurant.cuisine} · {restaurant.priceRange} · {restaurant.reviewCount} reviews
								</p>
								<p class="line-clamp-1 text-sm text-muted-foreground">
									{restaurant.address}
								</p>
								<div class="mt-2 flex flex-wrap gap-1">
									{#each restaurant.features.slice(0, 3) as feature}
										<span class="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
											{feature}
										</span>
									{/each}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if filteredRestaurants.length === 0}
				<div class="flex flex-col items-center justify-center px-4 py-20 text-center">
					<svg class="mb-4 h-12 w-12 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
						<circle cx="12" cy="10" r="3" />
					</svg>
					<h3 class="mb-1 text-lg font-semibold">No restaurants found</h3>
					<p class="mb-4 text-sm text-muted-foreground">Try adjusting your filters</p>
					<Button variant="outline" size="sm" onclick={clearFilters}>Clear Filters</Button>
				</div>
			{/if}
		</div>

		<!-- Right: Map -->
		<div class="relative flex-1">
			{#if mapError}
				<div class="flex h-full items-center justify-center">
					<div class="text-center">
						<svg class="mx-auto mb-4 h-12 w-12 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
						<h2 class="mb-2 text-lg font-semibold">Failed to load map</h2>
						<p class="text-sm text-muted-foreground">{mapError}</p>
					</div>
				</div>
			{:else if !mapLoaded}
				<div class="flex h-full items-center justify-center bg-muted">
					<div class="text-center">
						<div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted-foreground/20 border-t-foreground"></div>
						<p class="text-sm font-medium text-muted-foreground">Loading map...</p>
					</div>
				</div>
			{/if}

			<div bind:this={mapContainer} class="h-full w-full" class:invisible={!mapLoaded || mapError}></div>

			<!-- Recenter button -->
			{#if mapLoaded && !mapError}
				<button
					onclick={centerOnAustin}
					class="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
					aria-label="Center map on Austin"
				>
					<svg class="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polygon points="3 11 22 2 13 21 11 13 3 11" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Filters Modal -->
	{#if showFilters}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
			role="button"
			tabindex="0"
			onclick={() => (showFilters = false)}
			onkeydown={(e) => e.key === 'Escape' && (showFilters = false)}
		>
			<div
				class="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl bg-background p-6 shadow-2xl duration-200"
				role="dialog"
				tabindex="-1"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<div class="mb-6 flex items-center justify-between">
					<h2 class="text-xl font-semibold">Filters</h2>
					<Button variant="ghost" size="icon" class="rounded-full" onclick={() => (showFilters = false)}>
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</Button>
				</div>

				<div class="space-y-6">
					<!-- Cuisine -->
					<div class="space-y-3">
						<span class="text-sm font-semibold">Cuisine Type</span>
						<div class="flex flex-wrap gap-2">
							{#each cuisines as cuisine}
								<button
									onclick={() => (selectedCuisine = cuisine)}
									class={cn(
										'rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200',
										selectedCuisine === cuisine
											? 'border-foreground bg-foreground text-background shadow-md'
											: 'border-border bg-background text-foreground hover:border-foreground'
									)}
								>
									{cuisine === 'all' ? 'All' : cuisine}
								</button>
							{/each}
						</div>
					</div>

					<!-- Price Range -->
					<div class="space-y-3">
						<span class="text-sm font-semibold">Price Range</span>
						<div class="flex gap-2">
							{#each priceRanges as price}
								<button
									onclick={() => (selectedPrice = price)}
									class={cn(
										'flex-1 rounded-full border py-2.5 text-sm font-semibold transition-all duration-200',
										selectedPrice === price
											? 'border-foreground bg-foreground text-background shadow-md'
											: 'border-border bg-background text-foreground hover:border-foreground'
									)}
								>
									{price === 'all' ? 'Any' : price}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<div class="mt-8 flex gap-3">
					<Button variant="outline" class="flex-1 rounded-full" onclick={clearFilters}>
						Clear all
					</Button>
					<Button class="flex-1 rounded-full" onclick={() => (showFilters = false)}>
						Show {filteredRestaurants.length} places
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}

	:global(.gm-style-iw-d) {
		overflow: hidden !important;
		padding: 0 !important;
	}
	:global(.gm-style-iw-c) {
		padding: 0 !important;
		border-radius: 12px !important;
	}
	:global(.gm-style-iw-tc) {
		display: none !important;
	}
	:global(.gm-ui-hover-effect) {
		display: none !important;
	}
</style>
