import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function PostList({ onSelect, refreshSignal }) {
    const [posts, setPosts] = useState([]);
    const [sort, setSort] = useState('date');
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await api.get(`/posts?sort=${sort}`);
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [sort, refreshSignal]);

    return (
        <div className="relative overflow-hidden rounded-2xl border border-green-400/40 shadow-[0_0_30px_rgba(34,197,94,0.12)] bg-black/40 backdrop-blur-xl p-6">

            <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent">
                        Questions
                    </h3>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-black/50 px-4 py-2 text-green-200 border border-green-400/30 rounded-lg text-sm
                                   focus:border-green-300 focus:ring-2 focus:ring-green-400/40 transition-all duration-300"
                    >
                        <option value="date">Newest</option>
                        <option value="votes">Top</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="w-10 h-10 border-4 rounded-full animate-spin border-green-300 border-t-transparent"></div>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {posts.map(p => (
                            <li
                                key={p._id}
                                onClick={() => onSelect(p._id)}
                                className="p-5 rounded-xl bg-black/30 border border-green-400/20 hover:bg-black/50
                                           hover:border-green-400/60 cursor-pointer backdrop-blur-lg
                                           transition-transform duration-300 hover:scale-[1.03]
                                           shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="font-semibold text-green-100 text-lg group-hover:text-green-400 transition-colors">
                                            {p.title}
                                        </div>

                                        <div className="text-sm text-green-500/60">
                                            {p.author} • {new Date(p.createdAt).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/10 border border-green-500/30">
                                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                            </svg>
                                            <span className="text-sm font-semibold text-green-300">{p.votes}</span>
                                        </div>

                                        {p.answered && (
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-400/40 text-emerald-300 bg-emerald-500/10 text-xs">
                                                ✅ Answered
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
