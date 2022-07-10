# Voter Lookup Extension

This folder has the code for the Voter Registration Lookup Tool [web extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons), which needs to be installed to make [voterlookup.ballotapi.org](https://voterlookup.ballotapi.org/) work.

There are two options for installing this extension:
* [Option A](#TODO): Install from your browser's extension store
* [Option B](#TODO): Install from your local development environment

## Option A: Install from your browser's extension store

* **Firefox:** Link-here-TODO
* **Chrome:** Link-here-TODO
* **iPhone/Safari/iOS:** Link-here-TODO
* **Android:** See instructions below

#### Android installation from the Firefox Add-On store

Because Chrome for Android doesn't let you install web extensions, you need to install the [Firefox Browser (Nightly for Developers)](https://play.google.com/store/apps/details?id=org.mozilla.fenix&gl=US), which allows web extension installs.

* Step 1: TODO

## Option B: Install from your local development environment

If you've cloned this repository to your local computer, you can install this extension directly from this `extension/` folder.

* Step 1: Clone this repository to your computer.

* Step 2: Navigate to this extension folder.

Proceed to the steps below for whatever browser you're using.

### Firefox desktop installation from local

* Step 3: Navigate to `about:debugging#/runtime/this-firefox`

* Step 4: Select "Load Temporary Add-on"

* Step 5: Navigate to this folder and select `manifest.json`

* Step 6: In a new tab, open [https://voterlookup.ballotapi.org/](https://voterlookup.ballotapi.org/) (or whatever website you have running locally, if your running a local copy)

### Chrome desktop installation from local

* Step 3: Navigate to `chrome://extensions/`.

* Step 4: Toggle "Developer mode"

* Step 5: Select "Load unpacked"

* Step 6: Select this `extension/` folder

* Step 7: In a new tab, open [https://voterlookup.ballotapi.org/](https://voterlookup.ballotapi.org/) (or whatever website you have running locally, if your running a local copy)

### Android installation from local

* Step 3: Follow the Firefox for Android instructions to [Set up your computer to install Firefox for Android add-ons](https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/#set-up-your-computer-and-android-emulator-or-device)

* Step 4: Follow the Firefox for Android instructions to [Install and run your extension in Firefox for Android](https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/#install-and-run-your-extension-in-firefox-for-android)

* Step 5: On your Android device, open Firefox Browser (Nightly for Developers) and navigate to [https://voterlookup.ballotapi.org/](https://voterlookup.ballotapi.org/) (or whatever website you have running locally, if your running a local copy)
