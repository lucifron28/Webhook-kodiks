async function postWebhook() {
    const apiUrl = "https://environment.data.gov.uk/flood-monitoring/id/floods";
    const webhookUrl = "https://mseufeduph.webhook.office.com/webhookb2/8ef714f6-81de-4b42-ad2e-c262d5ce04d1@ddedb3cc-596d-482b-8e8c-6cc149a7a7b7/IncomingWebhook/6df630f3353c4b2a8ec37e4fa6d7ecd1/e0510d66-17c3-43f4-a3ef-0cf6a6fba189/V2Epa08tX2A0vihBCTaa6xE1g4wlAgOQCtYMwCKp2H6FQ1";
    console.log("Fetching data from", apiUrl);
    const severityThreshhold = parseFloat(document.getElementById("st").value);
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        let warnings = "";
        data.items.forEach(item => {
            if (item.severityLevel <= severityThreshhold) {
                warnings += `Flood warning for ${item.description}\n`;
                warnings += `Area: ${item.eaAreaName}\n`;
                warnings += `Severity: ${item.severityLevel}\n`;
                warnings += `🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊🌊\n\n`;
        });
        
        console.log(warnings);
        const payload = {
            "type": "message",
            "attachments": [
              {
                "contentType": "application/vnd.microsoft.card.adaptive",
                "content": {
                  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                  "type": "AdaptiveCard",
                  "version": "1.4",
                  "body": [
                    {
                      "type": "TextBlock",
                      "text": warnings.replace(/\n/g, '\n\n'),
                      "wrap": true,
                      "size": "Medium",
                      "spacing": "Medium"
                    }
                  ]
                }
              }
            ]
          };
          
        const responseWebHook = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "no-cors",
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}