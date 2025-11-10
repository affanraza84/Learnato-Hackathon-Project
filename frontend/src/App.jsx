import React, { useEffect, useState } from 'react';
import PostList from './components/PostList';
import PostView from './components/PostView';
import NewPostForm from './components/NewPostForm';
import { io } from 'socket.io-client';

// ✅ Updated socket configuration
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;   // remove localhost fallback
const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],  // enable both in case WebSocket upgrade fails
    withCredentials: true,
});

export default function App() {
    const [selected, setSelected] = useState(null);
    const [postsChanged, setPostsChanged] = useState(0);

    useEffect(() => {
        socket.on('connect', () => console.log('✅ Connected to socket:', socket.id));
        socket.on('post:created', () => setPostsChanged(n => n + 1));
        socket.on('post:updated', () => setPostsChanged(n => n + 1));
        socket.on('post:reply', () => setPostsChanged(n => n + 1));

        return () => socket.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 p-6">
            <div className="max-w-6xl mx-auto">

                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-green-600 bg-clip-text text-transparent tracking-wide">
                        Learnato — Discussion Forum
                    </h1>
                    <div className="text-sm text-green-300 opacity-80">
                        Empower learning through conversation
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <section className="lg:col-span-1 space-y-4">
                        <div className="rounded-xl shadow-xl border border-green-700/60 backdrop-blur-md bg-black/40 p-1">
                            <NewPostForm onPosted={() => setPostsChanged(n => n + 1)} />
                        </div>

                        <div className="rounded-xl shadow-xl border border-green-700/60 backdrop-blur-md bg-black/40 p-1">
                            <PostList onSelect={setSelected} refreshSignal={postsChanged} />
                        </div>
                    </section>

                    <section className="lg:col-span-2">
                        {selected ? (
                            <PostView postId={selected} onBack={() => setSelected(null)} />
                        ) : (
                            <div className="p-8 bg-black/40 border border-green-700/60 backdrop-blur-md rounded-xl shadow-xl">
                                <p className="text-xl font-semibold text-green-300">Select a post to view details</p>
                                <p className="mt-2 text-sm text-gray-300 opacity-80">
                                    Real-time updates enabled — new posts & replies appear instantly.
                                </p>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
