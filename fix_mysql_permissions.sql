-- appuser에게 REFERENCES 권한 부여
GRANT REFERENCES ON dochub.* TO 'appuser'@'%';
GRANT REFERENCES ON dochub.* TO 'appuser'@'localhost';

-- 권한 적용
FLUSH PRIVILEGES;

-- 권한 확인
SHOW GRANTS FOR 'appuser'@'%'; 