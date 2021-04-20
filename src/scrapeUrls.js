module.exports = async (page) => {
    try {
        let scrapedUrls = await page.evaluate(() => {
            let allUrls = [];

            const getHref = (doc, selector) => {
                if (doc.querySelector(selector)) {
                    return doc.querySelector(selector).href;
                }

                return "";
            };

            // get all agents
            const agents = document.querySelectorAll(".agencyCol .cityStateAgencyBlocks");

            for (let agent of agents) {
                const url = getHref(agent, "a.cityStateName");
                allUrls.push({
                    url,
                    scraped: false,
                });
            }

            return allUrls;
        });

        return scrapedUrls;
    } catch (error) {
        console.log("SCRAPEURLS() ---", error);
    }
};
