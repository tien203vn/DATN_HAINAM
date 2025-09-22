  import { useState } from 'react';
  import { API_URL } from '../shared/constants/apiUrl';

  const GEMINI_API_KEY = 'AIzaSyA9ZNtXCFzPNAb4I_ras32olpJD3N07EzU';

  export default function GeminiChatBox() {
    const [messages, setMessages] = useState([
      { role: 'assistant', content: 'Xin chào! Tôi là chatbot AI Gemini. Bạn cần hỗ trợ gì?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const sendMessage = async () => {
      if (!input.trim()) return;
      const userMsg = { role: 'user', content: input };
      setMessages(msgs => [...msgs, userMsg]);
      setLoading(true);
      setInput('');
      try {
        // viết thêm vài cái api rồi call ở đây (ví dụ viết thêm 1 cái all lấy ra all các trường trong trong bảng car ấy , rồi thằng chatbot này nó đọc nó sẽ trả lười trong phạm vi đó )
    const carRes = await fetch(API_URL + 'car/all');
        const carData = await carRes.json();
        let carList = '';
        if (carData?.data?.length) {
          const cars = carData.data.slice(0, 50);
          carList = cars.map(car => {
            return (
              `- Tên: ${car.name}\n` +
              `  Biển số: ${car.licensePlate}\n` +
              `  Hãng: ${car.brand}\n` +
              `  Màu: ${car.color}\n` +
              `  Số ghế: ${car.numberOfSeats}\n` +
              `  Năm sản xuất: ${car.productionYear}\n` +
              `  Loại truyền động: ${car.transmissionType}\n` +
              `  Loại nhiên liệu: ${car.fuelType}\n` +
              `  Số km đã đi: ${car.mileage}\n` +
              `  Tiêu thụ nhiên liệu: ${car.fuelConsumption}\n` +
              `  Giá thuê: ${car.basePrice}\n` +
              `  Đặt cọc: ${car.deposit}\n` +
              `  Địa chỉ: ${car.address}\n` +
              `  Mô tả: ${car.description}`
            );
          }).join('\n\n');
        } else {
          carList = 'Không có xe nào trong cơ sở dữ liệu.';
        }
        // Tạo prompt cho Gemini
        const instruction = 'Chỉ trả lời các câu hỏi liên quan đến việc tìm kiếm ô tô trong cơ sở dữ liệu dưới đây. Nếu câu hỏi không liên quan, hãy từ chối trả lời.';
        const prompt = `${instruction}\nDanh sách ô tô:\n${carList}\nCâu hỏi: ${input}`;
        const res = await fetch(
          'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });
        const data = await res.json();
        let aiContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiContent) {
          aiContent = data?.error?.message ? `Lỗi: ${data.error.message}` : 'Xin lỗi, tôi không thể trả lời.';
        }
        setMessages(msgs => [...msgs, { role: 'assistant', content: aiContent }]);
      } catch (e) {
        setMessages(msgs => [...msgs, { role: 'assistant', content: 'Đã xảy ra lỗi. Vui lòng thử lại.' }]);
      }
      setLoading(false);
    };

    return (
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        width: minimized ? 80 : 350,
        height: minimized ? 60 : 420,
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
        borderRadius: 16,
        background: '#fff',
        overflow: 'hidden',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}>
        <div
          style={{
            background: '#4285F4',
            color: '#fff',
            padding: minimized ? '10px' : '10px 16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: minimized ? 60 : undefined,
          }}
          onClick={() => minimized && setMinimized(false)}
        >
          <span style={{ fontWeight: 600 }}>
            {!minimized && 'Chatbot hỗ trợ dịch vụ ô tô'}
            {minimized && (
              <span style={{ fontSize: 28, marginLeft: 4 }}>
                {/* Biểu tượng chat đơn giản, có thể thay bằng SVG hoặc hình ảnh nếu muốn */}
                💬
              </span>
            )}
          </span>
          <button
            onClick={e => {
              e.stopPropagation();
              setMinimized(m => !m);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >{minimized ? '▲' : '▼'}</button>
        </div>
        {!minimized && (
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', fontSize: 15 }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: 10,
                textAlign: msg.role === 'user' ? 'right' : 'left',
              }}>
                <span style={{
                  display: 'inline-block',
                  background: msg.role === 'user' ? '#e3f2fd' : '#f1f8e9',
                  color: '#333',
                  borderRadius: 8,
                  padding: '7px 12px',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                }}>{msg.content}</span>
              </div>
            ))}
            {loading && <div style={{ color: '#888', fontStyle: 'italic' }}>Đang trả lời...</div>}
          </div>
        )}
        {!minimized && (
          <div style={{ padding: '10px 12px', borderTop: '1px solid #eee', background: '#fafafa' }}>
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                style={{ flex: 1, borderRadius: 8, border: '1px solid #ccc', padding: '8px' }}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()} style={{
                background: '#4285F4',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '0 16px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>Gửi</button>
            </form>
          </div>
        )}
      </div>
    );
  }
