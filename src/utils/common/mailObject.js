import { APP_LINK, MAIL_ID } from '../../config/serverConfig.js';

export const workspaceJoinMail = function (workspaceName) {
  return {
    from: MAIL_ID,
    subject: 'You have been added to a workspace',
    text: `You have been added to the workspace ${workspaceName}`
  };
};

export const verifyEmailMail = function (verificationToken) {
  return {
    from: MAIL_ID,
    subject: 'Welcome to the App. Please verify your email',
    text: `Welcome to the app. Please verify your email by clicking on the link below: 
    ${APP_LINK}/verify/${verificationToken}
    `
  };
};
