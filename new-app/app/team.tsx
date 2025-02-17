import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native";
import * as SQLite from "expo-sqlite";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
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

const team = () => {
    
    
    
    
    const router = useRouter();
    const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    
    useEffect(() => {
        console.log(pokemonList);
            const getPokemonData = async () => {
                try {
                    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1304");
                    const data = await response.json();
                    const allPokemon = data.results;
                    const selectedPokemon = [];
                    
                    
                        for (let i = 1; i <= 6; i++) {
                            
                                
                                const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                                const pokemonData = await pokemonResponse.json();
                                selectedPokemon.push({
                                    id: pokemonData.id,
                                    name: pokemonData.name,
                                    types: pokemonData.types,
                                    sprites: {
                                        front_default: pokemonData.sprites.front_default
                                    }
                                });
                            
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
    
        
    const renderPokemonList = () => {
            const elements = [];
            for (let i = 0; i < pokemonList.length; i++) {
                const pokemon = pokemonList[i];
    
                elements.push(
                    <TouchableOpacity key={i} style={styles.pokemonimage} onPress={() => handlePokemonPress(pokemon.id)}>
                        <Image source={{ uri: pokemon.sprites.front_default }} style={styles.pokemonimage} />
                    </TouchableOpacity>
                );
            }
            return elements;
        };
        const handlePokemonPress = (pokemonId: number) => {
            //This will navigate to the Pokemon Details page, and also allows for the pokemonId to be passed as a parameter
            router.push(`/pokemon/${pokemonId}`);
        };
    return (
        <View style={styles.container}>
            <View style={styles.pokemoncontainer}>
            <View style={styles.pokemoncontainer}>
                {renderPokemonList()}
            </View>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    pokemoncontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "30%",
    },
    pokemonimage: {
        width: 100,
        height: 100,
    },
});
export default team;