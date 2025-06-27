-- Create avatars bucket 
INSERT INTO storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/*']);

CREATE POLICY "All can upload"
ON storage.objects
AS PERMISSIVE
FOR ALL
TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (SELECT role FROM  public.allowed_users WHERE id = (SELECT auth.uid())) >= 'viewer'
  )
  WITH CHECK(
    bucket_id = 'avatars' AND
    (SELECT role FROM  public.allowed_users WHERE id = (SELECT auth.uid())) >= 'viewer'
  );



-- Create screenshots_url storage bucket
INSERT INTO storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('screenshots', 'screenshots', true, 5242880, ARRAY['image/*']);
-- Policies
CREATE POLICY "All can view screenshots but admins modify"
ON storage.objects
AS PERMISSIVE
FOR All
TO authenticated
  USING(
    bucket_id = 'screenshots' AND
    (SELECT "role" FROM public.allowed_users WHERE id = (SELECT auth.uid())) >= 'viewer'
  )
  WITH CHECK(
    bucket_id = 'screenshots' AND
    (SELECT "role" FROM public.allowed_users WHERE id = (SELECT auth.uid())) = 'admin'
  );



-- Create references bucket
INSERT INTO storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('references', 'references', true, 5242880, ARRAY['image/*']);
-- Policies
CREATE POLICY "All can view references but only admins modify"
ON storage.objects
AS PERMISSIVE
FOR All
TO authenticated
  USING(
    bucket_id = 'references' AND
    (SELECT "role" FROM public.allowed_users WHERE id = (SELECT auth.uid())) >= 'viewer'
  )
  WITH CHECK(
    bucket_id = 'references' AND
    (SELECT "role" FROM public.allowed_users WHERE id = (SELECT auth.uid())) = 'admin'
  );
