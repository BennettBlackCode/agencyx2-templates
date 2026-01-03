-- ================================================
-- BOLDSLATE PLUMBER TEMPLATE SEED DATA
-- ================================================

-- Clear existing data
DELETE FROM contact_submissions;
DELETE FROM faqs;
DELETE FROM testimonials;
DELETE FROM service_areas;
DELETE FROM services;
DELETE FROM team;
DELETE FROM media;
DELETE FROM pages;
DELETE FROM global_content;
DELETE FROM site_info;
DELETE FROM tokens;

-- ================================================
-- TOKENS (Theme Configuration)
-- ================================================
INSERT INTO tokens (
  id, color_mode,
  primary_color, primary_hover, secondary_color, accent_color,
  light_background, light_surface, light_surface_alt, light_text, light_text_body, light_text_muted, light_border,
  dark_background, dark_surface, dark_surface_alt, dark_text, dark_text_body, dark_text_muted, dark_border,
  font_heading, font_body, radius
) VALUES (
  1, 'dark',
  '#2563eb', '#1d4ed8', '#0ea5e9', '#f59e0b',
  '#ffffff', '#f8fafc', '#f1f5f9', '#0f172a', '#334155', '#64748b', '#e2e8f0',
  '#0f172a', '#1e293b', '#334155', '#f8fafc', '#cbd5e1', '#64748b', '#334155',
  'Inter', 'Inter', '0.5rem'
);

-- ================================================
-- SITE INFO
-- Placeholders: {{business_name}}, {{phone}}, {{email}}, {{address}}, {{city}}, {{state}}, {{zip}}
-- These are replaced during site provisioning with user-provided values
-- ================================================
INSERT INTO site_info (
  id, name, tagline, description, phone, email, address, city, state, zip,
  logo_url, social_facebook, social_instagram, social_google,
  year_established, license_number
) VALUES (
  1,
  '{{business_name}}',
  'Your Trusted Local Plumbing Experts',
  'Fast, reliable plumbing services for your home or business. Licensed, insured, and available 24/7 for emergencies.',
  '{{phone}}',
  '{{email}}',
  '{{address}}',
  '{{city}}',
  '{{state}}',
  '{{zip}}',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
);

-- ================================================
-- SERVICES
-- ================================================
INSERT INTO services (slug, title, short_description, full_description, icon, is_featured, sort_order, hero_image_prompt, content_image_prompt) VALUES
('drain-cleaning', 'Drain Cleaning', 'Professional drain cleaning to eliminate clogs and restore proper flow.',
'## Expert Drain Cleaning Services

Is your drain running slow or completely clogged? Our professional drain cleaning services will restore proper flow and prevent future backups.

### Our Drain Cleaning Methods

- **Hydro Jetting**: High-pressure water blasting that clears even the toughest blockages
- **Cable Snaking**: Traditional method for breaking up clogs
- **Video Inspection**: Camera technology to identify the source of problems

### Common Drain Issues We Fix

- Slow draining sinks and tubs
- Recurring clogs
- Foul odors from drains
- Complete blockages

### Why Professional Drain Cleaning?

DIY solutions often provide temporary relief but don''t address the root cause. Our professional equipment and expertise ensure lasting results.

**Don''t let a clogged drain disrupt your day. Call us now for fast, reliable service.**',
'droplet', 1, 1,
'Professional plumber using drain snake equipment, close-up action shot, modern bathroom setting',
'Hydro jetting machine clearing drain pipe, water spray visible, professional equipment'),

('water-heater', 'Water Heater Services', 'Installation, repair, and maintenance for all water heater types.',
'## Complete Water Heater Solutions

From tankless to traditional, we handle all your water heater needs with expertise and care.

### Our Water Heater Services

- **Installation**: Professional setup of new water heaters
- **Repairs**: Quick fixes for leaks, no hot water, and strange noises
- **Maintenance**: Annual flushing and inspection to extend lifespan
- **Replacement**: Efficient removal and installation when it''s time to upgrade

### Types We Service

- Traditional tank water heaters
- Tankless/on-demand systems
- Heat pump water heaters
- Solar water heaters

### Signs You Need Service

- No hot water or inconsistent temperature
- Rusty or discolored water
- Strange noises or rumbling
- Leaks or pooling water
- Higher than normal energy bills

**We''ll help you choose the right water heater for your home and budget.**',
'flame', 1, 2,
'Plumber installing new tankless water heater on wall, professional tools visible',
'Close-up of water heater maintenance, plumber adjusting thermostat'),

('leak-detection', 'Leak Detection', 'Advanced technology to find hidden leaks and prevent water damage.',
'## Professional Leak Detection Services

Hidden leaks can cause significant damage to your home and lead to costly repairs. Our advanced detection technology finds leaks quickly and accurately.

### Our Detection Methods

- **Electronic Leak Detection**: Pinpoints leaks without destructive digging
- **Thermal Imaging**: Identifies moisture behind walls
- **Acoustic Detection**: Listens for the sound of escaping water
- **Pressure Testing**: Confirms the presence of leaks in your system

### Common Leak Locations

- Under slab/foundation
- Behind walls
- In ceilings
- Underground pipes
- Swimming pools

### Warning Signs of Hidden Leaks

- Unexplained increase in water bill
- Sound of running water when nothing is on
- Warm spots on floors
- Mold or mildew growth
- Musty odors

**Early detection saves thousands in repair costs. Schedule an inspection today.**',
'search', 1, 3,
'Plumber using electronic leak detection equipment, focused professional at work',
'Thermal imaging camera showing heat signature of hidden pipe leak'),

('emergency-plumbing', 'Emergency Plumbing', '24/7 emergency response for burst pipes, major leaks, and flooding.',
'## 24/7 Emergency Plumbing Services

Plumbing emergencies don''t wait for business hours, and neither do we. Our team is available around the clock for urgent situations.

### Emergency Situations We Handle

- **Burst Pipes**: Immediate response to prevent water damage
- **Major Leaks**: Quick repairs to stop water flow
- **Sewage Backups**: Safe and sanitary cleanup
- **No Water**: Restore service quickly
- **Gas Leaks**: Safety-first approach to gas line issues

### What to Do in an Emergency

1. Turn off the main water supply if possible
2. Call us immediately: (512) 555-0123
3. If safe, contain the water with towels
4. Document damage for insurance

### Our Emergency Promise

- 60-minute response time
- Fully stocked service vehicles
- Upfront pricing, even in emergencies
- No overtime charges for nights/weekends

**When disaster strikes, we''re the plumbers you can count on.**',
'wrench', 1, 4,
'Plumber responding to emergency pipe burst, water spray, action shot',
'Service van arriving at residential home at night, emergency response'),

('sewer-line', 'Sewer Line Services', 'Complete sewer line repair, replacement, and maintenance solutions.',
'## Professional Sewer Line Services

Your sewer line is critical to your home''s plumbing system. We offer comprehensive services to keep it flowing properly.

### Our Sewer Services

- **Video Inspection**: Camera diagnosis of sewer problems
- **Cleaning**: Remove buildup and restore flow
- **Repair**: Fix cracks, breaks, and joint failures
- **Replacement**: Complete line replacement when needed
- **Trenchless Options**: Minimal disruption to your yard

### Common Sewer Problems

- Tree root intrusion
- Pipe collapse or bellying
- Corrosion and deterioration
- Blockages and backups
- Ground shifting damage

### Warning Signs

- Multiple drain clogs
- Sewage odors in yard
- Wet spots in lawn
- Slow drains throughout house
- Gurgling sounds

**Protect your property with professional sewer line services.**',
'wrench', 0, 5,
'Plumber performing sewer line camera inspection, monitor showing pipe interior',
'Trenchless sewer repair in progress, minimal yard disruption'),

('fixture-installation', 'Fixture Installation', 'Expert installation of faucets, toilets, sinks, and more.',
'## Professional Fixture Installation

Upgrade your home with expertly installed plumbing fixtures. We ensure everything works perfectly from day one.

### Fixtures We Install

- **Faucets**: Kitchen, bathroom, and utility
- **Toilets**: Standard, low-flow, and smart toilets
- **Sinks**: Drop-in, undermount, and vessel
- **Showers**: Heads, valves, and complete systems
- **Bathtubs**: Standard, jetted, and freestanding
- **Garbage Disposals**: All major brands

### Why Professional Installation?

- Proper connections prevent leaks
- Code compliance guaranteed
- Warranty protection maintained
- Expert advice on fixture selection

### The Process

1. Consultation and measurement
2. Fixture selection assistance
3. Professional installation
4. Testing and cleanup
5. Usage demonstration

**Transform your bathroom or kitchen with beautiful new fixtures.**',
'wrench', 0, 6,
'Plumber installing modern kitchen faucet, hands working with tools',
'Beautiful newly installed bathroom fixtures, modern design');

-- ================================================
-- SERVICE AREAS
-- Note: Service areas use {{city}} and {{state}} placeholders.
-- The primary city is inserted during provisioning. Additional areas can be added via CMS.
-- ================================================
INSERT INTO service_areas (slug, name, short_description, full_description, city, state, hero_image_prompt, content_image_prompt, sort_order) VALUES
('{{city_slug}}', '{{city}}', 'Serving homeowners and businesses throughout {{city}}, {{state}}.',
'## Plumbing Services in {{city}}, {{state}}

As {{city}}''s trusted plumbing company, we provide professional plumbing services for homes and businesses throughout the area.

### Areas We Cover

- Downtown {{city}}
- Surrounding neighborhoods
- Commercial districts
- Residential communities

### Why Choose Us

We understand the unique plumbing challenges of local homes and provide fast, reliable service you can count on.

**Contact us today for reliable plumbing services in {{city}}.**',
'{{city}}', '{{state}}',
'{{city}} {{state}} cityscape, beautiful local scenery',
'Residential neighborhood in {{city}}, tree-lined street, charming homes', 1);

-- ================================================
-- TESTIMONIALS
-- Note: Testimonials use {{city}} and {{state}} placeholders for location.
-- These are sample testimonials that will be customized during provisioning.
-- ================================================
INSERT INTO testimonials (client_name, client_location, content, rating, is_featured, sort_order) VALUES
('Sarah J.', '{{city}}, {{state}}',
'They saved us when our water heater failed on a Sunday morning. Arrived within an hour and had hot water restored by noon. Incredibly professional and fair pricing!',
5, 1, 1),

('Michael C.', '{{city}}, {{state}}',
'We had a stubborn drain clog that two other plumbers couldn''t fix. They used hydro jetting equipment and solved it in under an hour. Should have called them first!',
5, 1, 2),

('Patricia W.', '{{city}}, {{state}}',
'They found a hidden leak that was causing mold in our walls. Their detection technology is impressive. They repaired the leak and helped us file the insurance claim. Five stars!',
5, 1, 3),

('David M.', '{{city}}, {{state}}',
'Emergency burst pipe at 2 AM and they were there in 45 minutes. Stopped the flooding, made repairs, and helped clean up. True professionals who care about their customers.',
5, 0, 4),

('Jennifer B.', '{{city}}, {{state}}',
'Had them install all new fixtures in our bathroom remodel. Beautiful work, on time, and on budget. The plumber even gave us tips on maintenance. Highly recommend!',
5, 0, 5),

('Robert T.', '{{city}}, {{state}}',
'Excellent sewer line inspection and cleaning. They showed me the camera footage and explained everything. No high-pressure sales tactics, just honest recommendations.',
5, 0, 6);

-- ================================================
-- FAQS (Global)
-- ================================================
INSERT INTO faqs (question, answer, is_published, sort_order) VALUES
('Do you offer 24/7 emergency service?',
'Yes! We have plumbers on call 24 hours a day, 7 days a week for plumbing emergencies. Call our emergency line anytime and we''ll dispatch a technician right away.',
1, 1),

('How quickly can you respond to a service call?',
'For regular service calls, we typically offer same-day or next-day appointments. For emergencies, our goal is to arrive within 60 minutes.',
1, 2),

('Are your plumbers licensed and insured?',
'Absolutely. All our plumbers are fully licensed by the State of Texas and we carry comprehensive liability insurance for your protection.',
1, 3),

('Do you provide free estimates?',
'Yes, we provide free estimates for most plumbing work. We''ll assess the situation and give you an upfront price before starting any repairs.',
1, 4),

('What payment methods do you accept?',
'We accept all major credit cards, checks, and cash. We also offer financing options for larger projects.',
1, 5),

('Do you offer warranties on your work?',
'Yes, all our work is backed by a satisfaction guarantee. Most repairs come with a 1-year warranty, and new installations are covered for 2 years or the manufacturer''s warranty period.',
1, 6);

-- ================================================
-- SERVICE-SPECIFIC FAQS
-- ================================================
INSERT INTO faqs (question, answer, service_id, is_published, sort_order) VALUES
('How often should I have my drains professionally cleaned?',
'We recommend professional drain cleaning every 1-2 years for preventive maintenance. If you experience frequent clogs, more frequent cleaning may be needed.',
(SELECT id FROM services WHERE slug = 'drain-cleaning'), 1, 1),

('Can you clean all types of drains?',
'Yes, we clean kitchen drains, bathroom drains, floor drains, main sewer lines, and outdoor drains. No job is too big or too small.',
(SELECT id FROM services WHERE slug = 'drain-cleaning'), 1, 2),

('How long do water heaters typically last?',
'Traditional tank water heaters last 8-12 years on average. Tankless systems can last 20+ years with proper maintenance. We can assess your unit''s condition.',
(SELECT id FROM services WHERE slug = 'water-heater'), 1, 1),

('Should I repair or replace my water heater?',
'Generally, if your water heater is over 10 years old and needs major repairs, replacement is more cost-effective. We''ll give you honest advice on the best option.',
(SELECT id FROM services WHERE slug = 'water-heater'), 1, 2),

('How do you find hidden leaks?',
'We use advanced technology including electronic detection, thermal imaging, and acoustic equipment. These methods locate leaks without damaging walls or floors.',
(SELECT id FROM services WHERE slug = 'leak-detection'), 1, 1),

('What happens after you find the leak?',
'Once we locate the leak, we''ll explain the situation and provide repair options. We can often repair the leak the same day.',
(SELECT id FROM services WHERE slug = 'leak-detection'), 1, 2);

-- ================================================
-- TEAM MEMBERS
-- ================================================
INSERT INTO team (name, role, bio, sort_order) VALUES
('Mike Johnson', 'Owner & Master Plumber',
'With over 25 years of experience, Mike founded Austin Pro Plumbing with a simple mission: provide honest, reliable service at fair prices. He still goes out on calls and ensures every customer receives the same care he''d want for his own family.',
1),

('Carlos Rodriguez', 'Service Manager',
'Carlos has been with us for 15 years and leads our service team. His expertise in diagnostics and customer communication makes him an invaluable part of our company.',
2),

('Jennifer Lee', 'Office Manager',
'Jennifer ensures our office runs smoothly and our customers are taken care of. She handles scheduling, billing, and makes sure your experience is seamless from start to finish.',
3);

-- ================================================
-- GLOBAL CONTENT
-- ================================================
DELETE FROM global_content;
INSERT INTO global_content (key, value, description) VALUES
('cta_headline', 'Ready to Get Started?', 'CTA section headline'),
('cta_subheadline', 'Contact us today for a free estimate. We''re available 24/7 for emergencies.', 'CTA section subtext'),
('cta_button_primary', 'Call Now', 'Primary CTA button text'),
('cta_button_secondary', 'Get Free Estimate', 'Secondary CTA button text'),
('reviews_headline', 'What Our Customers Say', 'Reviews section headline'),
('reviews_subheadline', 'Don''t just take our word for it. See why Austin homeowners trust us for all their plumbing needs.', 'Reviews section subtext'),
('services_headline', 'Our Services', 'Services section headline'),
('services_subheadline', 'Professional plumbing solutions for every need. From minor repairs to major installations, we''ve got you covered.', 'Services section subtext'),
('footer_tagline', 'Licensed, insured, and available 24/7. Your trusted plumbing experts since 2005.', 'Footer description');
