import React, { useState } from 'react';
import { api } from '../api';

export default function NewPostForm({ onPosted }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit(e) {  
        e.preventDefault();
        if (!title.trim()) return alert('Title is required');
        setLoading(true);
        try {
            await api.post('/posts', { title, content, author: author || 'Learner' });
            setTitle(''); setContent(''); setAuthor('');
            onPosted?.();
        } catch (err) {
            console.error(err);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={submit}
            className="relative bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6 rounded-2xl shadow-2xl border border-green-500/40 backdrop-blur-xl overflow-hidden transition-all hover:border-green-400 hover:shadow-green-500/20"
        >
            <div className="absolute inset-0 bg-green-600/5 blur-2xl pointer-events-none"></div>
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -left-10 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <h2 className="font-bold text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 tracking-wide">
                    Create a Question
                </h2>

                <input
                    className="w-full bg-gray-900/80 border border-green-500/30 rounded-xl p-3 mb-4 text-green-50 placeholder-green-500/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/40 transition-all duration-300"
                    placeholder="Your name (optional)"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />

                <input
                    className="w-full bg-gray-900/80 border border-green-500/30 rounded-xl p-3 mb-4 text-green-50 placeholder-green-500/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/40 transition-all duration-300"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="w-full bg-gray-900/80 border border-green-500/30 rounded-xl p-3 mb-4 text-green-50 placeholder-green-500/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/40 transition-all duration-300 resize-none"
                    placeholder="Add details..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                />

                <button
                    className={`w-full px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-300 transform active:scale-95 ${
                        loading && 'opacity-50 cursor-not-allowed hover:scale-100'
                    }`}
                    disabled={loading}
                    type="submit"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Posting...
                        </span>
                    ) : (
                        'Post Question'
                    )}
                </button>
            </div>
        </form>
    );
}
