// small helper to broadcast events
module.exports = {
    emitNewPost: (io, post) => io.emit('post:created', post),
    emitUpdatedPost: (io, post) => io.emit('post:updated', post),
    emitNewReply: (io, { postId, reply }) => io.emit('post:reply', { postId, reply })
};
