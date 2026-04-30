import { test, expect } from '@playwright/test'

test.describe('Reddit Mini App', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app before each test
        await page.goto('/')
    })
    
    test('loads with posts visible', async ({ page }) => {
        // expect post cards to be visible
        const postCards = page.locator('[aria-label^="Select post:"]')
        // assert at least one visible post card
        await expect(postCards.first()).toBeVisible()
    })

    test('search filters posts', async ({ page }) => {
        // use nonsense query "zzzzzzzzzzz" to filter posts
        const searchInput = page.locator('input[placeholder*="Search"]')
        await searchInput.fill('zzzzzzzzzzz')
        // expect no posts found is visible 
        await expect(page.locator('text=No posts found')).toBeVisible()
    })

    test('click post shows details', async ({ page }) => {
        // click on first post 
        const firstPost = page.locator('[aria-label^="Select post:"]').first()
        await firstPost.click() 
        // assert aria-pressed=true for selected post 
        await expect(firstPost).toHaveAttribute('aria-pressed', 'true')
        // assert that post detail content is visible after selection
        // on desktop: detail card appears; on mobile: card expands inline
        const postTitle = await firstPost.locator('h3').textContent()
        const detailTitle = page.locator('h2').filter({ hasText: postTitle?.trim() ?? '' })
        await expect(detailTitle).toBeVisible()
    })
})