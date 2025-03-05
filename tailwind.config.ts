
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Game-specific colors
				krutagidon: {
					purple: '#6e2ca0',
					green: '#8dc63f',
					yellow: '#ffff00',
					orange: '#f7941d',
					red: '#ed1c24',
					blue: '#00aeef',
					dark: '#231f20',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 15px rgba(255, 255, 0, 0.5)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 25px rgba(255, 255, 0, 0.8)',
						transform: 'scale(1.05)'
					}
				},
				'card-flip': {
					'0%': { transform: 'rotateY(0deg)' },
					'100%': { transform: 'rotateY(180deg)' }
				},
				'fade-in-up': {
					'0%': { 
						opacity: '0',
						transform: 'translateY(20px)' 
					},
					'100%': { 
						opacity: '1',
						transform: 'translateY(0)' 
					}
				},
				'scale-in': {
					'0%': { 
						opacity: '0',
						transform: 'scale(0.9)' 
					},
					'100%': { 
						opacity: '1',
						transform: 'scale(1)' 
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'rotate-glow': {
					'0%': { 
						transform: 'rotate(0deg)',
						filter: 'drop-shadow(0 0 5px rgba(255,255,0,0.7))'
					},
					'50%': {
						filter: 'drop-shadow(0 0 15px rgba(255,255,0,0.9))'
					},
					'100%': { 
						transform: 'rotate(360deg)',
						filter: 'drop-shadow(0 0 5px rgba(255,255,0,0.7))'
					}
				},
				'damage-shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'card-flip': 'card-flip 0.5s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.5s ease-out',
				'slide-in-left': 'slide-in-left 0.5s ease-out',
				'rotate-glow': 'rotate-glow 10s linear infinite',
				'damage-shake': 'damage-shake 0.5s ease-in-out'
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(8px)',
			},
			fontFamily: {
				'game': ['Impact', 'Fantasy'],
				'card': ['Courier New', 'monospace'],
			},
			boxShadow: {
				'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 2px rgba(255, 255, 255, 0.1)',
				'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(255, 255, 255, 0.2)',
				'neon': '0 0 5px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 0, 0.5), 0 0 30px rgba(255, 255, 0, 0.2)',
				'inner-neon': 'inset 0 0 10px rgba(255, 255, 0, 0.5)',
			},
			backfaceVisibility: {
				'hidden': 'hidden',
				'visible': 'visible',
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }) {
			const newUtilities = {
				'.backface-visibility-hidden': {
					'backface-visibility': 'hidden',
				},
				'.backface-visibility-visible': {
					'backface-visibility': 'visible',
				},
			};
			addUtilities(newUtilities);
		}
	],
} satisfies Config;
