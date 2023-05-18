<div align="center">

![HoloSongs icon](docs/img/Icon.png)

# HoloSongs

[![Build status](https://img.shields.io/github/actions/workflow/status/themintchoco/holosongs/release.yml?style=for-the-badge)](https://github.com/themintchoco/holosongs/actions/workflows/release.yml)
[![Latest release](https://img.shields.io/chrome-web-store/v/ipibfcnlipdkimfmajnddpboejkocplf?style=for-the-badge&label=Latest%20Release)](https://chrome.google.com/webstore/detail/holosongs/ipibfcnlipdkimfmajnddpboejkocplf)
[![Users](https://img.shields.io/chrome-web-store/users/ipibfcnlipdkimfmajnddpboejkocplf?style=for-the-badge)](https://chrome.google.com/webstore/detail/holosongs/ipibfcnlipdkimfmajnddpboejkocplf)
[![Localized](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fholosongs.mintchoco.workers.dev%2Fcrowdin)](https://crowdin.com/project/holosongs)
[![Songs indexed](https://img.shields.io/endpoint?style=for-the-badge&url=https%3A%2F%2Fholosongs.mintchoco.workers.dev%2FsongsIndexed)](https://holodex.net/about)

</div>

Powered by the global Holodex community, HoloSongs is a Chrome extension that adds a full featured media player to long YouTube livestreams so you can seek to your favorite songs and play them on repeat.

![HoloSongs screenshot](docs/img/Songs.png)

## Features

Get a full featured media player alongside singing streams

-  Setlist at a glance
-  Seek and skip individual songs
-  Repeat modes
-  Music mode (skips talking segments)

Works with most videos from your favorite streamers, including streamers from Hololive, Nijisanji and other organizations.

## Usage

To get started, retrieve your API key from your [account settings](https://holodex.net/login) and paste it into the extension settings.

## Installing

### Chrome Web Store

[![Available on the Chrome Web Store](docs/img/ChromeWebStore.png)](https://chrome.google.com/webstore/detail/holosongs/ipibfcnlipdkimfmajnddpboejkocplf)

The easiest method of installation. Simply click on the above image and then on *Add to Chrome*.

### Build from source

```bash
git clone git@github.com:themintchoco/holosongs.git
cd holosongs

npm install
npm run build
```

To complete installation, enable developer mode on the Chrome extensions page and click *Load Unpacked*. Then select the `dist/` directory created during the build.
