# Hướng dẫn Deploy lên Vercel

## 1. Cấu hình Environment Variables trên Vercel

### Bước 1: Vào Vercel Dashboard
1. Đăng nhập vào [Vercel](https://vercel.com)
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**

### Bước 2: Thêm các biến môi trường

Thêm các biến sau (chọn tất cả 3 environments: Production, Preview, Development):

#### Supabase Variables:
| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |

#### Google OAuth Variables:
| Name | Value | Environment |
|------|-------|-------------|
| `GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` | Production, Preview, Development |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | Production, Preview, Development |

#### NextAuth Variables:
| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_SECRET` | `your-generated-secret` (generate với `openssl rand -base64 32`) | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production, Preview, Development |

#### OpenAI Variable (nếu dùng GitHub Summarizer):
| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Production, Preview, Development |

**Lưu ý quan trọng:**
- ✅ Chọn tất cả 3 environments (Production, Preview, Development) cho mỗi biến
- ✅ `NEXTAUTH_URL` phải là URL production của bạn (ví dụ: `https://your-app.vercel.app`)
- ✅ Cập nhật **Authorized redirect URIs** trong Google Cloud Console:
  - Thêm: `https://your-app.vercel.app/api/auth/callback/google`
- ✅ Sau khi thêm tất cả biến, cần **Redeploy** project để áp dụng

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

### Lỗi Build: "useSearchParams() should be wrapped in a suspense boundary"
- ✅ Đã được sửa trong code - đảm bảo đã pull code mới nhất
- ✅ Nếu vẫn lỗi, kiểm tra file `src/app/auth/error/page.js` và `src/app/login/page.js` có Suspense wrapper

### Lỗi: "Supabase is not configured"
- ✅ Kiểm tra environment variables đã được thêm chưa
- ✅ Kiểm tra tên biến có đúng: `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Redeploy sau khi thêm biến

### Lỗi: "Failed to fetch API keys"
- ✅ Kiểm tra RLS policies trên Supabase
- ✅ Kiểm tra Supabase URL và Key có đúng không
- ✅ Xem Function Logs trên Vercel để biết lỗi chi tiết

### Lỗi: Google OAuth không hoạt động
- ✅ Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` đã được thêm chưa
- ✅ Kiểm tra `NEXTAUTH_SECRET` đã được tạo và thêm chưa
- ✅ Kiểm tra `NEXTAUTH_URL` đúng với domain Vercel của bạn
- ✅ Cập nhật **Authorized redirect URIs** trong Google Cloud Console:
  - Thêm: `https://your-app.vercel.app/api/auth/callback/google`
- ✅ Đợi vài phút sau khi cập nhật Google Cloud Console (Google cache settings)

### Lỗi: CORS hoặc Network errors
- ✅ Kiểm tra Supabase project có đang active không
- ✅ Kiểm tra network restrictions trên Supabase

### Lỗi: Build failed với environment variables warnings
- ✅ Các warnings về missing env vars là bình thường trong build process
- ✅ Quan trọng là đảm bảo tất cả env vars đã được set trên Vercel Dashboard
- ✅ Redeploy sau khi thêm env vars

## 6. Kiểm tra nhanh

Sau khi deploy, test endpoint này để kiểm tra connection:

```
https://your-app.vercel.app/api/health
```

Endpoint này sẽ trả về status của Supabase connection.