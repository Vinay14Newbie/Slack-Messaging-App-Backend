// workspace in slack is equivalent to server in Discord

import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workspace name is required'],
    unique: true
  },
  description: {
    type: String
  },
  members: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
      }
    }
  ],
  joinCode: {
    // there is joinCode in slack, when you joins a new workspace
    type: String,
    require: [true, 'Join code is required']
  },
  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel'
    }
  ]
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
