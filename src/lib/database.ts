import { supabase } from './supabase';

async function createTables() {
  const queries = [
    `
    create table if not exists public.user_settings (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id) on delete cascade not null unique,
      api_key text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    `,
    `
    create table if not exists public.messages (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users(id) on delete cascade not null,
      content text not null,
      role text not null check (role in ('user', 'assistant')),
      timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    `
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('execute_sql', { sql: query });
    if (error) {
      console.error('Database initialization error:', error);
    }
  }
}

export async function initializeDatabase() {
  try {
    await createTables();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}