import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTicketStore, Comment } from '../store/tickets';

export default function CommentItem({ c }: { c: Comment }) {
  const currentUser = useTicketStore((s) => s.currentUser);
  const deleteComment = useTicketStore((s) => s.deleteComment);
  const canDelete = currentUser?.id === c.userId;
  return (
    <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: '600' }}>{c.userName}</Text>
        <Text>{new Date(c.createdAt).toLocaleString()}</Text>
      </View>
      <Text style={{ marginTop: 6 }}>{c.text}</Text>
      {canDelete && (
        <Pressable onPress={() => deleteComment(c.id)} style={{ alignSelf: 'flex-end', marginTop: 6 }}>
          <Text style={{ color: 'red' }}>Delete</Text>
        </Pressable>
      )}
    </View>
  );
}
