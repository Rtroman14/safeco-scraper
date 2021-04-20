module.exports = async (page) => {
    try {
        let scrapedAgencies = await page.evaluate(() => {
            let allAgentsData = [];

            const getText = (doc, selector) => {
                if (doc.querySelector(selector)) {
                    return doc.querySelector(selector).innerText;
                }

                return "";
            };

            const getHref = (doc, selector) => {
                if (doc.querySelector(selector)) {
                    return doc.querySelector(selector).href;
                }

                return "";
            };

            // get all agents
            const agents = document.querySelectorAll(".profileTeamContainer #agentsList");

            let street = getText(
                document,
                "p[ng-show='agencyInformation.agencyModel.agencyAddress1 ']"
            );
            let city = getText(document, "p[ng-show='agencyInformation.agencyModel.agencyCity']");
            let website = getHref(document, "#apgWebsite");

            let numAgents = 1;

            for (let agent of agents) {
                let agentData = {
                    agency: getText(document, "#profileMapTitle"),
                    name: getText(agent, ".agentName"),
                    phone: getText(agent, ".agentPhone "),
                    email: getHref(agent, ".agentEmail").replace("mailto:", ""),
                    street,
                    city,
                    website,
                };

                allAgentsData.push(agentData);

                numAgents++;
            }

            return allAgentsData;
        });

        return scrapedAgencies;
    } catch (error) {
        console.log("SCRAPEPAGE() ---", error);
    }
};
