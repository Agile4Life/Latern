# Nguồn gốc và giấy phép tài nguyên

## Nguồn gói

Mã nguồn và tài nguyên được lấy từ URL ZIP đã chỉ định trong yêu cầu:

`https://d1oupeiobkpcny.cloudfront.net/assets/dashboard/materials/2026/09/30/467bc2058b307dabd00ac3c3996f30010a10c32f3afcff8a24cd22e891f7f6b0.zip`

SHA-256 ZIP gốc: `467bc2058b307dabd00ac3c3996f30010a10c32f3afcff8a24cd22e891f7f6b0`.

Bên trong có README/NOTES, source code, hình ảnh, model/texture, âm thanh, font, file license và metadata nguồn của một số asset. Nội dung bên nguồn được giữ nguyên, không chỉnh sửa. Bản bàn giao loại trừ `.manus-starter-init.json` và `.manus-webdev/preview-identity.json` vì đây là định danh nội bộ của dự án nguồn, không cần cho phát triển game.

## Tôn trọng giấy phép

- Không coi việc có file trong gói là bằng chứng rằng mọi tài nguyên đều cùng một giấy phép hoặc được phép tái phân phối trong mọi hình thức.
- Trước khi phát hành/phân phối lại, kiểm tra `License.txt`, các file `*-OFL.txt`, file license trong từng pack và metadata đi kèm đúng với tài nguyên đang sử dụng.
- Giữ notice/attribution và yêu cầu sửa đổi/phân phối lại của từng asset; không xóa `assets/source/`, license hoặc metadata provenance chỉ để giảm dung lượng.
- README nguồn ghi font Bangers, Sora và Figtree theo SIL Open Font License 1.1. Kiểm tra đúng các notice tại `public/fonts/` trước khi đóng gói sản phẩm.
- Một số tài nguyên được ghi là từ Kenney, Poly Haven và Quaternius. Các file license/provenance cụ thể trong gói là nguồn tham chiếu; hãy dùng chúng thay vì khái quát một giấy phép cho toàn bộ thư mục.
- README cũng ghi nhạc được tạo bằng Google Lyria và hiệu ứng âm thanh bằng ElevenLabs. Giữ thông tin nguồn này trong hồ sơ dự án và kiểm tra điều khoản hiện hành trước khi phân phối thương mại.

## Giữ metadata và nguồn

Các file `.catalog-retrieval-*.json` được giữ cùng tài nguyên nguồn. Theo README/metadata, chúng lưu thông tin nguồn, license, thành viên và hash tài nguyên; không dùng chúng thay cho việc đọc notice thực tế khi chuẩn bị bản phát hành. Không đưa grant/credential riêng hoặc tệp xác thực vào bản xuất. Không có grant credential nào được thêm vào bộ bàn giao này.
