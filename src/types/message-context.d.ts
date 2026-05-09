export interface MsgContext {
  info: any;
  from: string;
  type: string;
  body: string;

  comando: string;
  args: string[];
  q: string;

  sender: string;
  pushname: string;
  isOwner: boolean;

  isReg: boolean;
  isGroup: boolean;

  groupMembers: any[];
  groupAdmins: any[];

  isGroupAdmins: boolean;
  isBotGroupAdmins: boolean;

  sendMention: (txt: string, members: any[]) => void;

  BotNumber: string;
  welcome: string[];
  bngp: string[];

  antilink: string[];
  Antipv: string[];

  modoAdminList: string[];
  botActivo: boolean;

  isWelcome: boolean;
  isBanGp: boolean;

  isAntiLink: boolean;
  isAntipv: boolean;

  isModoAdmin: boolean;
  coins: number;
  roleData: any[];

  isQuotedVideo: boolean;
  isQuotedSticker: boolean;

  respuesta: any;
  sendText: (txt: string, opt?: any) => void;

  doSleep: (ms: number) => Promise<void>;
  sock: import('baileys').WASocket;
}