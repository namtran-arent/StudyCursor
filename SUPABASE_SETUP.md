npm# Supabase Setup Guide

## 1. Tạo Supabase Project

1. Truy cập [Supabase](https://supabase.com) và đăng nhập
2. Tạo một project mới
3. Lưu lại **Project URL** và **anon/public key** từ Settings > API

## 2. Tạo Database Table

Chạy SQL sau trong Supabase SQL Editor:

```sql
-- Tạo bảng api_keys
CREATE TABLE api_keys (
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
CREATE INDEX idx_api_keys_type ON api_keys(type);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at);

-- Tạo function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động update updated_at
CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Tạo policy để cho phép tất cả operations (có thể customize sau)
CREATE POLICY "Enable all operations for all users" ON api_keys
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

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
