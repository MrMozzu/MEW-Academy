import { Router, Request, Response } from 'express';
import { getDatabase } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { generateId } from '../utils/helpers.js';

const router = Router();

/**
 * POST /api/progress/lesson
 * Mark a lesson as complete or record quiz score
 */
router.post('/lesson', authenticate, (req: Request, res: Response) => {
  try {
    const { courseId, lessonId, completed, quizScore } = req.body;
    const userId = req.user!.userId;

    if (!courseId || !lessonId) {
      res.status(400).json({ error: 'Course ID and Lesson ID are required.' });
      return;
    }

    const db = getDatabase();

    // Upsert progress record
    const existing = db.prepare(
      'SELECT id FROM progress WHERE user_id = ? AND course_id = ? AND lesson_id = ?'
    ).get(userId, courseId, lessonId) as any;

    if (existing) {
      const updates: string[] = [];
      const values: any[] = [];

      if (completed !== undefined) {
        updates.push('completed = ?');
        values.push(completed ? 1 : 0);
        if (completed) {
          updates.push('completed_at = datetime("now")');
        }
      }
      if (quizScore !== undefined) {
        updates.push('quiz_score = ?');
        values.push(quizScore);
      }

      values.push(existing.id);
      db.prepare(`UPDATE progress SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    } else {
      const progressId = generateId('prg');
      db.prepare(
        'INSERT INTO progress (id, user_id, course_id, lesson_id, completed, quiz_score, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(
        progressId,
        userId,
        courseId,
        lessonId,
        completed ? 1 : 0,
        quizScore || null,
        completed ? new Date().toISOString() : null
      );
    }

    // Update user XP
    if (completed) {
      db.prepare('UPDATE users SET xp_points = xp_points + 25 WHERE id = ?').run(userId);
    }

    res.json({ success: true, message: 'Progress updated.' });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/progress/toggle
 * Toggle lesson completion status
 */
router.post('/toggle', authenticate, (req: Request, res: Response) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user!.userId;

    if (!courseId || !lessonId) {
      res.status(400).json({ error: 'Course ID and Lesson ID are required.' });
      return;
    }

    const db = getDatabase();

    const existing = db.prepare(
      'SELECT id, completed FROM progress WHERE user_id = ? AND course_id = ? AND lesson_id = ?'
    ).get(userId, courseId, lessonId) as any;

    if (existing) {
      const newCompleted = existing.completed ? 0 : 1;
      db.prepare('UPDATE progress SET completed = ?, completed_at = ? WHERE id = ?').run(
        newCompleted,
        newCompleted ? new Date().toISOString() : null,
        existing.id
      );
      res.json({ success: true, completed: !!newCompleted });
    } else {
      const progressId = generateId('prg');
      db.prepare(
        'INSERT INTO progress (id, user_id, course_id, lesson_id, completed, completed_at) VALUES (?, ?, ?, ?, 1, datetime("now"))'
      ).run(progressId, userId, courseId, lessonId);
      res.json({ success: true, completed: true });
    }
  } catch (error) {
    console.error('Toggle progress error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/progress/:courseId
 * Get all progress for a specific course
 */
router.get('/:courseId', authenticate, (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.userId;
    const db = getDatabase();

    const records = db.prepare(
      'SELECT lesson_id, completed, quiz_score, completed_at FROM progress WHERE user_id = ? AND course_id = ?'
    ).all(userId, courseId) as any[];

    const completedLessonIds = records.filter(r => r.completed).map(r => r.lesson_id);
    const quizScores: Record<string, number> = {};
    records.forEach(r => {
      if (r.quiz_score !== null) {
        quizScores[r.lesson_id] = r.quiz_score;
      }
    });

    res.json({
      success: true,
      courseId,
      completedLessonIds,
      quizScores,
      totalCompleted: completedLessonIds.length,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /api/progress
 * Get all progress for the authenticated user across all courses
 */
router.get('/', authenticate, (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const db = getDatabase();

    const records = db.prepare(
      'SELECT course_id, lesson_id, completed, quiz_score, completed_at FROM progress WHERE user_id = ?'
    ).all(userId) as any[];

    // Group by course
    const progressMap: Record<string, { completedLessonIds: string[]; quizScores: Record<string, number> }> = {};

    records.forEach(r => {
      if (!progressMap[r.course_id]) {
        progressMap[r.course_id] = { completedLessonIds: [], quizScores: {} };
      }
      if (r.completed) {
        progressMap[r.course_id].completedLessonIds.push(r.lesson_id);
      }
      if (r.quiz_score !== null) {
        progressMap[r.course_id].quizScores[r.lesson_id] = r.quiz_score;
      }
    });

    res.json({ success: true, progress: progressMap });
  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
