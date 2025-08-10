import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Ticket } from '../store/tickets';

function StatusBadge({ status }: { status: Ticket['status'] }) {
  const map: Record<Ticket['status'], { bg: string; fg: string }> = {
    'Open': { bg: '#DBEAFE', fg: '#1D4ED8' },
    'In Progress': { bg: '#FEF3C7', fg: '#92400E' },
    'Closed': { bg: '#DCFCE7', fg: '#166534' },
  };
  const { bg, fg } = map[status];
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
      <Text style={{ color: fg, fontWeight: '600', fontSize: 12 }}>{status}</Text>
    </View>
  );
}

export default function TicketItem({ ticket, onPress }: { ticket: Ticket; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: '#111827', flexShrink: 1 }}>{ticket.name}</Text>
        <StatusBadge status={ticket.status} />
      </View>
      {ticket.description ? (
        <Text style={{ color: '#4B5563', marginTop: 6 }} numberOfLines={2}>
          {ticket.description}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <Text style={{ color: '#6B7280', fontSize: 12 }}>{ticket.id}</Text>
        <Text style={{ color: '#6B7280', fontSize: 12 }}>
          {new Date(ticket.createdAt).toLocaleDateString()} • {ticket.createdByName}
        </Text>
      </View>
    </Pressable>
  );
}
