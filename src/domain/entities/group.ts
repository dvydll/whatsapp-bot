// Group entity
export interface Group {
  id: string;
  jid: string;
  name: string;
  welcomeEnabled: boolean;
  welcomeMessage: string;
  antilinkEnabled: boolean;
  createdAt: Date;
}

export type GroupCreate = Omit<Group, 'id' | 'createdAt'>;
export type GroupUpdate = Partial<Omit<Group, 'id'>>;