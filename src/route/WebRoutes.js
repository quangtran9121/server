const express = require('express');
const router = express.Router();
const ControllerWeb = require('../controller/ControllerWeb/ControllerWeb');

var multer = require('multer');
const path = require('path');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/blog');
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}${ext}`);
        },
    }),
});

router.get('/api/getblog', ControllerWeb.GetBlog);
router.post('/api/addblog', upload.single('img'), ControllerWeb.AddBlog);
router.post('/api/deleteblog', ControllerWeb.DeleteBlog);
router.post('/api/editblog', upload.single('imgBlog'), ControllerWeb.EditBlog);

module.exports = router;
