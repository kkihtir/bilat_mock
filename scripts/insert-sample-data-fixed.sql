-- Get user IDs first
DO $$
DECLARE
  john_id UUID;
  sarah_id UUID;
  michael_id UUID;
  emily_id UUID;
  david_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO john_id FROM users WHERE email = 'john.smith@example.com';
  SELECT id INTO sarah_id FROM users WHERE email = 'sarah.johnson@example.com';
  SELECT id INTO michael_id FROM users WHERE email = 'michael.brown@example.com';
  SELECT id INTO emily_id FROM users WHERE email = 'emily.davis@example.com';
  SELECT id INTO david_id FROM users WHERE email = 'david.wilson@example.com';

  -- Verify that we have all user IDs
  IF john_id IS NULL OR sarah_id IS NULL OR michael_id IS NULL OR emily_id IS NULL OR david_id IS NULL THEN
    RAISE EXCEPTION 'One or more user IDs are missing. Make sure all users exist before running this script.';
  END IF;
  
  -- Sample reports (only if table is empty)
  IF NOT EXISTS (SELECT 1 FROM reports LIMIT 1) THEN
    INSERT INTO reports (title, country_code, date, type, status, description, created_by_id, approved_by_id, tags, created_at)
    VALUES
      ('US-Japan Trade Meeting', 'jp', '2025-03-10', 'meeting', 'approved', 'Comprehensive report on trade negotiations between Japan and the United States', john_id, sarah_id, ARRAY['Trade', 'Bilateral', 'Technology'], NOW() - INTERVAL '20 days'),
      ('Germany Economic Overview', 'de', NULL, 'informative', 'pending', 'Analysis of Germany''s economic indicators and future outlook', michael_id, NULL, ARRAY['Economy', 'Europe', 'Manufacturing'], NOW() - INTERVAL '25 days'),
      ('UK Diplomatic Relations', 'gb', '2025-04-15', 'meeting', 'approved', 'Report on diplomatic relations with the United Kingdom', john_id, emily_id, ARRAY['Diplomacy', 'Europe', 'Post-Brexit'], NOW() - INTERVAL '30 days');
    
    RAISE NOTICE 'Inserted 3 reports successfully!';
    
    -- Insert more reports after verifying the first batch worked
    INSERT INTO reports (title, country_code, date, type, status, description, created_by_id, approved_by_id, tags, created_at)
    VALUES
      ('China Trade Analysis', 'cn', NULL, 'informative', 'pending', 'Comprehensive analysis of trade relations with China', michael_id, NULL, ARRAY['Trade', 'Asia', 'Manufacturing'], NOW() - INTERVAL '18 days'),
      ('India Investment Opportunities', 'in', '2025-05-20', 'meeting', 'rejected', 'Overview of investment opportunities in India''s growing economy', sarah_id, NULL, ARRAY['Investment', 'Asia', 'Technology'], NOW() - INTERVAL '15 days'),
      ('Brazil Agricultural Cooperation', 'br', '2025-04-10', 'meeting', 'approved', 'Report on agricultural cooperation initiatives with Brazil', david_id, sarah_id, ARRAY['Agriculture', 'South America', 'Trade'], NOW() - INTERVAL '12 days'),
      ('France Cultural Exchange Program', 'fr', '2025-06-15', 'informative', 'pending', 'Overview of cultural exchange programs with France', emily_id, NULL, ARRAY['Culture', 'Europe', 'Education'], NOW() - INTERVAL '10 days'),
      ('Australia Energy Partnership', 'au', NULL, 'informative', 'approved', 'Analysis of energy partnership opportunities with Australia', john_id, michael_id, ARRAY['Energy', 'Oceania', 'Renewable'], NOW() - INTERVAL '8 days'),
      ('South Africa Mining Cooperation', 'za', '2025-05-05', 'meeting', 'pending', 'Report on mining cooperation initiatives with South Africa', david_id, NULL, ARRAY['Mining', 'Africa', 'Resources'], NOW() - INTERVAL '5 days'),
      ('Canada Technology Summit', 'ca', '2025-04-25', 'meeting', 'approved', 'Summary of technology summit with Canadian partners', sarah_id, emily_id, ARRAY['Technology', 'North America', 'Innovation'], NOW() - INTERVAL '2 days');
      
    RAISE NOTICE 'Inserted all reports successfully!';
  ELSE
    RAISE NOTICE 'Reports table already has data, skipping report insertion.';
  END IF;

  -- Sample profiles
  IF NOT EXISTS (SELECT 1 FROM profiles LIMIT 1) THEN
    INSERT INTO profiles (full_name, country, position, type, education, image_url)
    VALUES
      ('James Miller', 'us', 'Ambassador to Japan', 'ambassador', 'Harvard University, International Relations', 'https://randomuser.me/api/portraits/men/1.jpg'),
      ('Emma Thompson', 'gb', 'Foreign Secretary', 'non-ambassador', 'Oxford University, Political Science', 'https://randomuser.me/api/portraits/women/2.jpg'),
      ('François Dupont', 'fr', 'Ambassador to the United States', 'ambassador', 'Sciences Po, Diplomacy', 'https://randomuser.me/api/portraits/men/3.jpg'),
      ('Akiko Yamamoto', 'jp', 'Minister of Foreign Affairs', 'non-ambassador', 'Tokyo University, International Law', 'https://randomuser.me/api/portraits/women/4.jpg'),
      ('Klaus Schmidt', 'de', 'Ambassador to the European Union', 'ambassador', 'Humboldt University, European Politics', 'https://randomuser.me/api/portraits/men/5.jpg'),
      ('Maria Silva', 'br', 'Deputy Foreign Minister', 'non-ambassador', 'University of São Paulo, Economics', 'https://randomuser.me/api/portraits/women/6.jpg'),
      ('Li Wei', 'cn', 'Ambassador to the United Nations', 'ambassador', 'Peking University, International Relations', 'https://randomuser.me/api/portraits/men/7.jpg'),
      ('Sophie Trudeau', 'ca', 'Minister of International Development', 'non-ambassador', 'McGill University, Public Policy', 'https://randomuser.me/api/portraits/women/8.jpg');
      
    RAISE NOTICE 'Inserted profiles successfully!';
  ELSE
    RAISE NOTICE 'Profiles table already has data, skipping profile insertion.';
  END IF;

  -- Sample agreements
  IF NOT EXISTS (SELECT 1 FROM agreements LIMIT 1) THEN
    INSERT INTO agreements (name, country, type, status, start_date, end_date, description, latest_update, key_points)
    VALUES
      ('US-Japan Trade Agreement', 'jp', 'trade', 'active', '2023-05-10', '2028-05-10', 'Comprehensive trade agreement focusing on automotive and agricultural sectors', 'Renewal negotiations to begin next quarter', ARRAY['Reduced tariffs on agricultural products', 'Streamlined customs procedures', 'Intellectual property protections']),
      ('UK-EU Post-Brexit Relations', 'gb', 'diplomatic', 'pending', '2024-01-01', '2029-01-01', 'Framework for continued cooperation after Brexit', 'Awaiting final approval from EU parliament', ARRAY['Visa-free travel provisions', 'Academic exchange programs', 'Research collaboration framework']),
      ('Germany Renewable Energy Partnership', 'de', 'energy', 'active', '2022-03-15', '2027-03-15', 'Collaboration on renewable energy technologies and policies', 'Implementation progressing as scheduled', ARRAY['Joint research on solar technology', 'Shared carbon reduction targets', 'Technology transfer provisions']),
      ('France Cultural Exchange Initiative', 'fr', 'cultural', 'active', '2023-09-01', '2026-09-01', 'Program for promoting cultural exchange in arts, education, and cuisine', 'First year review completed with positive results', ARRAY['Annual film festival exchanges', 'Culinary arts program', 'Museum exhibit rotations']),
      ('China Manufacturing Cooperative', 'cn', 'trade', 'pending', '2024-06-01', '2029-06-01', 'Agreement on manufacturing standards and trade processes', 'Final terms being negotiated', ARRAY['Supply chain optimization', 'Quality control standards', 'Technology sharing guidelines']),
      ('Brazil Agricultural Partnership', 'br', 'agricultural', 'active', '2023-02-20', '2028-02-20', 'Sustainable agriculture and rainforest preservation agreement', 'Mid-term review scheduled for next month', ARRAY['Sustainable farming practices', 'Deforestation prevention measures', 'Agricultural technology exchange']),
      ('India Technology Development Agreement', 'in', 'technology', 'rejected', '2024-07-01', '2029-07-01', 'Partnership on software development and IT services', 'Rejected due to data security concerns', ARRAY['IT personnel exchange program', 'Joint research initiatives', 'Startup incubator partnerships']),
      ('Canada-US Border Security Agreement', 'ca', 'security', 'active', '2022-11-15', '2027-11-15', 'Comprehensive border security and immigration coordination', 'Annual review completed successfully', ARRAY['Coordinated border patrol operations', 'Shared intelligence framework', 'Emergency response protocols']);
      
    RAISE NOTICE 'Inserted agreements successfully!';
  ELSE
    RAISE NOTICE 'Agreements table already has data, skipping agreement insertion.';
  END IF;

  -- Sample action items
  IF NOT EXISTS (SELECT 1 FROM action_items LIMIT 1) THEN
    INSERT INTO action_items (title, country, status, priority, due_date, assigned_to_id, created_by_id, description)
    VALUES
      ('Schedule Minister Meeting', 'jp', 'pending', 'high', CURRENT_DATE + INTERVAL '10 days', john_id, sarah_id, 'Arrange meeting with Japanese Trade Minister during upcoming summit'),
      ('Draft Trade Proposal', 'gb', 'in_progress', 'medium', CURRENT_DATE + INTERVAL '15 days', michael_id, emily_id, 'Create initial draft of post-Brexit trade proposal'),
      ('Review Cultural Exchange Report', 'fr', 'completed', 'low', CURRENT_DATE - INTERVAL '5 days', emily_id, david_id, 'Review and approve annual report on cultural exchange program'),
      ('Prepare Briefing on Renewable Energy', 'de', 'pending', 'medium', CURRENT_DATE + INTERVAL '7 days', david_id, john_id, 'Prepare briefing on German renewable energy initiatives for senior staff'),
      ('Coordinate Embassy Security Upgrade', 'cn', 'in_progress', 'high', CURRENT_DATE + INTERVAL '30 days', sarah_id, john_id, 'Oversee security system upgrade at Beijing embassy'),
      ('Develop Agricultural Exchange Program', 'br', 'pending', 'medium', CURRENT_DATE + INTERVAL '20 days', john_id, michael_id, 'Create program for agricultural expert exchange with Brazil'),
      ('Analyze Investment Opportunities', 'in', 'in_progress', 'low', CURRENT_DATE + INTERVAL '25 days', michael_id, sarah_id, 'Research and analyze potential investment opportunities in Indian tech sector'),
      ('Prepare Border Security Brief', 'ca', 'completed', 'high', CURRENT_DATE - INTERVAL '3 days', emily_id, david_id, 'Prepare briefing on Canadian border security cooperation for Secretary');
      
    RAISE NOTICE 'Inserted action items successfully!';
  ELSE
    RAISE NOTICE 'Action items table already has data, skipping action item insertion.';
  END IF;

  RAISE NOTICE 'All sample data inserted successfully!';
END
$$; 