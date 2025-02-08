document.addEventListener("DOMContentLoaded", () => {
    console.log("Amazon Invoice Downloader: Content script loaded.");

    // CODE TO FIND INVOICES LINKS
    let invoiceLinks = [...document.querySelectorAll("a.a-link-normal")].filter(link =>
        link.innerText.includes("View invoice")
    ).map(link => link.href);

    if (invoiceLinks.length === 0) {
        console.log("No invoices found.");
        return;
    }

    console.log(`Found ${invoiceLinks.length} invoices.`);

    // SEND INVOICES TO background.js
    chrome.runtime.sendMessage({ action: "download_invoices", invoices: invoiceLinks });
});