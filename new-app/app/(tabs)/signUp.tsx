import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
export default function SignUp() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up Brah</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Usssssaahhhhhname"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="passworddddd"
         placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sign Up NOW!!!</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    width: "25%",
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
});