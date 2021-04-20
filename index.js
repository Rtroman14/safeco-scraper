const puppeteer = require("puppeteer");

const repo = require("./repo");
const agentRepo = require("./agentRepo");
const agencyData = require("./repo.json");

const scrapePage = require("./src/scrapePage");
const scrapeUrls = require("./src/scrapeUrls");

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1366, height: 768 });

        // robot detection incognito - console.log(navigator.userAgent);
        page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
        );

        // await ripUrls(
        //     "https://insurance-agent.safeco.com/find-an-insurance-agency/app/colorado-insurance-agents/aurora"
        // );

        await ripAgents(page);

        await browser.close();
    } catch (error) {
        console.log("ERROR SCRAPING ---", error);
    }
})();

const ripUrls = async (url) => {
    await page.goto(url, {
        waitUntil: "networkidle2",
    });

    const scrapedUrls = await scrapeUrls(page);

    for (let scrapedUrl of scrapedUrls) {
        await repo.create(scrapedUrl);
    }
};

const ripAgents = async (page) => {
    for (let agency of agencyData) {
        if (!agency.scraped) {
            await page.goto(agency.url, {
                waitUntil: "networkidle2",
            });

            await page.waitForSelector(".footer");

            await page.waitFor(4000);

            const scrapedAgency = await scrapePage(page);

            for (let scrapedAgent of scrapedAgency) {
                await agentRepo.create(scrapedAgent);
            }

            await repo.update(agency.id, {
                scraped: true,
            });
        }
    }
};
