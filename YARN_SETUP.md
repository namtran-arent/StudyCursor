# Chuyển đổi từ npm sang yarn

## 1. Cài đặt Yarn

### Cách 1: Cài đặt qua npm (khuyến nghị)
```bash
npm install -g yarn
```

### Cách 2: Cài đặt qua Corepack (Node.js 16.10+)
```bash
corepack enable
corepack prepare yarn@stable --activate
```

### Cách 3: Cài đặt qua Chocolatey (Windows)
```bash
choco install yarn
```

## 2. Xóa package-lock.json

File `package-lock.json` đã được xóa. Nếu vẫn còn, xóa thủ công:
```bash
rm package-lock.json
```

## 3. Cài đặt dependencies với yarn

```bash
yarn install
```

Lệnh này sẽ tạo file `yarn.lock` thay thế cho `package-lock.json`.

## 4. Sử dụng yarn commands

Thay vì `npm`, sử dụng `yarn`:

```bash
# Development
yarn dev

# Build
yarn build

# Start production
yarn start

# Lint
yarn lint

# Add dependency
yarn add package-name

# Add dev dependency
yarn add -D package-name

# Remove dependency
yarn remove package-name
```

## 5. Cấu hình Vercel

Vercel tự động phát hiện yarn nếu có file `yarn.lock` trong project. Không cần cấu hình thêm.

## 6. Commit yarn.lock

File `yarn.lock` nên được commit vào git để đảm bảo mọi người sử dụng cùng version của dependencies.

```bash
git add yarn.lock
git commit -m "Switch from npm to yarn"
git push
```
