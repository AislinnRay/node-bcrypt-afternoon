INSERT INTO users1
(is_admin, username, hash)
VALUES
($1, $2, $3)
returning *;