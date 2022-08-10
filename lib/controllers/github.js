const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');
const GithubUser = require('../models/GithubUser');
const {
  exchangeCodeForToken,
  getGithubProfile,
} = require('../services/github');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  })
  
  .get('/callback', async (req, res, next) => {
    // const { code } = req.query;
    // res.json({ code });
    try {
      //   TODO:
      //  * get code
      const { code } = req.query;

      //  * exchange code for token
      const token = await exchangeCodeForToken(code);
      //  * get info from github about user with token
      const githubProfile = await getGithubProfile(token);
      console.log(githubProfile);
      // res.json({ githubProfile });
      // //  * get existing user if there is one
      let user = await GithubUser.findByUsername(githubProfile.login);
      //  * if not, create one
      if (!user) {
        user = await GithubUser.insert({
          username: githubProfile.login,
          email: githubProfile.email,
          avatar: githubProfile.avatar_url,
        });
      }
      //  * create jwt
      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      //  * set cookie and redirect
      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (e) {
      next(e);
    }
  })
  .get('/dashboard', authenticate, async (req, res) => {
    // require req.user
    // get data about user and send it as json
    res.json(req.user);
  })
;
