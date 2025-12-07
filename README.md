# 📄 DocReader – Real-Time Collaborative Document Editor

DocReader is a full-stack **real-time collaborative editor** built with **MERN**, **TipTap**, **Yjs**, **Socket.IO**, and **JWT Authentication**.  
Multiple users can edit the same document simultaneously — just like **Google Docs**.

This project supports:

✅ Live typing sync  
✅ Collaborative editing (CRDT - Yjs)  
✅ Document sharing (public/edit/view links)  
✅ Rich text formatting (bold, italic, headings, lists, colors)  
✅ Authentication & protected dashboard  
✅ Presence indicators  
✅ Real-time status updates  
✅ MongoDB for persistent storage  

---

## 🚀 Live Demo

### **Production Frontend:**  
🔗 https://docreader-aa9p.vercel.app

### **Backend API:**  
🔗 https://docreader-XXXX.onrender.com *(replace with your actual backend URL)*

---

## 🧰 Tech Stack

### **Frontend (Vite + React)**
- React 18
- TipTap (Rich Text Editor)
- Yjs + y-websocket (CRDT for collaboration)
- Socket.IO client (presence, typing indicators)
- TailwindCSS
- ShadCN UI
- JWT Auth (with context)

### **Backend (Node.js + Express)**
- Express REST API
- MongoDB + Mongoose
- Socket.IO for real-time collaboration presence
- y-websocket server for TipTap/Yjs
- JWT authentication
- CORS configured for Vercel + Render + localhost

---

## 🗂️ Folder Structure

