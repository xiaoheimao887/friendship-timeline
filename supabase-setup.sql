-- 在 Supabase SQL Editor 中执行
-- 注意: 这是一个个人日记应用，使用 PIN 码做数据隔离

-- 1. 创建 friends 表
CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_hash TEXT NOT NULL DEFAULT '',
  nickname TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  tags TEXT[] DEFAULT '{}',
  met_date DATE NOT NULL,
  met_place_name TEXT,
  met_place_lat DOUBLE PRECISION,
  met_place_lng DOUBLE PRECISION,
  birthday DATE,
  current_location_name TEXT,
  current_location_lat DOUBLE PRECISION,
  current_location_lng DOUBLE PRECISION,
  met_story TEXT NOT NULL,
  relationship TEXT DEFAULT 'regular' CHECK (relationship IN ('close','regular','occasional','lost')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 创建 milestones 表
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  friend_id UUID NOT NULL REFERENCES friends(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 创建索引
CREATE INDEX idx_friends_pin_hash ON friends(pin_hash);
CREATE INDEX idx_milestones_friend_id ON milestones(friend_id);

-- 4. 开启 RLS
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- 5. 创建宽松策略（个人应用，数据隔离靠 pin_hash 字段 + 应用层控制）
CREATE POLICY "Allow all for friends" ON friends
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for milestones" ON milestones
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. 创建 auth 表（PIN + 二级密码）
CREATE TABLE IF NOT EXISTS auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_hash TEXT NOT NULL UNIQUE,
  pin_key_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE auth ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for auth" ON auth
  FOR ALL USING (true) WITH CHECK (true);

-- 7. 在 Supabase Dashboard > Storage 中创建 avatars bucket，设为 public
