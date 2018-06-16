# Tildes Extended

## What it is

An attempt at creating a basic browser extension cross-compatible with at least firefox and chrome, that extend [tildes](https://tildes.net) functionalities.

## How to use it

There are two version officially supported:

- Chrome: [chrome.google.com](https://chrome.google.com/webstore/detail/tildes-extended/dinimcigfnjcblajimodbacmbknmicgl)
- Firefox: [addons.mozilla.org](https://addons.mozilla.org/en-GB/firefox/addon/tildes-extended/)

I've positive report of it working on Firefox Mobile and various forks of Chromium that supports extension but I cannot guarantee support for them. However you're welcome to contribute you feel inclined to do so!

## How to contribute

This requires [NodeJS](https://nodejs.org/en/) and [npm](http://npmjs.com/).

Fork the project from the `develop` branch if you want to write a new feature.  
Fork from `master` if you want to write an hotfix.

Remember to run `npm install` to install all dependencies.

Available npm commands are:

* `npm run lint` to validate the code to be compatible with chrome and firefox
* `npm run serve` to assemble on the fly a non-packaged source code for testing purpose
* `npm run serve:build` to assemble on the fly a non-packaged source code, as it will be made in the packaged version (aka with uglify)
* `npm run build` to create a distributable source ready to be packaged into an extension
