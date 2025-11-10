import React, { useEffect, useState } from 'react';
import { api } from '../api';
import ReplyForm from './ReplyForm';

export default function PostView({ postId, onBack }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await api.get(`/posts/${postId}`);
            setPost(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [postId]);

    async function upvote() {
        try {
            await api.post(`/posts/${postId}/upvote`);
            load();
        } catch (err) {
            console.error(err);
        }
    }

    async function markAnswered() {
        try {
            await api.post(`/posts/${postId}/answer`);
            load();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="relative overflow-hidden rounded-2xl border border-green-500/40 bg-black/40 backdrop-blur-xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)]">

            <div className="absolute -top-24 -left-24 w-80 h-80 bg-green-600/20 blur-[130px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/20 blur-[120px] rounded-full"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6 border-b border-green-400/30 pb-4">
                    <div>
                        <button
                            onClick={onBack}
                            className="text-green-300 hover:text-green-400 text-sm transition-colors"
                        >
                            ← Back
                        </button>

                        <h2 className="text-3xl font-extrabold mt-2 bg-gradient-to-r from-green-300 to-emerald-500 text-transparent bg-clip-text">
                            {post?.title || (loading && "Loading...")}
                        </h2>

                        <div className="text-green-400/60 text-sm mt-1">
                            {post?.author} • {post && new Date(post.createdAt).toLocaleString()}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-green-300 text-sm font-medium mb-2">
                            {post?.votes ?? 0} votes
                        </div>
                        <div className="space-x-3 flex">
                            <button
                                onClick={upvote}
                                className="px-4 py-2 text-sm font-medium border border-green-400/40 rounded-xl bg-green-500/10 text-green-300 hover:bg-green-500/20 hover:shadow-[0_0_10px_rgba(34,197,94,0.4)] transition-all"
                            >
                                Upvote
                            </button>
                            <button
                                onClick={markAnswered}
                                className="px-4 py-2 text-sm font-medium border border-emerald-500/40 rounded-xl bg-emerald-600/10 text-emerald-300 hover:bg-emerald-600/20 hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all"
                            >
                                Mark Answered
                            </button>
                        </div>
                    </div>
                </div>

                <article className="text-green-50 leading-relaxed mb-8">
                    <p className="text-green-200/90">{post?.content}</p>
                </article>

                <section className="mb-6">
                    <h3 className="font-bold text-xl text-green-300 mb-4">
                        Replies ({post?.replies?.length || 0})
                    </h3>

                    <div className="space-y-4">
                        {post?.replies?.map((r, i) => (
                            <div
                                key={i}
                                className="bg-black/30 border border-green-500/20 rounded-xl p-4 backdrop-blur-lg hover:border-green-400/40 transition-all"
                            >
                                <div className="text-sm text-green-400/70">
                                    {r.author} • {new Date(r.createdAt).toLocaleString()}
                                </div>
                                <div className="mt-2 text-green-100">
                                    {r.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <ReplyForm postId={postId} onReply={() => load()} />
            </div>
        </div>
    );
}
