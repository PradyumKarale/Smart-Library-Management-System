CREATE TABLE `loans` (
    `id` VARCHAR(191) NOT NULL,
    `studentUserId` VARCHAR(191) NOT NULL,
    `bookId` VARCHAR(191) NOT NULL,
    `issuedById` VARCHAR(191) NOT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NOT NULL,
    `returnedAt` DATETIME(3) NULL,
    `fineAmount` INTEGER NOT NULL DEFAULT 0,
    INDEX `loans_studentUserId_returnedAt_idx`(`studentUserId`, `returnedAt`),
    INDEX `loans_bookId_returnedAt_idx`(`bookId`, `returnedAt`),
    INDEX `loans_dueDate_returnedAt_idx`(`dueDate`, `returnedAt`),
    PRIMARY KEY (`id`),
    CONSTRAINT `loans_studentUserId_fkey` FOREIGN KEY (`studentUserId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `loans_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `loans_issuedById_fkey` FOREIGN KEY (`issuedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
