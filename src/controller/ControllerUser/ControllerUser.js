const ModelUser = require('../../model/ModelUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');
const sendMail = require('../ControllerEmail/SendEmail');
const sendMailMessage = require('../ControllerEmail/SendMailMessage');
const fs = require('fs');
const ModelComments = require('../../model/ModelComments');
const ModelPaymentSuccess = require('../../model/ModelPaymentSuccess');
const ForgotPassword = require('../ControllerEmail/ForgotPassword');
require('dotenv').config();

class ControllerUser {
    async Register(req, res) {
        const { fullname, password, email, phone } = req.body;
        const saltRounds = 10;
        const myPlaintextPassword = password;
        try {
            const dataUser = await ModelUser.findOne({ email: email });
            if (dataUser) {
                return res.status(403).json({ message: 'Người Dùng Đã Tồn Tại !!!' });
            } else {
                bcrypt.hash(myPlaintextPassword, saltRounds, async function (err, hash) {
                    const newUser = new ModelUser({
                        fullname,
                        password: hash,
                        email,
                        phone: phone,
                    });
                    await newUser.save();
                    return res.status(200).json({ message: 'Đăng Ký Thành Công !!!' });
                });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Đã xảy ra lỗi !!!' });
        }
    }

    async Login(req, res, next) {
        const { password, email } = req.body;
        const dataUser = await ModelUser.findOne({ email });
        if (!dataUser) {
            return res.status(401).json({ message: 'Email Hoặc Mật Không Chính Xác !!!' });
        }
        const match = await bcrypt.compare(password, dataUser.password);
        if (match) {
            const admin = dataUser.isAdmin;
            const employee = dataUser.isEmployee;
            const token = jwt.sign({ email, admin, employee }, 'quangtt', {
                expiresIn: '24h',
            });
            res.setHeader('Set-Cookie', `Token=${token}  ; max-age=7200 ;path=/`).json({
                message: 'Đăng Nhập Thành Công !!!',
            });
        } else {
            return res.status(401).json({ message: 'Email Hoặc Mật Khẩu Không Chính Xác !!!' });
        }
    }
    async GetUser(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        if (decoded) {
            ModelUser.findOne({ email: decoded.email }).then((dataUser) => {
                return res.status(200).json(dataUser);
            });
        } else {
            return res.status(401).json({ message: 'Có Lỗi Xảy Ra !!!' });
        }
    }
    async ChangePass(req, res, next) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        const dataUser = await ModelUser.findOne({ email: decoded.email });
        if (dataUser) {
            const saltRounds = 10;
            const myPlaintextPassword = req.body.newPass;
            bcrypt.hash(myPlaintextPassword, saltRounds, async function (err, hash) {
                dataUser.updateOne({ password: hash }).then();
                return res.status(200).json({ message: 'Change Password Success' });
            });
        } else {
            return res.status(403).json({ message: 'error !!!' });
        }
    }
    Logout(req, res) {
        res.setHeader('Set-Cookie', `Token=${''};max-age=0 ;path=/`).json({});
    }
    async EditProfile(req, res) {
        try {
            const token = req.cookies.Token;
            const decoded = jwtDecode(token);

            const updateUser = await ModelUser.findOne({ email: decoded.email });

            if (!updateUser) {
                return res.status(403).json({ message: 'Người dùng không tồn tại' });
            }

            const updatedFields = {
                email: req.body.email || updateUser.email,
                phone: req.body.phone || updateUser.phone,
            };

            const updatedUser = await ModelUser.findOneAndUpdate(
                { email: decoded.email },
                { $set: updatedFields },
                { new: true },
            );

            const newToken = jwt.sign({ email: updatedUser.email, isAdmin: updatedUser.isAdmin }, 'quangtt', {
                expiresIn: '24h',
            });

            await ModelPaymentSuccess.updateMany({ email: decoded.email }, { $set: { email: updatedUser.email } });

            res.cookie('Token', newToken, { maxAge: 3600000, httpOnly: true });

            return res.status(200).json({ message: 'Cập nhật hồ sơ thành công', user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }
    async SendMessage(req, res) {
        const email = req.body.email;
        const message = req.body.message;
        sendMailMessage(email, message);
        return res.status(200).json({ message: 'Send Message Success' });
    }
    async ChangeAvatar(req, res, next) {
        try {
            const token = req.cookies.Token;
            const decoded = jwtDecode(token);
            const urlImg = req.file.filename;

            ModelUser.findOne({ email: decoded.email }).then((dataUser) => {
                if (!dataUser) {
                    return res.status(404).json({ error: 'User not found' });
                }
                if (dataUser.avatar === '1') {
                    ModelUser.updateOne({ email: decoded.email }, { avatar: urlImg, imageData: req.file.path })
                        .then(() => {
                            res.json({ imagePath: req.file.path });
                        })
                        .catch((error) => {
                            console.error('Error updating image:', error);
                            res.status(500).json({ error: 'Server error' });
                        });
                } else {
                    ModelUser.updateOne(
                        { email: decoded.email },
                        { avatar: req.file.filename, imageData: req.file.path },
                    )
                        .then(() => {
                            fs.unlinkSync(`uploads/avatars/${dataUser.avatar}`);
                            res.json({ imagePath: req.file.path });
                        })
                        .catch((error) => {
                            console.error('Error updating image:', error);
                            res.status(500).json({ error: 'Server error' });
                        });
                }
            });
        } catch (error) {
            console.error('Error saving image:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    GetCommentProduct(req, res) {
        ModelComments.find({ id: req.query.id }).then((dataComments) => res.status(200).json(dataComments));
    }
    PostComments(req, res) {
        const { comment, idProduct, rating } = req.body;
        const token = req.cookies.Token;
        const decoded = jwtDecode(token);

        const newComments = new ModelComments({
            id: idProduct,
            username: decoded.email,
            comments: comment,
            rating,
        });
        newComments.save();
        return res.status(200).json({ message: 'Success' });
    }

    GetOrder(req, res) {
        const token = req.cookies.Token;
        const decoded = jwtDecode(token);
        if (decoded) {
            ModelPaymentSuccess.find({ email: decoded.email }).then((dataOrder) => {
                return res.status(200).json(dataOrder);
            });
        }
    }

    async DeleteOrder(req, res) {
        try {
            const token = req.cookies.Token;
            const decoded = jwtDecode(token);

            if (!decoded) {
                return res.status(401).json({ message: 'Token không hợp lệ' });
            }

            // Find the order to delete based on order ID and user's email
            const deletedOrder = await ModelPaymentSuccess.findOneAndDelete({
                _id: req.body.id,
                email: decoded.email,
            });

            if (!deletedOrder) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng để xóa' });
            }

            return res.status(200).json({ message: 'Xóa đơn hàng thành công', deletedOrder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    async ForgotPassword(req, res) {
        const dataUser = await ModelUser.findOne({ email: req.body.email });
        if (!dataUser) {
            return res.status(404).json({ message: 'Không Tìm Thấy Người Dùng !!!' });
        }
        const SECRET_KEY = 'quangtt';
        const OTP_EXPRIRY = '15m';
        const email = req.body.email;

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const token = jwt.sign({ email, otp }, SECRET_KEY, { expiresIn: OTP_EXPRIRY });
        ForgotPassword(email, token, otp);
        return res.status(200).json({ message: 'Thành Công !!!' });
    }

    async ResetPassword(req, res) {
        const SECRET_KEY = 'quangtt';
        const { token, otp, newPassword } = req.body;

        const hashPassword = await bcrypt.hash(newPassword, 10);

        const decoded = jwt.verify(token, SECRET_KEY);

        if (decoded.otp === otp) {
            ModelUser.updateOne({ email: decoded.email }, { password: hashPassword })
                .then(() => {
                    return res.status(200).json({ message: 'Success' });
                })
                .catch((error) => {
                    console.error('Error updating password:', error);
                    return res.status(500).json({ error: 'Server error' });
                });
        } else {
            return res.status(401).json({ message: 'Bạn Cần Xem Lại Thông Tin ' });
        }
    }
}

module.exports = new ControllerUser();
