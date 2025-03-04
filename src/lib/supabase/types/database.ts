export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
          role: 'user' | 'admin';
          status: 'active' | 'inactive';
        };
        Insert: Omit<
          Database['public']['Tables']['users']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
  };
};
