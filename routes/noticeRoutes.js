const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');
const { createNotice, getAllNotices, deleteNotice, getUnviewedNoticesCount, markAllNoticesAsViewed  } = require('../controllers/noticeController');

// ✅ Admin routes
router.post('/', verifyToken, verifyAdmin, createNotice);
router.delete('/:id', verifyToken, verifyAdmin, deleteNotice);
router.get('/unviewed/count', verifyToken, getUnviewedNoticesCount);   // ✅ count
router.put('/viewed/all', verifyToken, markAllNoticesAsViewed);
// ✅ Public route (users can see notices)
router.get('/', getAllNotices);

module.exports = router;
