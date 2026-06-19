-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 11, 2026 at 10:02 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `AlexandriaUnburnt`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `UseruserId` tinyint(3) UNSIGNED NOT NULL,
  `permissionLevel` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`UseruserId`, `permissionLevel`) VALUES
(3, 'superadmin'),
(4, 'superadmin'),
(5, 'superadmin'),
(6, 'superadmin'),
(7, 'superadmin');

-- --------------------------------------------------------

--
-- Table structure for table `Book`
--

CREATE TABLE `Book` (
  `isbn` varchar(13) NOT NULL,
  `title` varchar(100) NOT NULL,
  `author` varchar(50) NOT NULL,
  `description` varchar(300) NOT NULL,
  `publisher` varchar(50) NOT NULL,
  `price` float NOT NULL,
  `stock` int(10) UNSIGNED NOT NULL,
  `genreID` tinyint(3) UNSIGNED NOT NULL
) ;

--
-- Dumping data for table `Book`
--

INSERT INTO `Book` (`isbn`, `title`, `author`, `description`, `publisher`, `price`, `stock`, `genreID`) VALUES
('9780007559220', 'Solitaire', 'Alice Osemen', 'My name is Tori Spring. I like to sleep, blog, and until last year, I had friends.', 'Scholastic Press', 339.94, 5, 6),
('9780008501853', 'Babel', 'R. F. Kuang', 'Translator, traitor: To translate will always be a betrayal.', 'Harper', 490.05, 2, 2),
('9780060837020', 'The Bell Jar', 'Sylvia Plath', 'Working as an intern at a New York fashion magazine in the summer of 1953, Esther Greenwood is on the cusp of her future.', 'Harperperennial', 249, 5, 1),
('9780140449174', 'Anna Karenina', 'Leo Tolstoy', 'Anna is a beautiful and intelligent woman whose passionate affair with the dashing Count Vronsky leads to her downfall. ', 'Penguin', 369, 11, 1),
('9780141197692', 'Persuasion', 'Jane Austen', 'At twenty-seven, Anne Elliot is no longer young and has few romantic prospects.', 'Penguin', 379, 10, 1),
('9780141439471', 'Frankestein', 'Mary Shelly', 'Obsessed with the power to create life itself, Victor Frankenstein plunders graves to obtain the materials necessary to create a new being.', 'Pebguin', 349.6, 10, 1),
('9780141439518', 'Pride and Prejudice', 'Jane Austen', 'The first time Elizabeth Bennet meets the eligible bachelor Fitzwilliam Darcy, she dismisses him as arrogant and conceited; at the same time, the gentleman remains indifferent to Miss Bennet\'s beauty and lively mind.', 'Penguin', 220, 6, 1),
('9780143034698', 'The Coming of the Third Reich', 'Richard J. Evands', 'A masterful synthesis of a vast body of scholarly work integrated with important new research and interpretations, Evans’s history restores drama and contingency to the rise to power of Hitler and the Nazis.', 'Penguin', 522.55, 3, 5),
('9780143105435', 'Wuthering Heights', 'Emily Brontë', 'Wuthering Heights is the story of two families bound together and torn apart by love and hate.', 'Penguin', 419, 2, 1),
('9780545229937', 'The Hunger Games', 'Suzanne Collins', 'In the ruins of what was once North America now lies the country of Panem, a glittering Capitol surrounded by twelve districts.', 'Scholastic Press', 330, 2, 6),
('9780593168202', 'Normal People', 'Sally Rooney', 'Marianne and Connell are classmates in high school, but they never speak to each other.', 'Crown', 430, 3, 4),
('9780593595718', 'Ready or Not', 'Cara Barstone', 'Eve Hatch lives for surprises! Well, not really. She already knows what\'s going to happen every day, and she knows that each one will look pretty much the same.', 'The Dial Press', 287.48, 1, 3),
('9780786282258', 'The Lightning Thief', 'Rick Riordan', 'Percy Jackson is about to be expelled from school…again.', 'Disney Hyperion', 242.94, 1, 6),
('9781250076960', 'Six of Crows', 'Leigh Bardugo', 'Ketterdam is an international trading hub where anything can be bought for the right price, and no one knows this better than Kaz Brekker.', 'Henry Holt & Company', 240, 4, 6),
('9781410446077', 'Cinder', 'Marissa Meyer', 'Cinder, a talented mechanic in New Beijing, is also a cyborg. She is abused by her stepmother and blamed for her stepsister\'s sudden illness.', 'Square Fish', 242, 19, 6),
('9798885785365', 'Book Lovers', 'Emily Hendry', 'Nora Stephens’ life is books—she’s read them all—and she is not that type of heroine.', 'BookLovers', 418, 10, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Cart`
--

CREATE TABLE `Cart` (
  `cartId` tinyint(3) UNSIGNED NOT NULL,
  `Total` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `Fecha` date NOT NULL,
  `Descuento` tinyint(1) NOT NULL DEFAULT 0
) ;

--
-- Dumping data for table `Cart`
--

INSERT INTO `Cart` (`cartId`, `Total`, `Fecha`, `Descuento`) VALUES
(1, 584, '2024-06-01', 1),
(2, 350, '2024-06-02', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Client`
--

CREATE TABLE `Client` (
  `UseruserId` tinyint(3) UNSIGNED NOT NULL,
  `Address` varchar(50) NOT NULL,
  `Phone` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Client`
--

INSERT INTO `Client` (`UseruserId`, `Address`, `Phone`) VALUES
(8, 'Av Calle 2', '3330001212'),
(9, 'Av Calle 2', '4493330099');

-- --------------------------------------------------------

--
-- Table structure for table `Genre`
--

CREATE TABLE `Genre` (
  `genreID` tinyint(3) UNSIGNED NOT NULL,
  `Type` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Genre`
--

INSERT INTO `Genre` (`genreID`, `Type`) VALUES
(1, 'Classic'),
(2, 'Fantasy'),
(3, 'Romance'),
(4, 'Cotemporary'),
(5, 'History'),
(6, 'YA');

-- --------------------------------------------------------

--
-- Table structure for table `Have`
--

CREATE TABLE `Have` (
  `CartcartId` tinyint(3) UNSIGNED NOT NULL,
  `Bookisbn` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Message`
--

CREATE TABLE `Message` (
  `messageId` tinyint(3) UNSIGNED NOT NULL,
  `subject` varchar(40) NOT NULL,
  `message` varchar(200) NOT NULL,
  `sentData` varchar(255) NOT NULL,
  `UseruserId` tinyint(3) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `userId` tinyint(3) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `CartcartId` tinyint(3) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`userId`, `name`, `email`, `password`, `CartcartId`) VALUES
(7, 'Celia Fernanda Vela Uribe', 'celiafer@gmail.com', '$2b$10$cxlBT9eHyXxadkXfxhLkteHJ/Khz1ZWRu2JEHLc2.kczYyxf.AwTy', NULL),
(8, 'fer vela', 'fervela@email.com', '$2b$10$cxlBT9eHyXxadkXfxhLkteHJ/Khz1ZWRu2JEHLc2.kczYyxf.AwTy', NULL),
(9, 'Ana Martínez', 'ana@mail.com', '$2b$10$C7Fyv1ZwFmX7R2JPWwzzC.uLDUtUqlEUTEUNHSmboFD/tee7XSupy', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`UseruserId`);

--
-- Indexes for table `Book`
--
ALTER TABLE `Book`
  ADD PRIMARY KEY (`isbn`),
  ADD KEY `genreID` (`genreID`);

--
-- Indexes for table `Cart`
--
ALTER TABLE `Cart`
  ADD PRIMARY KEY (`cartId`);

--
-- Indexes for table `Client`
--
ALTER TABLE `Client`
  ADD PRIMARY KEY (`UseruserId`);

--
-- Indexes for table `Genre`
--
ALTER TABLE `Genre`
  ADD PRIMARY KEY (`genreID`);

--
-- Indexes for table `Have`
--
ALTER TABLE `Have`
  ADD PRIMARY KEY (`CartcartId`,`Bookisbn`),
  ADD KEY `Bookisbn` (`Bookisbn`);

--
-- Indexes for table `Message`
--
ALTER TABLE `Message`
  ADD PRIMARY KEY (`messageId`),
  ADD KEY `message_ibfk_1` (`UseruserId`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `CartcartId` (`CartcartId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `userId` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `Message`
--
ALTER TABLE `Message`
  MODIFY `messageId` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Table structure for table `BookOrder`
--

CREATE TABLE `BookOrder` (
  `orderId` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT,
  `userId` tinyint(3) UNSIGNED NOT NULL,
  `orderDate` varchar(255) NOT NULL,
  `total` float NOT NULL,
  PRIMARY KEY (`orderId`),
  KEY `order_ibfk_1` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `OrderItem`
--

CREATE TABLE `OrderItem` (
  `orderId` tinyint(3) UNSIGNED NOT NULL,
  `isbn` varchar(13) NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `price` float NOT NULL,
  PRIMARY KEY (`orderId`, `isbn`),
  KEY `orderitem_ibfk_2` (`isbn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Book`
--
ALTER TABLE `Book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`genreID`) REFERENCES `Genre` (`genreID`) ON UPDATE CASCADE;

--
-- Constraints for table `Have`
--
ALTER TABLE `Have`
  ADD CONSTRAINT `have_ibfk_1` FOREIGN KEY (`CartcartId`) REFERENCES `Cart` (`cartId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `have_ibfk_2` FOREIGN KEY (`Bookisbn`) REFERENCES `Book` (`isbn`) ON UPDATE CASCADE;

--
-- Constraints for table `Message`
--
ALTER TABLE `Message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`UseruserId`) REFERENCES `User` (`userId`);

--
-- Constraints for table `BookOrder`
--
ALTER TABLE `BookOrder`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `OrderItem`
--
ALTER TABLE `OrderItem`
  ADD CONSTRAINT `orderitem_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `BookOrder` (`orderId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitem_ibfk_2` FOREIGN KEY (`isbn`) REFERENCES `Book` (`isbn`) ON UPDATE CASCADE;

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`CartcartId`) REFERENCES `Cart` (`cartId`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
