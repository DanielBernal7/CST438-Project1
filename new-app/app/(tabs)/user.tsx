import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import * as SQLite from 'expo-sqlite';

type User = {
  id: number;
  username: string;
  password: string;
};

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const db = SQLite.openDatabaseSync('pokeDatabase.db');
  const fetchUsers = () => {
    try {
      const result = db.getAllSync("SELECT * FROM users;");
      console.log("Fetched users:", result);
      setUsers(result as User[]);
    } catch (error) {
      console.error("uh oh no users!: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account List</Text>

      <View style={{ flex: 1, width: "100%" }}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text style={styles.userText}>{`Username: ${item.username}`}</Text>
              <Text style={styles.userText}>{`Password: ${item.password}`}</Text>
            </View>
          )}
          ListFooterComponent={<View style={{ height: 50 }} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#FF5D5D",
    borderRadius: 5,
    width: "80%",
  },
  userText: {
    color: "white",
    fontSize: 16,
  },
});

export default User;