# Gmail OSX App

Gmail OSX app based on Electron

* Dock notifications with unread emails count
* Desktop popup notifications
* Familiar web Gmail interface
* Based on [Electron](http://electron.atom.io/)

## How to Build

_Note: requires node v6_

```
clone https://github.com/fujifish/gmail-app.git
cd gmail-app
npm install
npm run build
```

Copy the the file `./Gmail-darwin-x64/Gmail.app` to your Applications directory.

## Troubleshooting

You might need to run `electron-rebuild --version 1.3.5` to make sure electron is built against the correct 
node version headers.

## License

The MIT license. Copyright 2016 fujifish.
