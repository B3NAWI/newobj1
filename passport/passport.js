// const GoogleStrategy = require("passport-google-oauth20").Strategy
// const passport = require("passport")
// require('dotenv').config();

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.CLINT_ID,
//             clientSecret: process.env.CLINT_SECRET,
//             callbackURL: "/auth/google/callback",
//             scope: ['profile', 'email'],
//         },
//         function (accessToken, refreshToken, profile, callback) {
//             callback(null, profile,refreshToken,accessToken)
//         }
//     )
// )
// passport.serializeUser((user, done) => {
//     done(null, user)
// })
// passport.deserializeUser((user, done) => {
//     done(null, user)
// })