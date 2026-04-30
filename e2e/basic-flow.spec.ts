import { test, expect } from '@playwright/test'

test.describe('Reddit Mini App', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app before each test
        await page.goto('http://localhost:5173')
    })
    
    test('loads with posts visible', async ({ page }) => {
        // expect post cards to be visible
        const postCards = page.locator('[role="button"]')
        await expect(postCards).toHaveCount(10) // expect 10 posts to be loaded
    })

    test('search filters posts', async ({ page }) => {
        // type in search bar 
        await page.fill('input[placeholder*="Search"]', 'test')
        // expect filtered results 
        const postCards = page.locator('[role="button"]')
        await expect(postCards).toHaveCount(0) // or however many match the search query
    })

    test('click post shows details', async ({ page }) => {
        // click on first post 
        const firstPost = page.locator('[role="button"]').first()
        await firstPost.click() 
        // on desktop, expect PostDetail panel 
        // on mobile, expect expanded content in card
        const details = page.locator('h2') // or some selector for the post detail title
        await expect(details).toContainText('Trending')
    })
})