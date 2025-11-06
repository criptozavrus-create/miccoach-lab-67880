-- Create function to get all referrals with levels for a user
CREATE OR REPLACE FUNCTION public.get_referral_network(root_user_id UUID)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  referral_level INTEGER,
  created_at TIMESTAMPTZ,
  has_wallet BOOLEAN
) 
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE referral_tree AS (
    -- Base case: direct referrals (level 1)
    SELECT 
      p.id as user_id,
      p.email,
      p.full_name,
      1 as referral_level,
      p.created_at,
      p.referred_by
    FROM profiles p
    WHERE p.referred_by = root_user_id
    
    UNION ALL
    
    -- Recursive case: referrals of referrals
    SELECT 
      p.id as user_id,
      p.email,
      p.full_name,
      rt.referral_level + 1 as referral_level,
      p.created_at,
      p.referred_by
    FROM profiles p
    INNER JOIN referral_tree rt ON p.referred_by = rt.user_id
    WHERE rt.referral_level < 15  -- Limit to 15 levels
  )
  SELECT 
    rt.user_id,
    rt.email,
    rt.full_name,
    rt.referral_level,
    rt.created_at,
    EXISTS(SELECT 1 FROM wallets w WHERE w.user_id = rt.user_id) as has_wallet
  FROM referral_tree rt
  ORDER BY rt.referral_level, rt.created_at;
$$;

-- Create function to get level statistics for a user
CREATE OR REPLACE FUNCTION public.get_level_statistics(root_user_id UUID)
RETURNS TABLE (
  level INTEGER,
  partner_count BIGINT,
  total_earnings NUMERIC
) 
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH network AS (
    SELECT * FROM public.get_referral_network(root_user_id)
  ),
  level_counts AS (
    SELECT 
      referral_level as level,
      COUNT(*) as partner_count
    FROM network
    GROUP BY referral_level
  ),
  level_earnings AS (
    SELECT 
      t.referral_level as level,
      SUM(t.amount) as total_earnings
    FROM transactions t
    WHERE t.user_id = root_user_id
    GROUP BY t.referral_level
  )
  SELECT 
    COALESCE(lc.level, le.level) as level,
    COALESCE(lc.partner_count, 0) as partner_count,
    COALESCE(le.total_earnings, 0) as total_earnings
  FROM level_counts lc
  FULL OUTER JOIN level_earnings le ON lc.level = le.level
  ORDER BY level;
$$;