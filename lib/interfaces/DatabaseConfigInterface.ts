export default interface DatabaseConfigInterface {
  fromMemory: boolean;
  active?: boolean;
  database?: string;
  dialect?: string;
  host?: string;
  password?: string;
  username?: string;
  logging?: (...params) => void;
  pool?: {
    max?: number;
    min?: number;
    idle?: number;
  };
  port?: number;
  seederStorage?: string;
}
