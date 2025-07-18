import { userCaller } from '@/server/routers/_app';
import { NoteType } from '@/server/types';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const upsertBlinkoTool = createTool({
  id: 'upsert-blinko-tool',
  description: 'you are a brainwave.ai assistant,you can use api to create brainwave.ai,save to database',
  //@ts-ignore
  inputSchema: z.object({
    content: z.string().describe("Tag is start with #"),
    accountId: z.number(),
  }),
  execute: async ({ context }) => {
    console.log(`create note:${context.content}`);
    try {
      const caller = userCaller({
        id: context.accountId.toString(),
        exp: 0,
        iat: 0,
        name: 'admin',
        sub: context.accountId.toString(),
        role: 'superadmin'
      })
      const note = await caller.notes.upsert({
        content: context.content,
        type: NoteType.BLINKO,
      })
      console.log(note)
      return true
    } catch (error) {
      console.log(error)
      return error.message
    }
  }
});