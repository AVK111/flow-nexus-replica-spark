
CREATE OR REPLACE FUNCTION public.check_application_exists(
  user_id_param UUID, 
  opportunity_id_param UUID
)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT json_build_object(
    'id', id,
    'user_id', user_id,
    'opportunity_id', opportunity_id,
    'status', status
  )
  FROM franchise_applications
  WHERE user_id = user_id_param AND opportunity_id = opportunity_id_param;
END;
$$;
