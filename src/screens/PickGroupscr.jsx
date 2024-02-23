import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

const items = [
  {
    label: 'general',
    users: 1023,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'office',
    users: 827,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'design',
    users: 72,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'marketing',
    users: 24,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'reports',
    users: 9,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
  {
    label: 'engineering',
    users: 239,
    description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
];

export default function PickGroup() {
  const [value, setValue] = React.useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Channels</Text>

        {items.map(({ label, users, description }, index) => {
          const isActive = value === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setValue(index);
              }}>
              <View style={[styles.radio, isActive && styles.radioActive]}>
                <View style={styles.radioTop}>
                  <Text style={styles.radioLabel}>#{label}</Text>

                  <Text style={styles.radioUsers}>
                    <Text style={{ fontWeight: '700' }}>{users}</Text> users
                  </Text>
                </View>

                <Text style={styles.radioDescription}>{description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  /** Radio */
  radio: {
    position: 'relative',
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 12,
    borderRadius: 6,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  radioActive: {
    borderColor: '#0069fe',
  },
  radioTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  radioUsers: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2f2f2f',
  },
  radioDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#848a96',
  },
});