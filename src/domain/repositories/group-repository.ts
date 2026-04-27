// Group repository interface
import type { Group, GroupCreate, GroupUpdate } from '../entities/group.js';

export interface GroupRepository {
  findById(id: string): Promise<Group | null>;
  findByJid(jid: string): Promise<Group | null>;
  create(data: GroupCreate): Promise<Group>;
  update(id: string, data: GroupUpdate): Promise<Group>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Group[]>;
}