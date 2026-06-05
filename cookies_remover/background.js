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
        cache: true,
        cookies: true,
        // indexedDB: true,
        // localStorage: true,
        // serviceWorkers: true,
        // cacheStorage: true
    });

    chrome.tabs.reload(tab.id);
});