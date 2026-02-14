-- debates テーブルに status カラムを追加
ALTER TABLE debates ADD COLUMN status TEXT DEFAULT 'pending';

-- 既存のディベートにデフォルト値を設定
UPDATE debates SET status = 'pending' WHERE status IS NULL;

-- デフォルトディベートを常にactiveに設定
UPDATE debates SET status = 'active' WHERE id = 'default';
