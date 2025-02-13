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
    // useEffect(() => {
    //     const  InitializeDatabase = async() => {
    //         const db = SQLite.openDatabaseSync('pokeDatabase.db');
    //         await db.execAsync(`
    //             PRAGMA journal_mode = WAL;
    //             CREATE TABLE IF NOT EXISTS users (
    //             id INTEGER PRIMARY KEY AUTOINCREMENT,
    //             username TEXT UNIQUE NOT NULL,
    //             password TEXT NOT NULL
    //             );
    //             CREATE TABLE IF NOT EXISTS party (
    //             id INTEGER primary key NOT NULL,
    //             mon1 integer,
    //             mon2 integer,
    //             mon3 integer,
    //             mon4 integer,
    //             mon5 integer,
    //             mon6 integer);
    //             insert into users (username, password) values ('test', 'test');
    //             insert into party (id, mon1, mon2, mon3, mon4, mon5, mon6) values (1 ,6, 5, 4, 3, 2, 1);
    //             `);
    //             const testrow = await db.getFirstAsync('SELECT * FROM party');
    //             console.log(testrow);

    //     };
        
    //     InitializeDatabase();
    // }, []);
    // const
    const db = SQLite.openDatabaseSync('pokeDatabase.db');
    const InitializeDatabase =  () => {
        

        db.execAsync(`
            PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS party (
            id INTEGER primary key,mon1 INTEGER,mon2 INTEGER, mon3 INTEGER, mon4 INTEGER, mon5 INTEGER, mon6 INTEGER,
            FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE);
            insert into party(id, mon1, mon2, mon3, mon4, mon5, mon6) values (1, 6, 5, 4, 3, 2, 1);
            `);
        
            

    };
    useEffect(() => {
    InitializeDatabase();
}, []);
    
    const router = useRouter();
    const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // useEffect(() => {
    //     const fetchData = async () => {
            
    //     };
    //     fetchData();
    // }, []);
    useEffect(() => {
        const result = db.getAllAsync("SELECT * FROM party");
        console.log(result);
            const getPokemonData = async () => {
                try {
                    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1304");
                    const data = await response.json();
                    const allPokemon = data.results;
                    const selectedPokemon = [];
                    // const usedIndices = new Set();
                    // const db = SQLite.openDatabaseSync('pokeDatabase.db');
                    
                    
                    
                    for (let i = 0; i < 6; i++) {
                        const pokemonResponse = await fetch(allPokemon[i].url);
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
                    <TouchableOpacity key={i} style={styles.pokemonimage} >
                        <Image source={{ uri: pokemon.sprites.front_default }} style={styles.pokemonimage} />
    
                        
                            
    
                      
                    </TouchableOpacity>
                );
            }
            return elements;
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