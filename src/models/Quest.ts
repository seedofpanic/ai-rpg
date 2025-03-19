export interface Quest {
  killCount: number;
  id: string;
  title: string;
  description: string;
  subject: string;
  quantity: number;
  action: string;
  completed: boolean;
  questGiverId: string;
  rewards?: {
    gold?: number;
    items?: string[];
    experience?: number;
  };
}
