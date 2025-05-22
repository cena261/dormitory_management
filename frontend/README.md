Quy trình thực hiện để tránh bị conflict mỗi khi code

Bước đầu tiên thực hiện trước khi vào code, đó là kéo code từ master về máy tính cá nhân  
git checkout master  
git pull origin master  

Bước 2: làm việc trên nhánh riêng chứ ko làm trong master  
git checkout NguyenVanDuc //Chuyển sang nhánh của đuk  
git pull origin NguyenVanDuc  
git merge master //Hợp nhất thay đổi từ master vào nhánh  
Sau đó thì cứ code và commit như bình thường  
git add .  
git commit -m "Cập nhật tính năng ABC"

Bước 3: code xong thì đẩy code lên nhánh  
git push origin NguyenVanDuc

Bước cuối: gộp code từ nhánh vào master (chỉ nên gộp khi hoàn thành được một phần lớn, còn làm lặt vặt thì từ từ merge cũng được :v)  
git checkout master  
git merge NguyenVanDuc  
git push origin master

Hiểu nhanh GitHub: https://www.youtube.com/watch?v=-XsRLyKV9_k  
