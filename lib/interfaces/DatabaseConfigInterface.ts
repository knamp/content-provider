export default interface DatabaseConfigInterface {
  fromMemory: boolean;
  database?: string;
  dialect?: string;
  host?: string;
  password?: string;
  username?: string;
}
