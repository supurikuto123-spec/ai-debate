-- Force default debate to be live status
UPDATE debates SET status = 'live' WHERE id = 'default';
