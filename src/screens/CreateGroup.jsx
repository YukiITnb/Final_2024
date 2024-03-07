import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";

const CreateGroup = ({ navigation }) => {
  const [name, setName] = useState("");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your Group</Text>
      </View>
      <View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên nhóm có thể gồm ký tự chữ và số"
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
  },
});
