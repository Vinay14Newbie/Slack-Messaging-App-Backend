import { MAIL_ID } from '../../config/serverConfig.js';

export const workspaceJoinMail = function (workspaceName) {
  return {
    from: MAIL_ID,
    subject: 'You have been added to a workspace',
    text: `You have been added to the workspace ${workspaceName}`
  };
};
