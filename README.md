# RemoteTouchPad
Remote touch pad based of nodejs.



## Install 

This project uses [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/). 

```sh
$ git clone https://github.com/whzyustc/RemoteTouchPad.git
```



Install modules

```bash
$ npm install 
```



## Usage

### Start server 

```bash
$ npm start
//or
$ node index.js
```



### Access server in LAN. 

Get server IP:

```bash
$ ipconfig
```

Default port: 3000

[Example](http://192.168.3.5:3000/)



## Default touchevent config:

Touch move -> Mouse move

One finger tap(less than 1s) -> Left click

One finger tap(anoter finger hold on the right) -> Left click

One finger tap(anoter finger hold on the left) -> Right click




