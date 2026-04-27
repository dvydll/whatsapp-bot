// Antilink plugin
export interface AntilinkPlugin {
  setEnabled(jid: string, enabled: boolean): void;
  isEnabled(jid: string): boolean;
  addWhitelist(jid: string, link: string): void;
  getWhitelist(jid: string): string[];
}