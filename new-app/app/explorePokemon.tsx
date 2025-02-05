// @ts-nocheck

import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";


//This is the interface needed for typescript to work with the API
interface Pokemon {
	name: string;
	url: string;
}

//Another interface needed for typescript to stop complaining
interface PokemonDetail {
	id: number;
	name: string;
	types: Array<{
		type: {
			name: string;
		};
	}>;
	sprites: {
		front_default: string;
	};
}


const ExplorePokemon = () => {
	const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchPokemonDetail = async (url: string) => {
			try {
				const response = await fetch(url);
				const data = await response.json();
				return data;
			} catch (error) {
				console.error("Could not get Pokemon Detail:", error);
				return null;
			}
		};

		const getPokemon = async () => {
			try {
				const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
				const data = await response.json();

				const detailedPokemon = await Promise.all(data.results.map((pokemon: { url: string }) => fetchPokemonDetail(pokemon.url)));

				setPokemonList(detailedPokemon.filter((pokemon) => pokemon !== null));
				setIsLoading(false);
			} catch (error) {
				console.error("Could not get Pokemon:", error);
				setIsLoading(false);
			}
		};

		getPokemon();
	}, []);


	const handlePokemonPress = (pokemonName: String) => {
		console.log(`You selected ${pokemonName}!`);
	};

	
	const renderTypeTag = (typeInfo, index) => {
		return (
			<View key={index} style={[styles.typeTag, { backgroundColor: getTypeColor(typeInfo.type.name) }]}>
				<Text style={styles.typeText}>{typeInfo.type.name.toUpperCase()}</Text>
			</View>
		);
	};


	const renderPokemonTypes = (types) => {
		return <View style={styles.typeContainer}>{types.map((typeInfo, index) => renderTypeTag(typeInfo, index))}</View>;
	};

	// Function to show Pokemon's name and types
	const renderPokemonInfo = (pokemon) => {
		return (
			<View style={styles.pokemonInfo}>
				<Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
				{renderPokemonTypes(pokemon.types)}
			</View>
		);
	};

	// Function to create a card for each Pokemon
	const renderPokemonCard = (pokemon, index) => {
		return (
			<TouchableOpacity key={index} style={styles.pokemonCard} onPress={() => handlePokemonPress(pokemon.name)}>
				<Image source={{ uri: pokemon.sprites.front_default }} style={styles.pokemonImage} />
				{renderPokemonInfo(pokemon)}
			</TouchableOpacity>
		);
	};

	// Show loading screen while getting data
	if (isLoading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color="#FF5D5D" />
				<Text>Loading Pokémon...</Text>
			</View>
		);
	}

	// Main display of the Pokemon gallery
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Pokémon Gallery</Text>
			<ScrollView>{pokemonList.map((pokemon, index) => renderPokemonCard(pokemon, index))}</ScrollView>
		</View>
	);
};

// Function to get the right color for each Pokemon type. i.e. fire, water, etc. color
const getTypeColor = (type: string) => {
	const colors: { [key: string]: string } = {
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
	return colors[type] || "#888888";
};

// This is all of the styles I used.
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#2E3057",
		textAlign: "center",
		marginBottom: 20,
	},
	pokemonCard: {
		backgroundColor: "white",
		padding: 15,
		marginBottom: 10,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
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
	typeContainer: {
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

// Here is where I'm exporting the component. 
export default ExplorePokemon;
