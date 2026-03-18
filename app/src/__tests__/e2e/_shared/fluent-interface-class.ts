/**
 * Базовый класс для fluent interface с асинхронными методами.
 *
 * Идея: вместо того чтобы писать `await` после каждого шага,
 * мы создаём "цепочку" — объект-обёртку, который ставит вызовы
 * в очередь и выполняет их последовательно.
 *
 * Как работает:
 * 1) `fluent()` возвращает Proxy-объект, который перехватывает обращения
 *    к методам экземпляра (например `load`, `checkBasicDisplay` и т.д.).
 * 2) Каждый вызов метода не выполняется сразу, а добавляется в очередь `queue`.
 * 3) Каждый следующий вызов ждёт завершения предыдущего — порядок вызовов сохранён.
 * 4) `done()` возвращает Promise, который резолвится, когда очередь закончилась,
 *    и отдаёт исходный экземпляр класса (чтобы можно было продолжать работу).
 *
 * Это позволяет писать:
 *   await page.fluent().load().checkBasicDisplay().checkTypesFilter().done()
 *
 * Важно:
 * - Ошибки любого шага прерывают цепочку и пробрасываются в `done()`.
 * - Обычные async-методы класса остаются рабочими и могут вызываться напрямую.
 * - Chain можно `await`-ить напрямую (оно дождётся очереди и вернёт target),
 *   но `done()` остаётся явным и предпочтительным способом завершать цепочку.
 */
export type TFluentChain<T extends object> = {
  done: () => Promise<T>
  then: Promise<T>['then']
} & {
  [K in keyof T]: T[K] extends (...args: infer Args) => unknown
    ? (...args: Args) => TFluentChain<T>
    : never
}

export abstract class FluentInterfaceClass<T extends FluentInterfaceClass<T>> {
  private queue: Promise<void> = Promise.resolve()

  /**
   * Возвращает fluent-цепочку для этого экземпляра.
   * Используйте `done()` в конце, чтобы дождаться выполнения всех шагов.
   */
  public fluent(this: T): TFluentChain<T> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- target нужен для closure в ProxyHandler, где this имеет другой контекст
    const target = this
    let proxy: TFluentChain<T>

    const handler: ProxyHandler<TFluentChain<T>> = {
      get: (_unused, prop) => {
        if (prop === 'done') {
          return async () => {
            await this.queue

            return target
          }
        }

        // Делаем chain thenable, чтобы `await chain` ждал очередь
        if (prop === 'then') {
          return (onFulfilled?: (value: T) => unknown, onRejected?: (reason: unknown) => unknown) =>
            this.queue.then(() => target).then(onFulfilled, onRejected)
        }

        const value = (target as Record<PropertyKey, unknown>)[prop]

        if (typeof value === 'function') {
          return (...args: unknown[]) => {
            this.queue = this.queue
              .then(() => (value as (...params: unknown[]) => unknown).apply(target, args))
              .then(() => undefined)

            return proxy
          }
        }

        return value
      },
    }

    proxy = new Proxy({} as TFluentChain<T>, handler)

    return proxy
  }
}
