import { backUrl } from '@functions/global';
import { useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const sockets: { [key: string]: Socket } = {};
const useSocket = (blooway?: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (blooway && sockets[blooway]) {
      // console.log('💠 Socket Disconnected');
      sockets[blooway].disconnect();
      delete sockets[blooway];
    }
  }, [blooway]);
  if (!blooway) {
    return [undefined, disconnect];
  }
  if (!sockets[blooway]) {
    // 연결된 소켓이 없었으면
    sockets[blooway] = io(`${backUrl}/bw-${blooway}`, {
      transports: ['websocket'],
    });
    // console.info('새 소켓 생성', blooway, sockets[blooway]);
    sockets[blooway].on('connect_error', (error) => {
      console.error(error);
      console.log(`connect_error due to ${error.message}`);
    });
  }
  // 이미 연결된 소켓이 있으면 기존 소켓 리턴
  return [sockets[blooway], disconnect];
};

export default useSocket;
