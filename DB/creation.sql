CREATE DATABASE  IF NOT EXISTS `notifications` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `notifications`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 192.168.0.159    Database: notifications
-- ------------------------------------------------------
-- Server version 5.7.21-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notificationlist`
--

DROP TABLE IF EXISTS `notificationlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificationlist` (
  `notificationID` int(10) NOT NULL AUTO_INCREMENT,
  `subject` varchar(100) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(100) NOT NULL,
  `rulesID` int(20) NOT NULL,
  PRIMARY KEY (`notificationID`),
  KEY `token` (`token`),
  CONSTRAINT `notificationlist_ibfk_1_idx` FOREIGN KEY (`token`) REFERENCES `registration` (`token`)  ON DELETE CASCADE ON UPDATE NO ACTION,
  KEY `rulesID` (`rulesID`),
  CONSTRAINT `notificationlist_ibfk_2_idx` FOREIGN KEY (`rulesID`) REFERENCES `ruleslist` (`rulesID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `registration`
--

DROP TABLE IF EXISTS `registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registration` (
  `token` varchar(100) NOT NULL,
  `appID` varchar(100) NOT NULL,
  `developerID` varchar(100) NOT NULL,
  PRIMARY KEY (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `ruleslist`
--

DROP TABLE IF EXISTS `ruleslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ruleslist` (
  `rulesID` int(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(100) NOT NULL,
  `parameter` varchar(100) NOT NULL,
  `conditionValue` varchar(50) NOT NULL,
  `controlValue` varchar(50) NOT NULL,
  `threshold` varchar(5) NOT NULL,
  `notifyType` varchar(20) NOT NULL,
  `emailTo` varchar(100) NOT NULL,
  `notificationType` int(1) NOT NULL,
  `hostname` varchar(100) NOT NULL,
  `port` int(10) NOT NULL,
  `path` varchar(100) NOT NULL,
  `method` varchar(20) NOT NULL,
  `token` varchar(100) NOT NULL,
  PRIMARY KEY (`rulesID`),
  KEY `token` (`token`),
  CONSTRAINT `ruleslist_ibfk_1_idx` FOREIGN KEY (`token`) REFERENCES `registration` (`token`)  ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `statisticslist`
--

DROP TABLE IF EXISTS `statisticslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statisticslist` (
  `statisticsID` int(11) NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `result` varchar(5) NOT NULL,
  `subjectValue` varchar(50) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `rulesID` int(11) NOT NULL,
  PRIMARY KEY (`statisticsID`),
  KEY `rulesID` (`rulesID`),
  CONSTRAINT `statisticslist_ibfk_1_idx` FOREIGN KEY (`rulesID`) REFERENCES `ruleslist` (`rulesID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-09 11:30:51

