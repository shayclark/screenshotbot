const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const { parse } = require('json2csv');
const cliProgress = require('cli-progress');

(async () => {
    const urls = [];
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');
    const outputDir = path.join(__dirname, 'output', timestamp);
    const screenshotsDir = path.join(outputDir, 'screenshots');
    const outputCsvPath = path.join(outputDir, 'output.csv');

    const MAX_CONCURRENT_PAGES = 5;

    // Create output directories
    fs.mkdirSync(screenshotsDir, { recursive: true });

    // Read URLs from CSV
    fs.createReadStream('urls.csv')
        .pipe(csv())
        .on('data', (row) => {
            const url = Object.values(row)[0];
            urls.push(url);
        })
        .on('end', async () => {
            const results = [];
            const browser = await puppeteer.launch();
            const progressBar = new cliProgress.SingleBar({
                format: 'Progress | {bar} | {percentage}% | {value}/{total} | {message}',
                hideCursor: true
            }, cliProgress.Presets.shades_classic);

            // Initialize the progress bar
            progressBar.start(urls.length, 0, { message: 'Starting...' });

            // Function to update the progress bar and message
            const updateProgress = (increment = 1, message = '') => {
                progressBar.increment(increment, { message });
            };

            const processUrl = async (url) => {
                try {
                    updateProgress(0, `Loading ${url}`);
                    const page = await browser.newPage();
                    const response = await page.goto(url, { waitUntil: 'networkidle2' });

                    if (!response.ok()) {
                        const status = response.status();
                        results.push({ url, status: `error - ${status}` });
                        await page.close();
                        return;
                    }

                    // Mobile Screenshot
                    updateProgress(0, `Taking mobile screenshot for ${url}`);
                    await page.setViewport({ width: 500, height: 1000 });
                    const mobileFileName = path.join(screenshotsDir, `${url.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-mobile.png`);
                    await page.screenshot({ path: mobileFileName, fullPage: true });

                    // Desktop Screenshot
                    updateProgress(0, `Taking desktop screenshot for ${url}`);
                    await page.setViewport({ width: 1920, height: 1080 });
                    const desktopFileName = path.join(screenshotsDir, `${url.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-desktop.png`);
                    await page.screenshot({ path: desktopFileName, fullPage: true });

                    results.push({ url, status: 'success' });
                    await page.close();
                } catch (error) {
                    results.push({ url, status: `error - ${error.message}` });
                }
                updateProgress(1, '');
            };

            // Process URLs in batches to limit concurrency
            for (let i = 0; i < urls.length; i += MAX_CONCURRENT_PAGES) {
                const urlBatch = urls.slice(i, i + MAX_CONCURRENT_PAGES);
                await Promise.all(urlBatch.map(url => processUrl(url)));
            }

            await browser.close();
            updateProgress(0, 'Finalizing...');
            progressBar.stop();

            // Write the results to the output CSV
            const csvData = parse(results);
            fs.writeFileSync(outputCsvPath, csvData);

            console.log('Screenshots and results saved to:', outputDir);
        });
})();