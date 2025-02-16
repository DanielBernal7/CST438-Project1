//@ts-nocheck

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import * as SQLite from "expo-sqlite"; // Using the “sync” version from your existing code
import { useRouter } from "expo-router";
import { push } from "expo-router/build/global-state/routing";
import AsyncStorage from '@react-native-async-storage/async-storage';



// Login screen that checks user credentials in local DB and displays 3 starter Pokémon from PokéAPI
export default function Login({ navigation }: { navigation: any }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [starters, setStarters] = useState<any[]>([]);
  const router = useRouter();

  // Same openDatabaseSync call used in SignUp
  const db = SQLite.openDatabaseSync("pokeDatabase.db");

  useEffect(() => {
    fetchStarterPokemon();
  }, []);

  // Fetch 3 starter Pokémon from PokéAPI
  const fetchStarterPokemon = async () => {
    try {
      const starterNames = ["bulbasaur", "charmander", "squirtle"];
      const fetchedData = [];
      for (const name of starterNames) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await response.json();
        fetchedData.push(data);
      }
      setStarters(fetchedData);
    } catch (error) {
      console.log("Error fetching Pokémon:", error);
      setErrorMessage("Failed to load Pokémon data.");
    }
  };

  // Check user credentials from local DB
  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Please provide both username and password");
      return;
    }

    try {
      const result = db.getAllSync(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password]
      );
      if (result && result.length > 0) {
        setErrorMessage("");
        const user = result[0];
        await AsyncStorage.setItem("user", JSON.stringify({ id: user.id, username: user.username }));
        alert("Login successful!");
        router.push("/startPage");
      } else {
        setErrorMessage("Invalid username or password.");
      }
    } catch (error) {
      console.log("Error checking credentials:", error);
      setErrorMessage("An error occurred during login.");
    }
  };

  // Navigate to SignUp screen
  const handleGoToSignUp = () => {
    router.push("/signUp");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PokéLogin</Text>
      <Text style={styles.subtitle}>Enter the world of Pokémon!</Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Trainer Name"
        placeholderTextColor="#555"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Secret Password"
        placeholderTextColor="#555"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleGoToSignUp} style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>Need a PokéTrainer Account? Sign Up!</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={styles.startersContainer}>
        {starters.map((pokemon) => (
          <View key={pokemon.id} style={styles.pokemonCard}>
            <Text style={styles.pokemonName}>{pokemon.name}</Text>
            {pokemon.sprites?.front_default && (
              <Image
                source={{ uri: pokemon.sprites.front_default }}
                style={styles.pokemonImage}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// Basic Pokémon-themed styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFCB05",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2A75BB",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#2A75BB",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#2A75BB",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
  },
  loginButton: {
    backgroundColor: "#2A75BB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    backgroundColor: "#EE6B2F",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 30,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  startersContainer: {
    marginTop: 10,
  },
  pokemonCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
    width: 120,
  },
  pokemonName: {
    textTransform: "capitalize",
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A75BB",
    marginBottom: 5,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
});
