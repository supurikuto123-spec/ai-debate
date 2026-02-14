-- debates テーブルに status カラムを追加
ALTER TABLE debates ADD COLUMN status TEXT DEFAULT 'pending';

-- 既存のディベートにデフォルト値を設定
UPDATE debates SET status = 'pending' WHERE status IS NULL;

-- デフォルトディベートを常にliveに設定
UPDATE debates SET status = 'live' WHERE id = 'default';
