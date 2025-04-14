
CREATE OR REPLACE FUNCTION public.get_user_documents(user_id_param UUID)
RETURNS SETOF jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY 
  SELECT json_build_object(
    'user_id', user_id,
    'aadhaar_doc_url', aadhaar_doc_url,
    'business_exp_doc_url', business_exp_doc_url,
    'business_experience', business_experience,
    'phone', phone,
    'address', address
  )
  FROM user_documents
  WHERE user_id = user_id_param;
END;
$$;
