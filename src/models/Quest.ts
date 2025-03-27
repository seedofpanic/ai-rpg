export interface Quest {
  killCount: number;
  id: string;
  title: string;
  description: string;
  subject: string;
  locationId: string | null;
  quantity: number;
  action: string;
  completed: boolean;
  questGiverId: string | null;
  rewards?: {
    gold?: number;
    items?: string[];
    experience?: number;
  };
}
