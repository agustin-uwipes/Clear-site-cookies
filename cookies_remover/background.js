const GITHUB_URL = "https://github.com/agustin-uwipes/Clear-site-cookies/releases/latest";

chrome.runtime.onInstalled.addListener(() => {
    const version = chrome.runtime.getManifest().version;

    chrome.contextMenus.create({
        id: "check-updates",
        title: `Check for updates (v${version})`,
        contexts: ["action"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "check-updates") {
        chrome.tabs.create({
            url: GITHUB_URL
        });
    }
});

chrome.action.onClicked.addListener(async (tab) => {
    const url = new URL(tab.url);

    const cookies = await chrome.cookies.getAll({
        domain: url.hostname
    });

    for (const cookie of cookies) {
        const protocol = cookie.secure ? "https://" : "http://";

        await chrome.cookies.remove({
            url: protocol + cookie.domain.replace(/^\./, "") + cookie.path,
            name: cookie.name,
            storeId: cookie.storeId
        });
    }

    await chrome.browsingData.remove({
        origins: [url.origin]
    }, {
        // cache: true,
        cookies: true,
        // indexedDB: true,
        // localStorage: true,
        // serviceWorkers: true,
        // cacheStorage: true
    });

    chrome.action.setBadgeText({
        text: "✅",
        tabId: tab.id
    });

    setTimeout(() => {
        chrome.action.setBadgeText({
            text: "",
            tabId: tab.id
        });

        chrome.tabs.reload(tab.id);
    }, 500);

});