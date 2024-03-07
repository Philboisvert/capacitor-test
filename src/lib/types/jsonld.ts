export interface ContentJsonLd {
	readonly '@context': 'https://schema.org'
	readonly '@type': string
	readonly author: AuthorJsonLd[]
	readonly copyrightHolder: {
		readonly '@type': string
		readonly name: string | undefined
		readonly url: string | undefined
	}

	readonly description: string
	readonly headline: string

	readonly publisher: {
		readonly '@type': string
		readonly name: string | undefined
		readonly url: string
	}
	readonly image: ImageJsonLd | VideoJsonLd | null
	readonly isAccessibleForFree: boolean
	readonly inLanguage: string
}

export interface PersonJsonLd {
	readonly '@context': 'https://schema.org'
	readonly '@type': string
	readonly name: string | undefined
	readonly kind: string
	readonly jobTitle: string | undefined
	readonly inLanguage: string
	readonly image: string | null
	readonly email: string | null | undefined
	readonly telephone: string | null | undefined
	readonly address: Address
	readonly sameAs: [string | null | undefined]
}

export interface OrganizationJsonLd {
	readonly '@context': 'https://schema.org'
	readonly '@type': string
	readonly name: string | undefined
	readonly inLanguage: string
	readonly address: Address
	readonly url: string | null | undefined
	readonly logo: string | null

	readonly contact: {
		readonly '@type': string
		readonly telephone: string | null | undefined
		readonly email: string | null | undefined
	}
	readonly sameAs: [string | null | undefined]
}

export interface EventJsonLd {
	readonly '@context': 'https://schema.org'
	readonly '@type': string
	readonly name: string | undefined
	readonly description: string | undefined
	readonly startDate: string | undefined
	readonly endDate: string | undefined
	readonly inLanguage: string
	readonly image: string | null
	readonly url: string | null | undefined
	readonly location: {
		readonly '@type': string
		readonly address: Address
	}
}

export interface AuthorJsonLd {
	readonly '@type': string
	readonly name: string
}

export interface VideoJsonLd {
	readonly '@type': string
	readonly caption: string | undefined
	readonly contentUrl: string
	readonly license: string | undefined
}

export interface ImageJsonLd {
	readonly '@type': string
	readonly caption: string | undefined
	readonly url: string
	readonly license: string | undefined
}

export interface Address {
	readonly '@type': string
	readonly addressCountry: string | null | undefined
	readonly addressLocality: string | null | undefined
	readonly addressRegion: string | null | undefined
	readonly streetAddress: string | null | undefined
}

export type VisualJsonLd = ImageJsonLd | VideoJsonLd
