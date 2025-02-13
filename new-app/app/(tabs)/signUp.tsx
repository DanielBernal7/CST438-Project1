import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //database stufs
  const db = SQLite.openDatabaseSync('pokeDatabase.db');
  const initializeDatabase = () => {
    db.execAsync(`
      PRAGMA journal_mode = WAL;
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS party (
            partyid INTEGER PRIMARY KEY not null,
            mon1 INTEGER,
            mon2 INTEGER,
            mon3 INTEGER,
            mon4 INTEGER,
            mon5 INTEGER,
            mon6 INTEGER,
            FOREIGN KEY (partyid) REFERENCES users(id) ON DELETE CASCADE);
            
            `);
  };

  useEffect(() => {
    initializeDatabase();
  }, []);
  useEffect(() => {
    const insertData = async () => {
      await db.execAsync(`insert into party(id, mon1, mon2, mon3, mon4, mon5, mon6) values (1, 6, 5, 4, 3, 2, 1);`);
    }
    insertData();
    }, []);
  const handleSignUp = () => {
    
    if (!username || !password) {
      setErrorMessage("Fill out both brah");
      return;
    }

    try {
      const result = db.getAllSync(`SELECT * FROM users WHERE username = ?`, [username]);

      if (result.length > 0) {
        setErrorMessage("This name is already being used dummy!");
      } else {
        db.execAsync(`
          INSERT INTO users (username, password) 
          VALUES ('${username}', '${password}');
        `);
        setErrorMessage("");
        alert("sucessfully signed up!!!");
      }
    } catch (error) {
      setErrorMessage("There was an error brah");
      console.error("THIS COULD NOT BE INSERTED IN THE DATABASE", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up!!!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",  
    padding: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#FF5D5D",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default SignUp;