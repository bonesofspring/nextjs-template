import { type Locator } from '@playwright/test'

/**
 * Проверяет видимость элемента без выброса ошибки (возвращает false при таймауте/ошибке).
 * Удобно для условных проверок «если элемент есть — проверить что-то».
 */
export async function isVisibleSafe(locator: Locator): Promise<boolean> {
  return locator.isVisible().catch(() => false)
}
