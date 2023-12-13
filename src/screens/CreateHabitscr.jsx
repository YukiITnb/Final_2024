import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, TextInputBase } from 'react-native';
import React, { useState } from 'react'
// import TimePicker from 'react-native-picker-select';

import { icons } from '../constants';
import Colorpicker from '../components/Colorpicker';

const Weekday = [
  {
    id: 1,
    name: 'CN',
  },
  {
    id: 2,
    name: 'T2',
  },
  {
    id: 3,
    name: 'T3',
  },
  {
    id: 4,
    name: 'T4',
  },
  {
    id: 5,
    name: 'T5',
  },
  {
    id: 6,
    name: 'T6',
  },
  {
    id: 7,
    name: 'T7',
  },
]

const CreateHabit = ({navigation}) => {
  const [selectedDays, setSelectedDays] = useState([]);

  const handleDayPress = (id) => {
    if (selectedDays.includes(id)) {
      setSelectedDays(selectedDays.filter((dayId) => dayId !== id));
    } else {
      setSelectedDays([...selectedDays, id]);
    }
  };

  const handleSave = () => {
    console.log(selectedDays);
    navigation.navigate('Home');
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} >
            <Image source={icons.chevronLeft} resizeMode='contain' style={{width: 20, height: 20}}/>
            <Text style={styles.title}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Tạo thói quen</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên</Text>
          <TextInput style={styles.input} placeholder="Ví dụ: Học tiếng Anh" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={styles.input}
            placeholder="v.d. Học tiếng Anh 30 phút mỗi ngày"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Màu sắc</Text>
          <Colorpicker />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Chọn ngày thực hiện</Text>
          <FlatList
          data={Weekday}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.daycontainer,
                selectedDays.includes(item.id) && { backgroundColor: 'pink' },
              ]}
              onPress={() => handleDayPress(item.id)}
            >
              <Text style={[styles.daytext, selectedDays.includes(item.id) && { color: 'white' }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          horizontal
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nhắc nhở</Text>
          <TouchableOpacity style={styles.switch} onPress={handleSave}>
            <Text style={styles.switchText}>Save</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
  },
  switch: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  switchText: {
    fontSize: 16,
    textAlign: 'center',
  },
  iconContainer: {
    margin: 5,
    padding: 5,
    backgroundColor: '#eee',
    borderRadius: 5,
    width: 40,
    height: 40,
  },
  daycontainer: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  daytext: {
    fontSize: 14,
    color: "#000000",
  },
});

export default CreateHabit