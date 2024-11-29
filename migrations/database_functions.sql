-- Function to execute SQL safely
create or replace function execute_sql(sql text)
returns void as $$
begin
  execute sql;
exception when others then
  -- Log error and continue
  raise notice 'Error executing SQL: %', SQLERRM;
end;
$$ language plpgsql security definer;