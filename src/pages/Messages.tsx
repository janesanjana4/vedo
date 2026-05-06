import { useState } from 'react'

const CONVERSATIONS = [
  {
    id: 1, name: 'Arjun Mehta', initials: 'AM',
    avatarBg: '#EEEDFE', avatarText: '#534AB7',
    preview: 'hey! so excited about the match 🎉',
    time: '2m', unread: 1, verified: true, city: 'Boston',
  },
  {
    id: 2, name: 'Priya & Neha', initials: 'P+N',
    avatarBg: '#FBEAF0', avatarText: '#993556',
    preview: 'we have a 3BR in Astoria, want to see?',
    time: '1h', unread: 0, verified: true, city: 'NYC',
  },
  {
    id: 3, name: 'Rohan Iyer', initials: 'RI',
    avatarBg: '#E1F5EE', avatarText: '#0F6E56',
    preview: 'are you okay with splitting groceries?',
    time: '3h', unread: 0, verified: true, city: 'Boston',
  },
]

const MESSAGES = [
  { id: 1, sender: 'them', text: 'hey! so excited we matched. are you looking in Allston or Brighton?', time: '9:39' },
  { id: 2, sender: 'me', text: 'allston mostly! closer to BU. what about you?', time: '9:40' },
  { id: 3, sender: 'them', text: 'same! I found a 2BR on Commonwealth — want me to share the link?', time: '9:41' },
]

const QUICK_REPLIES = ['yes please!', "let's do a call first", "what's the budget?"]

export default function Messages({ onBack }: { onBack: () => void }) {
  const [activeChat, setActiveChat] = useState<typeof CONVERSATIONS[0] | null>(null)
  const [messages, setMessages] = useState(MESSAGES)
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState('messages')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, {
      id: prev.length + 1, sender: 'me', text: input, time: 'now'
    }])
    setInput('')
  }

  if (activeChat) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#ffffff' }}>
        {/* Thread header */}
        <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #F0F0F0' }}>
          <button onClick={() => setActiveChat(null)} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid #E8E8E8', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: activeChat.avatarBg, color: activeChat.avatarText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, flexShrink: 0, fontFamily: 'inherit' }}>
            {activeChat.initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>{activeChat.name}</div>
            <div style={{ fontSize: 10, color: '#1D9E75', fontFamily: 'inherit' }}>verified · {activeChat.city}</div>
          </div>
          <div style={{ cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5" r="1.5" fill="#CCCCCC" /><circle cx="9" cy="9" r="1.5" fill="#CCCCCC" /><circle cx="9" cy="13" r="1.5" fill="#CCCCCC" /></svg>
          </div>
        </div>

        {/* Info strip */}
        <div style={{ background: '#FAFAFA', padding: '8px 14px', borderBottom: '1px solid #F5F5F5' }}>
          <p style={{ fontSize: 10, color: '#BBBBBB', textAlign: 'center', fontFamily: 'inherit' }}>
            you matched 2 minutes ago · 4 shared preferences
          </p>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
          <p style={{ textAlign: 'center', fontSize: 10, color: '#CCCCCC', fontFamily: 'inherit' }}>today 9:39 am</p>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender === 'me' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
              {msg.sender === 'them' && (
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: activeChat.avatarBg, color: activeChat.avatarText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, flexShrink: 0, fontFamily: 'inherit' }}>
                  {activeChat.initials.slice(0, 1)}
                </div>
              )}
              <div>
                <div style={{
                  maxWidth: 200, padding: '10px 14px', fontSize: 13, lineHeight: 1.45, fontFamily: 'inherit',
                  background: msg.sender === 'me' ? '#1a1a1a' : '#F5F5F5',
                  color: msg.sender === 'me' ? '#ffffff' : '#1a1a1a',
                  borderRadius: 18,
                  borderBottomRightRadius: msg.sender === 'me' ? 4 : 18,
                  borderBottomLeftRadius: msg.sender === 'them' ? 4 : 18,
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: '#CCCCCC', marginTop: 3, textAlign: msg.sender === 'me' ? 'right' : 'left', fontFamily: 'inherit' }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Quick replies */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {QUICK_REPLIES.map(r => (
              <div key={r} onClick={() => setInput(r)} style={{ padding: '7px 12px', background: '#F5F5F5', borderRadius: 20, fontSize: 12, color: '#555555', cursor: 'pointer', fontFamily: 'inherit' }}>
                {r}
              </div>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px', borderTop: '1px solid #F0F0F0', alignItems: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={`message ${activeChat.name.split(' ')[0]}...`}
            style={{ flex: 1, padding: '10px 14px', border: '1px solid #EEEEEE', borderRadius: 22, fontSize: 13, color: '#1a1a1a', fontFamily: 'inherit', outline: 'none', background: '#ffffff' }}
          />
          <button onClick={sendMessage} style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: input.trim() ? '#1a1a1a' : '#EEEEEE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s', flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke={input.trim() ? '#ffffff' : '#AAAAAA'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#ffffff' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>messages</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#1a1a1a" strokeWidth="1.2" /><path d="M6 9h6M9 6v6" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" /></svg>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 10px' }}>
        <div style={{ background: '#F5F5F5', borderRadius: 22, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#BBBBBB" strokeWidth="1.2" /><line x1="9.5" y1="9.5" x2="12" y2="12" stroke="#BBBBBB" strokeWidth="1.2" strokeLinecap="round" /></svg>
          <span style={{ fontSize: 13, color: '#BBBBBB', fontFamily: 'inherit' }}>search conversations</span>
        </div>
      </div>

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {CONVERSATIONS.map(conv => (
          <div key={conv.id} onClick={() => setActiveChat(conv)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #F8F8F8', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: conv.avatarBg, color: conv.avatarText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 500, flexShrink: 0, fontFamily: 'inherit' }}>
              {conv.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', fontFamily: 'inherit' }}>{conv.name}</div>
              <div style={{ fontSize: 12, color: '#AAAAAA', fontFamily: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, marginTop: 2 }}>{conv.preview}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: '#CCCCCC', fontFamily: 'inherit' }}>{conv.time}</span>
              {conv.unread > 0 && (
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1a1a1a', color: '#ffffff', fontSize: 10, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>
                  {conv.unread}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px', borderTop: '1px solid #F0F0F0', background: '#ffffff' }}>
        {[
          { key: 'home', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10L10 3l7 7v7H13v-4H7v4H3z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg>, onClick: onBack },
          { key: 'discover', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 17c0-3 3-5 7-5s7 2 7 5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg> },
          { key: 'messages', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 13c0 .6-.4 1-1 1H6l-3 3V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v9z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg> },
          { key: 'profile', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
        ].map(tab => (
          <div key={tab.key} onClick={() => { setActiveTab(tab.key); tab.onClick?.() }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer', padding: '2px 12px', color: activeTab === tab.key ? '#1a1a1a' : '#CCCCCC' }}>
            {tab.icon}
            {tab.key === 'messages' && activeTab === tab.key && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D85A30' }} />}
          </div>
        ))}
      </div>
    </div>
  )
}