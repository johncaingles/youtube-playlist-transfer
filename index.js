const puppeteer = require('puppeteer');

async function transferPlaylist() {
	let transferredCount = 0;
	let deletedCount = 0

	const browser = await puppeteer.launch({
			executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
			userDataDir: '.\\Chrome\\User Data',
			headless:false,
			defaultViewport: null,
			ignoreDefaultArgs: ['--disable-extensions'],
			args: [
				'--start-maximized',
				'--no-sandbox',
				'--disable-setuid-sandbox'
			]
	});
  const page = await browser.newPage();
	await page.goto('https://www.youtube.com/playlist?list=WL');
	
	await page.waitForSelector('ytd-playlist-video-renderer')
	const optionButtons = await page.$$('ytd-playlist-video-renderer button.style-scope.yt-icon-button')
	for(optionButton of optionButtons) {
		// click ...
		await optionButton.click()

		// wait dropdown
		await page.waitForSelector('iron-dropdown.ytd-popup-container', {visible: true})
		await page.waitForTimeout(500)
		const tablist = await page.$$('ytd-menu-service-item-renderer')

		// click after ...
		if(tablist.length == 1) {
			await tablist[0].click();
			deletedCount++;
			continue;
		}
		await tablist[1].click()

		// wait open dialog box
		await page.waitForSelector('paper-dialog[role=dialog][aria-hidden] #playlists paper-checkbox#checkbox', {hidden: true})
		
		// playlist pindot pindot
		await page.waitForSelector('#playlists paper-checkbox#checkbox', {visible: true})
		const playlists = await page.$$('#playlists paper-checkbox#checkbox')
		await playlists[0].click()
		await playlists[1].click()

		await page.waitForSelector('#close-button.ytd-add-to-playlist-renderer')
		const closePlaylist = await page.$('#close-button.ytd-add-to-playlist-renderer')
		await closePlaylist.click()

		transferredCount++;

		console.log(`Total Transferred: ${transferredCount}`);
		console.log(`Total Deleted: ${deletedCount}`);
	}
	


  await browser.close();
}

transferPlaylist();