# Fix Login Error - Quick Guide

## Vấn đề: Trang hiển thị lỗi sau khi đăng nhập bằng Google

### Nguyên nhân phổ biến:

1. **Thiếu `NEXTAUTH_SECRET`** - Đây là nguyên nhân chính!
2. **Thiếu `NEXTAUTH_URL`**
3. **Sai cấu hình Google OAuth credentials**
4. **Redirect URI không khớp trong Google Cloud Console**

## Giải pháp nhanh:

### Bước 1: Kiểm tra và tạo environment variables

Chạy script tự động:

```bash
node check-env.js
```

Script này sẽ:
- ✅ Kiểm tra các biến môi trường cần thiết
- ✅ Tự động tạo `NEXTAUTH_SECRET` nếu thiếu
- ✅ Tự động thêm `NEXTAUTH_URL` nếu thiếu
- ✅ Hiển thị các biến còn thiếu

### Bước 2: Kiểm tra `.env.local`

Đảm bảo file `.env.local` có đầy đủ:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### Bước 3: Kiểm tra Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Vào **APIs & Services** > **Credentials**
3. Click vào OAuth 2.0 Client ID của bạn
4. Kiểm tra **Authorized redirect URIs** có:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Nếu chưa có, thêm vào và **Save**

### Bước 4: Restart Development Server

**QUAN TRỌNG**: Sau khi cập nhật `.env.local`, bạn PHẢI restart server:

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại
yarn dev
```

### Bước 5: Test lại

1. Xóa cookies và cache của trình duyệt (hoặc dùng Incognito mode)
2. Truy cập `http://localhost:3000/dashboards`
3. Click "Sign in with Google"
4. Đăng nhập và kiểm tra

## Kiểm tra lỗi cụ thể:

### Nếu thấy trang error với code "Configuration":

- ✅ Kiểm tra `NEXTAUTH_SECRET` đã được tạo
- ✅ Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` đúng
- ✅ Restart server sau khi cập nhật `.env.local`

### Nếu thấy "redirect_uri_mismatch":

- ✅ Kiểm tra redirect URI trong Google Cloud Console
- ✅ Đảm bảo chính xác: `http://localhost:3000/api/auth/callback/google`
- ✅ Đợi vài phút sau khi cập nhật (Google cache settings)

### Nếu thấy "Invalid Client":

- ✅ Kiểm tra `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` trong `.env.local`
- ✅ Không có khoảng trắng thừa hoặc dấu ngoặc kép
- ✅ Restart server

## Debug Mode:

Nếu vẫn gặp lỗi, kiểm tra console của server:

```bash
yarn dev
```

Bạn sẽ thấy các cảnh báo nếu thiếu environment variables:
- ⚠️ GOOGLE_CLIENT_ID is not set
- ⚠️ GOOGLE_CLIENT_SECRET is not set  
- ⚠️ NEXTAUTH_SECRET is not set

## Vẫn không được?

1. Xóa `.next` folder và rebuild:
   ```bash
   rm -rf .next
   yarn dev
   ```

2. Kiểm tra browser console (F12) để xem lỗi JavaScript

3. Kiểm tra Network tab để xem request/response từ `/api/auth/*`

4. Xem file `GOOGLE_SSO_SETUP.md` để setup lại từ đầu

## Liên hệ:

Nếu vẫn gặp vấn đề, cung cấp:
- Error message cụ thể
- Console logs từ server
- Browser console errors
- Network tab errors
