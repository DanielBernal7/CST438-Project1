import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";

const PokemonDetails = () => {
	const [pokemon, setPokemon] = useState(null);
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const { id } = useLocalSearchParams();

	useEffect(() => {
		const getPokemonInfo = async () => {
			try {
				const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
				const data = await response.json();
				setPokemon(data);
				setLoading(false);
			} catch (error) {
				console.log("Couldn't get Pokemon data: ", error);
				setLoading(false);
			}
		};

		getPokemonInfo();
	}, [id]);

	//This is a functino that should handle the go back button, i.e. going bakc to the previous screen
	const handleGoBack = () => {
		router.back();
	};

	const showTypes = () => {
		if (!pokemon || !pokemon.types) {
			return null;
		}

		return (
			<View style={styles.typesContainer}>
				<View style={[styles.typeTag, { backgroundColor: getTypeColor(pokemon.types[0].type.name) }]}>
					<Text style={styles.typeText}>{pokemon.types[0].type.name.toUpperCase()}</Text>
				</View>

				{pokemon.types[1] && (
					<View style={[styles.typeTag, { backgroundColor: getTypeColor(pokemon.types[1].type.name) }]}>
						<Text style={styles.typeText}>{pokemon.types[1].type.name.toUpperCase()}</Text>
					</View>
				)}
			</View>
		);
	};

	if (loading || !pokemon) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#FF5D5D" />
				<Text>Loading Pokemon...</Text>
			</View>
		);
	}

	const renderBaseStats = () => {
		const elements = [];
		for (let i = 0; i < pokemon.stats.length; i++) {
			const stat = pokemon.stats[i];
			elements.push(
				<View key={i} style={styles.statRow}>
					<Text style={styles.statLabel}>{stat.stat.name.replace("-", " ").toUpperCase()}:</Text>
					<Text style={styles.statValue}>{stat.base_stat}</Text>
				</View>
			);
		}
		return elements;
	};

	const renderAbilities = () => {
		const elements = [];
		for (let i = 0; i < pokemon.abilities.length; i++) {
			const ability = pokemon.abilities[i];
			elements.push(
				<Text key={i} style={styles.abilityText}>
					• {ability.ability.name.replace("-", " ").toUpperCase()}
					{ability.is_hidden && " (Hidden)"}
				</Text>
			);
		}
		return elements;
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
				<TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
					<Text style={styles.backButtonText}> ← Back </Text>
				</TouchableOpacity>

				<View style={styles.headerContainer}>
					<Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
				</View>

				<View style={styles.imageContainer}>
					<Image style={styles.pokemonImage} source={{ uri: pokemon.sprites.front_default }} />
				</View>

				{showTypes()}

				<View style={styles.infoCard}>
					<Text style={styles.sectionTitle}>Physical Traits</Text>
					<View style={styles.physicalInfo}>
						<Text style={styles.infoText}>Height: {pokemon.height / 10}m</Text>
						<Text style={styles.infoText}>Weight: {pokemon.weight / 10}kg</Text>
					</View>
				</View>

				<View style={styles.infoCard}>
					<Text style={styles.sectionTitle}>Base Stats</Text>
					{renderBaseStats()}
				</View>

				<View style={styles.infoCard}>
					<Text style={styles.sectionTitle}>Abilities</Text>
					{renderAbilities()}
				</View>

				<TouchableOpacity style={styles.addToTeam} onPress={() => alert("Added to team!")}>
					<Text style={styles.addToTeamText}> Add pokemon to team! </Text>
				</TouchableOpacity>
				
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

const getTypeColor = (type) => {
	return POKEMON_TYPE_COLORS[type] || "#888888";
};

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 15,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	backButton: {
		padding: 10,
		marginBottom: 10,
	},
	backButtonText: {
		fontSize: 18,
		color: "#2E3057",
		fontWeight: "600",
	},
	headerContainer: {
		alignItems: "center",
		marginVertical: 10,
	},
	pokemonName: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#2E3057",
	},
	imageContainer: {
		alignItems: "center",
		marginVertical: 15,
	},
	pokemonImage: {
		width: 200,
		height: 200,
		backgroundColor: "#fff",
		borderColor: "#83ACCD",
		borderWidth: 5,
		borderRadius: 15,
	},
	typesContainer: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
		marginVertical: 15,
	},
	typeTag: {
		paddingHorizontal: 20,
		paddingVertical: 8,
		borderRadius: 20,
		marginHorizontal: 5,
	},
	typeText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",

		textShadowColor: 'black',
		textShadowOffset: {width: .5, height: 1},
		textShadowRadius: 1,
	},

	pokemonId: {
		fontSize: 18,
		color: "Black",
		marginTop: 5,
	},
	infoCard: {
		backgroundColor: "#6A839C",
		// backgroundColor: '#83ACCD',
		borderRadius: 15,
		padding: 20,
		borderWidth: 0.2,
		borderColor: "black",
		// color: 'green',
		marginVertical: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		marginBottom: 15,
		
		textShadowColor: 'black',
		textShadowOffset: {width: .5, height: 1},
		textShadowRadius: 1,
	},
	physicalInfo: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 10,
	},
	infoText: {
		fontSize: 16,
		color: "white",

		textShadowColor: ' #3B444B',
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 1,
	},
	statRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	statLabel: {
		fontSize: 14,
		color: "white",
		fontWeight: "500",

		textShadowColor: ' #3B444B',
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 1,
	},
	statValue: {
		fontSize: 14,
		color: "white",
		fontWeight: "bold",
	},
	abilityText: {
		fontSize: 16,
		color: "white",
		marginBottom: 8,

		textShadowColor: ' #3B444B',
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 1,
	},

	scrollContent: {
		padding: 15,
		paddingBottom: 100,
	},

	addToTeam: {
		backgroundColor: "#FF5D5D",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 20,
	},

	addToTeamText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",

		textShadowColor: ' #3B444B',
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: 1,
	},

});

export default PokemonDetails;
