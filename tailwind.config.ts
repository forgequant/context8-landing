import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0C0A08',
          900: '#161210',
          800: '#2E2A24',
          700: '#443E36',
          600: '#5A544C',
        },
        terminal: {
          text: '#E8E0D4',
          muted: '#9A9080',
          cyan: '#C49A3C',
          green: '#4ADE80',
          red: '#F87171'
        },
        bull: {
          DEFAULT: '#4CAF78',
          dim: 'rgba(76, 175, 120, 0.10)'
        },
        bear: {
          DEFAULT: '#C94D4D',
          dim: 'rgba(201, 77, 77, 0.10)'
        },
        neutral: {
          DEFAULT: '#7B8FA0',
          dim: 'rgba(123, 143, 160, 0.10)'
        },
        amber: {
          DEFAULT: '#C49A3C',
          dim: 'rgba(196, 154, 60, 0.10)',
          bright: '#E8B84A'
        },
        divergence: {
          DEFAULT: '#5A9EC9',
          dim: 'rgba(90, 158, 201, 0.10)'
        },
        surface: {
          DEFAULT: '#161210',
          elevated: '#1E1A16'
        },
        conviction: {
          0: '#1A1C21',
          3: '#3D3526',
          5: '#6B5D30',
          7: '#9A7E35',
          10: '#C49A3C'
        },
        conflict: {
          low: '#7B8FA0',
          medium: '#C49A3C',
          high: '#E8853D',
          critical: '#C94D4D'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
} satisfies Config
