# Hướng dẫn Deploy lên Vercel

## 1. Cấu hình Environment Variables trên Vercel

### Bước 1: Vào Vercel Dashboard
1. Đăng nhập vào [Vercel](https://vercel.com)
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**

### Bước 2: Thêm các biến môi trường

Thêm 2 biến sau:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

**Lưu ý:**
- Chọn tất cả 3 environments (Production, Preview, Development)
- Copy chính xác URL và Key từ Supabase Dashboard
- Sau khi thêm, cần **Redeploy** project để áp dụng

## 2. Kiểm tra Supabase RLS Policies

### Bước 1: Vào Supabase Dashboard
1. Vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Authentication** → **Policies**

### Bước 2: Kiểm tra Policy cho bảng `api_keys`

Đảm bảo có policy sau (hoặc tương tự):

```sql
CREATE POLICY "Enable all operations for all users" ON api_keys
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

Nếu chưa có, chạy SQL sau trong **SQL Editor**:

```sql
-- Kiểm tra RLS có được enable không
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'api_keys';

-- Nếu rowsecurity = false, enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Tạo policy nếu chưa có
CREATE POLICY "Enable all operations for all users" ON api_keys
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## 3. Redeploy trên Vercel

Sau khi thêm environment variables:

1. Vào **Deployments** tab
2. Click vào 3 dots (⋯) của deployment mới nhất
3. Chọn **Redeploy**
4. Hoặc push một commit mới lên git

## 4. Test sau khi deploy

### Test API endpoint:
```bash
curl https://your-app.vercel.app/api/api-keys
```

### Kiểm tra logs:
1. Vào Vercel Dashboard → **Deployments**
2. Click vào deployment
3. Xem **Function Logs** để debug

## 5. Troubleshooting

### Lỗi: "Supabase is not configured"
- ✅ Kiểm tra environment variables đã được thêm chưa
- ✅ Kiểm tra tên biến có đúng: `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Redeploy sau khi thêm biến

### Lỗi: "Failed to fetch API keys"
- ✅ Kiểm tra RLS policies trên Supabase
- ✅ Kiểm tra Supabase URL và Key có đúng không
- ✅ Xem Function Logs trên Vercel để biết lỗi chi tiết

### Lỗi: CORS hoặc Network errors
- ✅ Kiểm tra Supabase project có đang active không
- ✅ Kiểm tra network restrictions trên Supabase

## 6. Kiểm tra nhanh

Sau khi deploy, test endpoint này để kiểm tra connection:

```
https://your-app.vercel.app/api/health
```

Endpoint này sẽ trả về status của Supabase connection.
