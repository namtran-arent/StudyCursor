# Vercel Environment Variables Checklist

## ✅ Checklist trước khi deploy

### 1. Supabase Variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - URL từ Supabase Dashboard
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key từ Supabase Dashboard

### 2. Google OAuth Variables
- [ ] `GOOGLE_CLIENT_ID` - Từ Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - Từ Google Cloud Console

### 3. NextAuth Variables
- [ ] `NEXTAUTH_SECRET` - Generate với: `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` - URL production của bạn (ví dụ: `https://your-app.vercel.app`)

### 4. OpenAI Variable (Optional - nếu dùng GitHub Summarizer)
- [ ] `OPENAI_API_KEY` - API key từ OpenAI

## 📝 Hướng dẫn thêm trên Vercel

1. Vào Vercel Dashboard → Project → Settings → Environment Variables
2. Thêm từng biến với:
   - **Name**: Tên biến (ví dụ: `NEXTAUTH_SECRET`)
   - **Value**: Giá trị của biến
   - **Environment**: Chọn tất cả (Production, Preview, Development)
3. Click **Save**
4. **Redeploy** project

## 🔧 Generate NEXTAUTH_SECRET

```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online
# Visit: https://generate-secret.vercel.app/32
```

## 🔗 Cập nhật Google Cloud Console

Sau khi có URL production từ Vercel:

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Click vào OAuth 2.0 Client ID của bạn
4. Thêm vào **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
5. Click **Save**
6. Đợi vài phút để Google cập nhật

## ⚠️ Lưu ý quan trọng

- ✅ `NEXTAUTH_URL` phải là URL production, KHÔNG phải `http://localhost:3000`
- ✅ Tất cả env vars phải được set cho cả 3 environments
- ✅ Sau khi thêm env vars, PHẢI redeploy
- ✅ Google OAuth redirect URI phải match chính xác với `NEXTAUTH_URL`

## 🧪 Test sau khi deploy

1. Truy cập: `https://your-app.vercel.app/dashboards`
2. Bạn sẽ được redirect đến `/login`
3. Click "Sign in with Google"
4. Đăng nhập và kiểm tra redirect về `/dashboards`

## 🐛 Debug

Nếu gặp lỗi:
1. Xem **Build Logs** trên Vercel để tìm lỗi cụ thể
2. Xem **Function Logs** để debug runtime errors
3. Kiểm tra browser console để xem client-side errors
4. Kiểm tra Network tab để xem API requests
