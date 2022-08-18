function withOpacityValue(variable) {
	return ({ opacityValue }) => {
		if (opacityValue === undefined) {
			return `rgb(var(${variable}))`
		}
		return `rgba(var(${variable}), ${opacityValue})`
	}
}

module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	safelist: [
		{
			pattern: /^(.*?)/,
			variants: ["lg", "hover", "focus", "lg:hover", "opacity"],
		},
	],
	theme: {
		postcss: {
			plugins: [require("tailwindcss"), require("autoprefixer")],
		},
		extend: {
			fontSize: {
				"custom-xs": "var(--nds-core-font-xs)",
				"custom-2xs": "var(--nds-core-font-2xs)",
				"custom-sm": "var(--nds-core-font-sm)",
				"custom-md": "var(--nds-core-font-md)",
				"custom-lg": "var(--nds-core-font-lg)",
				"custom-xl": "var(--nds-core-font-xl)",
				"custom-3xl": "var(--nds-core-font-3xl)",
			},
			letterSpacing: {
				"custom-x2wider": "0.04em",
				"custom-tight": "-0.01em",
				"custom-tighter": "-0.02em",
				"custom-x2tighter": "-0.04em",
			},
			dropShadow: {
				xxl: "0 16px 32px rgba(22, 34, 51, 0.16)",
			},
			boxShadow: {
				xxl: "0 4px 12px -4px rgba(22, 34, 51, 0.12)",
				"3xl": "0px 8px 16px -4px rgba(22, 34, 51, 0.12)",
			},
			backdropBlur: {
				xxl: "18px",
				opaque: "12px",
			},
			spacing: {
				"8xl": "96rem",
				"9xl": "128rem",
			},
			borderRadius: {
				"4xl": "2rem",
			},
			border: {
				default: "var(--nds-semantic-color-border-input)",
				"custom-white": "var(--nds-core-border-white)",
			},
			colors: {
				"border-menu": "var(--nds-semantic-color-border-menu)",
				"surface-button-primary":
					"var(--nds-semantic-color-surface-button-primary)",
				placeholder: "var(--nds-semantic-color-text-placeholder)",
				"default-border": "var(--nds-semantic-color-border-input)",
				default: "var(--nds-semantic-color-text)",
				"outlined-disabled":
					"var(--nds-semantic-color-border-outlined-disabled)",
				"brand-tertiary": "var(--nds-semantic-color-brand-tertiary)",
				"surface-button-subtle":
					"var(--nds-semantic-color-surface-button-subtle)",
				"surface-button-subtle-hovered":
					"var(--nds-semantic-color-surface-button-subtle-hovered)",
				"button-subtle": "var(--nds-semantic-color-on-button-subtle)",
				"button-transparent": "var(--nds-semantic-color-on-button-transparent)",
				"button-outlined": "var(--nds-semantic-color-on-button-outlined)",
				subdued: "var(--nds-semantic-color-text-subdued)",
				light: {
					default: "var(--nds-semantic-color-text)",
				},
				blue: {
					100: withOpacityValue("--color-blue-100"),
					200: withOpacityValue("--color-blue-200"),
					300: withOpacityValue("--color-blue-300"),
					400: withOpacityValue("--color-blue-400"),
					500: withOpacityValue("--color-blue-500"),
					600: withOpacityValue("--color-blue-600"),
					700: withOpacityValue("--color-blue-700"),
					DEFAULT: withOpacityValue("--color-blue-300"),
				},
				purple: {
					100: withOpacityValue("--color-purple-100"),
					200: withOpacityValue("--color-purple-200"),
					300: withOpacityValue("--color-purple-300"),
					400: withOpacityValue("--color-purple-400"),
					500: withOpacityValue("--color-purple-500"),
					DEFAULT: withOpacityValue("--color-purple-300"),
				},
				red: {
					200: withOpacityValue("--color-red-200"),
					300: withOpacityValue("--color-red-300"),
					400: withOpacityValue("--color-red-400"),
					600: withOpacityValue("--color-red-600"),
					DEFAULT: withOpacityValue("--color-red-300"),
				},
				green: {
					200: withOpacityValue("--color-green-200"),
					300: withOpacityValue("--color-green-300"),
					400: withOpacityValue("--color-green-400"),
					DEFAULT: withOpacityValue("--color-green-300"),
				},
				gray: {
					200: withOpacityValue("--color-gray-200"),
					300: withOpacityValue("--color-gray-300"),
					"300-transparent": withOpacityValue("--color-gray-300-transparent")(
						0.5
					),
					400: withOpacityValue("--color-gray-400"),
					500: withOpacityValue("--color-gray-500"),
					"500-transparent": withOpacityValue("--color-gray-500-transparent")(
						0.5
					),
					600: withOpacityValue("--color-gray-600"),
					700: withOpacityValue("--color-gray-700"),
					800: withOpacityValue("--color-gray-800"),
					900: withOpacityValue("--color-gray-900"),
					"900-transparent": withOpacityValue("--color-gray-900-transparent")(
						0.05
					),
					DEFAULT: withOpacityValue("--color-gray-700"),
				},
				primary: {
					light: withOpacityValue("--color-primary-light"),
					DEFAULT: withOpacityValue("--color-primary-light"),
					dark: withOpacityValue("--color-primary-dark"),
					gray: withOpacityValue("--color-primary-gray"),
					yellow: withOpacityValue("--color-primary-yellow"),
				},
				secondary: {
					purple: withOpacityValue("--color-purple-300"),
					reg: withOpacityValue("--color-reg-300"),
					green: withOpacityValue("--color-green-300"),
					gray: withOpacityValue("--color-gray-800"),
				},
				tertiary: {
					red: withOpacityValue("--color-tertiary-red"),
					green: withOpacityValue("--color-tertiary-green"),
				},
			},
			textColor: {
				emphasis: "var(--nds-semantic-color-text-emphasis)",
				default: "var(--nds-semantic-color-text)",
				"button-transparent": "var(--nds-semantic-color-on-button-transparent)",
				subdued: "var(--nds-semantic-color-text-subdued)",
				"button-highlight": "var(--nds-semantic-color-on-button-highlight)",
				"button-subtle": "var(--nds-semantic-color-on-button-subtle)",
				skin: {
					primary: withOpacityValue("--color-text-primary"),
					"primary-muted": withOpacityValue("--color-text-primary-muted"),
					secondary: withOpacityValue("--color-text-secondary"),
					"secondary-muted": withOpacityValue("--color-text-secondary-muted"),
					subtle: withOpacityValue("--color-text-subtle"),
					"subtle-muted": withOpacityValue("--color-text-subtle-muted"),
					inverted: withOpacityValue("--color-text-inverted"),
					"inverted-muted": withOpacityValue("--color-text-inverted-muted"),
				},
			},
			backgroundColor: {
				"surface-default": "var(--nds-semantic-color-surface-default)",
				"button-subtle": "var(--nds-semantic-color-surface-button-subtle)",
				"surface-button-subtle-hovered":
					"var(--nds-semantic-color-surface-button-subtle-hovered)",
				gray: {
					"300-transparent": withOpacityValue("--color-gray-300-transparent")(
						0.5
					),
					"900-transparent":
						"var(--nds-semantic-color-bg-gray-900-transparent)",
				},

				"semi-transparent": withOpacityValue("--color-white-transparent")(0.5),
				skin: {
					primary: withOpacityValue("--color-fill-primary"),
					"primary-muted": withOpacityValue("--color-fill-primary-muted"),
					secondary: withOpacityValue("--color-fill-secondary"),
					"secondary-muted": withOpacityValue("--color-fill-secondary-muted"),
					subtle: withOpacityValue("--color-fill-subtle"),
					"subtle-muted": withOpacityValue("--color-fill-subtle-muted"),
					transparent: withOpacityValue("--color-fill-transparent"),
					"transparent-muted": withOpacityValue(
						"--color-fill-transparent-muted"
					),
					inverted: withOpacityValue("--color-fill-inverted"),
					"inverted-muted": withOpacityValue("--color-fill-inverted-muted"),
				},
			},
			backgroundImage: {
				"black-gray-logo": 'url("/src/assets/LogoTransparent.svg")',
			},
		},
	},
}
