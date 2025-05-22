function Rules() {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Quy định ký túc xá</h2>
      </div>

      <div className="bg-gray-100 rounded-xl p-6">
        <div className="prose max-w-none">
          <h3 className="text-xl font-bold mb-4">I. Quy định cơ bản</h3>

          <p className="font-medium italic">Trật tự và vệ sinh chung:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Sinh viên phải tuân thủ nội quy chung, giữ gìn trật tự, giữ gìn vệ sinh cá nhân và khu vực chung.
            </li>
            <li className="mb-2">
              Không được gây ồn ào, xâm phạm quyền lợi của người khác hay gây ảnh hưởng xấu đến môi trường sống chung.
            </li>
          </ul>

          <p className="font-medium italic">Bảo quản tài sản chung:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Sinh viên có trách nhiệm bảo quản các thiết bị, đồ dùng chung của KTX.</li>
            <li className="mb-2">
              Mọi hành vi phá hoại, làm hỏng tài sản chung sẽ bị xử lý theo quy định của Ban quản lý KTX.
            </li>
          </ul>

          <h3 className="text-xl font-bold mb-4">II. Quy định khi chuyển phòng</h3>

          <p className="font-medium italic">Đăng ký chuyển phòng:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Sinh viên cần điền đầy đủ mẫu đơn chuyển phòng theo mẫu của Ban quản lý KTX và nộp đúng quy định.
            </li>
            <li className="mb-2">
              Phản ánh lý do chuyển phòng một cách trung thực, rõ ràng (ví dụ: điều kiện phòng không đảm bảo,...).
            </li>
          </ul>

          <p className="font-medium italic">Xét duyệt và sắp xếp:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Đơn chuyển phòng sẽ được Ban quản lý xem xét và duyệt dựa trên điều kiện hiện có của KTX (số lượng phòng
              trống, tình trạng phòng mới, ...).
            </li>
            <li className="mb-2">
              Sinh viên sẽ được thông báo kết quả và hướng dẫn thủ tục chuyển phòng sau khi đơn được duyệt.
            </li>
          </ul>

          <h3 className="text-xl font-bold mb-4">III. Quy định khi phản ánh trực tuyến</h3>

          <p className="font-medium italic">Phương thức phản ánh:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">
              Sinh viên phản ánh qua cổng thông tin trực tuyến của KTX hoặc email chính thức do Ban quản lý cung cấp.
            </li>
            <li className="mb-2">
              Nội dung phản ánh phải trung thực, khách quan và không mang tính chất khiêu khích, phỉ báng cá nhân hay tổ
              chức.
            </li>
          </ul>

          <p className="font-medium italic">Thời gian và quy trình xử lý:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2">Ban quản lý cam kết tiếp nhận và phản hồi phản ánh trong vòng 12 giờ làm việc.</li>
            <li className="mb-2">
              Các phản ánh cần được ghi nhận đầy đủ thông tin (họ tên, mã số sinh viên, nội dung phản ánh) để xử lý
              nhanh chóng và chính xác.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Rules
