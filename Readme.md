# crtrdgmmorpg

This is an experiment about doing a multiplayer with `crtrdg` and `node`.


# Install

`git clone` this repo, do `npm install` and then `npm start` to check it out.

If you want to put it on heroku, you should enable websockets. Otherwise it will
use long pulling.
```
heroku create <sitename>
heroku labs:enable websockets -a <sitename>
git push heroku master
```

# Ideas for improvement and tests

* Try `ws` instead of `socket.io`
* Use WebRTC (UDP) instead of Websockets (TCP)
* Implement a simple chat
* Collision detection (There it gets tricky)
* Let the server do some work to avoid cheating (Could it run the client code somehow?)
