const express = require('express');
const router = express.Router();

const ControllerAdmin = require('../controller/ControllerAdmin/ControllerAdmin');

var multer = require('multer');
const path = require('path');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads');
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}${ext}`);
        },
    }),
});

router.get('/api/auth/me', ControllerAdmin.GetDataAuth);

router.get('/api/getorder', ControllerAdmin.GetDataOrder);
router.get('/api/datauser', ControllerAdmin.GetUser);
router.post('/api/addproduct', upload.single('imgpro'), ControllerAdmin.AddProduct);
router.post('/api/deleteproduct', ControllerAdmin.DeleteProduct);
router.post('/api/editproduct', upload.single('imgpro'), ControllerAdmin.EditProduct);
router.post('/api/checkproduct', ControllerAdmin.checkProduct);
router.post('/api/editorder', ControllerAdmin.EditOrder);
router.post('/api/edituser', ControllerAdmin.EditUser);

module.exports = router;
