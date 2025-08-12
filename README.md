# 📋 Ticket Management App
  
  A simple React Native ticket management application that allows logged-in users to:
  
  Create tickets (with manual ticket number entry)
  
  Edit/delete only the tickets they created
  
  Add and manage comments on tickets (edit/delete own comments only)
  
  Search, filter, and sort tickets
  
  Log out from both the  header and the main screen
  
  View ticket details with description and comments

## ✨ Features
1. User Authentication
   
  Log in with username (no password for demo purposes)
  
  Logout option inthe  header and the main screen
  
3. Ticket Management
   
  Manual Ticket Number: User enters own ticket ID (e.g., T-1001)
  
  Create Ticket via pop-up modal form:
  
  Ticket Number (required)
  
  Title (required)
  
  Description (optional)
  
  Only ticket creator can:
  
  Edit title, description, and status
  
  Delete the ticket
  
  Other users can view but cannot edit/delete tickets they didn’t create

5. Filtering & Sorting
   
  Filter by status: All, Open, In Progress, Closed
  
  Sort tickets:
  
  Newest first
  
  Oldest first
  
  Search by ticket name or ticket number
  
5. Ticket Details & Comments
   
  View ticket details: number, title, description, status, creator name, date
  
  Add comments to tickets
  
  Edit/Delete only your comments
  
7. UI/UX

  Clean, consistent, modern design
  
  Rounded filter chips for status selection
  
  Floating + button to create new tickets
  
  Minimal, intuitive modal for ticket creation

## 🛠 Tech Stack
    
    1. React Native (Expo)
    2. TypeScript
    3. Zustand – lightweight global state management
    4. React Navigation – stack-based navigation
    5. AsyncStorage – persistent local storage
    6. React Native Modal – popup for creating tickets
    7. SafeAreaView – handles iOS/Android safe areas

## 📂 Project Structure

    src/
    components/
      TicketItem.tsx          # Displays a ticket in the list
      CommentItem.tsx         # Displays a single comment
    navigation/
      index.tsx               # Root navigation stack
    screens/
      LoginScreen.tsx         # Login form
      TicketsScreen.tsx       # Ticket list + search/filter/sort
      TicketDetailsScreen.tsx # Ticket details & comments
    store/
      tickets.ts              # Zustand store for state management
    App.tsx                     # Entry point

## 🚀 Getting Started

1️⃣ Install Dependencies

  ### npm install
  
2️⃣ Start App

  ### npx expo start
  
3️⃣ Run the App

 On Device → Scan the QR code in the Expo Go app (iOS/Android)

 On Emulator → Press i for iOS simulator or a for Android emulator in the terminal

## 📖 Usage

Login
Enter a username and tap Login.

Create Ticket

Tap + button

Fill in ticket number, title, and  optional description

Tap Create

Edit/Delete Ticket

Open the ticket you created

Tap Edit or Delete

Comments

Add comments under a ticket

Edit/Delete only your comments

Search & Filter

Search bar for ticket name or number

Filter by status

Sort newest/oldest

Logout

Tap the  logout button in the header or the main screen

## 🗂 State Management

The app uses Zustand with persistent storage.

Tickets: all created tickets

comments: all comments

currentUser: logged-in user info

## 🔒 Permissions

Only the ticket creator can edit/delete their ticket

Only the comment creator can edit/delete their comment

## 📌 Notes

No backend — data is stored locally in AsyncStorage

Clearing storage will reset app data
