/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hezjimzmxmjrxzwvdnal.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlemppbXpteG1qcnh6d3ZkbmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNjAxMTUsImV4cCI6MjA5OTYzNjExNX0.toPTafTfwrgUAedsMb7JCTxC8OmIOpMWDmtknXYUlc4';

export const supabase = createClient(supabaseUrl, supabaseKey);
