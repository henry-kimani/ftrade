declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_MT_SERVER_PORT: number;

    INITIAL_ADMIN: string;
    DATABASE_URL: string;
  }
}
