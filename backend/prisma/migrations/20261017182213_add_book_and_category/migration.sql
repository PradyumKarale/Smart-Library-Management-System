-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `books` (
    `id` VARCHAR(191) NOT NULL,
    `isbn` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `publisher` VARCHAR(191) NULL,
    `publicationYear` INTEGER NULL,
    `shelfLocation` VARCHAR(191) NULL,
    `totalCopies` INTEGER NOT NULL DEFAULT 1,
    `availableCopies` INTEGER NOT NULL DEFAULT 1,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `books_isbn_key`(`isbn`),
    INDEX `books_title_idx`(`title`),
    INDEX `books_author_idx`(`author`),
    INDEX `books_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
