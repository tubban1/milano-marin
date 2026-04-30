-- Milano Marin 内容管理数据库表结构
-- 数据库：wish_2

-- 创建页面内容表
CREATE TABLE IF NOT EXISTS `milano_marin_page_content` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `page_key` VARCHAR(50) NOT NULL COMMENT '页面标识：home, menu, reservation, about, contact',
  `locale` VARCHAR(10) NOT NULL COMMENT '语言代码：it, en, zh-CN',
  `content` JSON NOT NULL COMMENT '页面内容（JSON格式）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `unique_page_locale` (`page_key`, `locale`),
  KEY `idx_page_key` (`page_key`),
  KEY `idx_locale` (`locale`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='页面内容表';

-- 内容修改历史表
CREATE TABLE IF NOT EXISTS `milano_marin_content_history` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `page_key` VARCHAR(50) NOT NULL,
  `locale` VARCHAR(10) NOT NULL,
  `content` JSON NOT NULL COMMENT '修改前的内容',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_page_locale` (`page_key`, `locale`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容修改历史表';
