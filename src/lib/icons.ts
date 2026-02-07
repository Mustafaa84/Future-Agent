export const getCategoryIcon = (iconName: string | null) => {
    const icons: Record<string, string> = {
        'Megaphone': '📣',
        'Code2': '💻',
        'PenTool': '✍️',
        'Zap': '⚡',
        'Search': '🔍',
        'Video': '🎥',
        'Image': '🖼️',
        'MessageSquare': '💬',
        'Bot': '🤖',
        'Gauge': '⏱️',
        'Shield': '🛡️',
        'Globe': '🌐',
        'Brain': '🧠',
        'Target': '🎯',
        'TrendingUp': '📈',
        'Database': '🗄️',
        'Link': '🔗'
    }
    return iconName ? (icons[iconName] || '📁') : '📁'
}
