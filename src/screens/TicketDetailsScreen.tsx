import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { useTicketStore, Status } from '../store/tickets';
import CommentItem from '../components/CommentItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

export default function TicketDetailsScreen(
  { route, navigation }: NativeStackScreenProps<RootStackParamList, 'TicketDetails'>
) {
  const { ticketId } = route.params;

  const tickets       = useTicketStore((s) => s.tickets);
  const currentUser   = useTicketStore((s) => s.currentUser);
  const setStatus     = useTicketStore((s) => s.setStatus);
  const comments      = useTicketStore((s) => s.comments);
  const addComment    = useTicketStore((s) => s.addComment);
  const updateTicket  = useTicketStore((s) => s.updateTicket);
  const deleteTicket  = useTicketStore((s) => s.deleteTicket);

  const ticket = tickets.find((t) => t.id === ticketId);
  const [text, setText] = useState('');


  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (ticket) {
      setEditName(ticket.name);
      setEditDescription(ticket.description ?? '');
    }
  }, [ticket]);

  const ticketComments = useMemo(
    () => comments.filter((c) => c.ticketId === ticketId).sort((a, b) => a.createdAt - b.createdAt),
    [comments, ticketId]
  );

  if (!ticket) return <View style={{ padding: 20 }}><Text>Ticket not found.</Text></View>;

  const isOwner = !!(currentUser && ticket.createdById === currentUser.id);

  const onSave = () => {
    const nameTrim = editName.trim();
    if (!nameTrim) return;
    updateTicket(ticket.id, { name: nameTrim, description: editDescription });
    setIsEditing(false);
  };

  const onCancel = () => {
    setEditName(ticket.name);
    setEditDescription(ticket.description ?? '');
    setIsEditing(false);
  };

  const confirmDelete = () => {
    Alert.alert('Delete Ticket', 'Are you sure you want to delete this ticket?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => {
          deleteTicket(ticket.id);
          navigation.goBack();
        }
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {!isEditing ? (
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{ticket.name}</Text>
          <Text>{ticket.description}</Text>
          <Text style={{ color: '#6b7280', marginTop: 4 }}>Created by: {ticket.createdByName}</Text>

          {isOwner && (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <Pressable onPress={() => setIsEditing(true)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#2563EB' }}>
                <Text style={{ color: 'white' }}>Edit Ticket</Text>
              </Pressable>
              <Pressable onPress={confirmDelete} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#DC2626' }}>
                <Text style={{ color: 'white' }}>Delete</Text>
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <>
          <TextInput
            value={editName}
            onChangeText={setEditName}
            placeholder="Ticket title"
            style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 }}
          />
          <TextInput
            value={editDescription}
            onChangeText={setEditDescription}
            placeholder="Description"
            multiline
            style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginTop: 8, minHeight: 80 }}
          />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <Pressable
              onPress={onSave}
              disabled={!editName.trim()}
              style={{
                backgroundColor: editName.trim() ? '#10B981' : '#9CA3AF',
                paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8
              }}
            >
              <Text style={{ color: 'white' }}>Save</Text>
            </Pressable>
            <Pressable
              onPress={onCancel}
              style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }}
            >
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </>
      )}

      <Text style={{ marginVertical: 8 }}>Created: {new Date(ticket.createdAt).toLocaleString()}</Text>

      <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
        {(['Open', 'In Progress', 'Closed'] as Status[]).map((s) => {
          const active = ticket.status === s;
          const canPress = isOwner;
          return (
            <Pressable
              key={s}
              onPress={() => canPress && setStatus(ticket.id, s)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: '#ddd',
                backgroundColor: active ? '#111827' : 'white',
                opacity: canPress ? 1 : 0.5
              }}
            >
              <Text style={{ color: active ? 'white' : '#111827' }}>{s}</Text>
            </Pressable>
          );
        })}
      </View>

  
      <Text style={{ fontWeight: '600', marginBottom: 6 }}>Comments</Text>
      <FlatList
        data={ticketComments}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <CommentItem c={item} />}
        ListEmptyComponent={<Text>No comments yet.</Text>}
      />

  
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TextInput
          placeholder="Add a comment"
          value={text}
          onChangeText={setText}
          style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 }}
        />
        <Pressable
          onPress={() => {
            const v = text.trim();
            if (!v) return;
            addComment(ticket.id, v);
            setText('');
          }}
          style={{ backgroundColor: '#2563EB', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 }}
        >
          <Text style={{ color: 'white' }}>Post</Text>
        </Pressable>
      </View>
    </View>
  );
}
