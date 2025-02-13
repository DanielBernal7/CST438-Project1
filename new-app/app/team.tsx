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
interface party {
    party_id: number;
    mon1: number;
    mon2: number;
    mon3: number;
    mon4: number;
    mon5: number;
    mon6: number;
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
    const db = SQLite.openDatabaseSync('pokeDatabase.db');
    
    
    
    
    const router = useRouter();
    const [partyList, setPartyList] = useState<party[]>([]);
    const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    
    useEffect(() => {
        const fetchUsers =async () => {
            
            const result = await db.getAllAsync("select * from party;");
            console.log(result);
            setPartyList(result as party[]);
        };
        fetchUsers();
    }, []);
    useEffect(() => {
        console.log(pokemonList);
            const getPokemonData = async () => {
                try {
                    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1304");
                    const data = await response.json();
                    const allPokemon = data.results;
                    const selectedPokemon = [];
                    // const usedIndices = new Set();
                    // const db = SQLite.openDatabaseSync('pokeDatabase.db');
                    
                    
                    
                    // console.log(result);
                    // setPokemonList(result);
                    const party = partyList[0];
                    // for (const party of partyList) {
                        const pokemonIds = [party.mon1, party.mon2, party.mon3, party.mon4, party.mon5, party.mon6];
                        for (const id of pokemonIds) {
                            if (id) {
                                console.log(id);
                                const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
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
                        }
                    // }
                    
                    setPokemonList(selectedPokemon);
                    setIsLoading(false);
                } catch (error) {
                    console.log("Error fetching Pokémon data: ", error);
                    setIsLoading(false);
                }
            };
            getPokemonData();
        }, [partyList]);
    
        
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
        const handlePokemonPress = (pokemonId) => {
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