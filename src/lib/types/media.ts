export interface MediaMetadata {
	readonly [name: `name_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [description: `description_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [contact: `contact_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [facebook: `facebook_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [linkedin: `linkedin_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [twitter: `twitter_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [x: `x_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [website: `website_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [youtube: `youtube_${Intl.UnicodeBCP47LocaleIdentifier}`]: string
	readonly [
		community_labels_community: `community.labels.community.${Intl.UnicodeBCP47LocaleIdentifier}`
	]: string
	readonly [
		community_labels_people: `community.labels.people.${Intl.UnicodeBCP47LocaleIdentifier}`
	]: string
	readonly [
		community_labels_events: `community.labels.events.${Intl.UnicodeBCP47LocaleIdentifier}`
	]: string
	readonly [
		community_labels_projects: `community.labels.projects.${Intl.UnicodeBCP47LocaleIdentifier}`
	]: string
	readonly [
		community_labels_organizations: `community.labels.organizations.${Intl.UnicodeBCP47LocaleIdentifier}`
	]: string
	readonly name: string
	readonly weather_lat?: string
	readonly weather_long?: string
	readonly license?: string
}

export interface LocalizedMediaMetadata {
	readonly name?: string
	readonly description?: string
	readonly contact?: string
	readonly facebook?: string
	readonly linkedin?: string
	readonly twitter?: string
	readonly x?: string
	readonly website?: string
	readonly youtube?: string
}

export function localizeMediaMetadata(
	metadata: MediaMetadata,
	locale: Intl.UnicodeBCP47LocaleIdentifier,
): LocalizedMediaMetadata {
	return Object.fromEntries(
		Object.entries(metadata)
			.filter(([key]) => key.endsWith(`_${locale}`))
			.map(([key, value]) => [key.replace(`_${locale}`, ''), value]),
	)
}
