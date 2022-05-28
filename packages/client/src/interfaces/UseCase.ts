export interface UseCase<Input = void, Output = void> {
  name: string

  execute(options?: Input): Promise<Output>
}
