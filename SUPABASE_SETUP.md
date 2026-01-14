npm# Supabase Setup Guide

## 1. Tạo Supabase Project

1. Truy cập [Supabase](https://supabase.com) và đăng nhập
2. Tạo một project mới
3. Lưu lại **Project URL** và **anon/public key** từ Settings > API

## 2. Tạo Database Tables

### 2.1. Tạo bảng `api_keys`

Chạy SQL sau trong Supabase SQL Editor:

```sql
-- Tạo bảng api_keys
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key TEXT NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL DEFAULT 'dev',
  description TEXT,
  monthly_limit INTEGER,
  limit_enabled BOOLEAN DEFAULT false,
  usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index cho performance
CREATE INDEX IF NOT EXISTS idx_api_keys_type ON api_keys(type);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at);

-- Tạo function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động update updated_at
DROP TRIGGER IF EXISTS update_api_keys_updated_at ON api_keys;
CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Tạo policy để cho phép tất cả operations (có thể customize sau)
DROP POLICY IF EXISTS "Enable all operations for all users" ON api_keys;
CREATE POLICY "Enable all operations for all users" ON api_keys
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

### 2.2. Tạo bảng `users` (cho OAuth users)

Chạy SQL từ file `SUPABASE_USERS_TABLE.sql` hoặc copy SQL sau:

```sql
-- Create users table for storing OAuth user information
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  image TEXT,
  provider VARCHAR(50) DEFAULT 'google',
  first_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
DROP POLICY IF EXISTS "Enable all operations for all users" ON users;
CREATE POLICY "Enable all operations for all users" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

**Lưu ý**: Bảng `users` sẽ tự động được tạo khi user đăng nhập lần đầu tiên qua Google OAuth.

## 3. Cấu hình Environment Variables

1. Tạo file `.env.local` trong thư mục `ko0ls`:
   ```bash
   # Windows PowerShell
   New-Item -Path .env.local -ItemType File
   
   # Linux/Mac
   touch .env.local
   ```

2. Thêm các giá trị sau vào file `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

   Ví dụ:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 4. Cài đặt Dependencies

```bash
npm install @supabase/supabase-js
```

## 5. Chạy Application

```bash
npm run dev
```

## Lưu ý về Security

- File `.env.local` không nên commit vào git (đã có trong .gitignore)
- Nếu cần bảo mật hơn, có thể customize RLS policies trong Supabase
- Có thể thêm authentication để chỉ user đã đăng nhập mới có thể CRUD API keys
