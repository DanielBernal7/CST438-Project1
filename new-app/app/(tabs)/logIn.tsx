import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

interface Pokemon {
  name: string;
  image: string;
}

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [starters, setStarters] = useState<Pokemon[]>([]);

  useEffect(() => {
    const fetchStarters = async () => {
      try {
        const starterIds = [1, 4, 7]; // Bulbasaur, Charmander, Squirtle
        const starterData = await Promise.all(
          starterIds.map(async (id) => {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return {
              name: response.data.name,
              image: response.data.sprites.front_default,
            };
          })
        );
        setStarters(starterData);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch starter Pokémon data.');
      }
    };

    fetchStarters();
  }, []);

  const handleLogin = async () => {
    if (username && password) {
      setLoading(true);
      try {
        // random Pokémon
        const randomId = Math.floor(Math.random() * 600) + 1; 
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const pokemonData = response.data;

        setPokemon({
          name: pokemonData.name,
          image: pokemonData.sprites.front_default,
        });

        Alert.alert('Welcome!', `Hello, ${username}! Here's your Pokémon: ${pokemonData.name}`);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch Pokémon data. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please enter both username and password.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, Trainer!</Text>
      </View>

      <View style={styles.loginBox}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#f0f0f0" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.starterTitle}>Starter Pokémon</Text>
      <View style={styles.starterContainer}>
        {starters.map((starter, index) => (
          <View key={index} style={styles.starterCard}>
            <Image source={{ uri: starter.image }} style={styles.starterImage} />
            <Text style={styles.starterName}>{starter.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Pokemon-Solid', // Use the Pokémon font
    color: '#ee1515',
    textAlign: 'center',
  },
  loginBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    color: '#222224',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#222224',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#222224',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#ee1515',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#f0f0f0',
    fontSize: 16,
    fontFamily: 'Pokemon-Solid', // Use the Pokémon font
  },
  starterTitle: {
    fontSize: 24,
    fontFamily: 'Pokemon-Solid', // Use the Pokémon font
    color: '#ee1515',
    marginTop: 20,
    marginBottom: 10,
  },
  starterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  starterCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  starterImage: {
    width: 80,
    height: 80,
  },
  starterName: {
    color: '#222224',
    fontSize: 16,
    textTransform: 'capitalize',
    marginTop: 5,
  },
});

export default LoginScreen;