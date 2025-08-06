import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiRotateCw, FiX, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

async function query(data) {
    const response = await fetch(
        "https://cloud.flowiseai.com/api/v1/prediction/45498995-aa76-4d65-ad7f-27631f369937",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Halo! Ada yang bisa saya bantu?" }
  ]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Tambah state untuk pagination
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(messages.length / pageSize));
  const [page, setPage] = useState(totalPages);

  useEffect(() => {
    setPage(Math.max(1, Math.ceil(messages.length / pageSize)));
  }, [messages.length]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showChat, page]);

  const addMessage = (text, isUser = false) => {
    setMessages((prev) => [
      ...prev,
      { from: isUser ? "user" : "bot", text }
    ]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message) return;
    addMessage(message, true);
    setInput("");
    setIsBotTyping(true);
    try {
      const response = await query({ question: message });
      const botReply = response.answer || response.text || response.message;
      if (
        !botReply ||
        botReply.trim().toLowerCase() === "hmm, i'm not sure." ||
        botReply.trim().toLowerCase() === "i'm not sure."
      ) {
        addMessage("Maaf, saya tidak mengerti.");
      } else {
        addMessage(botReply);
      }
    } catch (error) {
      addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.");
    }
    setIsBotTyping(false);
  };

  // Pagination logic
  const pagedMessages = messages.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      {/* Floating Bot Icon */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#4ade80",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 20px rgba(74, 222, 128, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(74, 222, 128, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(74, 222, 128, 0.3)';
          }}
          aria-label="Buka Chatbot"
        >
          <FiMessageCircle />
        </button>
      )}

      {/* Modal Verifikasi saat refresh chat */}
      {showVerify && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center">
            <div className="text-lg font-semibold mb-4">Reset Chatbot?</div>
            <div className="text-gray-600 mb-6">Apakah Anda yakin ingin mengulang chat? Semua riwayat chat akan dihapus.</div>
            <div className="flex gap-4 justify-center">
              <button
                className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                onClick={() => {
                  if (pendingAction === 'reset') {
                    setMessages([{ from: "bot", text: "Halo! Ada yang bisa saya bantu?" }]);
                  }
                  setShowVerify(false);
                  setPendingAction(null);
                }}
              >
                Ya, Reset
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                onClick={() => { setShowVerify(false); setPendingAction(null); }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Popup */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: isMobile ? 0 : 30,
              right: isMobile ? 0 : 32,
              zIndex: 1001,
              width: isMobile ? '100%' : 360,
              height: isMobile ? '100%' : 520,
              fontFamily: "'Poppins', Arial, sans-serif"
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: isMobile ? 0 : 20,
                boxShadow: "0 8px 32px rgba(44,62,80,0.15)",
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 36px rgba(44,62,80,0.2)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(44,62,80,0.15)'}
            >
              {/* HEADER */}
              <div style={{
                background: "#4ade80",
                color: "#fff",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                borderTopLeftRadius: isMobile ? 0 : 20,
                borderTopRightRadius: isMobile ? 0 : 20,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                position: "relative",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(74,222,128,0.2)"
              }}>
                {/* Tombol repeat kiri */}
                <button
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 14,
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#fff",
                    fontSize: 20,
                    cursor: "pointer",
                    borderRadius: 8,
                    padding: 6,
                    transition: "all 0.2s ease"
                  }}
                  title="Ulangi chat"
                  onClick={() => { setShowVerify(true); setPendingAction('reset'); }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  <FiRotateCw />
                </button>
                <div style={{ fontWeight: 600, fontSize: 15, flex: 1, textAlign: "center", letterSpacing: 0.5 }}>ChatDM</div>
                {/* Tombol close kanan */}
                <button
                  onClick={() => setShowChat(false)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 14,
                    background: "rgba(255,255,255,0.15)",
                    border: "none",
                    color: "#fff",
                    fontSize: 20,
                    cursor: "pointer",
                    borderRadius: 8,
                    padding: 6,
                    transition: "all 0.2s ease"
                  }}
                  aria-label="Tutup Chatbot"
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  <FiX />
                </button>
              </div>
              {/* CHAT BUBBLES */}
              <div style={{
                flex: 1,
                padding: 16,
                overflowY: "auto",
                minHeight: 0,
                maxHeight: "100%",
                background: "#f8fafc"
              }}>
                {pagedMessages.map((msg, idx) => (
                  <div
                    key={idx + (page-1)*pageSize}
                    style={{
                      display: "flex",
                      flexDirection: msg.from === "user" ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      marginBottom: 8
                    }}
                  >
                    {/* Bubble */}
                    <div style={{
                      background: msg.from === "bot"
                        ? "#fff"
                        : "#4ade80",
                      color: msg.from === "bot" ? "#222" : "#fff",
                      borderRadius: 16,
                      padding: "12px 16px",
                      maxWidth: "76%",
                      fontSize: 13,
                      marginLeft: 0,
                      marginRight: 10,
                      boxShadow: msg.from === "user"
                        ? "0 2px 8px rgba(74,222,128,0.15)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                      textAlign: "left",
                      border: msg.from === "bot" ? "1px solid #e0e7ef" : "none",
                      transition: "all 0.2s ease"
                    }}>
                      <span style={{ whiteSpace: 'pre-line' }}>{msg.text}</span>
                    </div>
                  </div>
                ))}
                {/* Typing indicator OUTSIDE bubble */}
                {isBotTyping && (
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-end", marginBottom: 8, marginLeft: 0 }}>
                    <div style={{
                      background: "transparent",
                      color: "#222",
                      borderRadius: 0,
                      padding: 0,
                      maxWidth: "76%",
                      fontSize: 18,
                      marginLeft: 'calc(4%)', // geser ke kanan agar sejajar bubble bot
                      border: "none",
                      minWidth: 40,
                      marginRight: 10,
                      boxShadow: "none",
                      textAlign: "left",
                    }}>
                      <span className="typing-dots" style={{ display: 'inline-block', letterSpacing: 2 }}>
                        <span style={{ animation: 'blink 1s infinite', fontSize: 32, lineHeight: 1, fontWeight: 700, verticalAlign: 'middle' }}>.</span>
                        <span style={{ animation: 'blink 1s infinite 0.2s', fontSize: 32, lineHeight: 1, fontWeight: 700, verticalAlign: 'middle' }}>.</span>
                        <span style={{ animation: 'blink 1s infinite 0.4s', fontSize: 32, lineHeight: 1, fontWeight: 700, verticalAlign: 'middle' }}>.</span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: 8, background: '#f8fafc', borderTop: '1px solid #e0e7ef' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 8,
                      background: page === 1 ? '#e5e7eb' : '#4ade80',
                      color: page === 1 ? '#888' : '#fff',
                      border: 'none',
                      fontWeight: 600,
                      cursor: page === 1 ? 'not-allowed' : 'pointer',
                      fontSize: 13,
                      transition: 'all 0.2s'
                    }}
                  >Sebelumnya</button>
                  <span style={{ fontSize: 13, color: '#666' }}>Halaman {page} dari {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 8,
                      background: page === totalPages ? '#e5e7eb' : '#4ade80',
                      color: page === totalPages ? '#888' : '#fff',
                      border: 'none',
                      fontWeight: 600,
                      cursor: page === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: 13,
                      transition: 'all 0.2s'
                    }}
                  >Selanjutnya</button>
                </div>
              )}
              {/* INPUT */}
              <form onSubmit={sendMessage} style={{
                display: "flex",
                borderTop: "1px solid #e0e7ef",
                background: "#f8fafc",
                padding: 12
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Tanyakan sesuatu..."
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: 13,
                    background: "#f1f5f9",
                    borderRadius: 12,
                    padding: "10px 16px",
                    marginRight: 8,
                    transition: "all 0.2s ease",
                    color: "#1e293b",
                    "::placeholder": {
                      color: "#94a3b8"
                    }
                  }}
                  onFocus={e => e.target.style.background = '#fff'}
                  onBlur={e => e.target.style.background = '#f1f5f9'}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      sendMessage(e);
                    }
                  }}
                />
                <button type="submit" style={{
                  background: "#4ade80",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(74,222,128,0.2)",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#3dd16d';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74,222,128,0.3)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#4ade80';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(74,222,128,0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                >
                  <FiSend />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
@keyframes blink {
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}
`}</style>
    </>
  );
};

export default Chatbot;
