import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TicketsScreen from '../screens/TicketsScreen';
import TicketDetailsScreen from '../screens/TicketDetailsScreen';
export type RootStackParamList = {
  Login: undefined;
  Tickets: undefined;
  TicketDetails: { ticketId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Tickets" component={TicketsScreen} options={{ title: 'Tickets' }} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} options={{ title: 'Ticket Details' }} />
    </Stack.Navigator>
  );
}
