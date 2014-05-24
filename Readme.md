# crtrdgmmorpg

`git clone` this repo, do `npm install` and then `npm start` to check it out.


If you want to put it on heroku, you should enable websockets. Otherwise it will
use long pulling.
```
heroku create <sitename>
heroku labs:enable websockets -a <sitename>
git push heroku master
```
