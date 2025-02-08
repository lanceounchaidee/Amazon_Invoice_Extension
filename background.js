let running = false;
//TRACK IF THE INVOICE TABS BY CREATING AN LIST
let openedTabs = [];

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "download_invoices" && message.invoices) {
        if (running) {
            console.log("Download already in progress...");
            return;
        }

        running = true;
        //RESETS THE LIST
        openedTabs = []; 

        message.invoices.forEach((invoiceUrl, index) => {
            setTimeout(() => {
                //STOPS THE TAB FROM USER INPUT
                if (!running) return;
                
                chrome.tabs.create({ url: invoiceUrl, active: false }, (tab) => {
                    //STORES THE TAB ID SO IT CAN CLOSE LATER
                    openedTabs.push(tab.id); 
                    // TRIGGERS DOWNLOAD
                    setTimeout(() => {
                        chrome.downloads.download({ url: invoiceUrl }, () => {
                            // CLOSES TAB AFTER DOWNLOAD USING TAB ID
                            chrome.tabs.remove(tab.id, () => console.log(`Closed tab ${tab.id}`));
                        });
                    }, 3000);
                });
                //IF IT RUNS TOO FAST IT'LL CAUSE MEMORY ISSUES SO A DELAY IS NEEDED
            }, index * 5000);
        });
    }

    if (message.action === "stop_download") {
        running = false;
        console.log("Invoice download stopped.");

        // CLOSES ALL INVOICES
        openedTabs.forEach(tabId => {
            chrome.tabs.remove(tabId, () => console.log(`Closed tab ${tabId}`));
        });
        // RESETS/CLEARS THE LIST
        openedTabs = [];
    }
});