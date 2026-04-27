// Group service interface
export interface GroupService {
  getGroup(jid: string): Promise<GroupInfo | null>;
  setWelcome(jid: string, enabled: boolean, message?: string): Promise<void>;
  setAntilink(jid: string, enabled: boolean): Promise<void>;
}

export interface GroupInfo {
  id: string;
  jid: string;
  name: string;
 welcomeEnabled: boolean;
  welcomeMessage: string;
  antilinkEnabled: boolean;
}