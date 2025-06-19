-- Create storage bucket for chat files
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true);

-- Set up storage policies for chat-files bucket
CREATE POLICY "Chat files are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'chat-files');

CREATE POLICY "Users can upload chat files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'chat-files');

CREATE POLICY "Users can update their chat files" ON storage.objects
FOR UPDATE USING (bucket_id = 'chat-files') WITH CHECK (bucket_id = 'chat-files');

CREATE POLICY "Users can delete their chat files" ON storage.objects
FOR DELETE USING (bucket_id = 'chat-files');
