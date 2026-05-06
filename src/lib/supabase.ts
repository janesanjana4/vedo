import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tpiarytnlxjakhnlfrbt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaWFyeXRubHhqYWtobmxmcmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3Njk5NzcsImV4cCI6MjA5MzM0NTk3N30.JWT3yaPehAOeV8klqZVwizt2KdFhcGOxgyT72EjJamk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)