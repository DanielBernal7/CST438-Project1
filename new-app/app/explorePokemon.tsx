//@ts-nocheck

import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

const ExplorePokemon = () => {
	const router = useRouter();
	const [pokemonList, setPokemonList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getPokemonData = async () => {
			try {
				const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1304");
				const data = await response.json();
				const allPokemon = data.results;
				const selectedPokemon = [];
				const usedIndices = new Set();

				while (selectedPokemon.length < 10) {
					const randomIndex = Math.floor(Math.random() * allPokemon.length);
					if (!usedIndices.has(randomIndex)) {
						usedIndices.add(randomIndex);
						const pokemonResponse = await fetch(allPokemon[randomIndex].url);
						const pokemonData = await pokemonResponse.json();
						selectedPokemon.push({
							id: pokemonData.id,
							name: pokemonData.name,
							types: pokemonData.types,
							sprite: pokemonData.sprites.front_default,
						});
					}
				}
				setPokemonList(selectedPokemon);
				setIsLoading(false);
			} catch (error) {
				console.log("Error fetching Pokémon data: ", error);
				setIsLoading(false);
			}
		};
		getPokemonData();
	}, []);

	const handlePokemonPress = (pokemonId) => {
		//This will navigate to the Pokemon Details page, and also allows for the pokemonId to be passed as a parameter
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

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#FF5D5D" />
				<Text>Loading Pokémon...</Text>
			</View>
		);
	}

	const renderPokemonList = () => {
		const elements = [];
		for (let i = 0; i < pokemonList.length; i++) {
			const pokemon = pokemonList[i];

			elements.push(
				<TouchableOpacity key={i} style={styles.pokemonCard} onPress={() => handlePokemonPress(pokemon.id)}>
					<Image source={{ uri: pokemon.sprite }} style={styles.pokemonImage} />

					<View style={styles.pokemonInfo}>

						<Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>

						{renderPokemonTypes(pokemon.types)}

					</View>
				</TouchableOpacity>
			);
		}
		return elements;
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<Text style={styles.title}>Pokémon Gallery</Text>

				{renderPokemonList()}
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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
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
		marginBottom: 15,
	},
	pokemonCard: {
		backgroundColor: "#92A6C4",
		padding: 15,
		marginBottom: 10,
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

export default ExplorePokemon;
