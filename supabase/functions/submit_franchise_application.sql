
CREATE OR REPLACE FUNCTION public.submit_franchise_application(
  user_id_param UUID,
  opportunity_id_param UUID,
  franchisor_id_param UUID,
  investment_capacity_param TEXT,
  preferred_location_param TEXT,
  timeframe_param TEXT,
  motivation_param TEXT,
  questions_param TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO franchise_applications (
    user_id,
    opportunity_id,
    franchisor_id,
    investment_capacity,
    preferred_location,
    timeframe,
    motivation,
    questions,
    status
  ) VALUES (
    user_id_param,
    opportunity_id_param,
    franchisor_id_param,
    investment_capacity_param,
    preferred_location_param,
    timeframe_param,
    motivation_param,
    questions_param,
    'pending'
  );
END;
$$;
