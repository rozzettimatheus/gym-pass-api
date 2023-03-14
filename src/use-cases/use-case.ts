export interface UseCase<A = any, R = void> {
  run(args?: A): Promise<R>
}
