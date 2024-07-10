function ChatBot(message, io) {
    if (message.toLowerCase() === 'chào bạn') {
        setTimeout(() => {
            io.emit('message', 'Xin chào bạn , tôi có thể giúp gì cho bạn ?');
        }, 1000);
    } else if (message.toLowerCase() === 'bạn giới thiệu về website đi') {
        setTimeout(() => {
            io.emit(
                'message',
                'Apex Fashion là một trong những nền tảng mua sắm trực tuyến hàng đầu tại Việt Nam với sứ mệnh mang đến cho khách hàng những sản phẩm chất lượng cao về thể thao và phong cách sống. Với sự đa dạng và phong phú trong danh mục sản phẩm, Apex Fashion cung cấp những lựa chọn đa dạng từ giày dép, quần áo, phụ kiện đến dụng cụ thể thao và các sản phẩm phong cách hàng ngày.',
            );
        }, 1000);
    } else if (message.toLowerCase() === 'chuỗi cửa hàng của mình ở đâu') {
        setTimeout(() => {
            io.emit(
                'message',
                'HN',
            );
        }, 1000);
    } else if (message.toLowerCase() === 'bạn giới thiệu về mình đi') {
        setTimeout(() => {
            io.emit(
                'message',
                'Tôi là một chatbot tự động được tạo ra từ socket.io, thư viện mạnh mẽ về thời gian thực và tôi ở đây để hỗ trợ bạn khi nào bạn cần, chúng ta cùng trò chuyện nhé !!!',
            );
        }, 1000);
    } else {
        setTimeout(() => {
            io.emit(
                'message',
                'Tôi chưa hiểu ý bạn lắm !!! ,vui lòng liên hệ chúng tôi qua Instagram  : https://www.instagram.com/tom.traanf hoặc facebook : https://www.facebook.com/tom.quang.35',
            );
        }, 1000);
    }
}

module.exports = ChatBot;
