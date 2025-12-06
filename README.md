# Real-Time Collaborative Docs (MERN + TipTap + Yjs)

This project is a Google Docs–style real-time collaborative text editor built with:

- **Frontend**: React, Vite, TailwindCSS, TipTap, Yjs
- **Backend**: Node.js, Express, MongoDB, Socket.IO, y-websocket
- **Features**:
  - Authentication (login/register)
  - Dashboard with user documents
  - Google Docs–like rich text editor (bold, italic, underline, headings, lists, colors)
  - Real-time collaboration using **TipTap + Yjs**
  - Live collaborators list
  - Typing indicator ("X is typing...")
  - Auto-save to MongoDB every 10 seconds
  - Share button with:
    - Public edit link
    - View-only link (public_view)
    - Private mode

## 1. Prerequisites

- Node.js (LTS)
- npm or yarn
- MongoDB Atlas (recommended) or local MongoDB

## 2. Backend Setup (server)

```bash
cd server
npm install
```

Configure `.env` in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
# or
npm start
```

Backend runs on: `http://localhost:5000`

It also exposes a Yjs WebSocket endpoint for collaboration at:

- `ws://localhost:5000/collab`

## 3. Frontend Setup (client)

```bash
cd client
npm install
```

Configure `.env` in `client/`:

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 4. Usage

1. Open `http://localhost:5173` in a browser.
2. Register & login.
3. Create a new document in the dashboard.
4. Click **Open** to launch the TipTap editor.
5. Open the same URL in another browser/incognito window to see real-time collaboration:
   - Rich text changes (bold, italic, headings, lists, etc.) sync live.
   - Colored cursors show collaborators (via TipTap CollaborationCursor).
   - Typing indicator shows "username is typing...".

### Share button

- Click **Share** in the navbar on the editor page:
  - **Public edit link**: Anyone with this link can edit & view.
  - **View-only link**: Anyone with this link can only view.
  - **Make private**: Restricts access back to private.

For view-only links, the route `/view/:shareId` is used and the editor is opened in read-only mode (`shareMode="public_view"`).

## 5. Notes

- The collaborative content for current sessions is handled by **Yjs** and synchronized via the `/collab` WebSocket.
- An HTML snapshot of the document is periodically auto-saved in MongoDB (`content` field).
- You can extend this with version history, comments, or more advanced formatting using TipTap extensions.
