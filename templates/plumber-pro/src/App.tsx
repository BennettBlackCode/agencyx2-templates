import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams, useLocation } from 'react-router-dom'
import * as LucideIcons from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface SiteInfo {
  name: string
  tagline: string
  description: string
  phone: string
  email: string
  show_email: number
  address: string
  city: string
  state: string
  zip: string
  logo_url: string
  social_facebook: string
  social_instagram: string
  social_twitter: string
  social_linkedin: string
  social_youtube: string
  social_google: string
  year_established: number
  license_number: string
}

interface Service {
  id: number
  slug: string
  title: string
  short_description: string
  full_description: string
  icon: string
  hero_image: string
  hero_image_prompt: string
  content_image: string
  content_image_prompt: string
  meta_title: string
  meta_description: string
  is_featured: number
}

interface ServiceArea {
  id: number
  slug: string
  name: string
  short_description: string
  full_description: string
  hero_image: string | null
  hero_image_prompt: string
  content_image: string | null
  content_image_prompt: string
  city: string
  state: string
  zip_codes?: string
  meta_title: string
  meta_description: string
  is_published: number
  sort_order?: number
}

interface Testimonial {
  id: number
  client_name: string
  client_location: string
  client_photo: string | null
  content: string
  rating: number
  source: string
  service_id?: number | null
  is_published: number
  is_featured: number
  sort_order?: number
}

interface FAQ {
  id: number
  question: string
  answer: string
  page_slug?: string | null
  service_id?: number | null
  service_area_id?: number | null
  is_published: number
  sort_order?: number
}

interface TeamMember {
  id: number
  name: string
  role: string
  bio: string
  photo: string | null
  photo_prompt?: string
  email?: string | null
  phone?: string | null
  is_published: number
  sort_order?: number
}

interface Article {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  featured_image: string | null
  featured_image_prompt: string
  author: string
  category: string
  tags: string
  meta_title: string
  meta_description: string
  is_published: number
  is_featured: number
  published_at: string | null
  created_at: string
  updated_at: string
}


// PageData interface - for future dynamic pages from CMS
// interface PageData {
//   slug: string
//   title: string
//   hero_headline: string
//   hero_subheadline: string
//   hero_image: string
//   hero_image_prompt: string
//   content: string
//   content_image: string
//   content_image_prompt: string
//   show_reviews: number
//   show_cta: number
//   faqs: FAQ[]
//   site: { name: string; phone: string; email: string }
// }

interface NavPage {
  slug: string
  title: string
  nav_label: string
}

interface Tokens {
  color_mode: 'light' | 'dark'
  primary_color: string
  primary_hover: string
  secondary_color: string
  accent_color: string
  light_background: string
  light_surface: string
  light_surface_alt: string
  light_text: string
  light_text_body: string
  light_text_muted: string
  light_border: string
  dark_background: string
  dark_surface: string
  dark_surface_alt: string
  dark_text: string
  dark_text_body: string
  dark_text_muted: string
  dark_border: string
  font_heading: string
  font_body: string
  radius: string
}

interface GlobalContent {
  cta_headline: string
  cta_subheadline: string
  cta_button_primary: string
  cta_button_secondary: string
  reviews_headline: string
  reviews_subheadline: string
  services_headline: string
  services_subheadline: string
  footer_tagline: string
}

interface SiteData {
  site: SiteInfo
  services: Service[]
  serviceAreas: ServiceArea[]
  testimonials: Testimonial[]
  faqs: FAQ[]
  tokens: Tokens
  content: GlobalContent
  pages: NavPage[]
  team: TeamMember[]
  articles: Article[]
}

// ============================================
// LUCIDE ICON SYSTEM
// ============================================

// Convert PascalCase to kebab-case for display
function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// Get all icon names from Lucide (excluding non-icon exports)
const allLucideIcons = Object.keys(LucideIcons).filter(key => {
  // Filter out non-component exports (functions, types, etc.)
  // Icons are PascalCase and are valid React components
  if (key === 'createLucideIcon' || key === 'icons' || key === 'Icon' || key.startsWith('default')) return false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = (LucideIcons as any)[key]
  return typeof item === 'object' || typeof item === 'function'
}).sort()

// List of icon names available for selection in CMS (kebab-case for display)
const availableIcons = allLucideIcons.map(toKebabCase)

// Convert kebab-case back to PascalCase
function toPascalCase(str: string): string {
  return str.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

// Get a Lucide icon component by name (accepts both kebab-case and PascalCase)
function getIcon(name: string, className: string = 'w-6 h-6'): React.ReactNode {
  // Try PascalCase first (in case it's already in that format)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let IconComponent = (LucideIcons as any)[name]

  // If not found, convert from kebab-case to PascalCase
  if (!IconComponent) {
    const pascalName = toPascalCase(name)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IconComponent = (LucideIcons as any)[pascalName]
  }

  // Fallback to Wrench if still not found
  if (!IconComponent) {
    const FallbackIcon = LucideIcons.Wrench
    return <FallbackIcon className={className} />
  }

  return <IconComponent className={className} />
}

// Legacy icons object for backward compatibility
const icons: Record<string, React.ReactNode> = {
  wrench: getIcon('wrench'),
  droplet: getIcon('droplet'),
  flame: getIcon('flame'),
  search: getIcon('search'),
  phone: getIcon('phone'),
  mail: getIcon('mail'),
  mapPin: getIcon('map-pin'),
  clock: getIcon('clock'),
  shield: getIcon('shield'),
  check: getIcon('check'),
  chevronDown: getIcon('chevron-down', 'w-4 h-4'),
  chevronLeft: getIcon('chevron-left'),
  chevronRight: getIcon('chevron-right'),
  menu: getIcon('menu'),
  x: getIcon('x'),
  arrowRight: getIcon('arrow-right', 'w-5 h-5'),
}

// ============================================
// UTILITY COMPONENTS
// ============================================

// Icon Picker Component for CMS
export function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredIcons = search
    ? availableIcons.filter(icon => icon.toLowerCase().includes(search.toLowerCase()))
    : availableIcons

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-surface-alt rounded-lg border border-default hover:border-primary transition w-full"
      >
        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
          {getIcon(value || 'wrench')}
        </div>
        <span className="text-heading">{value || 'Select icon'}</span>
        <span className="ml-auto text-muted">{icons.chevronDown}</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface border border-default rounded-xl shadow-xl max-h-96 overflow-hidden">
          <div className="p-3 border-b border-default sticky top-0 bg-surface">
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input w-full"
              autoFocus
            />
          </div>
          <div className="p-3 overflow-y-auto max-h-72">
            <div className="grid grid-cols-8 gap-2">
              {filteredIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => {
                    onChange(icon)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  title={icon}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                    value === icon
                      ? 'bg-primary text-white'
                      : 'bg-surface-alt text-muted hover:text-heading hover:bg-primary/10'
                  }`}
                >
                  {getIcon(icon)}
                </button>
              ))}
            </div>
            {filteredIcons.length === 0 && (
              <p className="text-center text-muted py-4">No icons found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'star-filled' : 'star-empty'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-heading text-xl">Loading...</div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// ============================================
// SERVICES SLIDER
// ============================================

function ServicesSlider({ services, content }: { services: Service[]; content: GlobalContent }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(3)
  const gap = 20

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setSlidesPerView(1)
      else if (window.innerWidth < 1024) setSlidesPerView(2)
      else setSlidesPerView(3)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, services.length - slidesPerView)

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1))
  const next = () => setCurrentIndex(i => Math.min(maxIndex, i + 1))

  return (
    <section className="section section-alt" id="services">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-h2 mb-2">{content.services_headline}</h2>
            <p className="text-body-lg text-muted max-w-xl">{content.services_subheadline}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-surface border border-default flex items-center justify-center text-heading hover:bg-primary hover:text-white hover:border-primary transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-heading disabled:hover:border-default"
            >
              {icons.chevronLeft}
            </button>
            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="w-12 h-12 rounded-full bg-surface border border-default flex items-center justify-center text-heading hover:bg-primary hover:text-white hover:border-primary transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:text-heading disabled:hover:border-default"
            >
              {icons.chevronRight}
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              gap: `${gap}px`,
              transform: `translateX(calc(-${currentIndex} * (${100 / slidesPerView}% + ${gap / slidesPerView}px)))`
            }}
          >
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group relative flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: `calc(${100 / slidesPerView}% - ${gap * (slidesPerView - 1) / slidesPerView}px)` }}
              >
                <div className="aspect-[3/4]">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${service.hero_image || `https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=640&h=800&fit=crop&q=80&sig=${service.slug}`})`
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                      {getIcon(service.icon || 'wrench')}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{service.short_description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      Learn more {icons.arrowRight}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// GLOBAL SECTIONS
// ============================================

function ReviewsSection({ testimonials, content }: { testimonials: Testimonial[]; content: GlobalContent }) {
  if (!testimonials.length) return null

  return (
    <section className="section" id="reviews">
      <div className="container">
        <div className="text-center mb-12">
          {/* @ai:reviews_headline */}
          <h2 className="text-h2 mb-4">{content.reviews_headline}</h2>
          {/* @ai:reviews_subheadline */}
          <p className="text-body-lg text-muted max-w-2xl mx-auto">{content.reviews_subheadline}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial) => (
            <div key={testimonial.id} className="card">
              <StarRating rating={testimonial.rating} />
              {/* @ai:testimonial_content */}
              <p className="text-body mt-4 mb-4">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                {testimonial.client_photo && (
                  <img
                    src={testimonial.client_photo}
                    alt={testimonial.client_name}
                    className="w-10 h-10 rounded-full object-cover"
                    data-ai={`testimonial-photo-${testimonial.id}: Professional headshot of ${testimonial.client_name}`}
                  />
                )}
                <div>
                  <div className="text-heading font-medium">{testimonial.client_name}</div>
                  <div className="text-small">{testimonial.client_location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ content }: { content: GlobalContent }) {
  return (
    <section className="section bg-primary" id="cta">
      <div className="container container-narrow text-center">
        {/* @ai:cta_headline */}
        <h2 className="text-h2 text-white mb-4">{content.cta_headline}</h2>
        {/* @ai:cta_subheadline */}
        <p className="text-white/80 mb-8 text-lg">{content.cta_subheadline}</p>
        <div className="flex justify-center">
          <Link to="/contact" className="btn btn-white btn-lg">
            {content.cta_button_secondary}
          </Link>
        </div>
      </div>
    </section>
  )
}

function FAQSection({ faqs, title }: { faqs: FAQ[]; title?: string }) {
  if (!faqs.length) return null

  // Split FAQs into two columns (2 per column for 4 FAQs, 4 per column for 8 FAQs)
  const displayFaqs = faqs.slice(0, 8)
  const midpoint = Math.ceil(displayFaqs.length / 2)
  const leftColumn = displayFaqs.slice(0, midpoint)
  const rightColumn = displayFaqs.slice(midpoint)

  return (
    <section className="section">
      <div className="container">
        <h2 className="text-h2 text-center mb-12">{title || 'Frequently Asked Questions'}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {leftColumn.map((faq) => (
              <details key={faq.id} className="faq-item">
                <summary>
                  <span>{faq.question}</span>
                  {icons.chevronDown}
                </summary>
                <div className="faq-content">{faq.answer}</div>
              </details>
            ))}
          </div>
          <div className="space-y-4">
            {rightColumn.map((faq) => (
              <details key={faq.id} className="faq-item">
                <summary>
                  <span>{faq.question}</span>
                  {icons.chevronDown}
                </summary>
                <div className="faq-content">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// HEADER
// ============================================

function Header({ site, services, serviceAreas }: { site: SiteInfo; services: Service[]; serviceAreas: ServiceArea[] }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesDropdown, setServicesDropdown] = useState(false)
  const [areasDropdown, setAreasDropdown] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileAreasOpen, setMobileAreasOpen] = useState(false)

  return (
    <header className="border-b border-default sticky top-0 bg-background/95 backdrop-blur z-50">
      <div className="container py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-heading">
          {site.logo_url ? (
            <img src={site.logo_url} alt={site.name} className="h-10" data-ai="logo: Company logo" />
          ) : (
            site.name
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-6 items-center">
          <Link to="/" className="text-body-color hover:text-heading transition">Home</Link>
          <Link to="/about" className="text-body-color hover:text-heading transition">About</Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button className="text-body-color hover:text-heading transition flex items-center gap-1 py-2">
              Services {icons.chevronDown}
            </button>
            {servicesDropdown && (
              <div className="absolute top-full left-0 pt-2 w-64">
                <div className="bg-surface border border-default rounded-lg shadow-lg py-2">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="block px-4 py-2 text-body-color hover:bg-surface-alt hover:text-heading transition"
                    >
                      {service.title}
                    </Link>
                  ))}
                  <div className="border-t border-default my-2" />
                  <Link
                    to="/services"
                    className="block px-4 py-2 text-primary font-medium hover:bg-surface-alt transition"
                  >
                    View All Services
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Service Areas Dropdown */}
          {serviceAreas.length > 0 && (
            <div
              className="relative"
              onMouseEnter={() => setAreasDropdown(true)}
              onMouseLeave={() => setAreasDropdown(false)}
            >
              <button className="text-body-color hover:text-heading transition flex items-center gap-1 py-2">
                Service Areas {icons.chevronDown}
              </button>
              {areasDropdown && (
                <div className="absolute top-full left-0 pt-2 w-56">
                  <div className="bg-surface border border-default rounded-lg shadow-lg py-2">
                    {serviceAreas.map((area) => (
                      <Link
                        key={area.slug}
                        to={`/service-areas/${area.slug}`}
                        className="block px-4 py-2 text-body-color hover:bg-surface-alt hover:text-heading transition"
                      >
                        {area.name}
                      </Link>
                    ))}
                    <div className="border-t border-default my-2" />
                    <Link
                      to="/service-areas"
                      className="block px-4 py-2 text-primary font-medium hover:bg-surface-alt transition"
                    >
                      View All Areas
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link to="/contact" className="text-body-color hover:text-heading transition">Contact</Link>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <a href={`tel:${site.phone}`} className="btn btn-primary hidden lg:inline-flex">
            {icons.phone}
            <span>{site.phone}</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-heading"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? icons.x : icons.menu}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-default bg-surface">
          <nav className="container py-4 flex flex-col gap-2">
            <Link to="/" className="text-body-color hover:text-heading transition py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-body-color hover:text-heading transition py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>

            {/* Mobile Services Dropdown */}
            <div>
              <button
                className="w-full text-left text-body-color hover:text-heading transition py-2 flex items-center justify-between"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                Services
                <span className={`transform transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}>
                  {icons.chevronDown}
                </span>
              </button>
              {mobileServicesOpen && (
                <div className="pl-4 flex flex-col gap-1 pb-2">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="text-body-color hover:text-heading transition py-1.5 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                  <Link
                    to="/services"
                    className="text-primary font-medium hover:text-primary/80 transition py-1.5 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View All Services
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Service Areas Dropdown */}
            {serviceAreas.length > 0 && (
              <div>
                <button
                  className="w-full text-left text-body-color hover:text-heading transition py-2 flex items-center justify-between"
                  onClick={() => setMobileAreasOpen(!mobileAreasOpen)}
                >
                  Service Areas
                  <span className={`transform transition-transform ${mobileAreasOpen ? 'rotate-180' : ''}`}>
                    {icons.chevronDown}
                  </span>
                </button>
                {mobileAreasOpen && (
                  <div className="pl-4 flex flex-col gap-1 pb-2">
                    {serviceAreas.map((area) => (
                      <Link
                        key={area.slug}
                        to={`/service-areas/${area.slug}`}
                        className="text-body-color hover:text-heading transition py-1.5 text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {area.name}
                      </Link>
                    ))}
                    <Link
                      to="/service-areas"
                      className="text-primary font-medium hover:text-primary/80 transition py-1.5 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      View All Areas
                    </Link>
                  </div>
                )}
              </div>
            )}

            <Link to="/contact" className="text-body-color hover:text-heading transition py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <a href={`tel:${site.phone}`} className="btn btn-primary mt-2">
              Call {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

// ============================================
// FOOTER
// ============================================

function Footer({ site, services, serviceAreas, content }: { site: SiteInfo; services: Service[]; serviceAreas: ServiceArea[]; content: GlobalContent }) {
  return (
    <footer className="border-t border-default bg-surface">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            {site.logo_url && (
              <Link to="/" className="block mb-3">
                <img src={site.logo_url} alt={site.name} className="h-10" />
              </Link>
            )}
            <Link to="/" className="text-xl font-bold text-heading mb-4 block">{site.name}</Link>
            {/* @ai:footer_tagline */}
            <p className="text-small mb-4">{content.footer_tagline}</p>
            {site.license_number && (
              <p className="text-small">License #{site.license_number}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <div className="text-heading font-medium mb-4">Contact</div>
            <div className="text-small space-y-2">
              <a href={`tel:${site.phone}`} className="flex items-center gap-2 hover:text-heading transition">
                {icons.phone} {site.phone}
              </a>
              {!!site.show_email && site.email && (
                <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-heading transition">
                  {icons.mail} {site.email}
                </a>
              )}
              <p className="flex items-start gap-2">
                {icons.mapPin}
                <span>{site.address}<br />{site.city}, {site.state} {site.zip}</span>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="text-heading font-medium mb-4">Services</div>
            <div className="text-small space-y-2">
              {services.slice(0, 6).map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="block hover:text-heading transition"
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          {serviceAreas.length > 0 && (
            <div>
              <div className="text-heading font-medium mb-4">Service Areas</div>
              <div className="text-small space-y-2">
                {serviceAreas.slice(0, 6).map((area) => (
                  <Link
                    key={area.slug}
                    to={`/service-areas/${area.slug}`}
                    className="block hover:text-heading transition"
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-default mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-small text-center md:text-left">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
            {site.year_established && ` Serving since ${site.year_established}.`}
          </p>
          <div className="flex gap-4">
            {site.social_facebook && (
              <a href={site.social_facebook} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-heading transition">Facebook</a>
            )}
            {site.social_instagram && (
              <a href={site.social_instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-heading transition">Instagram</a>
            )}
            {site.social_google && (
              <a href={site.social_google} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-heading transition">Google</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// HOME PAGE
// ============================================

function HomePage({ data }: { data: SiteData }) {
  const { site, services, testimonials, faqs, content } = data

  return (
    <>
      {/* Hero Section with Background Image */}
      <section
        className="hero-bg min-h-[70vh] flex items-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop&q=80)' }}
        data-ai="hero-bg: Professional plumber working under sink in modern kitchen, dramatic lighting, high quality"
      >
        <div className="container text-center">
          {/* @ai:hero_headline */}
          <h1 className="text-display text-white mb-6">
            Your Trusted Local Plumbing Experts
          </h1>
          {/* @ai:hero_subheadline */}
          <p className="text-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Fast, reliable plumbing services for your home or business. Available 24/7 for emergencies.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={`tel:${site.phone}`} className="btn btn-primary btn-lg text-white">
              {icons.phone}
              <span>Call Now: {site.phone}</span>
            </a>
            <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
              Get Free Estimate
            </Link>
          </div>
        </div>
      </section>

      {/* About/LR Section */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* @ai:home_about_headline */}
              <h2 className="text-h2 mb-6">
                Professional Plumbing Services You Can Trust
              </h2>
              {/* @ai:home_about_content */}
              <p className="text-body mb-6">
                With over 20 years of experience serving the Austin area, we've built our reputation on quality workmanship, fair pricing, and exceptional customer service. Our licensed plumbers are equipped to handle everything from minor repairs to major installations.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-body">
                  <span className="text-primary">{icons.check}</span>
                  Licensed & Insured Professionals
                </li>
                <li className="flex items-center gap-3 text-body">
                  <span className="text-primary">{icons.check}</span>
                  24/7 Emergency Service Available
                </li>
                <li className="flex items-center gap-3 text-body">
                  <span className="text-primary">{icons.check}</span>
                  Upfront, Honest Pricing
                </li>
                <li className="flex items-center gap-3 text-body">
                  <span className="text-primary">{icons.check}</span>
                  Satisfaction Guaranteed
                </li>
              </ul>
              <Link to="/about" className="btn btn-primary">
                Learn More About Us {icons.arrowRight}
              </Link>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop"
                alt="Professional plumber at work"
                className="rounded-xl shadow-lg w-full"
                data-ai="about-section: Friendly plumber in uniform shaking hands with homeowner, professional and trustworthy appearance"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Slider */}
      <ServicesSlider services={services} content={content} />

      {/* Why Choose Us / RL Section */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop"
                alt="Our professional team"
                className="rounded-xl shadow-lg w-full"
                data-ai="why-choose-us: Team of professional plumbers standing in front of service van, confident and friendly, uniforms, professional"
              />
            </div>
            <div className="order-1 lg:order-2">
              {/* @ai:why_choose_headline */}
              <h2 className="text-h2 mb-6">
                Why Customers Choose Us
              </h2>
              {/* @ai:why_choose_content */}
              <p className="text-body mb-8">
                We understand that plumbing problems can be stressful. That's why we're committed to providing fast, reliable service that gets the job done right the first time.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3 items-start">
                  <div className="text-primary flex-shrink-0 w-5 h-5">
                    {icons.clock}
                  </div>
                  <div>
                    <h4 className="text-heading font-semibold mb-1">Fast Response</h4>
                    <p className="text-small text-muted">Same-day service available for most repairs</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="text-primary flex-shrink-0 w-5 h-5">
                    {icons.shield}
                  </div>
                  <div>
                    <h4 className="text-heading font-semibold mb-1">Fully Licensed</h4>
                    <p className="text-small text-muted">Insured and bonded for your protection</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="text-primary flex-shrink-0 w-5 h-5">
                    {icons.check}
                  </div>
                  <div>
                    <h4 className="text-heading font-semibold mb-1">Quality Work</h4>
                    <p className="text-small text-muted">Guaranteed satisfaction on every job</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="text-primary flex-shrink-0 w-5 h-5">
                    {icons.phone}
                  </div>
                  <div>
                    <h4 className="text-heading font-semibold mb-1">24/7 Available</h4>
                    <p className="text-small text-muted">Emergency service when you need it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection testimonials={testimonials} content={content} />

      {/* FAQs Section */}
      <FAQSection faqs={faqs} />

      {/* CTA Section */}
      <CTASection content={content} />
    </>
  )
}

// ============================================
// ABOUT PAGE
// ============================================

function AboutPage({ data }: { data: SiteData }) {
  const { site, testimonials, content, team } = data

  return (
    <>
      {/* Hero */}
      <section
        className="hero-bg py-24"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&h=800&fit=crop&q=80)' }}
        data-ai="about-hero: Professional plumbing team working together, workshop or warehouse setting, professional atmosphere"
      >
        <div className="container text-center">
          <h1 className="text-display text-white mb-4">About {site.name}</h1>
          {/* @ai:about_hero_subheadline */}
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            Trusted by homeowners and businesses for over {site.year_established ? new Date().getFullYear() - site.year_established : 20} years
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              {/* @ai:about_content - This is WYSIWYG content from the CMS */}
              <div className="prose">
                <h2>Our Story</h2>
                <p>
                  Founded in {site.year_established || 2005}, {site.name} has been proudly serving {site.city} and the surrounding areas with top-quality plumbing services. What started as a small family operation has grown into one of the most trusted plumbing companies in the region.
                </p>
                <p>
                  Our mission is simple: provide honest, reliable plumbing services at fair prices. We treat every home like our own and every customer like family. That's why we've earned thousands of 5-star reviews and have become the go-to plumber for homeowners and businesses alike.
                </p>
                <h3>Our Values</h3>
                <p>
                  <strong>Integrity:</strong> We believe in transparent pricing with no hidden fees. You'll always know exactly what you're paying for before we start any work.
                </p>
                <p>
                  <strong>Excellence:</strong> Our team undergoes continuous training to stay current with the latest plumbing technologies and techniques.
                </p>
                <p>
                  <strong>Reliability:</strong> When we say we'll be there, we mean it. We respect your time and always aim to arrive within our scheduled window.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <img
                src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=400&fit=crop"
                alt="Our team"
                className="rounded-xl shadow-lg w-full mb-6"
                data-ai="about-content: Plumber inspecting pipes with flashlight, focused professional at work, clean and detailed"
              />
              <div className="card">
                <h3 className="text-h3 mb-4">Quick Facts</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between text-body border-b border-default pb-2">
                    <span className="text-muted">Established</span>
                    <span className="font-medium text-heading">{site.year_established || '2005'}</span>
                  </li>
                  <li className="flex justify-between text-body border-b border-default pb-2">
                    <span className="text-muted">License #</span>
                    <span className="font-medium text-heading">{site.license_number || 'TX-12345'}</span>
                  </li>
                  <li className="flex justify-between text-body border-b border-default pb-2">
                    <span className="text-muted">Service Area</span>
                    <span className="font-medium text-heading">{site.city}, {site.state}</span>
                  </li>
                  <li className="flex justify-between text-body">
                    <span className="text-muted">Availability</span>
                    <span className="font-medium text-heading">24/7 Emergency</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {team.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <h2 className="text-h2 text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.id} className="card text-center">
                  <img
                    src={member.photo || `https://i.pravatar.cc/150?u=${member.id}`}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    data-ai={`team-${member.id}: Professional headshot of ${member.name}, ${member.role}, friendly and professional appearance`}
                  />
                  <h3 className="text-h3 mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-3">{member.role}</p>
                  {/* @ai:team_bio */}
                  <p className="text-small">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <ReviewsSection testimonials={testimonials} content={content} />

      {/* CTA */}
      <CTASection content={content} />
    </>
  )
}

// ============================================
// CONTACT PAGE
// ============================================

function ContactPage({ data }: { data: SiteData }) {
  const { site, content } = data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Hero */}
      <section
        className="hero-bg py-24"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=800&fit=crop&q=80)' }}
        data-ai="contact-hero: Professional customer service representative on phone, office environment, friendly and helpful"
      >
        <div className="container text-center">
          <h1 className="text-display text-white mb-4">Contact Us</h1>
          {/* @ai:contact_hero_subheadline */}
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            Ready to schedule service? Have a question? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card">
                <h2 className="text-h2 mb-6">Send Us a Message</h2>
                {status === 'success' ? (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                    <div className="text-green-400 mb-2">{icons.check}</div>
                    <h3 className="text-h3 text-green-400 mb-2">Message Sent!</h3>
                    <p className="text-body">We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="label">Your Name *</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="John Smith"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="label">Phone Number *</label>
                        <input
                          type="tel"
                          className="input"
                          placeholder="(555) 123-4567"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label">Email Address *</label>
                      <input
                        type="email"
                        className="input"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Service Needed</label>
                      <select
                        className="input"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      >
                        <option value="">Select a service...</option>
                        {data.services.map((s) => (
                          <option key={s.id} value={s.title}>{s.title}</option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Message</label>
                      <textarea
                        className="input textarea"
                        placeholder="Tell us about your plumbing needs..."
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>
                    {status === 'error' && (
                      <p className="text-red-400 text-sm">Something went wrong. Please try again or call us directly.</p>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-full"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="text-h3 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${site.phone}`}
                    className="flex items-center gap-4 p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      {icons.phone}
                    </div>
                    <div>
                      <p className="text-small text-muted">Call Us</p>
                      <p className="text-heading font-medium">{site.phone}</p>
                    </div>
                  </a>
                  {!!site.show_email && site.email && (
                    <a
                      href={`mailto:${site.email}`}
                      className="flex items-center gap-4 p-4 bg-surface-alt rounded-lg hover:bg-primary/10 transition"
                    >
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                        {icons.mail}
                      </div>
                      <div>
                        <p className="text-small text-muted">Email Us</p>
                        <p className="text-heading font-medium">{site.email}</p>
                      </div>
                    </a>
                  )}
                  <div className="flex items-start gap-4 p-4 bg-surface-alt rounded-lg">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      {icons.mapPin}
                    </div>
                    <div>
                      <p className="text-small text-muted">Location</p>
                      <p className="text-heading font-medium">{site.address}</p>
                      <p className="text-body">{site.city}, {site.state} {site.zip}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-primary text-white">
                <h3 className="text-h3 text-white mb-2">Emergency Service</h3>
                <p className="text-white/80 mb-4">
                  Available 24/7 for plumbing emergencies. Don't wait – call now!
                </p>
                <a href={`tel:${site.phone}`} className="btn btn-white w-full">
                  {icons.phone} Call Now: {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection content={content} />
    </>
  )
}

// ============================================
// SERVICES LISTING PAGE
// ============================================

function ServicesPage({ data }: { data: SiteData }) {
  const { services, testimonials, content } = data

  return (
    <>
      {/* Hero */}
      <section
        className="hero-bg py-24"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1920&h=800&fit=crop&q=80)' }}
        data-ai="services-hero: Various plumbing tools and equipment laid out professionally, clean workshop background"
      >
        <div className="container text-center">
          <h1 className="text-display text-white mb-4">Our Services</h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            Professional plumbing solutions for every need
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="card card-hover group"
              >
                <img
                  src={service.hero_image || `https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop&q=80&sig=${service.slug}`}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  data-ai={`service-${service.slug}: ${service.hero_image_prompt || 'Professional plumber performing ' + service.title.toLowerCase()}`}
                />
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary/30 transition">
                  {getIcon(service.icon || 'wrench')}
                </div>
                <h2 className="text-h3 mb-2">{service.title}</h2>
                <p className="text-body mb-4">{service.short_description}</p>
                <span className="inline-flex items-center gap-2 text-primary text-sm group-hover:gap-3 transition-all">
                  Learn more {icons.arrowRight}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsSection testimonials={testimonials} content={content} />

      {/* CTA */}
      <CTASection content={content} />
    </>
  )
}

// ============================================
// SINGLE SERVICE PAGE
// ============================================

function ServiceDetailPage({ data }: { data: SiteData }) {
  const { slug } = useParams<{ slug: string }>()
  const [service, setService] = useState<Service & { faqs: FAQ[]; testimonials: Testimonial[]; site: SiteInfo } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/service/${slug}`)
      .then((res) => res.json())
      .then((d) => {
        setService(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <LoadingSpinner />
  if (!service || 'error' in service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h2 mb-4">Service Not Found</h1>
          <Link to="/services" className="btn btn-primary">View All Services</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section
        className="hero-bg py-24"
        style={{ backgroundImage: `url(${service.hero_image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop'})` }}
        data-ai={`service-hero-${slug}: ${service.hero_image_prompt || 'Professional plumber performing ' + service.title.toLowerCase() + ', high quality, dramatic lighting'}`}
      >
        <div className="container">
          <div className="flex items-center gap-2 text-primary mb-4">
            {getIcon(service.icon || 'wrench')}
            <span className="text-sm uppercase tracking-wider">Our Services</span>
          </div>
          <h1 className="text-display text-white mb-4">{service.title}</h1>
          <p className="text-body-lg text-white/80 max-w-2xl mb-8">{service.short_description}</p>
          <div className="flex gap-4 flex-wrap">
            <a href={`tel:${data.site.phone}`} className="btn btn-white btn-lg">
              {icons.phone} Call Now: {data.site.phone}
            </a>
            <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
              Get Free Estimate
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* @ai:service_full_description */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: formatContent(service.full_description) }} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <img
                  src={service.content_image || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'}
                  alt={service.title}
                  className="w-full rounded-xl shadow-lg"
                  data-ai={`service-content-${slug}: ${service.content_image_prompt || 'Close-up of plumber working on ' + service.title.toLowerCase()}`}
                />
                <div className="card bg-primary text-white">
                  <h3 className="text-h3 text-white mb-2">Ready to Get Started?</h3>
                  <p className="text-white/80 mb-4">Call now for fast, reliable service.</p>
                  <a href={`tel:${data.site.phone}`} className="btn btn-white w-full">
                    {data.site.phone}
                  </a>
                </div>
                <div className="card">
                  <h3 className="text-h3 mb-4">Why Choose Us?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-body">
                      <span className="text-primary mt-1">{icons.check}</span>
                      Licensed & Insured
                    </li>
                    <li className="flex items-start gap-2 text-body">
                      <span className="text-primary mt-1">{icons.check}</span>
                      Upfront Pricing
                    </li>
                    <li className="flex items-start gap-2 text-body">
                      <span className="text-primary mt-1">{icons.check}</span>
                      24/7 Emergency Service
                    </li>
                    <li className="flex items-start gap-2 text-body">
                      <span className="text-primary mt-1">{icons.check}</span>
                      Satisfaction Guaranteed
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <FAQSection faqs={service.faqs} title={`${service.title} FAQs`} />
      )}

      {/* Reviews */}
      {service.testimonials && service.testimonials.length > 0 && (
        <ReviewsSection testimonials={service.testimonials} content={data.content} />
      )}

      {/* CTA */}
      <CTASection content={data.content} />
    </>
  )
}

// ============================================
// SERVICE AREAS LISTING PAGE
// ============================================

function ServiceAreasPage({ data }: { data: SiteData }) {
  const { site, serviceAreas, content } = data

  return (
    <>
      {/* Hero */}
      <section className="section bg-surface">
        <div className="container text-center">
          <h1 className="text-display mb-4">Areas We Serve</h1>
          <p className="text-body-lg text-muted max-w-2xl mx-auto">
            Professional plumbing services throughout {site.city} and surrounding areas
          </p>
        </div>
      </section>

      {/* Areas Grid */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreas.map((area) => (
              <Link
                key={area.id}
                to={`/service-areas/${area.slug}`}
                className="card card-hover group"
              >
                <img
                  src={area.hero_image || `https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop&q=80&sig=${area.slug}`}
                  alt={area.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                  data-ai={`area-${area.slug}: ${area.hero_image_prompt || 'Aerial view of ' + area.name + ', beautiful cityscape'}`}
                />
                <div className="flex items-center gap-2 text-primary mb-2">
                  {icons.mapPin}
                  <span className="text-sm">{area.city}, {area.state}</span>
                </div>
                <h2 className="text-h3 mb-2">{area.name}</h2>
                <p className="text-body mb-4">{area.short_description}</p>
                <span className="inline-flex items-center gap-2 text-primary text-sm group-hover:gap-3 transition-all">
                  View services {icons.arrowRight}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection content={content} />
    </>
  )
}

// ============================================
// SINGLE SERVICE AREA PAGE
// ============================================

function ServiceAreaDetailPage({ data }: { data: SiteData }) {
  const { slug } = useParams<{ slug: string }>()
  const [area, setArea] = useState<ServiceArea & { faqs: FAQ[]; services: Service[]; testimonials: Testimonial[]; site: SiteInfo } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/service-area/${slug}`)
      .then((res) => res.json())
      .then((d) => {
        setArea(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  if (loading) return <LoadingSpinner />
  if (!area || 'error' in area) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h2 mb-4">Service Area Not Found</h1>
          <Link to="/service-areas" className="btn btn-primary">View All Areas</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section
        className="hero-bg py-24"
        style={{ backgroundImage: `url(${area.hero_image || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=600&fit=crop'})` }}
        data-ai={`area-hero-${slug}: ${area.hero_image_prompt || 'Beautiful view of ' + area.name + ', city skyline or neighborhood'}`}
      >
        <div className="container">
          <div className="flex items-center gap-2 text-primary mb-4">
            {icons.mapPin}
            <span className="text-sm uppercase tracking-wider">{area.city}, {area.state}</span>
          </div>
          <h1 className="text-display text-white mb-4">Plumbing Services in {area.name}</h1>
          <p className="text-body-lg text-white/80 max-w-2xl mb-8">{area.short_description}</p>
          <div className="flex gap-4 flex-wrap">
            <a href={`tel:${data.site.phone}`} className="btn btn-white btn-lg">
              {icons.phone} Call Now: {data.site.phone}
            </a>
            <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
              Get Free Estimate
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* @ai:area_full_description */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: formatContent(area.full_description) }} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <img
                  src={area.content_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'}
                  alt={area.name}
                  className="w-full rounded-xl shadow-lg"
                  data-ai={`area-content-${slug}: ${area.content_image_prompt || 'Local neighborhood in ' + area.name + ', residential street'}`}
                />
                <div className="card bg-primary text-white">
                  <h3 className="text-h3 text-white mb-2">Need a Plumber in {area.name}?</h3>
                  <p className="text-white/80 mb-4">We're just a phone call away.</p>
                  <a href={`tel:${data.site.phone}`} className="btn btn-white w-full">
                    {data.site.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services in this area - Same as home page */}
      <ServicesSlider
        services={area.services}
        content={{ ...data.content, services_headline: `Services Available in ${area.name}`, services_subheadline: `Professional plumbing solutions for ${area.name} residents` }}
      />

      {/* FAQs */}
      {area.faqs && area.faqs.length > 0 && (
        <FAQSection faqs={area.faqs} title={`${area.name} FAQs`} />
      )}

      {/* Reviews */}
      {area.testimonials && area.testimonials.length > 0 && (
        <ReviewsSection testimonials={area.testimonials} content={data.content} />
      )}

      {/* CTA */}
      <CTASection content={data.content} />
    </>
  )
}

// ============================================
// ARTICLES LISTING PAGE
// ============================================

function ArticlesPage({ data }: { data: SiteData }) {
  const { articles, content } = data
  const publishedArticles = articles.filter(a => a.is_published)

  return (
    <>
      {/* Hero */}
      <section
        className="hero-bg py-24"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&h=800&fit=crop&q=80)' }}
        data-ai="articles-hero: Professional blog workspace with laptop and coffee, clean modern desk setup"
      >
        <div className="container text-center">
          <h1 className="text-display text-white mb-4">Articles & Tips</h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto">
            Expert advice and insights to help you maintain your plumbing
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section">
        <div className="container">
          {publishedArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted text-lg">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/articles/${article.slug}`}
                  className="card card-hover group"
                >
                  <img
                    src={article.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop&q=80'}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    data-ai={`article-${article.slug}: ${article.featured_image_prompt || 'Blog article featured image for ' + article.title}`}
                  />
                  <div className="flex items-center gap-3 text-sm text-muted mb-3">
                    {article.category && (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">{article.category}</span>
                    )}
                    {article.published_at && (
                      <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    )}
                  </div>
                  <h2 className="text-h3 mb-2">{article.title}</h2>
                  <p className="text-body mb-4 line-clamp-3">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-primary text-sm group-hover:gap-3 transition-all">
                    Read more {icons.arrowRight}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTASection content={content} />
    </>
  )
}

// ============================================
// SINGLE ARTICLE PAGE
// ============================================

interface TOCItem {
  id: string
  text: string
  level: number
}

function ArticleDetailPage({ data }: { data: SiteData }) {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Article & { site: SiteInfo } | null>(null)
  const [loading, setLoading] = useState(true)
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    if (!slug) return
    fetch(`/api/article/${slug}`)
      .then((res) => res.json())
      .then((d) => {
        setArticle(d)
        // Extract headings for TOC
        if (d.content) {
          const headings: TOCItem[] = []
          const lines = d.content.split('\n')
          lines.forEach((line: string, index: number) => {
            const h2Match = line.match(/^## (.+)$/)
            const h3Match = line.match(/^### (.+)$/)
            if (h2Match) {
              const id = `section-${index}`
              headings.push({ id, text: h2Match[1], level: 2 })
            } else if (h3Match) {
              const id = `section-${index}`
              headings.push({ id, text: h3Match[1], level: 3 })
            }
          })
          setToc(headings)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = toc.map(item => document.getElementById(item.id)).filter(Boolean)
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.getBoundingClientRect().top <= 150) {
          setActiveSection(toc[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  if (loading) return <LoadingSpinner />
  if (!article || 'error' in article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h2 mb-4">Article Not Found</h1>
          <Link to="/articles" className="btn btn-primary">View All Articles</Link>
        </div>
      </div>
    )
  }

  // Process content to add IDs to headings
  function formatArticleContent(content: string): string {
    if (!content) return ''
    let headingIndex = 0
    let html = content
      .replace(/^## (.+)$/gm, () => {
        const id = `section-${headingIndex}`
        const match = content.split('\n').filter(l => l.startsWith('## ') || l.startsWith('### '))[headingIndex]
        headingIndex++
        const text = match?.replace(/^##+ /, '') || ''
        return `<h2 id="${id}">${text}</h2>`
      })

    // Reset for h3
    let h3Index = 0
    const allHeadings = content.split('\n').filter(l => l.startsWith('## ') || l.startsWith('### '))
    html = html.replace(/^### (.+)$/gm, () => {
      // Find h3 position in combined list
      const h3Lines = content.split('\n').filter(l => l.startsWith('### '))
      const lineText = h3Lines[h3Index]?.replace(/^### /, '') || ''
      const combinedIndex = allHeadings.findIndex((h, i) => h.startsWith('### ') && allHeadings.slice(0, i).filter(x => x.startsWith('### ')).length === h3Index)
      h3Index++
      return `<h3 id="section-${combinedIndex}">${lineText}</h3>`
    })

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Lists
    html = html.replace(/(?:^- .+$\n?)+/gm, (match) => {
      const items = match.trim().split('\n').map(line =>
        `<li>${line.replace(/^- /, '')}</li>`
      ).join('')
      return `<ul>${items}</ul>`
    })

    // Paragraphs
    html = html
      .split('\n\n')
      .map(block => {
        block = block.trim()
        if (!block) return ''
        if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol')) {
          return block
        }
        return `<p>${block}</p>`
      })
      .join('')

    return html
  }

  return (
    <>
      {/* Hero */}
      <section
        className="hero-bg py-24"
        style={{ backgroundImage: `url(${article.featured_image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop'})` }}
        data-ai={`article-hero-${slug}: ${article.featured_image_prompt || 'Blog article hero image for ' + article.title}`}
      >
        <div className="container">
          <div className="flex items-center gap-3 text-sm text-white/80 mb-4">
            {article.category && (
              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded">{article.category}</span>
            )}
            {article.published_at && (
              <span>{new Date(article.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            )}
            {article.author && (
              <>
                <span>•</span>
                <span>By {article.author}</span>
              </>
            )}
          </div>
          <h1 className="text-display text-white mb-4">{article.title}</h1>
          <p className="text-body-lg text-white/80 max-w-3xl">{article.excerpt}</p>
        </div>
      </section>

      {/* Content with TOC */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* TOC Sidebar - LEFT */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              {toc.length > 0 && (
                <div className="sticky top-24">
                  <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors ${
                          item.level === 3 ? 'pl-4' : ''
                        } ${
                          activeSection === item.id
                            ? 'text-primary font-medium'
                            : 'text-muted hover:text-primary'
                        }`}
                        onClick={(e) => {
                          e.preventDefault()
                          const el = document.getElementById(item.id)
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                        }}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>

            {/* Main Content - RIGHT */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formatArticleContent(article.content) }} />

              {/* Tags */}
              {article.tags && (
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted">Tags:</span>
                    {article.tags.split(',').map((tag, i) => (
                      <span key={i} className="bg-surface-alt px-3 py-1 rounded text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio (if available) */}
              {article.author && (
                <div className="mt-8 p-6 bg-surface rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                      {article.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-h4">{article.author}</h4>
                      <p className="text-sm text-muted">Author</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection content={data.content} />
    </>
  )
}

// ============================================
// UTILITIES
// ============================================

function formatContent(content: string): string {
  if (!content) return ''

  // Process the content
  let html = content
    // Headers
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // Handle lists - find consecutive lines starting with - and wrap in <ul>
  html = html.replace(/(?:^- .+$\n?)+/gm, (match) => {
    const items = match.trim().split('\n').map(line =>
      `<li>${line.replace(/^- /, '')}</li>`
    ).join('')
    return `<ul>${items}</ul>`
  })

  // Paragraphs - wrap non-tag lines
  html = html
    .split('\n\n')
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol')) {
        return block
      }
      return `<p>${block}</p>`
    })
    .join('')

  return html
}

function injectTokens(tokens: Tokens) {
  const root = document.documentElement
  const isDark = tokens.color_mode === 'dark'

  // Brand colors (same for both modes)
  root.style.setProperty('--color-primary', tokens.primary_color)
  root.style.setProperty('--color-primary-hover', tokens.primary_hover)
  root.style.setProperty('--color-secondary', tokens.secondary_color)
  root.style.setProperty('--color-accent', tokens.accent_color)

  // Mode-specific colors
  root.style.setProperty('--color-background', isDark ? tokens.dark_background : tokens.light_background)
  root.style.setProperty('--color-surface', isDark ? tokens.dark_surface : tokens.light_surface)
  root.style.setProperty('--color-surface-alt', isDark ? tokens.dark_surface_alt : tokens.light_surface_alt)
  root.style.setProperty('--color-text', isDark ? tokens.dark_text : tokens.light_text)
  root.style.setProperty('--color-text-body', isDark ? tokens.dark_text_body : tokens.light_text_body)
  root.style.setProperty('--color-text-muted', isDark ? tokens.dark_text_muted : tokens.light_text_muted)
  root.style.setProperty('--color-border', isDark ? tokens.dark_border : tokens.light_border)

  // Typography
  root.style.setProperty('--font-heading', `'${tokens.font_heading}', system-ui, sans-serif`)
  root.style.setProperty('--font-body', `'${tokens.font_body}', system-ui, sans-serif`)
  root.style.setProperty('--radius', tokens.radius)

  // Load Google Fonts
  if (tokens.font_heading || tokens.font_body) {
    const fonts = new Set([tokens.font_heading, tokens.font_body].filter(Boolean))
    const fontLink = document.createElement('link')
    fontLink.href = `https://fonts.googleapis.com/css2?${[...fonts].map(f => `family=${f}:wght@400;500;600;700`).join('&')}&display=swap`
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)
  }
}

// ============================================
// MAIN APP
// ============================================

function App() {
  const [data, setData] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/site')
      .then((res) => res.json())
      .then((d) => {
        setData(d)
        if (d.tokens) {
          injectTokens(d.tokens)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-heading text-xl">Loading...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-h2 text-red-400 mb-4">Error Loading Site</h1>
          <p className="text-body">{error || 'Failed to load site data'}</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        <Header site={data.site} services={data.services} serviceAreas={data.serviceAreas} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage data={data} />} />
            <Route path="/about" element={<AboutPage data={data} />} />
            <Route path="/contact" element={<ContactPage data={data} />} />
            <Route path="/services" element={<ServicesPage data={data} />} />
            <Route path="/services/:slug" element={<ServiceDetailPage data={data} />} />
            <Route path="/service-areas" element={<ServiceAreasPage data={data} />} />
            <Route path="/service-areas/:slug" element={<ServiceAreaDetailPage data={data} />} />
            <Route path="/articles" element={<ArticlesPage data={data} />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage data={data} />} />
          </Routes>
        </main>
        <Footer site={data.site} services={data.services} serviceAreas={data.serviceAreas} content={data.content} />
      </div>
    </BrowserRouter>
  )
}

export default App
