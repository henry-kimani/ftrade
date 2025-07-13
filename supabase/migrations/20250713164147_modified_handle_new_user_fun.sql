
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path=''
AS $$
  BEGIN
    -- Populate allowed_users table
    INSERT INTO public.allowed_users
      (id, email, role)
    VALUES
      -- Cast string "role" to a role type
      (NEW.id, NEW.email, (NEW.raw_user_meta_data->>'role')::public.role);

    -- Populate avatarUrls table
    INSERT INTO public.avatar_urls
      (user_id)
    VALUES
      (NEW.id);

    RETURN NEW;
  END
$$ LANGUAGE plpgsql
SECURITY DEFINER;
