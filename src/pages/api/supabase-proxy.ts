import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // HTTP 메소드 체크
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { table, action, data } = req.body;

    // 기본적인 유효성 검사
    if (!table || !action) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    let result;

    // 요청된 액션에 따른 처리
    switch (action) {
      case 'select':
        result = await supabase.from(table).select();
        break;
      case 'insert':
        result = await supabase.from(table).insert(data);
        break;
      case 'update':
        result = await supabase.from(table).update(data).match(data.match);
        break;
      case 'delete':
        result = await supabase.from(table).delete().match(data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Supabase proxy error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
