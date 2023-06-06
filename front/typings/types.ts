export interface Blooway {
  id: number;
  name: string;
  link: string;
  description: string;
  BuilderId: number;
}

export interface Area {
  id: number;
  name: string;
  secret: boolean;
  BloowayId: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  Blooways: Blooway[];
}

export interface UserWithOnline extends User {
  online: boolean;
}

export interface Talk {
  id: number;
  UserId: number;
  User: User; // 전송자
  content: string;
  createdAt: Date;
  AreaId: number;
  Area: Area;
}

export interface Private {
  id: number;
  SenderId: number;
  Sender: User;
  ReceiverId: number;
  Receiver: User;
  content: string;
  createdAt: Date;
}
