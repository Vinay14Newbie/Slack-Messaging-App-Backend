import { z } from 'zod';

export const zodCreateWorkspaceScema = z.object({
  name: z.string({ message: 'Enter a valid name for workspace' }).min(3).max(50)
});
