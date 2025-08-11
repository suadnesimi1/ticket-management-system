import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useTicketStore } from '../store/tickets';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

export default function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const login = useTicketStore((s) => s.login);
  const currentUser = useTicketStore((s) => s.currentUser);
  const [name, setName] = useState('');


  useEffect(() => { if (currentUser) navigation.replace('Tickets'); }, [currentUser]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Ticket System Management</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        style={{ width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }}
      />
      <Pressable onPress={() => login(name.trim() || 'User')} style={{ backgroundColor: '#111827', padding: 12, borderRadius: 8, marginTop: 12 }}>
        <Text style={{ color: 'white' }}>Continue</Text>
      </Pressable>
    </View>
  );
}
