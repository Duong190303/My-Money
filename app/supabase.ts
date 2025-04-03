import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sfcucwejlcoojdjsafch.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY3Vjd2VqbGNvb2pkanNhZmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODU1OTQsImV4cCI6MjA1ODQ2MTU5NH0.N6dkt4uGqKlsECbWxXMFcX4YCaLX7G5Tm4VKo8J2juo'
export const supabase = createClient(supabaseUrl, supabaseKey)
