import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal } from "react-native";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";

type User = {
  id: number;
  username: string;
  password: string;
};

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  
  const db = SQLite.openDatabaseSync("pokeDatabase.db");

  const fetchUsers = () => {
    try {
      const result = db.getAllSync("SELECT * FROM users;");
      console.log("Fetched users:", result);
      setUsers(result as User[]);
    } catch (error) {
      console.error("uh oh no users!: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setNewUsername(user.username);
    setNewPassword(user.password);
    setModalVisible(true);
  };

  const handleUpdate = () => {
    if (!editingUser) return;
    
    try {
      db.execSync(
        `UPDATE users SET username = '${newUsername}', password = '${newPassword}' WHERE id = ${editingUser.id};`
      );
      setModalVisible(false);
      fetchUsers(); 
    } catch (error) {
      console.error("Cant update the user man!!!!!!!!", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account List</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userLabel}>Username:</Text>
            <Text style={styles.userText}>{item.username}</Text>

            <Text style={styles.userLabel}>Password:</Text>
            <Text style={styles.userText}>{item.password}</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 50 }} />}
      />

      {/* Modal for Editing User */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Account</Text>

            <Text style={styles.userLabel}>Username:</Text>
            <TextInput
              style={styles.input}
              value={newUsername}
              onChangeText={setNewUsername}
            />

            <Text style={styles.userLabel}>Password:</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: "100%",
  },
  userLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  userText: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    
  },
  editButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default User;