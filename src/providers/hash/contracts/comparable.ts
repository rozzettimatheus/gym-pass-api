export interface IComparable {
  compare(target: string, hash: string): Promise<boolean>
}
