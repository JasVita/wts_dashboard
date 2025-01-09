import { Router } from 'express';
import { pool } from '../config/database';

const router = Router();

// Get chat status for a specific wa_id
router.get('/chat-status/:wa_id', async (req, res) => {
  try {
    const { wa_id } = req.params;
    const result = await pool.query(`
      SELECT 
        dm.wa_id,
        dm.is_ai_mode,
        dm.is_important,
        ARRAY_AGG(DISTINCT jsonb_build_object(
          'id', cl.id,
          'name', cl.name,
          'color', cl.color
        )) as labels
      FROM daily_message dm
      LEFT JOIN customer_label cl ON dm.wa_id = ANY(cl.customer_id)
      WHERE dm.wa_id = $1
      GROUP BY dm.wa_id, dm.is_ai_mode, dm.is_important
    `, [wa_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching chat status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const chatStatusRouter = router;