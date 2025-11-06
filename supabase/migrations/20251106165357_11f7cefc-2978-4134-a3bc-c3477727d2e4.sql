-- Fix #1: Allow admins to insert transactions for commission tracking
CREATE POLICY "Admins can insert transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix #2: Protect critical profile fields from modification
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create trigger function to prevent modification of critical fields
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent changes to referral attribution and identity fields
  IF NEW.referred_by IS DISTINCT FROM OLD.referred_by THEN
    RAISE EXCEPTION 'Cannot modify referred_by field';
  END IF;
  
  IF NEW.referral_code IS DISTINCT FROM OLD.referral_code THEN
    RAISE EXCEPTION 'Cannot modify referral_code field';
  END IF;
  
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Cannot modify email field';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce field protection
DROP TRIGGER IF EXISTS protect_profile_fields_trigger ON public.profiles;
CREATE TRIGGER protect_profile_fields_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_fields();

-- Create new policy allowing users to update their own profile
-- (trigger will prevent modification of protected fields)
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);