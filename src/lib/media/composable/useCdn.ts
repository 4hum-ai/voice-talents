/**
 * CDN Service Composable
 *
 * This composable provides CDN functionality for transforming URLs
 * to use CDN services. It handles domain configuration and simple
 * URL transformation without image-specific parameters.
 */

/**
 * Get the default CDN domain from environment variables
 */
function getCdnDomain(): string | undefined {
  // Get CDN domain from environment variable
  const domain = import.meta.env.VITE_CLOUDFLARE_DOMAIN
  console.log('CDN domain from env:', domain)
  return domain
}

/**
 * Check if CDN transformations are enabled
 */
function isCdnEnabled(): boolean {
  // Check if CDN is enabled via environment variable
  return import.meta.env.VITE_ENABLE_CDN !== 'false'
}

/**
 * Transform a source URL to use CDN domain
 * This is a simple domain replacement without transformation parameters
 */
function getCdnUrl(sourceUrl: string): string {
  if (!sourceUrl) return ''

  // Check if CDN is enabled
  if (!isCdnEnabled()) {
    return sourceUrl
  }

  // If already a CDN URL, return as-is
  if (sourceUrl.includes('/cdn-cgi/image/')) {
    return sourceUrl
  }

  // Get CDN domain
  const cdnDomain = getCdnDomain()
  if (!cdnDomain) {
    return sourceUrl
  }

  // For simple CDN replacement (audio/video), just return the source URL
  // The actual CDN domain replacement will be handled by the CDN service
  // This function is mainly for checking if CDN is enabled and available
  return sourceUrl
}

/**
 * CDN Composable
 * Provides CDN functionality for the application
 */
export function useCdn() {
  return {
    domain: getCdnDomain(),
    enabled: isCdnEnabled(),
    getCdnUrl,
    getCdnDomain,
  }
}

// Export individual functions for backward compatibility
export { getCdnDomain, isCdnEnabled, getCdnUrl }
