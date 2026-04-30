// configuration for playwright test, specifying test directory, timeout, and other settings
import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: '.',
    use: { baseURL: 'http://localhost:5173' },
    webServer: { command: 'npm run dev', port: 5173, reuseExistingServer: !process.env.CI },
    timeout: 30000, // increase timeout for slower environments
    reporter: 'html', // generate HTML report for test results
    projects: [
        { name: 'chromium', use: { browserName: 'chromium' } },
        { name: 'firefox', use: { browserName: 'firefox' } },
        { name: 'webkit', use: { browserName: 'webkit' } },
    ],
})