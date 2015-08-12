chrome.browserAction.onClicked.addListener(function(tab) {
	var viewTabUrl = chrome.extension.getURL('index.html');

	chrome.tabs.create({ url: viewTabUrl });
});

