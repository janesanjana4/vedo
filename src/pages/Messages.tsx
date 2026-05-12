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
      <div className="flex flex-col h-screen bg-white">
        {/* Thread header */}
        <div className="px-3.5 py-3.5 pb-2.5 flex items-center gap-2.5 border-b border-gray-100">
          <button onClick={() => setActiveChat(null)} className="w-8.5 h-8.5 rounded-full border border-border bg-white cursor-pointer flex items-center justify-center flex-shrink-0 hover:bg-gray-50">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7L9 12" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="w-9.5 h-9.5 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0" style={{ background: activeChat.avatarBg, color: activeChat.avatarText }}>
            {activeChat.initials}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-primary">{activeChat.name}</div>
            <div className="text-xs text-green-600">verified · {activeChat.city}</div>
          </div>
          <div className="cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5" r="1.5" fill="#CCCCCC" /><circle cx="9" cy="9" r="1.5" fill="#CCCCCC" /><circle cx="9" cy="13" r="1.5" fill="#CCCCCC" /></svg>
          </div>
        </div>

        {/* Info strip */}
        <div className="bg-gray-50 px-3.5 py-2 border-b border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            you matched 2 minutes ago · 4 shared preferences
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 px-3.5 py-3 flex flex-col gap-2.5 overflow-y-auto">
          <p className="text-center text-xs text-gray-400">today 9:39 am</p>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
              {msg.sender === 'them' && (
                <div className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0" style={{ background: activeChat.avatarBg, color: activeChat.avatarText }}>
                  {activeChat.initials.slice(0, 1)}
                </div>
              )}
              <div>
                <div className={`max-w-[200px] px-3.5 py-2.5 text-sm leading-relaxed rounded-2xl ${
                  msg.sender === 'me'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-primary'
                }`}
                style={{
                  borderBottomRightRadius: msg.sender === 'me' ? '4px' : undefined,
                  borderBottomLeftRadius: msg.sender === 'them' ? '4px' : undefined,
                }}
                >
                  {msg.text}
                </div>
                <div className={`text-xs text-gray-400 mt-0.75 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Quick replies */}
          <div className="flex gap-1.5 flex-wrap mt-1">
            {QUICK_REPLIES.map(r => (
              <div key={r} onClick={() => setInput(r)} className="px-3 py-1.75 bg-gray-100 rounded-full text-xs text-secondary cursor-pointer hover:bg-gray-200">
                {r}
              </div>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="flex gap-2 px-3.5 py-2.5 border-t border-gray-100 items-center">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-gray-200">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={`message ${activeChat.name.split(' ')[0]}...`}
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-full text-sm text-primary placeholder-gray-500 outline-none bg-white hover:bg-gray-50 focus:bg-white"
          />
          <button onClick={sendMessage} className={`w-9 h-9 rounded-full border-none cursor-pointer flex items-center justify-center transition-colors flex-shrink-0 ${
            input.trim()
              ? 'bg-primary hover:bg-gray-900'
              : 'bg-gray-200'
          }`}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke={input.trim() ? '#ffffff' : '#AAAAAA'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-4 pb-2.5 flex justify-between items-center">
        <span className="text-lg font-medium text-primary">messages</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#1a1a1a" strokeWidth="1.2" /><path d="M6 9h6M9 6v6" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round" /></svg>
      </div>

      {/* Search */}
      <div className="px-4 pb-2.5">
        <div className="bg-gray-100 rounded-full p-2 pl-3.5 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#BBBBBB" strokeWidth="1.2" /><line x1="9.5" y1="9.5" x2="12" y2="12" stroke="#BBBBBB" strokeWidth="1.2" strokeLinecap="round" /></svg>
          <span className="text-sm text-gray-400">search conversations</span>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {CONVERSATIONS.map(conv => (
          <div key={conv.id} onClick={() => setActiveChat(conv)} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-11.5 h-11.5 rounded-full flex items-center justify-center text-base font-medium flex-shrink-0" style={{ background: conv.avatarBg, color: conv.avatarText }}>
              {conv.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-primary">{conv.name}</div>
              <div className="text-xs text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] mt-0.5">{conv.preview}</div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs text-gray-400">{conv.time}</span>
              {conv.unread > 0 && (
                <div className="w-4.5 h-4.5 rounded-full bg-primary text-white text-xs font-medium flex items-center justify-center">
                  {conv.unread}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="flex justify-around py-2.5 pb-4 border-t border-gray-100 bg-white">
        {[
          { key: 'home', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 10L10 3l7 7v7H13v-4H7v4H3z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg>, onClick: onBack },
          { key: 'discover', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 17c0-3 3-5 7-5s7 2 7 5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg> },
          { key: 'messages', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 13c0 .6-.4 1-1 1H6l-3 3V4c0-.6.4-1 1-1h12c.6 0 1 .4 1 1v9z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" /></svg> },
          { key: 'profile', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
        ].map(tab => (
          <div key={tab.key} onClick={() => { setActiveTab(tab.key); tab.onClick?.() }} className="flex flex-col items-center gap-0.75 cursor-pointer px-3 py-0.5" style={{ color: activeTab === tab.key ? '#1a1a1a' : '#CCCCCC' }}>
            {tab.icon}
            {tab.key === 'messages' && activeTab === tab.key && <div className="w-1 h-1 rounded-full bg-warning" />}
          </div>
        ))}
      </div>
    </div>
  )
}