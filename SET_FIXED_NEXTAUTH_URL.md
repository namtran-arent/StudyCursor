# Cấu hình NEXTAUTH_URL cố định cho Vercel

## 🎯 Mục tiêu

Sử dụng URI cố định `https://study-cursor-mu.vercel.app` cho tất cả deployments (Production, Preview, Development) thay vì mỗi lần deploy lại tạo URI khác nhau.

## ✅ Giải pháp

### Bước 1: Set NEXTAUTH_URL cố định trên Vercel

1. **Vào Vercel Dashboard:**
   - Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
   - Chọn project của bạn

2. **Vào Environment Variables:**
   - Vào **Settings** → **Environment Variables**

3. **Tìm hoặc tạo biến `NEXTAUTH_URL`:**
   - Nếu đã có, click vào để edit
   - Nếu chưa có, click **Add New**

4. **Set giá trị cố định:**
   - **Name:** `NEXTAUTH_URL`
   - **Value:** `https://study-cursor-mu.vercel.app`
   - **Environment:** Chọn **tất cả 3** (Production, Preview, Development)
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

5. **Click Save**

### Bước 2: Cập nhật Google Cloud Console

1. **Truy cập Google Cloud Console:**
   - Vào [Google Cloud Console](https://console.cloud.google.com/)
   - Chọn project của bạn
   - Vào **APIs & Services** → **Credentials**

2. **Mở OAuth 2.0 Client ID:**
   - Click vào OAuth 2.0 Client ID của bạn

3. **Xóa các preview URIs cũ (nếu có):**
   - Xóa các URIs như:
     - `https://study-cursor-cllnh3jwc-namtran-arents-projects.vercel.app/api/auth/callback/google`
     - Các preview URIs khác

4. **Thêm/chỉnh sửa Redirect URIs:**
   
   Trong phần **Authorized redirect URIs**, đảm bảo chỉ có:
   ```
   http://localhost:3000/api/auth/callback/google
   https://study-cursor-mu.vercel.app/api/auth/callback/google
   ```
   
   ⚠️ **Lưu ý:**
   - Chỉ giữ lại localhost (cho development) và production URL cố định
   - Xóa tất cả preview URIs khác

5. **Cập nhật Authorized JavaScript origins:**
   
   Trong phần **Authorized JavaScript origins**, đảm bảo có:
   ```
   http://localhost:3000
   https://study-cursor-mu.vercel.app
   ```
   
   ⚠️ **Lưu ý:**
   - Xóa các preview origins khác
   - Chỉ giữ localhost và production URL cố định

6. **Click "SAVE"**

7. **Đợi 2-5 phút** để Google cập nhật settings

### Bước 3: Redeploy trên Vercel

1. **Vào Vercel Dashboard:**
   - Project → **Deployments**

2. **Redeploy:**
   - Click **"..."** trên deployment mới nhất → **Redeploy**
   - Hoặc push một commit mới lên Git

3. **Kiểm tra:**
   - Sau khi redeploy, tất cả deployments (production, preview) sẽ dùng `NEXTAUTH_URL` cố định
   - Redirect URI sẽ luôn là: `https://study-cursor-mu.vercel.app/api/auth/callback/google`

### Bước 4: Test lại

1. **Test trên Production:**
   - Mở: `https://study-cursor-mu.vercel.app`
   - Click "Sign In with Google"
   - Kiểm tra xem có hoạt động không

2. **Test trên Preview (nếu có):**
   - Mở preview deployment URL
   - Click "Sign In with Google"
   - Redirect URI sẽ vẫn là `https://study-cursor-mu.vercel.app/api/auth/callback/google` (không phải preview URL)

## 🎯 Kết quả

Sau khi cấu hình:
- ✅ Tất cả deployments (Production, Preview, Development) sẽ dùng `NEXTAUTH_URL` cố định
- ✅ Redirect URI luôn là: `https://study-cursor-mu.vercel.app/api/auth/callback/google`
- ✅ Không cần thêm preview URIs vào Google Cloud Console nữa
- ✅ OAuth sẽ hoạt động trên tất cả deployments với cùng một redirect URI

## 📝 Checklist

- [ ] Đã set `NEXTAUTH_URL=https://study-cursor-mu.vercel.app` trên Vercel cho tất cả environments
- [ ] Đã cập nhật Google Cloud Console với redirect URI cố định
- [ ] Đã xóa các preview URIs cũ trong Google Cloud Console
- [ ] Đã Save trong Google Cloud Console
- [ ] Đã đợi 2-5 phút sau khi save
- [ ] Đã redeploy trên Vercel
- [ ] Đã test lại và hoạt động đúng

## 🔍 Kiểm tra

Sau khi redeploy, kiểm tra redirect URI thực tế:

1. Mở Developer Tools (F12)
2. Vào tab **Network**
3. Click "Sign in with Google"
4. Tìm request đến `accounts.google.com`
5. Xem parameter `redirect_uri` trong URL
6. Phải là: `https://study-cursor-mu.vercel.app/api/auth/callback/google`

## ⚠️ Lưu ý

- Sau khi set `NEXTAUTH_URL` cố định, tất cả preview deployments cũng sẽ redirect về production URL
- Điều này có nghĩa là sau khi login trên preview, user sẽ được redirect về production URL
- Nếu bạn muốn test OAuth riêng trên preview, bạn cần tạo OAuth client riêng hoặc chỉ test trên production

## 💡 Alternative: Chỉ dùng Production cho OAuth

Nếu bạn không muốn OAuth hoạt động trên preview deployments:

1. Set `NEXTAUTH_URL` chỉ cho **Production** environment
2. Preview deployments sẽ không có OAuth (hoặc sẽ lỗi)
3. Chỉ test OAuth trên production deployment
