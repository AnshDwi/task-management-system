let ioInstance = null;

const setSocketServer = (io) => {
  ioInstance = io;
};

const emitTaskEvent = (userId, eventName, payload) => {
  if (!ioInstance) {
    return;
  }

  ioInstance.to(`user:${userId}`).emit(eventName, payload);
};

module.exports = {
  setSocketServer,
  emitTaskEvent,
};
