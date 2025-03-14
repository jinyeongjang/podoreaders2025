import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { formatToKST } from '../utils/dateUtils';

export interface QtRecord {
  id?: number;
  user_name: string;
  date: string;
  qt_count: number;
  bible_read_count: number;
  qt_done: boolean;
  bible_read_done: boolean;
  writing_done: boolean;
  created_at?: string;
  updated_at?: string;
}

export const qtAPI = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('qt_records')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<QtRecord[]>();

      if (error) throw error;
      return data || [];
    } catch {
      return [];
    }
  },

  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('qt_records')
      .select('id, user_name, date, qt_count, bible_read_count, qt_done, bible_read_done, writing_done')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getByUser(userName: string) {
    const { data, error } = await supabase
      .from('qt_records')
      .select('id, user_name, date, qt_count, bible_read_count, qt_done, bible_read_done, writing_done')
      .eq('user_name', userName)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(record: QtRecord) {
    const now = new Date();
    const recordWithTimestamp = {
      ...record,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const { data, error } = await supabase
      .from('qt_records')
      .insert([recordWithTimestamp])
      .select('id, user_name, date, qt_count, bible_read_count, qt_done, bible_read_done, writing_done')
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, record: Partial<QtRecord>) {
    const now = new Date();
    const recordWithTimestamp = {
      ...record,
      updated_at: now.toISOString(),
    };

    const { data, error } = await supabase
      .from('qt_records')
      .update(recordWithTimestamp)
      .eq('id', id)
      .select('id, user_name, date, qt_count, bible_read_count, qt_done, bible_read_done, writing_done')
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: number) {
    const { error } = await supabase.from('qt_records').delete().eq('id', id);

    if (error) throw error;
  },

  async findByDateAndUser(date: string, userName: string) {
    const kstDate = formatToKST(new Date(date));

    const { data, error } = await supabase
      .from('qt_records')
      .select('id, user_name, date, qt_count, bible_read_count, qt_done, bible_read_done, writing_done')
      .eq('date', kstDate)
      .eq('user_name', userName)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  subscribeToChanges(callback: (payload: Record<string, unknown>) => void): RealtimeChannel {
    try {
      const channel = supabase
        .channel('custom-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'qt_records',
          },
          callback,
        )
        .subscribe();

      return channel;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Subscription failed');
    }
  },

  unsubscribe(channel: RealtimeChannel) {
    supabase.removeChannel(channel);
  },
};
