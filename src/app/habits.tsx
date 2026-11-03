
import { StyleSheet, Text, View } from 'react-native';

export default function HabitsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis hábitos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#263B30',
  },
});
