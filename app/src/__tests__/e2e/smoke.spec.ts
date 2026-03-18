import { test, expect } from '@playwright/test'

test.describe('Тестовый тест', () => {
  test('Рендерит 404 страницу для несуществующего роута', async ({ page }) => {
    await page.goto('/definitely-not-a-real-route')
    await expect(page.getByText('This page could not be found')).toBeVisible()
  })
})
