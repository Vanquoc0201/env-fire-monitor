-- CreateTable
CREATE TABLE `telemetry_logs` (
    `id` VARCHAR(191) NOT NULL,
    `deviceId` VARCHAR(191) NOT NULL DEFAULT 'ESP32_FIRE_MONITOR',
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `gas` INTEGER NOT NULL,
    `flame` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
