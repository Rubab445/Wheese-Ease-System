-- ============================================================
-- WheezeEase Messages Table
-- Run this in Supabase SQL Editor BEFORE using the chat feature
-- ============================================================

CREATE TABLE IF NOT EXISTS public.messages (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id   uuid NOT NULL,
  receiver_id uuid NOT NULL,
  text        text NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  read_at     timestamptz
);

CREATE INDEX IF NOT EXISTS messages_thread_idx
  ON public.messages(sender_id, receiver_id, created_at);

-- Grants
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;

-- RLS: users can only see messages they sent or received
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Read own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Mark messages read" ON public.messages
  FOR UPDATE USING (auth.uid() = receiver_id);
