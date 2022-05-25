export interface UseCase<Input = void, Output = void> {
  execute(options: Input): Promise<Output>
}
