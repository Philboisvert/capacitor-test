export type ContentConfigurationKey =
	| 'headline-left-ad'
	| 'headline-left'
	| 'headline-right-ad'
	| 'headline-right'
	| 'parallax-headline-left'
	| 'parallax-headline-right'

export type DistributionConfigurationKey = 'distribution'

export type HtmlConfigurationKey =
	| 'ad'
	| 'featured-profiles'
	| 'html-content'
	| 'profiles-by-id'
	| 'profiles-by-tag'
	| 'separator'

export type SectionConfigurationKey =
	| 'section-1-1-2'
	| 'section-1-2-1-left'
	| 'section-1-2-1-right'
	| 'section-1-3-ad'
	| 'section-1'
	| 'section-2-1-1'
	| 'section-2-1-2'
	| 'section-2'
	| 'section-3'
	| 'section-4-ad'
	| 'section-4'
	| 'section-6-ad'
	| 'section-ad-3-1'
	| 'section-ad-4'
	| 'section-ad-6'

export type SectionRecursiveConfigurationKey =
	| 'section-1-1-2'
	| 'section-1-2-1-left'
	| 'section-1-2-1-right'
	| 'section-1-3-ad'
	| 'section-1'
	| 'section-2-1-1'
	| 'section-2-1-2'
	| 'section-2'
	| 'section-3'
	| 'section-4-ad'
	| 'section-4'
	| 'section-6-ad'
	| 'section-ad-3-1'
	| 'section-ad-4'
	| 'section-ad-6'

export type ConfigurationKey =
	| ContentConfigurationKey
	| DistributionConfigurationKey
	| HtmlConfigurationKey
	| SectionConfigurationKey
	| SectionRecursiveConfigurationKey
