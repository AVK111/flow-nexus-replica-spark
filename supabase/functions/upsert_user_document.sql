
CREATE OR REPLACE FUNCTION public.upsert_user_document(
  user_id_param UUID,
  aadhaar_doc_url_param TEXT,
  business_exp_doc_url_param TEXT,
  business_experience_param TEXT,
  phone_param TEXT,
  address_param TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if record exists
  IF EXISTS (SELECT 1 FROM user_documents WHERE user_id = user_id_param) THEN
    -- Update existing record
    UPDATE user_documents
    SET 
      aadhaar_doc_url = aadhaar_doc_url_param,
      business_exp_doc_url = business_exp_doc_url_param,
      business_experience = business_experience_param,
      phone = phone_param,
      address = address_param,
      updated_at = now()
    WHERE user_id = user_id_param;
  ELSE
    -- Insert new record
    INSERT INTO user_documents (
      user_id,
      aadhaar_doc_url,
      business_exp_doc_url,
      business_experience,
      phone,
      address
    ) VALUES (
      user_id_param,
      aadhaar_doc_url_param,
      business_exp_doc_url_param,
      business_experience_param,
      phone_param,
      address_param
    );
  END IF;
END;
$$;
