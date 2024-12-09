import { z } from 'zod';

export const zodCreateWorkspaceScema = z.object({
  name: z.string({ message: 'Enter a valid name for workspace' }).min(3).max(50)
});

export const zodAddMemberToWorkspaceSchema = z.object({
  memberId: z.string()
});

export const zodAddChannelToWorkspaceSchema = z.object({
  channelName: z.string()
});

export const zodAddMemberToByEmailWorkspaceSchema = z.object({
  memberEmail: z.string({ message: 'Give proper email address' }).email()
});
