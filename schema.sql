CREATE TABLE IF NOT EXISTS logins (
  user_id  VARCHAR(50) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS beans (
  bean_id       SERIAL PRIMARY KEY,
  bean_name     VARCHAR(100) NOT NULL,
  description   TEXT,
  price_per_unit DECIMAL(10,2)
);

CREATE TABLE IF NOT EXISTS dailybean (
  id         SERIAL PRIMARY KEY,
  bean_id    INT REFERENCES beans(bean_id),
  sale_price DECIMAL(10,2),
  date       DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS distributor (
  distributor_id   SERIAL PRIMARY KEY,
  distributor_name VARCHAR(100) NOT NULL,
  city             VARCHAR(100),
  state_region     VARCHAR(100),
  country          VARCHAR(100),
  phone            VARCHAR(50),
  email            VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS upload (
  upload_id     SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  document_file VARCHAR(255) NOT NULL,
  author        VARCHAR(100),
  uploaded_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_status (
  order_id      SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  bean_name     VARCHAR(100) NOT NULL,
  quantity      INT NOT NULL DEFAULT 1,
  status        VARCHAR(50) NOT NULL DEFAULT 'Pending',
  order_date    DATE DEFAULT CURRENT_DATE,
  order_time    TIME DEFAULT CURRENT_TIME
);

-- Default login: user_id=admin, password=admin123
INSERT INTO logins (user_id, password) VALUES ('admin', 'admin123') ON CONFLICT DO NOTHING;
