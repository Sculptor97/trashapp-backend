import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Validate Google OAuth environment variables
const validateGoogleOAuthConfig = () => {
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
  ];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing Google OAuth environment variables: ${missing.join(', ')}`
    );
    console.warn(
      'Google OAuth will not be available until these are configured.'
    );
    console.warn(`${process.env.GOOGLE_CLIENT_ID}`);
    console.warn(`${process.env.GOOGLE_CLIENT_SECRET}`);
    console.warn(`${process.env.GOOGLE_CALLBACK_URL}`);
    return false;
  }

  return true;
};

// Only configure Google OAuth if environment variables are present
if (validateGoogleOAuthConfig()) {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists with this Google ID
          const user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User exists, update Google info if needed
            if (!user.isGoogleLinked) {
              user.isGoogleLinked = true;
              user.googleEmail = profile.emails[0].value;
              await user.save();
            }
            return done(null, user);
          }

          // Check if user exists with the same email
          const existingUser = await User.findOne({
            email: profile.emails[0].value,
          });

          if (existingUser) {
            // Link Google account to existing user
            existingUser.googleId = profile.id;
            existingUser.googleEmail = profile.emails[0].value;
            existingUser.isGoogleLinked = true;
            await existingUser.save();
            return done(null, existingUser);
          }

          // Create new user
          const newUser = new User({
            googleId: profile.id,
            googleEmail: profile.emails[0].value,
            isGoogleLinked: true,
            name: profile.displayName,
            email: profile.emails[0].value,
            isEmailVerified: true, // Google emails are pre-verified
            password: undefined, // No password for Google users
          });

          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.log(
    'ℹ️  Google OAuth strategy not configured due to missing environment variables.'
  );
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
