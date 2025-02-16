
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../useAuth';


// export const UserContext = React.createContext(null);


//Here we are actually craeting the StartPage component
const StartPage = () => {
    const router = useRouter();

    useAuth(true);

    const fetchUser = async () => {
        const userData = await AsyncStorage.getItem('user');
        console.log("Hello", userData);
    };

    fetchUser();

    //This is a function that is meant to initialize the database. It is just a placeholder for now
    
    useEffect(() => {
    const  InitializeDatabase = async() => {
        const db = SQLite.openDatabaseSync('pokeDatabase.db');
        await db.execAsync(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS party (
        partyid INTEGER NOT NULL, mon1 INTEGER, mon2 INTEGER, mon3 INTEGER, mon4 INTEGER, mon5 INTEGER, mon6 INTEGER);    
        `
        );
            
    };
    InitializeDatabase();
}, []);
    
    // }
    // These function are meant to handle the press of buttons. They are just placeholders for now
    const handleExplorePress = () => {
        router.push('/explorePokemon');
        console.log('Explore pressed');
        // I intent to add navigation here later, this is just a placeholder
    };

    const handleSearchPress = () => {
        router.push('/searchPokemon');
        console.log('Search pressed');
        // I intent to add navigation here later, this is just a placeholder
    };

    const handleMyTeamPress = () => {
        router.push('/team')
        console.log('My Team pressed');
        // I intent to add navigation here later, this is just a placeholder
    };


	//To my knowledge, everything inside of this return() is what will show up on the page.
    return (
		//This is the main container for the page, it  holds everytihng. 
        <View style={styles.container}>
			{/* Right here is where I'm keeping the content, and it's being arranged*/}
            <View style={styles.contentContainer}>
                {/* This is the welcome section, this is for the welcome message */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.title}>Welcome to Pokédex</Text>
                    <Text style={styles.subtitle}>
                        Your journey into the world of Pokemon begins here!
                    </Text>
                </View>

                {/* This section here holds the three buttons  */}
                <View style={styles.buttonSection}>
					{/* The touchable oppoactiy is a button  */}
                    <TouchableOpacity style={styles.button} onPress={handleExplorePress}>
                        <Text style={styles.buttonText}>Explore Pokemon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleSearchPress}>
                        <Text style={styles.buttonText}>Search Pokemon</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleMyTeamPress}>
                        <Text style={styles.buttonText}>My Team</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


//This is just styling.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2E3057',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    buttonSection: {
        gap: 15, 
    },
    button: {
        backgroundColor: '#FF5D5D',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        borderColor: 'black',
        shadowColor: '#000',
        borderWidth: 1.5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textShadowColor: 'black',
        textShadowOffset:{width: 2, height: 2},
        textAlign: 'center',
    },
});

export default StartPage;