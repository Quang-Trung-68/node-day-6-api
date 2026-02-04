# Hướng dẫn cài đặt và chạy dự án

## Cài đặt

1.  Cài đặt các thư viện cần thiết:
    ```bash
    npm install
    ```

2.  Cấu hình biến môi trường:
    -   Tạo file `.env` từ file `.env.example`:
        ```bash
        cp .env.example .env
        ```
    -   Cập nhật các thông tin kết nối Database và JWT trong file `.env`.

3.  Cài đặt Database:
    -   Đảm bảo bạn đã cài MySQL.
    -   Chạy script trong file `database.sql` để tạo database và các bảng cần thiết:
        ```bash
        mysql -u root -p < database.sql
        ```
    -   *Lưu ý: Script trên sẽ tạo database tên là `chat_app` (khớp với cấu hình mặc định trong `.env.example`).*

## Chạy ứng dụng

-   Chạy môi trường phát triển (Development):
    ```bash
    npm run dev
    ```

-   Chạy môi trường sản xuất (Production):
    ```bash
    npm start
    ```

## Render Deployment

Link deploy trên Render: [Deploy Render](https://node-day-6-api.onrender.com)
