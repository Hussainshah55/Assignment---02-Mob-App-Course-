import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = "@my_todo_tasks_v1";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = text.trim();
    if (!trimmed) return Alert.alert("Enter a task");
    const id = Date.now().toString();
    setTasks([{ id, text: trimmed, completed: false }, ...tasks]);
    setText("");
    Keyboard.dismiss();
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.taskRow}>
      <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.checkbox}>
        <Text style={styles.checkboxText}>{item.completed ? "✅" : "◻️"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.taskTextContainer}>
        <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.background}>
      {/* This inner view centers the content and limits the width */}
      <View style={styles.contentContainer}>
        
        <Text style={styles.title}>Todo App</Text>

        <View style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Add a new task..."
            style={styles.input}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false} 
          ListEmptyComponent={<Text style={styles.empty}>No tasks yet. Add one!</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 1. The Background (Full Screen)
  background: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center", // This ensures the content container stays in the middle
  },
  // 2. The Content Container (Constrained Width)
  contentContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 600, // THIS is the magic fix. It prevents stretching on wide screens.
    paddingHorizontal: 24, // Increased side spacing slightly
    paddingTop: 40,        // More top spacing for a cleaner look
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 24,
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 24, // More breathing room between input and list
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20, // More internal padding
    paddingVertical: 16,   // Taller input looks more modern
    borderRadius: 16,      // Softer corners
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    // Added soft shadow to input
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  addBtn: {
    marginLeft: 12,
    backgroundColor: "#007aff",
    borderRadius: 16,
    paddingHorizontal: 24,
    justifyContent: "center",
    // Added shadow to button
    shadowColor: "#007aff",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 18, // Taller list items
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "transparent", // Prepare for border on selection if needed
  },
  checkbox: {
    paddingRight: 16,
  },
  checkboxText: {
    fontSize: 22,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 17,
    color: "#333",
    fontWeight: "500",
  },
  taskTextCompleted: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  deleteBtn: {
    paddingLeft: 16,
  },
  deleteText: {
    fontSize: 20,
  },
  empty: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 18,
    color: "#aaa",
  },
});