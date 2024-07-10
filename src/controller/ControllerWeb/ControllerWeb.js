const ModelBlog = require('../../model/ModelBlog');

class ControllerWeb {
    async GetBlog(req, res) {
        ModelBlog.find({}).then((dataBlog) => res.status(200).json(dataBlog));
    }
    async AddBlog(req, res) {
        const { title, des } = req.body;

        ModelBlog.findOne({})
            .sort({ id: 'desc' })
            .then(async (dataProduct) => {
                let newProductId = 1;
                if (dataProduct) {
                    newProductId = dataProduct.id + 1;
                }
                const newBlog = ModelBlog({
                    id: newProductId,
                    img: req.file.filename,
                    title: title,
                    des: des,
                });
                await newBlog.save();
                return res.status(200).json({ message: 'Thêm Bài Viết Thành Công !!!' });
            });
    }
    async DeleteBlog(req, res) {
        ModelBlog.deleteOne({ id: req.body.id }).then((data) =>
            res.status(200).json({ message: 'Xóa Thành Công !!!' }),
        );
    }
    async EditBlog(req, res) {
        const { imgBlog, titleBlog, desBlog, id } = req.body;
        ModelBlog.findOne({ _id: id }).then((dataProduct) => {
            if (dataProduct) {
                dataProduct
                    .updateOne({
                        img: req.file ? req.file.filename : dataProduct.img,
                        title: titleBlog || dataProduct.title,
                        des: desBlog || dataProduct.des,
                    })
                    .then();
                return res.status(200).json({ message: 'Sửa Thành Công !!!' });
            } else {
                return;
            }
        });
    }
}

module.exports = new ControllerWeb();
