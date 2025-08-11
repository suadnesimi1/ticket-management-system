import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Status = 'Open' | 'In Progress' | 'Closed';

export interface User { id: string; name: string; }
export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: number;
}
export interface Ticket {
  id: string;               // provided manually
  name: string;
  description?: string;
  status: Status;
  createdAt: number;
  createdById: string;
  createdByName: string;
}

interface State {
  currentUser?: User;
  tickets: Ticket[];
  comments: Comment[];

  login: (name: string) => void;
  logout: () => void;

  addTicket: (t: Omit<Ticket, 'createdAt' | 'createdById' | 'createdByName'>) => string;
  updateTicket: (id: string, updates: Partial<Omit<Ticket, 'id' | 'createdAt' | 'createdById' | 'createdByName'>>) => void;
  setStatus: (id: string, status: Status) => void;
  deleteTicket: (id: string) => void;

  addComment: (ticketId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
}

function trimOrEmpty(v?: string) {
  return (v ?? '').trim();
}

// Stable user id derived from username (so re-login with same name keeps same id)
const makeUserId = (name: string) => `user:${(name || '').trim().toLowerCase()}`;

export const useTicketStore = create<State>()(
  persist(
    (set, get) => ({
      currentUser: undefined,
      tickets: [],
      comments: [],

      // ---- FIXED: stable id + backfill ownership by matching name ----
      login: (name) => {
        const n = trimOrEmpty(name) || 'User';
        const id = makeUserId(n);

        set((state) => {
          // Backfill: any existing tickets/comments that were authored with this name
          // get reassigned to this stable id (useful if you created items before this fix).
          const retagTickets = state.tickets.map((t) =>
            t.createdByName?.trim() === n ? { ...t, createdById: id, createdByName: n } : t
          );
          const retagComments = state.comments.map((c) =>
            c.userName?.trim() === n ? { ...c, userId: id, userName: n } : c
          );

          return {
            currentUser: { id, name: n },
            tickets: retagTickets,
            comments: retagComments,
          };
        });
      },

      logout: () => set({ currentUser: undefined }),

      // CREATE — manual ticket number (id)
      addTicket: (t) => {
        const user = get().currentUser;
        if (!user) throw new Error('Must be logged in to create tickets');

        const id = trimOrEmpty(t.id);
        const name = trimOrEmpty(t.name);
        if (!id) throw new Error('Ticket number is required');
        if (!name) throw new Error('Ticket title is required');

        // unique id
        const exists = get().tickets.some((tk) => tk.id.toLowerCase() === id.toLowerCase());
        if (exists) throw new Error('A ticket with this number already exists');

        const ticket: Ticket = {
          id,
          name,
          description: trimOrEmpty(t.description) || undefined,
          status: t.status,
          createdAt: Date.now(),
          createdById: user.id,
          createdByName: user.name,
        };

        set({ tickets: [ticket, ...get().tickets] });
        return id;
      },

      // EDIT (title/description) — owner only
      updateTicket: (id, updates) => {
        const user = get().currentUser;
        set({
          tickets: get().tickets.map((t) => {
            if (t.id !== id || !user || t.createdById !== user.id) return t;
            const next = { ...t };
            if (updates.name !== undefined) next.name = trimOrEmpty(updates.name) || t.name;
            if (updates.description !== undefined) next.description = trimOrEmpty(updates.description) || undefined;
            return next;
          }),
        });
      },

      // STATUS — owner only
      setStatus: (id, status) => {
        const user = get().currentUser;
        set({
          tickets: get().tickets.map((t) =>
            t.id === id && user && t.createdById === user.id ? { ...t, status } : t
          ),
        });
      },

      // DELETE — owner only (also delete related comments)
      deleteTicket: (id) => {
        const user = get().currentUser;
        const isOwner = !!user && get().tickets.some((t) => t.id === id && t.createdById === user.id);
        if (!isOwner) return;
        set({
          tickets: get().tickets.filter((t) => t.id !== id),
          comments: get().comments.filter((c) => c.ticketId !== id),
        });
      },

      // COMMENTS
      addComment: (ticketId, text) => {
        const user = get().currentUser;
        if (!user) return;
        const v = trimOrEmpty(text);
        if (!v) return;
        const c: Comment = {
          id: `${ticketId}-${Date.now()}-${Math.random()}`,
          ticketId,
          userId: user.id,
          userName: user.name,
          text: v,
          createdAt: Date.now(),
        };
        set({ comments: [...get().comments, c] });
      },

      deleteComment: (commentId) => {
        const user = get().currentUser;
        set({
          comments: get().comments.filter(
            (c) => !(c.id === commentId && user && c.userId === user.id)
          ),
        });
      },
    }),
    {
      name: 'ticketing-system',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
