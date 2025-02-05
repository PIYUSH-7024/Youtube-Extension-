chrome.runtime.onInstalled.addListener(() => {
    console.log('Focus Tube Extension Installed');
});

// Open the recommendations page when "Continue" or "Save" is clicked
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'recommendations.html' });
});
