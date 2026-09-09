INSERT INTO services (name, slug, short_description, description, image_url, features, is_active, sort_order)
VALUES
(
  'MC',
  'mc',
  'Charismatic, poised Masters of Ceremonies who command the room, maintain seamless program flow, and elevate the guest experience.',
  'A consummate Master of Ceremonies sets the pulse and atmosphere of your occasion. Our professional MCs possess stage presence, eloquence, and the improvisational acumen required for galas, diplomatic gatherings, high-profile corporate summits, and intimate luxury weddings. From protocol observance to energetic audience engagement, every transition is executed with finesse.',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
  '["Bilingual and multilingual hosting options", "Pre-event run-of-show consultation", "Protocol and VIP etiquette mastery", "Crisp timeline and schedule management", "Audience engagement and keynote introductions"]'::jsonb,
  true,
  1
),
(
  'Public Address System',
  'public-address-system',
  'Concert-grade acoustic engineering and precision sound reinforcement calibrated specifically to your venue’s unique architecture.',
  'Flawless sound is invisible until it fails. We deploy industry-leading line arrays, digital mixing consoles, wireless RF management, and precision acoustic staging to ensure that every speech, musical nuance, and announcement resonates crystal-clear across intimate banquets or sprawling festival amphitheaters.',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
  '["Line array and point-source speaker configurations", "Digital consoles with multitrack recording capability", "Shure and Sennheiser frequency-coordinated wireless microphones", "Dedicated front-of-house sound engineers and stage technicians", "Acoustic site survey and delay tower optimization"]'::jsonb,
  true,
  2
),
(
  'Musical Instruments',
  'musical-instruments',
  'Bespoke backline hire featuring concert pianos, custom drum kits, vintage and modern amplifiers, and masterclass stage instrumentation.',
  'Whether hosting an orchestral ensemble, a contemporary jazz quartet, or a headlining touring artist, our backline inventory delivers tour-ready reliability and pristine sonic timbre. Maintained by certified instrument technicians, each piece arrives meticulously tuned, tested, and staged for peak performance.',
  'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
  '["Concert grand and stage digital pianos (Yamaha, Roland, Nord)", "Custom acoustic and electronic drum kits with Istanbul/Zildjian cymbals", "Boutique guitar and bass amplifiers (Fender, Marshall, Ampeg)", "Direct Injection (DI) boxes and studio-grade cabling", "On-site instrument tech and staging support"]'::jsonb,
  true,
  3
),
(
  'Events Planning',
  'events-planning',
  'End-to-end strategic event architecture, creative conceptualization, vendor orchestration, and on-site production management.',
  'From initial design briefs to the moment the final guest departs, our event directors synchronize logistics, creative design, risk management, and vendor partnerships into a singular harmonious production. We handle budget governance, permits, run-of-show development, and hospitality curation with relentless precision.',
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  '["Comprehensive timeline and budget engineering", "Curated vendor procurement and contract management", "Floor plan CAD design and 3D space rendering", "On-site lead producer and floor management team", "Contingency planning and emergency protocols"]'::jsonb,
  true,
  4
),
(
  'Decoration / Lighting',
  'decoration-lighting',
  'Atmospheric architectural illumination, bespoke floral artistry, custom stage sets, and transformative sensory scenography.',
  'Lighting transforms spaces from mundane to cinematic. We combine intelligent moving heads, warm ambient pin-spots, custom structural draping, theatrical uplighting, and tailored spatial decor to craft an intoxicating aesthetic narrative that envelops your guests in sophistication.',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  '["Intelligent moving beam and wash fixtures with DMX control", "Warm LED uplighting and wireless battery uplights", "Custom stage backdrops, truss wrapping, and floral installations", "Chandelier suspension and canopy fairy light networks", "Full architectural color temperature mapping"]'::jsonb,
  true,
  5
),
(
  'More',
  'more',
  'Tailored event solutions, specialized technical staging, live streaming, drone coverage, and custom bespoke service requests.',
  'Every visionary event carries bespoke demands that transcend conventional categories. Whether your event requires broadcast multi-camera live streaming, LED video walls, pyrotechnics, red carpet logistics, or simultaneous interpretation booths, our specialized production team coordinates custom solutions tailored to your exact brief.',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  '["Multi-camera 4K broadcast and live streaming", "High-definition indoor/outdoor LED video walls", "Red carpet arrivals, stanchions, and step-and-repeat media walls", "Simultaneous translation and interpretation suites", "Custom scenic fabrication and experiential brand activations"]'::jsonb,
  true,
  6
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
