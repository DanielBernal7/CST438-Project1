//@ts-nocheck

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

const SearchPokemon = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [pokemon, setPokemon] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSearch = async () => {
		if (!searchQuery.trim()) {
			setError("Please enter a pokemon name");
			return;
		}

		setLoading(true);
		setError("");
		setPokemon(null);

		try {
			const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);

			if (!response.ok) {
				throw new Error("Pokemon not found");
			}

			const data = await response.json();
			setPokemon({
				id: data.id,
				name: data.name,
				types: data.types,
				sprite: data.sprites.front_default,
			});
		} catch (error) {
			setError("Pokemon not found. Please check the spelling and try again!");
		} finally {
			setLoading(false);
		}
	};

	const handlePokemonPress = (pokemonId) => {
		router.push(`/pokemon/${pokemonId}`);
	};

	const renderPokemonTypes = (types) => {
		const typeElements = [];
		for (let i = 0; i < types.length; i++) {
			typeElements.push(
				<View key={i} style={[styles.typeTag, { backgroundColor: POKEMON_TYPE_COLORS[types[i].type.name] }]}>
					<Text style={styles.typeText}>{types[i].type.name.toUpperCase()}</Text>
				</View>
			);
		}
		return <View style={styles.typesContainer}>{typeElements}</View>;
	};

	let errorMessage = null;
	if (error) {
		errorMessage = <Text style={styles.errorText}>{error}</Text>;
	}

	let loadingIndicator = null;
	if (loading) {
		loadingIndicator = (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#FF5D5D" />
				<Text>Searching...</Text>
			</View>
		);
	}

	let pokemonCard = null;
	if (pokemon) {
		pokemonCard = (
			<TouchableOpacity style={styles.pokemonCard} onPress={() => handlePokemonPress(pokemon.id)}>
				<Image source={{ uri: pokemon.sprite }} style={styles.pokemonImage} />

				<View style={styles.pokemonInfo}>
					<Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>

					{renderPokemonTypes(pokemon.types)}
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.title}>Search Pokémon</Text>

				<View style={styles.searchContainer}>
					<TextInput style={styles.searchInput} placeholder="Enter Pokémon name..." value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={handleSearch} autoCapitalize="none" />
					<TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
						<Text style={styles.searchButtonText}>Search</Text>
					</TouchableOpacity>
				</View>

				{errorMessage}
				{loadingIndicator}
				{pokemonCard}
			</ScrollView>
		</SafeAreaView>
	);
};

const POKEMON_TYPE_COLORS = {
	normal: "#A8A878",
	fire: "#F08030",
	water: "#6890F0",
	electric: "#F8D030",
	grass: "#78C850",
	ice: "#98D8D8",
	fighting: "#C03028",
	poison: "#A040A0",
	ground: "#E0C068",
	flying: "#A890F0",
	psychic: "#F85888",
	bug: "#A8B820",
	rock: "#B8A038",
	ghost: "#705898",
	dragon: "#7038F8",
	dark: "#705848",
	steel: "#B8B8D0",
	fairy: "#EE99AC",
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	scrollContent: {
		padding: 15,
		paddingBottom: 100,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#313167",
		textAlign: "center",
		marginBottom: 20,
	},
	searchContainer: {
		flexDirection: "row",
		marginBottom: 20,
		gap: 10,
	},
	searchInput: {
		flex: 1,
		height: 50,
		backgroundColor: "white",
		borderRadius: 10,
		paddingHorizontal: 15,
		borderWidth: 2,
		borderColor: "#92A6C4",
	},
	searchButton: {
		backgroundColor: "#FF5D5D",
		paddingHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		borderWidth: 1.5,
		borderColor: "black",
	},
	searchButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	loadingContainer: {
		padding: 20,
		alignItems: "center",
	},
	errorText: {
		color: "#FF5D5D",
		textAlign: "center",
		marginBottom: 20,
	},
	pokemonCard: {
		backgroundColor: "#92A6C4",
		padding: 15,
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	pokemonImage: {
		width: 100,
		height: 100,
	},
	pokemonInfo: {
		flex: 1,
		marginLeft: 15,
	},
	pokemonName: {
		fontSize: 18,
		fontWeight: "600",
		color: "#2E3057",
		marginBottom: 5,
	},
	typesContainer: {
		flexDirection: "row",
		gap: 8,
	},
	typeTag: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 15,
	},
	typeText: {
		color: "white",
		fontSize: 12,
		fontWeight: "600",
	},
});

export default SearchPokemon;
