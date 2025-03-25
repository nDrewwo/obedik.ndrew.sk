/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for rfid_test
CREATE DATABASE IF NOT EXISTS `rfid_test` /*!40100 DEFAULT CHARACTER SET utf16 COLLATE utf16_slovak_ci */;
USE `rfid_test`;

-- Dumping structure for table rfid_test.esp
CREATE TABLE IF NOT EXISTS `esp` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `RFID` varchar(20) NOT NULL,
  `Choice` int(11) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `RFID` (`RFID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf16 COLLATE=utf16_slovak_ci;

-- Dumping data for table rfid_test.esp: ~1 rows (approximately)
INSERT INTO `esp` (`order_id`, `RFID`, `Choice`) VALUES
	(1, '4A7483A1', 1);

-- Dumping structure for table rfid_test.Orders
CREATE TABLE IF NOT EXISTS `Orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `ref_user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `lunch_choice` int(11) NOT NULL,
  `order_status` varchar(20) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `ref_user_id` (`ref_user_id`),
  CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`ref_user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf16 COLLATE=utf16_slovak_ci;

-- Dumping data for table rfid_test.Orders: ~1 rows (approximately)
INSERT INTO `Orders` (`order_id`, `ref_user_id`, `date`, `lunch_choice`, `order_status`) VALUES
	(8, 1, '2025-03-22', 1, 'pending');

-- Dumping structure for table rfid_test.Users
CREATE TABLE IF NOT EXISTS `Users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) DEFAULT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `role` enum('student','teacher') NOT NULL DEFAULT 'student',
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `card_id` varchar(20) DEFAULT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `password` varchar(255) NOT NULL,
  `mail` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf16 COLLATE=utf16_slovak_ci;

-- Dumping data for table rfid_test.Users: ~3 rows (approximately)
INSERT INTO `Users` (`user_id`, `first_name`, `middle_name`, `last_name`, `role`, `admin`, `card_id`, `balance`, `password`, `mail`) VALUES
	(1, 'Andrej', NULL, 'Siekel', 'student', 0, 'AABBCCDD', 993.00, '$2a$12$JOZNUrE6aXH9mi/xrMRA8exRpHMLF4Qngf71.MKgJJWEKd9fJ5nbe', 'andrej.siekel@spsmt.sk'),
	(2, 'Jozef', NULL, 'Kostolník', 'teacher', 0, 'AABBCC00', 21.00, '$2a$12$JOZNUrE6aXH9mi/xrMRA8exRpHMLF4Qngf71.MKgJJWEKd9fJ5nbe', 'jozef.kostolnik@spsmt.sk'),
	(3, 'Jarmila', 'Jarka', 'Chutná', 'teacher', 1, 'AABB0000', 12.00, '$2a$12$JOZNUrE6aXH9mi/xrMRA8exRpHMLF4Qngf71.MKgJJWEKd9fJ5nbe', 'jarka.chutna@spsmt.sk');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
