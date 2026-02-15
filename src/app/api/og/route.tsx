
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

// export const runtime = 'edge' // Disabled for Windows local dev compatibility


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // ?a=ToolName&b=ToolName
        const toolA = searchParams.get('a')?.slice(0, 20) || 'Tool A'
        const toolB = searchParams.get('b')?.slice(0, 20) || 'Tool B'

        // You can also pass ?theme=dark or ?color=cyan if you want variants
        // But we'll stick to the "Battle" theme: Dark + Neon Cyan/Purple

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#020617', // slate-950
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        fontFamily: '"Inter", sans-serif',
                        color: 'white',
                        position: 'relative',
                    }}
                >
                    {/* Background Glows */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-200px',
                            left: '-200px',
                            width: '600px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', // cyan
                            filter: 'blur(80px)',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-200px',
                            right: '-200px',
                            width: '600px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', // purple
                            filter: 'blur(80px)',
                        }}
                    />

                    {/* Main Battle Container */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '900px',
                            height: '400px',
                            backgroundColor: 'rgba(15, 23, 42, 0.6)', // slate-900/60
                            border: '2px solid rgba(30, 41, 59, 1)', // slate-800
                            borderRadius: '32px',
                            padding: '60px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* VS Badge in Center */}
                        <div
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                backgroundColor: '#0f172a', // slate-900
                                border: '4px solid rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 20,
                                boxShadow: '0 0 30px rgba(6,182,212,0.3)', // cyan glow
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '32px',
                                    fontWeight: 900,
                                    background: 'linear-gradient(to right, #22d3ee, #a855f7)', // cyan to purple
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                VS
                            </div>
                        </div>

                        {/* Tool A (Left) */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '45%',
                                textAlign: 'center',
                                zIndex: 10,
                            }}
                        >
                            {/* Simulated Logo / Icon Placeholder */}
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))',
                                    border: '1px solid rgba(6,182,212,0.3)',
                                    marginBottom: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '36px',
                                }}
                            >
                                🤖
                            </div>
                            <div
                                style={{
                                    fontSize: '48px',
                                    fontWeight: 800,
                                    color: 'white',
                                    lineHeight: 1.1,
                                    textShadow: '0 0 20px rgba(6,182,212,0.3)',
                                }}
                            >
                                {toolA}
                            </div>
                        </div>

                        {/* Tool B (Right) */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '45%',
                                textAlign: 'center',
                                zIndex: 10,
                            }}
                        >
                            {/* Simulated Logo / Icon Placeholder */}
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '20px',
                                    background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))',
                                    border: '1px solid rgba(168,85,247,0.3)',
                                    marginBottom: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '36px',
                                }}
                            >
                                ⚡
                            </div>
                            <div
                                style={{
                                    fontSize: '48px',
                                    fontWeight: 800,
                                    color: 'white',
                                    lineHeight: 1.1,
                                    textShadow: '0 0 20px rgba(168,85,247,0.3)',
                                }}
                            >
                                {toolB}
                            </div>
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            fontSize: '18px',
                            color: '#64748b', // slate-500
                            fontWeight: 600,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Future Agent • Battle Arena
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (e: any) {
        console.log(`${e.message}`)
        return new Response(`Failed to generate the image`, {
            status: 500,
        })
    }
}
