# Fix Error 400: redirect_uri_mismatch trên Production

## 🔴 Lỗi trên bản deploy

Khi bạn thấy lỗi "Error 400: redirect_uri_mismatch" trên bản deploy Vercel, đây là cách fix:

## ✅ Giải pháp nhanh

### Bước 1: Xác định URL production của bạn

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project của bạn
3. Copy **Production URL** (ví dụ: `https://your-app.vercel.app`)

### Bước 2: Kiểm tra NEXTAUTH_URL trên Vercel

1. Vào Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Tìm biến `NEXTAUTH_URL`
3. **Đảm bảo** giá trị là URL production của bạn:
   ```
   https://your-app.vercel.app
   ```
   ❌ **KHÔNG** dùng `http://localhost:3000` trên production!

### Bước 3: Cập nhật Google Cloud Console

1. **Truy cập Google Cloud Console:**
   - Vào [Google Cloud Console](https://console.cloud.google.com/)
   - Chọn project của bạn
   - Vào **APIs & Services** → **Credentials**

2. **Mở OAuth 2.0 Client ID:**
   - Click vào OAuth 2.0 Client ID của bạn

3. **Thêm Redirect URI cho Production:**
   
   Trong phần **Authorized redirect URIs**, thêm:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
   
   ⚠️ **Lưu ý quan trọng:**
   - Thay `your-app.vercel.app` bằng URL thực tế của bạn
   - Không có dấu `/` ở cuối
   - Phải là `https://` (không phải `http://`)
   - Path phải chính xác: `/api/auth/callback/google`

4. **Thêm Authorized JavaScript origins:**
   
   Trong phần **Authorized JavaScript origins**, thêm:
   ```
   https://your-app.vercel.app
   ```
   
   ⚠️ **Lưu ý:**
   - Không có path, chỉ domain
   - Phải là `https://`

5. **Click "SAVE"**

6. **Đợi 2-5 phút** để Google cập nhật settings (Google cache các settings này)

### Bước 4: Redeploy trên Vercel

1. Vào Vercel Dashboard → Project → **Deployments**
2. Click **"..."** trên deployment mới nhất → **Redeploy**
3. Hoặc push một commit mới lên Git để trigger auto-deploy

### Bước 5: Test lại

1. Mở URL production: `https://your-app.vercel.app`
2. Click "Sign In with Google"
3. Đăng nhập và kiểm tra xem có còn lỗi không

## 🎯 Checklist

- [ ] Đã xác định URL production trên Vercel
- [ ] Đã kiểm tra `NEXTAUTH_URL` trên Vercel = URL production
- [ ] Đã thêm redirect URI vào Google Cloud Console: `https://your-app.vercel.app/api/auth/callback/google`
- [ ] Đã thêm JavaScript origin vào Google Cloud Console: `https://your-app.vercel.app`
- [ ] Đã Save trong Google Cloud Console
- [ ] Đã đợi 2-5 phút sau khi save
- [ ] Đã redeploy trên Vercel
- [ ] Đã test lại và không còn lỗi

## 🔍 Kiểm tra redirect URI thực tế

Nếu vẫn còn lỗi, kiểm tra redirect URI thực tế mà NextAuth đang sử dụng:

1. Mở Developer Tools (F12) trong browser
2. Vào tab **Network**
3. Click "Sign in with Google"
4. Tìm request đến `accounts.google.com`
5. Xem parameter `redirect_uri` trong URL
6. Copy redirect URI đó và so sánh với URI trong Google Cloud Console

**Redirect URI phải match chính xác:**
- ✅ Protocol: `https://`
- ✅ Domain: `your-app.vercel.app`
- ✅ Path: `/api/auth/callback/google`
- ❌ Không có dấu `/` ở cuối
- ❌ Không có query parameters

## 📝 Ví dụ cấu hình đúng

### Google Cloud Console - Authorized redirect URIs:

```
http://localhost:3000/api/auth/callback/google
https://your-app.vercel.app/api/auth/callback/google
```

### Google Cloud Console - Authorized JavaScript origins:

```
http://localhost:3000
https://your-app.vercel.app
```

### Vercel Environment Variables:

```
NEXTAUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123
NEXTAUTH_SECRET=your-secret-here
```

## 💡 Tips

1. **Nếu có Preview Deployments:**
   - Thêm cả preview URL vào Google Cloud Console:
   ```
   https://your-app-git-main-your-team.vercel.app/api/auth/callback/google
   ```

2. **Nếu có Custom Domain:**
   - Thêm cả custom domain:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

3. **Sau khi cập nhật Google Cloud Console:**
   - Đợi 2-5 phút trước khi test lại
   - Xóa cookies/cache hoặc dùng Incognito mode
   - Redeploy trên Vercel để đảm bảo env vars được load lại

## 🆘 Vẫn không được?

1. Kiểm tra lại `NEXTAUTH_URL` trên Vercel có đúng không
2. Kiểm tra redirect URI trong Network tab có match với Google Cloud Console không
3. Đảm bảo đã đợi đủ thời gian (2-5 phút) sau khi save
4. Thử xóa cookies và test lại
5. Kiểm tra logs trên Vercel để xem có lỗi gì khác không
