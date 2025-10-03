import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../shared/constants/apiUrl';

const GEMINI_API_KEY = 'AIzaSyDwQfFqyhi0DnPCYRAIV7_VfKkNQCBvask';

export default function GeminiChatBox() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '🚗 Xin chào! Tôi là trợ lý AI cho dịch vụ cho thuê xe. Tôi có thể giúp bạn tìm kiếm và tư vấn về các loại xe phù hợp với nhu cầu của bạn. Bạn muốn thuê xe loại nào?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(true); // Start minimized
  const messagesEndRef = useRef(null);

  // Thêm style vào document.head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes chatPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes typingDot {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
      }

      .chat-message {
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 20px;
        margin-bottom: 10px;
        word-wrap: break-word;
        line-height: 1.4;
      }

      .user-message {
        background-color: #0084ff;
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 5px;
      }

      .assistant-message {
        background-color: #f0f0f0;
        color: #333;
        margin-right: auto;
        border-bottom-left-radius: 5px;
      }
      
      .chat-input {
        border: none;
        border-radius: 20px;
        padding: 12px 20px;
        flex-grow: 1;
        background: #f0f0f0;
      }
      
      .chat-input:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0,132,255,0.3);
      }
      
      .send-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #0084ff;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        margin-left: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      
      .send-button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      
      .chat-bubble {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #0084ff;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      
      .typing-indicator {
        display: flex;
        align-items: center;
        padding: 8px 15px;
        background: #f0f0f0;
        border-radius: 20px;
        margin-right: auto;
        border-bottom-left-radius: 5px;
        margin-bottom: 10px;
      }
      
      .typing-dot {
        width: 8px;
        height: 8px;
        margin: 0 2px;
        background-color: #888;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup khi unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(msgs => [...msgs, userMsg]);
    setLoading(true);
    setInput('');
    
    try {
      // Existing fetch logic remains unchanged
      const carRes = await fetch(API_URL + 'car/all');
      const carData = await carRes.json();
      let carList = '';
      if (carData?.data?.length) {
        // Your existing car mapping logic
        const cars = carData.data.slice(0, 50);
        carList = cars.map(car => {
          return (
            `🚗 ${car.name}\n` +
            `   📍 Địa chỉ: ${car.address}\n` +
            `   💰 Giá thuê: ${(car.basePrice ? car.basePrice * 1000000 : 0).toLocaleString('vi-VN')} VNĐ/ngày\n` +
            `   💳 Đặt cọc: ${(car.deposit ? car.deposit * 1000000 : 0).toLocaleString('vi-VN')} VNĐ\n` +
            `   🏷️ Hãng xe: ${car.brand}\n` +
            `   👥 Số ghế: ${car.numberOfSeats} chỗ\n` +
            `   🎨 Màu sắc: ${car.color}\n` +
            `   📅 Năm SX: ${car.productionYear}\n` +
            `   ⚙️ Hộp số: ${car.transmissionType}\n` +
            `   ⛽ Nhiên liệu: ${car.fuelType}\n` +
            `   📏 Km đã đi: ${car.mileage?.toLocaleString('vi-VN')} km\n` +
            `   ⚡ Tiêu hao: ${car.fuelConsumption}L/100km\n` +
            `   📋 Mô tả: ${car.description || 'Không có mô tả'}\n` +
            `   🔢 Biển số: ${car.licensePlate}`
          );
        }).join('\n\n');
      } else {
        carList = 'Không có xe nào trong cơ sở dữ liệu.';
      }

      // Existing instruction and prompt
      const instruction = `Bạn là trợ lý AI chuyên nghiệp cho dịch vụ cho thuê xe ô tô. 
Nhiệm vụ của bạn:
- Tư vấn khách hàng chọn xe phù hợp dựa trên nhu cầu (số chỗ, ngân sách, mục đích sử dụng)
- Giải đáp thông tin về xe: giá thuê, đặt cọc, thông số kỹ thuật, địa chỉ
- Đưa ra gợi ý xe tương tự nếu không tìm thấy xe phù hợp
- Chỉ trả lời về dịch vụ cho thuê xe, từ chối các câu hỏi khác
- Trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
- Khi recommend xe, hãy đề xuất tối đa 3-5 xe phù hợp nhất
- Luôn đề cập giá thuê và địa chỉ để khách hàng tiện tham khảo`;
      const prompt = `${instruction}\n\nDanh sách xe hiện có:\n${carList}\n\nKhách hàng hỏi: ${input}`;

      // Existing API call
      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await res.json();
      let aiContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiContent) {
        if (data?.error?.status === "RESOURCE_EXHAUSTED") {
          aiContent = '⚠️ Bạn đã vượt quá quota miễn phí (250 request/ngày).\n\nCách khắc phục:\n• Đợi quota reset sau 24h\n• Tạo project mới để có API key khác\n• Hoặc nâng cấp lên gói trả phí';
        } else {
          aiContent = data?.error?.message ? `❌ Lỗi API: ${data.error.message}` : 'Xin lỗi, tôi không thể trả lời lúc này.';
        }
      }

      setMessages(msgs => [...msgs, { role: 'assistant', content: aiContent }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Đã xảy ra lỗi. Vui lòng thử lại.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Chat bubble when minimized */}
      {minimized && (
        <div 
          className="chat-bubble"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
          }}
          onClick={() => setMinimized(false)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
          </svg>
        </div>
      )}

      {/* Main chat window when expanded */}
      {!minimized && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '350px',
          height: '500px',
          borderRadius: '15px',
          boxShadow: '0 5px 40px rgba(0,0,0,0.16)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9999,
          background: '#fff',
        }}>
          {/* Header */}
          <div style={{
            padding: '15px',
            background: '#0084ff',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
              </svg>
              <span style={{ fontWeight: 'bold' }}>Tư vấn thuê xe</span>
            </div>
            <button 
              onClick={() => setMinimized(true)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                padding: '5px' 
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="white"/>
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div style={{
            flex: 1,
            padding: '15px',
            overflowY: 'auto',
            backgroundColor: '#f8f9fa',
          }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`chat-message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                {msg.content}
              </div>
            ))}
            
            {/* Typing indicator */}
            {loading && (
              <div className="typing-indicator">
                <div className="typing-dot" style={{ animation: 'typingDot 1s infinite' }}></div>
                <div className="typing-dot" style={{ animation: 'typingDot 1s infinite 0.2s' }}></div>
                <div className="typing-dot" style={{ animation: 'typingDot 1s infinite 0.4s' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
          </div>

          {/* Input area */}
          <div style={{
            padding: '10px 15px',
            borderTop: '1px solid #e6e6e6',
            display: 'flex',
            alignItems: 'center',
          }}>
            <form 
              onSubmit={e => { e.preventDefault(); sendMessage(); }} 
              style={{ display: 'flex', width: '100%', alignItems: 'center' }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="chat-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()} 
                className="send-button"
                aria-label="Gửi"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="white"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
