-- Step 1: Add a temporary column `new_user_id` to the `app_user` table
ALTER TABLE app_user ADD COLUMN new_user_id TEXT;

-- Step 2: Populate the `new_user_id` column with new `cuid` values
UPDATE app_user SET new_user_id = gen_random_uuid();

-- Step 3: Add `new_user_id` to all dependent tables and populate it

-- app_user_meta_data
ALTER TABLE app_user_meta_data ADD COLUMN new_user_id TEXT;
UPDATE app_user_meta_data
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = app_user_meta_data.user_id
);

-- accounts
ALTER TABLE accounts ADD COLUMN new_user_id TEXT;
UPDATE accounts
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = accounts.user_id
);

-- sessions
ALTER TABLE sessions ADD COLUMN new_user_id TEXT;
UPDATE sessions
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = sessions.user_id
);

-- books_import
ALTER TABLE books_import ADD COLUMN new_user_id TEXT;
UPDATE books_import
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = books_import.user_id
);

-- book_in_list_visits
ALTER TABLE book_in_list_visits ADD COLUMN new_user_id TEXT;
UPDATE book_in_list_visits
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = book_in_list_visits.visitor_id
);

-- book_visits
ALTER TABLE book_visits ADD COLUMN new_user_id TEXT;
UPDATE book_visits
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = book_visits.visitor_id
);

-- list_visits
ALTER TABLE list_visits ADD COLUMN new_user_id TEXT;
UPDATE list_visits
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = list_visits.visitor_id
);

-- books_list
ALTER TABLE books_list ADD COLUMN new_user_id TEXT;
UPDATE books_list
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = books_list.user_id
);

-- user_book
ALTER TABLE user_book ADD COLUMN new_user_id TEXT;
UPDATE user_book
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = user_book.user_id
);

-- user_books_list_match
ALTER TABLE user_books_list_match ADD COLUMN new_user_id TEXT;
UPDATE user_books_list_match
SET new_user_id = (
    SELECT new_user_id
    FROM app_user
    WHERE app_user.user_id = user_books_list_match.user_id
);

-- Step 4: Drop all foreign key constraints referencing `user_id`
ALTER TABLE app_user_meta_data DROP CONSTRAINT app_user_meta_data_user_id_fkey;
ALTER TABLE accounts DROP CONSTRAINT accounts_user_id_fkey;
ALTER TABLE sessions DROP CONSTRAINT sessions_user_id_fkey;
ALTER TABLE books_import DROP CONSTRAINT books_import_user_id_fkey;
ALTER TABLE book_in_list_visits DROP CONSTRAINT book_in_list_visits_visitor_id_fkey;
ALTER TABLE book_visits DROP CONSTRAINT book_visits_visitor_id_fkey;
ALTER TABLE list_visits DROP CONSTRAINT list_visits_visitor_id_fkey;
ALTER TABLE books_list DROP CONSTRAINT books_list_user_id_fkey;
ALTER TABLE user_book DROP CONSTRAINT user_book_user_id_fkey;
ALTER TABLE user_books_list_match DROP CONSTRAINT user_books_list_match_user_id_fkey;

-- Step 5: Update the primary key on `app_user`
ALTER TABLE app_user DROP CONSTRAINT app_user_pkey;
ALTER TABLE app_user ADD CONSTRAINT app_user_pkey PRIMARY KEY (new_user_id);

-- Step 6: Remove `user_id` and replace it with `new_user_id` in all dependent tables

-- app_user_meta_data
ALTER TABLE app_user_meta_data DROP COLUMN user_id;
ALTER TABLE app_user_meta_data RENAME COLUMN new_user_id TO user_id;

-- accounts
ALTER TABLE accounts DROP COLUMN user_id;
ALTER TABLE accounts RENAME COLUMN new_user_id TO user_id;

-- sessions
ALTER TABLE sessions DROP COLUMN user_id;
ALTER TABLE sessions RENAME COLUMN new_user_id TO user_id;

-- books_import
ALTER TABLE books_import DROP COLUMN user_id;
ALTER TABLE books_import RENAME COLUMN new_user_id TO user_id;

-- book_in_list_visits
ALTER TABLE book_in_list_visits DROP COLUMN visitor_id;
ALTER TABLE book_in_list_visits RENAME COLUMN new_user_id TO visitor_id;

-- book_visits
ALTER TABLE book_visits DROP COLUMN visitor_id;
ALTER TABLE book_visits RENAME COLUMN new_user_id TO visitor_id;

-- list_visits
ALTER TABLE list_visits DROP COLUMN visitor_id;
ALTER TABLE list_visits RENAME COLUMN new_user_id TO visitor_id;

-- books_list
ALTER TABLE books_list DROP COLUMN user_id;
ALTER TABLE books_list RENAME COLUMN new_user_id TO user_id;

-- user_book
ALTER TABLE user_book DROP COLUMN user_id;
ALTER TABLE user_book RENAME COLUMN new_user_id TO user_id;

-- user_books_list_match
ALTER TABLE user_books_list_match DROP COLUMN user_id;
ALTER TABLE user_books_list_match RENAME COLUMN new_user_id TO user_id;

-- Step 7: Rename `new_user_id` to `user_id` in `app_user` table
ALTER TABLE app_user RENAME COLUMN new_user_id TO user_id;

-- Step 8: Recreate all foreign key constraints

-- app_user_meta_data
ALTER TABLE app_user_meta_data
ADD CONSTRAINT app_user_meta_data_user_id_fkey FOREIGN KEY (user_id)
REFERENCES app_user(user_id) ON DELETE CASCADE;

-- accounts
ALTER TABLE accounts
ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id)
REFERENCES app_user(user_id) ON DELETE CASCADE;

-- sessions
ALTER TABLE sessions
ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id)
REFERENCES app_user(user_id) ON DELETE CASCADE;

-- books_import
ALTER TABLE books_import
ADD CONSTRAINT books_import_user_id_fkey FOREIGN KEY (user_id)
REFERENCES app_user(user_id) ON DELETE NO ACTION;

-- book_in_list_visits
ALTER TABLE book_in_list_visits
ADD CONSTRAINT book_in_list_visits_visitor_id_fkey FOREIGN KEY (visitor_id)
REFERENCES app_user(user_id) ON DELETE NO ACTION;

-- book_visits
ALTER TABLE book_visits
ADD CONSTRAINT book_visits_visitor_id_fkey FOREIGN KEY (visitor_id)
REFERENCES app_user(user_id) ON DELETE NO ACTION;

-- list_visits
ALTER TABLE list_visits
ADD CONSTRAINT list_visits_visitor_id_fkey FOREIGN KEY (visitor_id)
REFERENCES app_user(user_id) ON DELETE NO ACTION;

-- books_list
ALTER TABLE books_list
ADD CONSTRAINT books_list_user_id_fkey FOREIGN KEY (user_id)
REFERENCES app_user(user_id) ON DELETE CASCADE;

-- user_book
ALTER TABLE user_book
ADD CONSTRAINT user_book_user_id_fkey FOREIGN KEY (user_id)
REFERENCES app_user(user_id) ON DELETE CASCADE;

-- user_books_list_match
ALTER TABLE user_books_list_match
ADD CONSTRAINT user_books_list_match_user_id_fkey FOREIGN KEY (user_id)
REFERENCES app_user(user_id) ON DELETE CASCADE;
