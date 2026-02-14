-- Ensure default debate always exists with live status
DELETE FROM debates WHERE id = 'default';
INSERT INTO debates (id, title, topic, agree_position, disagree_position, status, created_at) 
VALUES ('default', 'AIは仕事を創出するか奪うか', 'AIと雇用の関係', 'AIは仕事を創出する', 'AIは仕事を奪う', 'live', datetime('now'));
