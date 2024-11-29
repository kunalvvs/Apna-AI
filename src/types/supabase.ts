export interface Database {
  public: {
    Tables: {
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          api_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          api_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          api_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          role: 'assistant' | 'user';
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          role: 'assistant' | 'user';
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          role?: 'assistant' | 'user';
          timestamp?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      execute_sql: {
        Args: { sql: string };
        Returns: void;
      };
    };
  };
}