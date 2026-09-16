export interface SavedTool {
  id: string;
  toolId: string;
  userId: string;
  createdAt: Date;
  tool?: Tool;
}

import type { Tool } from './tool';