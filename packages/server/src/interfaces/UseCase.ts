export interface UseCase<Input, Output> {
  execute(options: Input): Promise<Output>
}
