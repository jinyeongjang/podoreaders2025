import { supabase } from '../../utils/supabase';

export default async function handler(req, res) {
    const { data, error } = await supabase.from('schedules').select('*');
    
    if (error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(200).json({ data });
    }
}
