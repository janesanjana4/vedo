interface VedoLogoProps {
  width?: number
}

export default function VedoLogo({ width = 120 }: VedoLogoProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
    }}>
      <span style={{
        fontSize: width * 0.28,
        fontWeight: 500,
        color: '#1a1a1a',
        letterSpacing: '-1px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        lineHeight: 1,
      }}>
        vedo
      </span>
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#D85A30',
        marginBottom: width * 0.18,
        flexShrink: 0,
      }} />
    </div>
  )
}