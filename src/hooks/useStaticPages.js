import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useStaticPages = (pageType) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaticPage = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('static_pages')
          .select('*')
          .eq('page_type', pageType)
          .single();

        if (error) {
          throw error;
        }

        setContent(data);
      } catch (err) {
        console.error(`Error fetching ${pageType} page:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pageType) {
      fetchStaticPage();
    }
  }, [pageType]);

  return { content, loading, error };
};
