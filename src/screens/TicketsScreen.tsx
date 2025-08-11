import React, { useMemo, useState, useLayoutEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  ViewStyle,
  Text,
  Pressable,
  Modal,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTicketStore, Ticket, Status } from '../store/tickets';
import TicketItem from '../components/TicketItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

const chip: ViewStyle = {
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  marginRight: 8,
};

export default function TicketsScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Tickets'>) {
  const currentUser = useTicketStore((s) => s.currentUser);
  const tickets = useTicketStore((s) => s.tickets);
  const addTicket = useTicketStore((s) => s.addTicket);
  const logout = useTicketStore((s) => s.logout);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status | 'All'>('All');
  const [sort, setSort] = useState<'Newest' | 'Oldest'>('Newest');

  // Create Ticket modal state
  const [showCreate, setShowCreate] = useState(false);
  const [newId, setNewId] = useState('');      // manual ticket number
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Header: logout on the LEFT, username on the RIGHT (optional)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Tickets',
      headerLeft: () => (
        <Pressable
          onPress={() => {
            logout();
            navigation.replace('Login');
          }}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 10,
            backgroundColor: '#EF4444',
            borderRadius: 8,
            marginLeft: 8,
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Logout</Text>
        </Pressable>
      ),
      headerRight: () =>
        currentUser?.name ? (
          <Text style={{ color: '#6B7280', marginRight: 8 }}>{currentUser.name}</Text>
        ) : null,
    });
  }, [navigation, currentUser, logout]);

  const data = useMemo(() => {
    let list: Ticket[] = tickets;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
      );
    }
    if (status !== 'All') list = list.filter((t) => t.status === status);
    return [...list].sort((a, b) =>
      sort === 'Newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );
  }, [tickets, query, status, sort]);

  const onCreateTicket = () => {
    const ticketId = newId.trim();
    const title = newName.trim();
    if (!ticketId || !title) return;

    try {
      const id = addTicket({
        id: ticketId,
        name: title,
        description: newDesc.trim() || undefined,
        status: 'Open',
      } as any); // store sets createdAt/createdBy

      setShowCreate(false);
      setNewId('');
      setNewName('');
      setNewDesc('');
      navigation.navigate('TicketDetails', { ticketId: id });
    } catch (err: any) {
      Alert.alert('Cannot create ticket', err?.message || 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            paddingHorizontal: 12,
          }}
        >
          <Text style={{ marginRight: 8, color: '#9CA3AF' }}>🔍</Text>
          <TextInput
            placeholder="Search by name or ticket number"
            value={query}
            onChangeText={setQuery}
            style={{ flex: 1, paddingVertical: 12 }}
            placeholderTextColor="#9CA3AF"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Text style={{ color: '#9CA3AF' }}>✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Filters & Sort */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          {(['All', 'Open', 'In Progress', 'Closed'] as const).map((s) => {
            const active = status === s;
            return (
              <Pressable
                key={s}
                onPress={() => setStatus(s as any)}
                style={[chip, { backgroundColor: active ? '#111827' : 'white' }]}
              >
                <Text style={{ color: active ? 'white' : '#111827' }}>{s}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {(['Newest', 'Oldest'] as const).map((s) => {
            const active = sort === s;
            return (
              <Pressable
                key={s}
                onPress={() => setSort(s)}
                style={[chip, { backgroundColor: active ? '#111827' : 'white' }]}
              >
                <Text style={{ color: active ? 'white' : '#111827' }}>{s}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* List / Empty */}
      {data.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
            No tickets found
          </Text>
          <Text style={{ color: '#6B7280', marginTop: 4, textAlign: 'center' }}>
            Try adjusting filters or create a new ticket.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TicketItem
              ticket={item}
              onPress={() =>
                navigation.navigate('TicketDetails', { ticketId: item.id })
              }
            />
          )}
        />
      )}

      {/* Floating Create Button */}
      <Pressable
        onPress={() => setShowCreate(true)}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 30,
          backgroundColor: '#2563EB',
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Text style={{ color: 'white', fontSize: 28, lineHeight: 28 }}>＋</Text>
      </Pressable>

      {/* Create Ticket Modal */}
      <Modal
        visible={showCreate}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreate(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
              Create Ticket
            </Text>

            {/* Ticket Number (manual) */}
            <TextInput
              placeholder="Ticket number (e.g., T-1001)"
              value={newId}
              onChangeText={setNewId}
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10, marginBottom: 8 }}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
            />

            <TextInput
              placeholder="Ticket title"
              value={newName}
              onChangeText={setNewName}
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 }}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              placeholder="Description (optional)"
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                padding: 10,
                marginTop: 8,
                minHeight: 80,
              }}
              placeholderTextColor="#9CA3AF"
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 12,
              }}
            >
              <Pressable
                onPress={() => {
                  setShowCreate(false);
                  setNewId('');
                  setNewName('');
                  setNewDesc('');
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#ddd',
                }}
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onCreateTicket}
                disabled={!newId.trim() || !newName.trim()}
                style={{
                  backgroundColor:
                    newId.trim() && newName.trim() ? '#2563EB' : '#9CA3AF',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
