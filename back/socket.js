const SocketIO = require("socket.io");

const onlineMap = {};
module.exports = (server, app) => {
  const io = SocketIO(server, {
    path: "/socket.io",
  });
  app.set("io", io);
  app.set("onlineMap", onlineMap);
  const dynamicNamespace = io.of(/^\/bw-.+$/).on("connect", (socket) => {
    const newNamespace = socket.nsp;
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }
    socket.on("signin", ({ id, areas }) => {
      onlineMap[socket.nsp.name][socket.id] = id;
      newNamespace.emit(
        "onlineList",
        Object.values(onlineMap[socket.nsp.name])
      );
      areas.forEach((area) => {
        socket.join(`${socket.nsp.name}-${area}`);
      });
    });
    socket.on("disconnect", () => {
      delete onlineMap[socket.nsp.name][socket.id];
      newNamespace.emit(
        "onlineList",
        Object.values(onlineMap[socket.nsp.name])
      );
    });
  });
};
