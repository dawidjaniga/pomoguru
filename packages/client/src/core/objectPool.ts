import debugModule from 'debug'
const debug = debugModule('pomoguru:core:objectPool')

interface UseCasesMap {
  [useCase: string]: any
}

interface DefaultUseCases extends UseCasesMap {
  [useCase: string]: (...args: any) => void
}

export declare class Emitter<UseCases extends UseCasesMap = DefaultUseCases> {
  /**
   * UseCase names in keys and arrays with listeners in values.
   *
   * ```js
   * emitter1.events = emitter2.events
   * emitter2.events = { }
   * ```
   */
  events: Partial<{ [E in keyof UseCases]: UseCases[E][] }>

  /**
   * Add a listener for a given event.
   *
   * ```js
   * const unbind = ee.on('tick', (tickType, tickDuration) => {
   *   count += 1
   * })
   *
   * disable () {
   *   unbind()
   * }
   * ```
   *
   * @param event The event name.
   * @param cb The listener function.
   * @returns Unbind listener from event.
   */
  on<K extends keyof UseCases> (this: this, event: K, cb: UseCases[K]): void

  /**
   * Calls each of the listeners registered for a given event.
   *
   * ```js
   * ee.emit('tick', tickType, tickDuration)
   * ```
   *
   * @param event The event name.
   * @param args The arguments for listeners.
   */
  emit<K extends keyof UseCases> (
    this: this,
    event: K,
    ...args: Parameters<UseCases[K]>
  ): void
}

/**
 * Create event emitter.
 *
 * ```js
 * import { createNanoUseCases } from 'nanoevents'
 *
 * class Ticker {
 *   constructor() {
 *     this.emitter = createNanoUseCases()
 *   }
 *   on(...args) {
 *     return this.emitter.on(...args)
 *   }
 *   tick() {
 *     this.emitter.emit('tick')
 *   }
 * }
 * ```
 */
// export function createNanoUseCases<
//   UseCases extends UseCasesMap = DefaultUseCases
// > (): Emitter<UseCases>

export class ObjectPool<ObjectsMap> {
  private instances: Partial<{ [E in keyof ObjectsMap]: ObjectsMap[E][] }> = {}

  constructor (
    public creators: Partial<{ [E in keyof ObjectsMap]: ObjectsMap[E] }>
  ) {}

  // register (name: InstanceName, creator: Instance): void {
  //   if (!this.creators[name]) {
  //     this.creators[name] = creator
  //   }
  // }

  get<K extends keyof ObjectsMap> (name: K): ObjectsMap[K] {
    if (!this.instances[name]) {
      debug('no instance for object: %s', name)

      if (this.creators[name] && this.creators[name] instanceof Function) {
        // @ts-ignore
        this.instances[name] = new this.creators[name]()
      }
    }

    // @ts-ignore
    return this.instances[name]
  }
}
