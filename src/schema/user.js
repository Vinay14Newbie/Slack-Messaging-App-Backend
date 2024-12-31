import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username already exists'],
      minLength: [3, 'Username must be at least 3 characters'],
      match: [
        /^[a-zA-Z0-9]+$/,
        'Username must contain only letters and numbers'
      ]
    },
    avatar: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String
    },
    verificationTokenExpiry: {
      type: Date
    }
  },
  { timestamps: true }
);

userSchema.pre('save', function saveUser(next) {
  if (this.isNew) {
    const user = this;
    const SALT = bcrypt.genSaltSync(9);
    const hashedPassword = bcrypt.hashSync(user.password, SALT);
    user.password = hashedPassword;
    user.avatar = `https://robohash.org/${user.username}`;
    user.verificationToken = uuidv4().substring(0, 10).toUpperCase();
    user.verificationTokenExpiry = Date.now() + 3600000; //1hr
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
