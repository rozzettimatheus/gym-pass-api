export interface IUseCase<A = any, R = void> {
  run(args?: A): Promise<R>
}
