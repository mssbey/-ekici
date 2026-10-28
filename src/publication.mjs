// Kalıcı yayın adresini kullanın; geçici deployment adresleri canonical olamaz.
export function publicationSettings(env = process.env, configuredDomain = '') {
  const productionHost = env.VERCEL_ENV === 'production' ? env.VERCEL_PROJECT_PRODUCTION_URL : '';
  const domain = (env.SITE_URL || configuredDomain || (productionHost ? `https://${productionHost}` : '')).trim().replace(/\/+$/, '');
  const preview = ['preview', 'development'].includes(env.VERCEL_ENV);
  return { domain, published: Boolean(domain) && !preview };
}
