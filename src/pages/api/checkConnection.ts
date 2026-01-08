import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data, error } = await supabase.from('prayers').select('*').limit(1);

    if (error) {
      throw error;
    }

    res.status(200).json({
      status: 'Connected',
      data,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 'Error',
        error: error.message,
      });
    } else {
      res.status(500).json({
        status: 'Error',
        error: 'Unknown error occurred',
      });
    }
  }
}
