export interface IHashable {
  hash(s: string, salt: number): Promise<string>
}
