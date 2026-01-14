# Hướng dẫn tạo OAuth 2.0 Client ID trong Google Cloud Console

## Bước 1: Vào trang Credentials

1. Trong Google Cloud Console, bạn đang ở trang **"APIs & Services"**
2. Click vào **"Credentials"** ở sidebar bên trái (dưới "Enabled APIs & services")
3. Hoặc truy cập trực tiếp: [APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)

## Bước 2: Tạo OAuth 2.0 Client ID

1. Ở trang **Credentials**, bạn sẽ thấy:
   - **API Keys** section
   - **OAuth 2.0 Client IDs** section (có thể trống nếu chưa tạo)
   - **Service Accounts** section

2. Click vào nút **"+ CREATE CREDENTIALS"** ở phía trên cùng (góc trên bên phải)

3. Chọn **"OAuth client ID"** từ dropdown menu

## Bước 3: Cấu hình OAuth Consent Screen (nếu chưa có)

Nếu đây là lần đầu tạo OAuth client, Google sẽ yêu cầu bạn cấu hình OAuth consent screen trước:

1. Click **"CONFIGURE CONSENT SCREEN"** button
2. Chọn **"External"** (trừ khi bạn có Google Workspace, thì chọn "Internal")
3. Click **"CREATE"**

### Điền thông tin OAuth Consent Screen:

1. **App information:**
   - **App name**: `Ko0ls AI` (hoặc tên bạn muốn)
   - **User support email**: Email của bạn
   - **App logo**: (Optional) Có thể bỏ qua
   - **App domain**: (Optional) Có thể bỏ qua
   - **Application home page**: `https://your-app.vercel.app` (hoặc localhost cho dev)
   - **Application privacy policy link**: (Optional)
   - **Application terms of service link**: (Optional)
   - **Authorized domains**: (Optional)

2. Click **"SAVE AND CONTINUE"**

3. **Scopes** (Step 2):
   - Click **"SAVE AND CONTINUE"** (scopes mặc định là đủ)

4. **Test users** (Step 3 - nếu chọn External):
   - Thêm email của bạn vào **Test users** nếu app đang ở chế độ Testing
   - Click **"ADD USERS"** và nhập email
   - Click **"SAVE AND CONTINUE"**

5. **Summary** (Step 4):
   - Review thông tin
   - Click **"BACK TO DASHBOARD"**

## Bước 4: Tạo OAuth 2.0 Client ID

Sau khi đã cấu hình OAuth consent screen:

1. Quay lại **Credentials** page
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

3. **Application type**: Chọn **"Web application"**

4. **Name**: Đặt tên cho client (ví dụ: `Ko0ls AI Web Client`)

5. **Authorized JavaScript origins**:
   - Click **"+ ADD URI"**
   - Thêm:
     ```
     http://localhost:3000
     ```
   - Nếu có production URL, thêm:
     ```
     https://your-app.vercel.app
     ```

6. **Authorized redirect URIs**:
   - Click **"+ ADD URI"**
   - Thêm:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Nếu có production URL, thêm:
     ```
     https://your-app.vercel.app/api/auth/callback/google
     ```

7. Click **"CREATE"**

## Bước 5: Copy Client ID và Client Secret

Sau khi tạo xong, Google sẽ hiển thị popup với:

- **Your Client ID**: `123456789-abc...apps.googleusercontent.com`
- **Your Client Secret**: `GOCSPX-...`

**QUAN TRỌNG:**
- ✅ Copy **Client ID** ngay bây giờ (bạn sẽ không thấy lại được)
- ✅ Copy **Client Secret** ngay bây giờ (bạn sẽ không thấy lại được)
- ✅ Lưu vào file `.env.local` hoặc Vercel Environment Variables

## Bước 6: Lưu vào Environment Variables

### Local (.env.local):
```env
GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret
```

### Vercel:
1. Vào Vercel Dashboard → Project → Settings → Environment Variables
2. Thêm:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL` (production URL)
   - `NEXTAUTH_SECRET`

## Nếu không thấy nút "CREATE CREDENTIALS"

### Kiểm tra:
1. ✅ Bạn đã chọn đúng project chưa? (Kiểm tra project selector ở top bar)
2. ✅ Bạn có quyền "Owner" hoặc "Editor" trong project không?
3. ✅ Bạn đã enable billing chưa? (Một số features cần billing enabled)

### Enable Billing (nếu cần):
1. Vào [Billing](https://console.cloud.google.com/billing)
2. Link billing account với project
3. Quay lại Credentials page

## Nếu đã có OAuth Client ID nhưng không thấy

1. Ở trang **Credentials**, scroll xuống section **"OAuth 2.0 Client IDs"**
2. Nếu có client ID, bạn sẽ thấy danh sách
3. Click vào tên client ID để xem/edit
4. Nếu muốn xem lại Client Secret:
   - Click vào client ID
   - Click **"RESET SECRET"** (sẽ tạo secret mới)
   - Hoặc tạo client ID mới

## Troubleshooting

### Lỗi: "OAuth client creation failed"
- ✅ Kiểm tra OAuth consent screen đã được cấu hình chưa
- ✅ Kiểm tra billing đã enable chưa
- ✅ Thử lại sau vài phút

### Lỗi: "Redirect URI mismatch" sau khi tạo
- ✅ Đảm bảo redirect URI trong Google Cloud Console match với `NEXTAUTH_URL/api/auth/callback/google`
- ✅ Xem file `FIX_REDIRECT_URI_MISMATCH.md` để biết chi tiết

## Checklist

- [ ] Đã cấu hình OAuth consent screen
- [ ] Đã tạo OAuth 2.0 Client ID
- [ ] Đã copy Client ID và Client Secret
- [ ] Đã thêm vào `.env.local` (local) hoặc Vercel (production)
- [ ] Đã thêm redirect URIs đúng
- [ ] Đã thêm JavaScript origins đúng
- [ ] Đã restart server (local) hoặc redeploy (production)

## Screenshots Guide

Nếu vẫn gặp khó khăn, các bước chính:

1. **APIs & Services** → **Credentials**
2. **+ CREATE CREDENTIALS** (góc trên bên phải)
3. **OAuth client ID**
4. **Web application**
5. Điền thông tin và **CREATE**
