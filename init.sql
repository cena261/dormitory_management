-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: KTX_Managerment
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bienbanbangiao`
--

DROP TABLE IF EXISTS `bienbanbangiao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bienbanbangiao` (
  `ngayBanGiao` date NOT NULL,
  `loaiBienBan` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maBienBan` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `maHopDong` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maQLBanGiao` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nguoiNhanBanGiao` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ghiChu` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`maBienBan`),
  KEY `FKqmiijuane4yacnkqf6ckdk8vn` (`maHopDong`),
  KEY `FKs52592k5gcuy1meesx89vtx8a` (`maQLBanGiao`),
  CONSTRAINT `FKqmiijuane4yacnkqf6ckdk8vn` FOREIGN KEY (`maHopDong`) REFERENCES `hopdong` (`maHopDong`),
  CONSTRAINT `FKs52592k5gcuy1meesx89vtx8a` FOREIGN KEY (`maQLBanGiao`) REFERENCES `quanly` (`maQL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bienbanbangiao`
--

LOCK TABLES `bienbanbangiao` WRITE;
/*!40000 ALTER TABLE `bienbanbangiao` DISABLE KEYS */;
/*!40000 ALTER TABLE `bienbanbangiao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitietbangiao`
--

DROP TABLE IF EXISTS `chitietbangiao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitietbangiao` (
  `soLuong` int NOT NULL,
  `tinhTrangKhiBanGiao` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maBienBan` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `maVatDung` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maBienBan`,`maVatDung`),
  KEY `FKmeim58v1942h21r0579e6rprr` (`maVatDung`),
  CONSTRAINT `FKb104xr19jaq83pyuc564ldsa6` FOREIGN KEY (`maBienBan`) REFERENCES `bienbanbangiao` (`maBienBan`),
  CONSTRAINT `FKmeim58v1942h21r0579e6rprr` FOREIGN KEY (`maVatDung`) REFERENCES `vatdungcosan` (`maVatDung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietbangiao`
--

LOCK TABLES `chitietbangiao` WRITE;
/*!40000 ALTER TABLE `chitietbangiao` DISABLE KEYS */;
/*!40000 ALTER TABLE `chitietbangiao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chitietdiennuoc`
--

DROP TABLE IF EXISTS `chitietdiennuoc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chitietdiennuoc` (
  `chiSoDienCuoi` int NOT NULL,
  `chiSoDienDau` int NOT NULL,
  `chiSoNuocCuoi` int NOT NULL,
  `chiSoNuocDau` int NOT NULL,
  `donGiaDien` decimal(10,2) NOT NULL,
  `donGiaNuoc` decimal(10,2) NOT NULL,
  `ngayGhiSo` date NOT NULL,
  `thanhTienDien` decimal(10,2) NOT NULL,
  `thanhTienNuoc` decimal(10,2) NOT NULL,
  `tongTien` decimal(10,2) NOT NULL,
  `maPhong` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kyGhiSo` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `maChiTietDN` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `maHoaDon` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maQuanLyGhi` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`maChiTietDN`),
  UNIQUE KEY `UKjgvg8kehkd2ngs3eessitci33` (`maPhong`),
  UNIQUE KEY `UKsuj467q3ggl8ew8b69vnm4rag` (`maHoaDon`),
  KEY `FKqmwiwfsvyooevyimvq2u2d5ia` (`maQuanLyGhi`),
  CONSTRAINT `FK_HoaDon_ChiTiet` FOREIGN KEY (`maHoaDon`) REFERENCES `hoadon` (`maHoaDon`),
  CONSTRAINT `FKk74x9wxf3v9fdioi5xsn9k47p` FOREIGN KEY (`maHoaDon`) REFERENCES `hoadon` (`maHoaDon`),
  CONSTRAINT `FKqmwiwfsvyooevyimvq2u2d5ia` FOREIGN KEY (`maQuanLyGhi`) REFERENCES `quanly` (`maQL`),
  CONSTRAINT `FKrmu8wakrh1fjw18lmcmx4vclj` FOREIGN KEY (`maPhong`) REFERENCES `phong` (`maPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chitietdiennuoc`
--

LOCK TABLES `chitietdiennuoc` WRITE;
/*!40000 ALTER TABLE `chitietdiennuoc` DISABLE KEYS */;
/*!40000 ALTER TABLE `chitietdiennuoc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoadon`
--

DROP TABLE IF EXISTS `hoadon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoadon` (
  `hanThanhToan` date NOT NULL,
  `ngayLap` date NOT NULL,
  `ngayThanhToan` date DEFAULT NULL,
  `soTien` decimal(10,2) NOT NULL,
  `kyThanhToan` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `loaiHoaDon` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `maHoaDon` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `maHopDong` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maQLThu` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trangThai` enum('ChuaThanhToan','DaThanhToan','QuaHan') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maHoaDon`),
  KEY `FKk2kchq2uq4cy7ycf13qiuns6i` (`maHopDong`),
  KEY `FKluhje82suyh6syam62cbwyfn6` (`maQLThu`),
  CONSTRAINT `FKk2kchq2uq4cy7ycf13qiuns6i` FOREIGN KEY (`maHopDong`) REFERENCES `hopdong` (`maHopDong`),
  CONSTRAINT `FKluhje82suyh6syam62cbwyfn6` FOREIGN KEY (`maQLThu`) REFERENCES `quanly` (`maQL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoadon`
--

LOCK TABLES `hoadon` WRITE;
/*!40000 ALTER TABLE `hoadon` DISABLE KEYS */;
INSERT INTO `hoadon` VALUES ('2025-05-31','2025-05-17',NULL,10000.00,'05-2025','Khac','53604c3da6184e50a0a1','HD011','QL003','ChuaThanhToan'),('2025-10-05','2025-04-30','2025-05-07',1837286.55,'2025-04','TienDienNuoc','HDNEW0001','HD001','QL002','DaThanhToan'),('2025-10-05','2025-04-30','2025-05-07',1639074.26,'2025-01','TienDienNuoc','HDNEW0002','HD002','QL001','DaThanhToan'),('2025-10-05','2025-04-30','2025-05-05',1425633.04,'2025-09','TienDienNuoc','HDNEW0003','HD003','QL003','DaThanhToan'),('2025-10-05','2025-04-30','2025-05-10',1350231.71,'2025-10','Khac','HDNEW0004','HD004','QL001','DaThanhToan'),('2025-10-05','2025-04-30','2025-05-01',1498991.34,'2025-09','TienPhong','HDNEW0005','HD005','QL003','DaThanhToan'),('2025-10-06','2025-05-20',NULL,707908.55,'2025-05','TongHop','HDNEW0006','HD006','QL003','ChuaThanhToan'),('2025-10-06','2025-05-20',NULL,1201980.33,'2025-05','TongHop','HDNEW0007','HD007','QL002','ChuaThanhToan'),('2025-10-06','2025-05-20',NULL,745609.87,'2025-04','TienPhong','HDNEW0008','HD008','QL003','ChuaThanhToan'),('2025-10-06','2025-05-20','2025-05-29',581711.19,'2025-11','TienDienNuoc','HDNEW0009','HD009','QL001','DaThanhToan'),('2025-10-06','2025-05-20','2025-05-17',534197.32,'2025-10','TongHop','HDNEW0010','HD010','QL_DEFAULT','DaThanhToan'),('2025-10-06','2025-05-20','2025-05-25',694658.93,'2025-01','TongHop','HDNEW0011','HD011','QL002','DaThanhToan'),('2025-10-06','2025-05-20','2025-05-27',1862799.44,'2025-04','Khac','HDNEW0012','HD012','QL003','DaThanhToan'),('2025-10-06','2025-05-20','2025-05-24',536356.98,'2025-12','Khac','HDNEW0013','HD013','QL001','DaThanhToan'),('2025-10-06','2025-05-20',NULL,1509523.75,'2025-06','TienDienNuoc','HDNEW0014','HD014','QL003','ChuaThanhToan'),('2025-10-06','2025-05-20',NULL,1519733.11,'2025-05','Khac','HDNEW0015','HD015','QL002','ChuaThanhToan'),('2025-10-06','2025-05-20','2025-05-27',1352675.78,'2025-08','Khac','HDNEW0016','HD016','QL002','DaThanhToan'),('2025-10-06','2025-05-20','2025-05-24',1458880.98,'2025-07','TienDienNuoc','HDNEW0017','HD017','QL001','DaThanhToan'),('2025-10-06','2025-05-20','2025-05-27',1506888.59,'2025-04','Khac','HDNEW0018','HD018','QL001','DaThanhToan'),('2025-10-06','2025-05-20',NULL,1964458.52,'2025-09','TongHop','HDNEW0019','HD019','QL003','ChuaThanhToan'),('2025-10-06','2025-05-20',NULL,1767833.60,'2025-11','TienDienNuoc','HDNEW0020','HD020','QL_DEFAULT','ChuaThanhToan');
/*!40000 ALTER TABLE `hoadon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hopdong`
--

DROP TABLE IF EXISTS `hopdong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hopdong` (
  `ngayBatDau` date NOT NULL,
  `ngayKetThucDuKien` date NOT NULL,
  `ngayKetThucThucTe` date DEFAULT NULL,
  `ngayLap` date NOT NULL,
  `tienCoc` decimal(38,2) NOT NULL,
  `maPhong` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maSV` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maHopDong` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `maQuanLyLap` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trangThai` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maHopDong`),
  UNIQUE KEY `UKs6rec1pggby44x95palaeosgs` (`maSV`),
  KEY `FKc4ostt4qaxyqpj246bjhas` (`maPhong`),
  KEY `FKroah8457rhxprfdtm1u8wa2tt` (`maQuanLyLap`),
  CONSTRAINT `FKaq48btol1kqiudjatxl0bvtdf` FOREIGN KEY (`maSV`) REFERENCES `sinhvien` (`maSV`),
  CONSTRAINT `FKc4ostt4qaxyqpj246bjhas` FOREIGN KEY (`maPhong`) REFERENCES `phong` (`maPhong`),
  CONSTRAINT `FKroah8457rhxprfdtm1u8wa2tt` FOREIGN KEY (`maQuanLyLap`) REFERENCES `quanly` (`maQL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hopdong`
--

LOCK TABLES `hopdong` WRITE;
/*!40000 ALTER TABLE `hopdong` DISABLE KEYS */;
INSERT INTO `hopdong` VALUES ('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'A102','2001235420','HD001','QL003','DangHieuLuc'),('2025-05-15','2025-09-12','2025-05-15','2025-05-15',500000.00,'B201','2001232287','HD002','QL001','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'B202','2001239930','HD003','QL002','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'A101','2001232673','HD004','QL003','DangHieuLuc'),('2025-05-15','2025-09-12','2025-05-15','2025-05-15',500000.00,'A102','2001232983','HD005','QL001','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'A101','2001234826','HD006','QL002','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'A201','2001238400','HD007','QL003','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'B202','2001232314','HD008','QL002','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'B202','2001237114','HD009','QL003','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'A201','2001233506','HD010','QL002','DangHieuLuc'),('2025-05-15','2025-09-12','2025-05-20','2025-05-15',500000.00,'A201','2001231546','HD011','QL003','DaHuy'),('2025-05-15','2025-09-12','2025-05-15','2025-05-15',500000.00,'B202','2001234699','HD012','QL001','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'A102','2001237943','HD013','QL002','DangHieuLuc'),('2025-05-15','2025-09-12','2025-05-15','2025-05-15',500000.00,'A201','2001236055','HD014','QL001','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'B201','2001236511','HD015','QL002','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'A102','2001231452','HD016','QL002','DangHieuLuc'),('2025-05-15','2025-09-12','2025-05-15','2025-05-15',500000.00,'A101','2001237912','HD017','QL001','DangHieuLuc'),('2025-05-15','2025-09-12','2025-05-15','2025-05-15',500000.00,'A101','2001231098','HD018','QL001','DangHieuLuc'),('2025-05-15','2025-09-12',NULL,'2025-05-15',500000.00,'B201','2001233590','HD019','QL003','DangHieuLuc'),('2025-05-15','2025-09-12','2025-05-15','2025-05-15',500000.00,'B201','2001238890','HD020','QL001','DangHieuLuc');
/*!40000 ALTER TABLE `hopdong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khuvuc`
--

DROP TABLE IF EXISTS `khuvuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khuvuc` (
  `soTang` int NOT NULL,
  `maKhu` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `tenKhu` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maKhu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khuvuc`
--

LOCK TABLES `khuvuc` WRITE;
/*!40000 ALTER TABLE `khuvuc` DISABLE KEYS */;
INSERT INTO `khuvuc` VALUES (4,'A','Khu A'),(5,'B','Khu B');
/*!40000 ALTER TABLE `khuvuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loaiphong`
--

DROP TABLE IF EXISTS `loaiphong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loaiphong` (
  `soNguoiToiDa` int NOT NULL,
  `maLoaiPhong` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maLoaiPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loaiphong`
--

LOCK TABLES `loaiphong` WRITE;
/*!40000 ALTER TABLE `loaiphong` DISABLE KEYS */;
INSERT INTO `loaiphong` VALUES (12,'P12'),(16,'P16'),(2,'P2'),(4,'P4'),(6,'P6'),(8,'P8');
/*!40000 ALTER TABLE `loaiphong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `loai` enum('HE_THONG','HOC_PHI','KHAC','SUA_CHUA') COLLATE utf8mb4_general_ci NOT NULL,
  `noiDung` text COLLATE utf8mb4_general_ci NOT NULL,
  `thoiGianGui` datetime(6) NOT NULL,
  `tieuDe` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `trangThai` enum('CHUA_DOC','DA_DOC') COLLATE utf8mb4_general_ci NOT NULL,
  `nguoiGui` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nguoiNhan` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK533if32bx5teo7xlswuymq3y4` (`nguoiGui`),
  KEY `FKc6ept3ueobyw6q574yaew3pdx` (`nguoiNhan`),
  CONSTRAINT `FK533if32bx5teo7xlswuymq3y4` FOREIGN KEY (`nguoiGui`) REFERENCES `quanly` (`maQL`),
  CONSTRAINT `FKc6ept3ueobyw6q574yaew3pdx` FOREIGN KEY (`nguoiNhan`) REFERENCES `sinhvien` (`maSV`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','DA_DOC','QL001','2001231098'),(2,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001231452'),(3,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001231546'),(4,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001232287'),(5,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001232314'),(6,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001232673'),(7,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001232983'),(8,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001233506'),(9,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001233590'),(10,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001234699'),(11,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001234826'),(12,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001235420'),(13,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001236055'),(14,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001236511'),(15,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001237114'),(16,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001237912'),(17,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001237943'),(18,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001238400'),(19,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001238890'),(20,'HE_THONG','Chào mừng đến với KTX','2025-05-15 10:00:00.000000','Chào mừng','CHUA_DOC','QL001','2001239930');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phong`
--

DROP TABLE IF EXISTS `phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phong` (
  `dienTich` float NOT NULL,
  `giaPhong` decimal(10,2) NOT NULL,
  `soNguoiHienTai` int NOT NULL,
  `tang` int NOT NULL,
  `maKhu` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maLoaiPhong` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maPhong` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `trangThai` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `moTa` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`maPhong`),
  KEY `FK8dxi24n4fj0ugo8jda596fc90` (`maKhu`),
  KEY `FKqe5upignmy92afnfrga60x577` (`maLoaiPhong`),
  CONSTRAINT `FK8dxi24n4fj0ugo8jda596fc90` FOREIGN KEY (`maKhu`) REFERENCES `khuvuc` (`maKhu`),
  CONSTRAINT `FKqe5upignmy92afnfrga60x577` FOREIGN KEY (`maLoaiPhong`) REFERENCES `loaiphong` (`maLoaiPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phong`
--

LOCK TABLES `phong` WRITE;
/*!40000 ALTER TABLE `phong` DISABLE KEYS */;
INSERT INTO `phong` VALUES (25,1200000.00,4,1,'A','P6','A101','DangO',''),(25,1200000.00,2,1,'A','P2','A102','Day',''),(69,1500000.00,0,2,'A','P16','A201','Trong',NULL),(25,1200000.00,6,1,'B','P6','B201','Day',''),(25,1200000.00,6,1,'B','P8','B202','DangO',''),(24.5,1500000.00,3,2,'B','P6','B203','DangO','Phòng mới sạch sẽ');
/*!40000 ALTER TABLE `phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quanly`
--

DROP TABLE IF EXISTS `quanly`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quanly` (
  `maQL` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `sdt` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `chucVu` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hoTen` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maQL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quanly`
--

LOCK TABLES `quanly` WRITE;
/*!40000 ALTER TABLE `quanly` DISABLE KEYS */;
INSERT INTO `quanly` VALUES ('QL001','0912345678','Phó Ký Túc Xá','admin01@gmail','Nguyễn Văn A'),('QL002','0912345678','Phó Ký Túc Xá','admin01@gmail','Nguyễn Văn A'),('QL003','0912345678','Phó Ký Túc Xá','admin01@gmail','Nguyễn Văn A'),('QL_DEFAULT','0123456789','Admin hệ thống','admin@ktx.edu.vn','Quản trị viên hệ thống');
/*!40000 ALTER TABLE `quanly` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sinhvien`
--

DROP TABLE IF EXISTS `sinhvien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sinhvien` (
  `ngaySinh` date DEFAULT NULL,
  `gioiTinh` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maSV` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `sdt` varchar(12) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cccd` varchar(13) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trangThai` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `doiTuongUuTien` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lop` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `diaChiThuongTru` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ghiChu` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hoTen` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `khoa` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maPhong` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `taiKhoan` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `matKhau` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trangThaiSinhVien` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `trangThaiTaiKhoan` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`maSV`),
  KEY `fk_sinhvien_phong` (`maPhong`),
  CONSTRAINT `fk_sinhvien_phong` FOREIGN KEY (`maPhong`) REFERENCES `phong` (`maPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sinhvien`
--

LOCK TABLES `sinhvien` WRITE;
/*!40000 ALTER TABLE `sinhvien` DISABLE KEYS */;
INSERT INTO `sinhvien` VALUES ('2004-12-01','Nữ','2001231098','0968123490','120398456712','Đang ở','Có','DHNN20B','TP.Huế','2001231098@ktx.edu.vn',NULL,'Hoàng Thị Lan','Ngôn ngữ Anh','A101',NULL,NULL,NULL,NULL),('2003-11-15','Nam','2001231452','0918234765','123456789012','Đang ở','Không','DHKTCN18B','Bình Dương','2001231452@ktx.edu.vn',NULL,'Trần Minh Khoa','Cơ khí chế tạo','A101',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001231546','1746629380','730585905299','Đang ở','Không','DHKTPM17A','TP.HCM','2001231546@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','A101',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001232287','1101041864','427021868322','Đang ở','Không','DHKTPM17A','TP.HCM','2001232287@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','A102',NULL,NULL,NULL,NULL),('2002-09-14','Nam','2001232314','0937231548','675849321765','Đang ở','Không','DHKTCN17C','Nha Trang','2001232314@ktx.edu.vn',NULL,'Tạ Minh Nhật','Cơ điện tử','A102',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001232673','5791674432','743178574153','Đang ở','Không','DHKTPM17A','TP.HCM','2001232673@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','B201',NULL,NULL,NULL,NULL),('2004-02-28','Nữ','2001232983','0934123456','321098765432','Đang ở','Có','DHKTPM18C','Đồng Nai','2001232983@ktx.edu.vn',NULL,'Lê Thị Bích Ngọc','Công nghệ thông tin','B201',NULL,NULL,NULL,NULL),('2003-05-05','Nam','2001233506','0987123401','789654123789','Rời đi','Không','DHDL17C','Vũng Tàu','2001233506@ktx.edu.vn',NULL,'Ngô Văn Huy','Du lịch','B201',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001233590','7069901772','969103503973','Đang ở','Không','DHKTPM17A','TP.HCM','2001233590@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','B201',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001234699','1793857172','748854200040','Đang ở','Không','DHKTPM17A','TP.HCM','2001234699@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','B201',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001234826','7194467545','248893774933','Đang ở','Không','DHKTPM17A','TP.HCM','2001234826@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','B201',NULL,NULL,NULL,NULL),('2003-03-22','Nam','2001235420','0923412876','874123569812','Đang ở','Không','DHKTPM17A','Hà Nội','2001235420@ktx.edu.vn',NULL,'Bùi Đức Mạnh','Công nghệ thông tin','B202',NULL,NULL,NULL,NULL),('2004-08-18','Nữ','2001236055','0945012678','230984752301','Đang ở','Có','DHKTPM19B','TP.HCM','2001236055@ktx.edu.vn',NULL,'Nguyễn Bảo Trân','Công nghệ thông tin','B202',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001236511','7831754540','878295981823','Đang ở','Không','DHKTPM17A','TP.HCM','2001236511@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','B202',NULL,NULL,NULL,NULL),('2002-07-10','Nam','2001237114','0978945612','456789123456','Đang ở','Không','DHKD19A','Cần Thơ','2001237114@ktx.edu.vn',NULL,'Phạm Văn Lộc','Kinh tế','B202',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001237912','6815688941','818420003218','Đang ở','Không','DHKTPM17A','TP.HCM','2001237912@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','B202',NULL,NULL,NULL,NULL),('2003-06-06','Nam','2001237943','0912098345','976542318908','Đang ở','Không','DHKTDL18A','An Giang','2001237943@ktx.edu.vn',NULL,'Lâm Quốc Huy','Du lịch','B202',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001238400','3026405198','522250624394','Đang ở','Không','DHKTPM17A','TP.HCM','2001238400@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','B203',NULL,NULL,NULL,NULL),('2005-01-20','Nữ','2001238890','0908123789','654321987654','Đang ở','Có','DHMKT20A','TP.HCM','2001238890@ktx.edu.vn',NULL,'Đặng Ngọc Anh','Marketing','B203',NULL,NULL,NULL,NULL),('2004-04-30','Nam','2001239930','2869002646','357564457320','Đang ở','Không','DHKTPM17A','TP.HCM','2001239930@ktx.edu.vn',NULL,'Nguyễn Văn A','Công nghệ thông tin','B203',NULL,NULL,NULL,NULL),('2004-12-01','Nữ','svtest','0968123490','120398456712','Rời đi','Có','DHNN20B','TP.Huế','sinhvientest@ktx.edu.vn',NULL,'Hoàng Thị Lan Anh','Ngôn ngữ Anh',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `sinhvien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taikhoan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `maSV` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maQL` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `matKhau` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `taiKhoan` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `trangThai` enum('Khoa','KichHoat') COLLATE utf8mb4_general_ci NOT NULL,
  `vaiTro` enum('QuanTriVien','SinhVien') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK7hl5xtmvdusw9j85od2ics5ci` (`taiKhoan`),
  UNIQUE KEY `UKhbeis8qyyqwy6so431e88rqan` (`maSV`),
  UNIQUE KEY `UK9dpbbnbvj2hynoym3hcdhlktl` (`maQL`),
  CONSTRAINT `FK12qcgrl61s3k4i5o2e02t2eoy` FOREIGN KEY (`maQL`) REFERENCES `quanly` (`maQL`),
  CONSTRAINT `FK7uolqq9bkhr1uabyhg71ysio9` FOREIGN KEY (`maSV`) REFERENCES `sinhvien` (`maSV`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (6,NULL,'QL_DEFAULT','$2a$10$rE/jhvnV7nSuIxFfgbY8VecWaHbnblDI0ExSQmPA2w/.PM01YcSVq','admin','KichHoat','QuanTriVien'),(7,NULL,'QL003','$2a$10$A575k1Gz9QDtQ1NpX7me7ukYjpg.IIzMYxHjrVZrtwb9P7lFcLTlK','Skibidi','KichHoat','QuanTriVien'),(11,'2001231546',NULL,'$2a$10$wcd2Hrax919iyyJoRiXXGuSOeZY0zbA13m9eNucZa5mkzv1mlExo6','2001231546','KichHoat','SinhVien'),(12,'2001237912',NULL,'$2a$10$TAUMoor2c9gV9Mb9nihT..JexqFhxf82HfyCyljz7kusO9ktWuhKW','2001237912','KichHoat','SinhVien'),(13,'2001236511',NULL,'$2a$10$aoo7MhbBiWErCkp3qthKq.DyaL6Px1dt8.TFQTpMi3Z2fCarVT.v.','2001236511','KichHoat','SinhVien'),(14,'2001234699',NULL,'$2a$10$HScJl.Pbsfo/DVrGTHHKDOs4L8rY6.7vPS6FqFQt6kIvGYKFml9pW','2001234699','KichHoat','SinhVien'),(15,'2001232287',NULL,'$2a$10$2LTvErG71b/NU4yNomZB8.aEDikOfX1kSmaCttF149Kjm8P/o1laS','2001232287','KichHoat','SinhVien'),(16,'2001232673',NULL,'$2a$10$9IAkTrPope90apGwFeVB/ex/JyW5jVh5C55/XlNqPgWq.VKH1cfke','2001232673','KichHoat','SinhVien'),(17,'2001233590',NULL,'$2a$10$1h.j42GMCHCyz2Hbssqh.uXHWzKgd.4LA6q0VPip1D99YG2HxYwEW','2001233590','KichHoat','SinhVien'),(18,'2001239930',NULL,'$2a$10$.0G.gYB/Lwea01j4ZGjiy.26zd9wWT2onTyY7VfrjoNg6L6NaHll.','2001239930','KichHoat','SinhVien'),(19,'2001234826',NULL,'$2a$10$g4X49X0ZLnSH18jWU3vRvOcktNmNhsr9gtNBkl2/yGu9uQW0IZgj2','2001234826','KichHoat','SinhVien'),(20,'2001238400',NULL,'$2a$10$/zWfi7jIOW8xv90LqKic5eUMftAzQ0OQoY./bcPXzHfHDOhKXrNIC','2001238400','KichHoat','SinhVien'),(21,'2001233506',NULL,'$2a$10$TLwGWZyBofuGH7PXEsev9uMt.3Tsobukg826G0O3L/9C5VYLZFbzm','2001233506','KichHoat','SinhVien'),(22,'2001238890',NULL,'$2a$10$sP6HfCuMenHN0LPp0mkoHO.MYYzny1T08lOOcvQuA0zYe8HUjb4p.','2001238890','KichHoat','SinhVien'),(23,'2001237114',NULL,'$2a$10$fECm1XgXJCmy2Ugq18fsXOi44GTuu1V4V70H3jWaOaY8W5wxKj2La','2001237114','KichHoat','SinhVien'),(24,'2001232983',NULL,'$2a$10$A8flXtr29mTx3s79lr1wsuOCRyBziMVyDeqL2ktZ9Ls54TxYAOYvq','2001232983','KichHoat','SinhVien'),(25,'2001231452',NULL,'$2a$10$spzK.3C9vHinNSpDcfpbMuIgoP6Y988sgg4mBmTL1ow/6rsOjuW6G','2001231452','KichHoat','SinhVien'),(26,'2001237943',NULL,'$2a$10$UTBhGhQyM9OO8XPHMkic6eEvm089KfEKJHEjAl7W5Y827d1XJuD2C','2001237943','KichHoat','SinhVien'),(27,'2001236055',NULL,'$2a$10$5e2Ox5uWAWJKmlpcM0jEAO8vkaZxgLJJzoYYQYDYGpzk4bypIWgvG','2001236055','KichHoat','SinhVien'),(28,'2001232314',NULL,'$2a$10$bRsMORW0mhQSXjLZkulb9.7S3Pw4OcBAxQysbI38EqhewlQtqw0w.','2001232314','KichHoat','SinhVien'),(29,'2001235420',NULL,'$2a$10$RzS73dUgJQMhdEmJA1oIzu6eNXjVQKo8GWypOmjxVzgpAT/7OpYqO','2001235420','KichHoat','SinhVien'),(30,'2001231098',NULL,'$2a$10$fqGl3z.QIBek2rE1l73nWOvueJYyXD5YYEP7n1DMyKRvwJ9RZA/D2','2001231098','KichHoat','SinhVien'),(33,'svtest',NULL,'$2a$10$QbCM4flXHAJPPX8nkEVdIOe.Bujuvcx2eQkkvhuc1nB/Aqfzgwl.6','svtest','KichHoat','SinhVien');
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vatdungcosan`
--

DROP TABLE IF EXISTS `vatdungcosan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vatdungcosan` (
  `giaTri` decimal(10,2) NOT NULL,
  `ngayNhap` date NOT NULL,
  `maPhong` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maVatDung` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `tenVatDung` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `moTa` text COLLATE utf8mb4_general_ci,
  `tinhTrang` enum('CanSua','HoatDong','Hong') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maVatDung`),
  KEY `FKawlgv1s7casf6sp0ql8ppgakj` (`maPhong`),
  CONSTRAINT `FKawlgv1s7casf6sp0ql8ppgakj` FOREIGN KEY (`maPhong`) REFERENCES `phong` (`maPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vatdungcosan`
--

LOCK TABLES `vatdungcosan` WRITE;
/*!40000 ALTER TABLE `vatdungcosan` DISABLE KEYS */;
INSERT INTO `vatdungcosan` VALUES (300000.00,'2024-01-01','A101','VD1','Ban ghe 1','Bộ bàn ghế sinh viên','HoatDong'),(300000.00,'2024-01-01','A102','VD2','Ban ghe 2','Bộ bàn ghế sinh viên','HoatDong'),(300000.00,'2024-01-01','B201','VD3','Ban ghe 3','Bộ bàn ghế sinh viên','HoatDong'),(300000.00,'2024-01-01','B202','VD4','Ban ghe 4','Bộ bàn ghế sinh viên','HoatDong');
/*!40000 ALTER TABLE `vatdungcosan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yeucausuachua`
--

DROP TABLE IF EXISTS `yeucausuachua`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `yeucausuachua` (
  `chiPhi` decimal(10,2) DEFAULT NULL,
  `ngayHoanThanh` date DEFAULT NULL,
  `ngayXuLy` date DEFAULT NULL,
  `ngayYeuCau` date NOT NULL,
  `maPhong` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maSV` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maQLXuLy` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `maYeuCau` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `ghiChu` text COLLATE utf8mb4_general_ci,
  `noiDung` text COLLATE utf8mb4_general_ci NOT NULL,
  `mucDoUuTien` enum('Cao','Thap','TrungBinh') COLLATE utf8mb4_general_ci NOT NULL,
  `trangThai` enum('DangCho','DangXuLy','HoanThanh') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`maYeuCau`),
  KEY `FK4wfn5lm4tvlt17kskbbds8cgp` (`maSV`),
  KEY `FKlnpw1m12tjhe1ejid6bbklsld` (`maPhong`),
  KEY `FK96ckmx5ohvjqqsxy2y9fgpa00` (`maQLXuLy`),
  CONSTRAINT `FK4wfn5lm4tvlt17kskbbds8cgp` FOREIGN KEY (`maSV`) REFERENCES `sinhvien` (`maSV`),
  CONSTRAINT `FK96ckmx5ohvjqqsxy2y9fgpa00` FOREIGN KEY (`maQLXuLy`) REFERENCES `quanly` (`maQL`),
  CONSTRAINT `FKlnpw1m12tjhe1ejid6bbklsld` FOREIGN KEY (`maPhong`) REFERENCES `phong` (`maPhong`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yeucausuachua`
--

LOCK TABLES `yeucausuachua` WRITE;
/*!40000 ALTER TABLE `yeucausuachua` DISABLE KEYS */;
INSERT INTO `yeucausuachua` VALUES (NULL,'2025-05-17','2025-05-16','2025-05-15','B201','2001233590','QL003','069a065da4d241dda6ff','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangXuLy'),(NULL,'2025-05-17','2025-05-16','2025-05-15','A102','2001232983','QL001','2abca07b54af493599c3','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangXuLy'),(NULL,'2025-05-17','2025-05-16','2025-05-15','A201','2001231546','QL003','54a861739d744a358f0b','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangXuLy'),(NULL,NULL,NULL,'2025-05-15','A102','2001231452','QL002','58b430e31240482c99ca','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangCho'),(NULL,NULL,NULL,'2025-05-15','A101','2001232673','QL003','64398148d2be46cfb627','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangCho'),(0.00,NULL,NULL,'2025-05-21','B201','2001234826',NULL,'76470ff948ba4738b5cd',NULL,'yêu cầu test ngày 21/5/2025','TrungBinh','DangCho'),(NULL,NULL,NULL,'2025-05-15','B201','2001232287','QL001','81b0113130db4c6eab93','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangCho'),(NULL,'2025-05-17','2025-05-16','2025-05-15','A101','2001231098','QL001','9024c91c8bd246bc80b8','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangXuLy'),(0.00,NULL,NULL,'2025-05-21','B201','2001234826',NULL,'bd37104364594c40a692',NULL,'adsadadadasda','TrungBinh','DangCho'),(NULL,NULL,NULL,'2025-05-15','A201','2001233506','QL002','cbc7d9e4f8304b8f8b79','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangCho'),(NULL,'2025-05-17','2025-05-16','2025-05-15','B202','2001232314','QL002','db067c7334824312938d','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangXuLy'),(NULL,NULL,NULL,'2025-05-15','B202','2001234699','QL001','f36a139fff4a450f98f5','Không','Sửa chữa bóng đèn phòng học','TrungBinh','DangCho');
/*!40000 ALTER TABLE `yeucausuachua` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-22 10:49:13
