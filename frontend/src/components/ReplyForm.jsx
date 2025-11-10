import React, { useState } from 'react';
import { api } from '../api';

export default function ReplyForm({ postId, onReply }) {
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        if (!content.trim()) return;
        setLoading(true);
        try {
            await api.post(`/posts/${postId}/reply`, { author: author || 'Learner', content });
            setContent(''); setAuthor('');
            onReply?.();
        } catch (err) {
            console.error(err);
            alert('Failed to add reply');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-5 rounded-2xl border border-green-500/30 mt-4 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-green-500/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
                <input 
                    placeholder="Your name (optional)" 
                    className="w-full bg-gray-900/80 border border-green-500/30 rounded-xl p-3 mb-3 text-green-50 placeholder-green-500/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)} 
                />
                <textarea 
                    placeholder="Write a helpful reply..." 
                    className="w-full bg-gray-900/80 border border-green-500/30 rounded-xl p-3 mb-3 text-green-50 placeholder-green-500/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300 resize-none" 
                    rows={3} 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                />
                <div className="flex gap-2">
                    <button 
                        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300" 
                        disabled={loading}
                        onClick={submit}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Posting...
                            </span>
                        ) : 'Reply'}
                    </button>
                </div>
            </div>
        </div>
    );
}