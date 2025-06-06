'use client'

export default function MessageBubble({ message }) {
  return (
    <div>
      <p>{message.content}</p>
    </div>
  )
}
