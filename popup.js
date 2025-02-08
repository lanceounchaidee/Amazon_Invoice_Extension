document.getElementById("downloadInvoices").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractInvoices
    });
});

document.getElementById("stopDownload").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop_download" });
});

function extractInvoices() {
    let invoiceLinks = [...document.querySelectorAll("a.a-link-normal")].filter(link =>
        link.innerText.includes("View invoice")
    ).map(link => link.href);

    chrome.runtime.sendMessage({ action: "download_invoices", invoices: invoiceLinks });
}