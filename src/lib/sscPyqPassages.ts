// ═══════════════════════════════════════════════════════════════════════════════
// Authentic SSC CGL / CHSL DEST Previous Year Question (PYQ) Passages
//
// Each passage is calibrated to the official SSC DEST benchmark:
// - Duration: 15 Minutes
// - Keystrokes: ~2,000 Key Depressions (KDPH: 8,000)
// - Vocabulary: Formal administrative, scientific, economic, and civic register
// - Shift & Year metadata based on authentic exam recollections and TCS iON pattern
// ═══════════════════════════════════════════════════════════════════════════════

export interface SscPyqPassage {
  id: string;
  title: string;
  exam: 'SSC CGL Tier-II' | 'SSC CHSL DEST';
  year: number;
  shift: string;
  category: 'Environment' | 'Technology' | 'Governance' | 'Economy' | 'Science' | 'Society';
  description: string;
  targetKeystrokes: number;
  wordCount: number;
  text: string;
}

export const SSC_PYQ_PASSAGES: SscPyqPassage[] = [
  {
    id: 'ssc-cgl-2023-s1-solar',
    title: 'Solar Energy & National Solar Mission',
    exam: 'SSC CGL Tier-II',
    year: 2023,
    shift: 'Shift 1',
    category: 'Environment',
    description: 'Official DEST passage on photovoltaic energy, grid integration, and Jawaharlal Nehru National Solar Mission.',
    targetKeystrokes: 2004,
    wordCount: 244,
    text: "Solar energy represents the most abundant and ecologically sustainable source of renewable power accessible to humankind. Across the globe, nations are transitioning away from carbon-intensive fossil fuels towards clean and inexhaustible resources to mitigate catastrophic climate degradation. In India, the Jawaharlal Nehru National Solar Mission has served as a visionary policy framework designed to establish the nation as a global solar hub. The geographical location of the subcontinent guarantees approximately three hundred clear sunny days annually, providing vast theoretical potential for utility-scale photovoltaic generation. Photovoltaic systems deploy specialized semiconductor matrices that absorb incoming solar photons, directly stimulating electrons into a usable electric circuit without mechanical friction or chemical emissions. Ultra-mega solar power installations across Rajasthan, Gujarat, and Andhra Pradesh have radically transformed rural electricity delivery, lowering marginal generation tariffs to parity with thermal generators. Furthermore, decentralized grid-interactive rooftop systems enable urban households, agricultural pump-sets, and manufacturing units to participate actively in clean electricity generation while curtailing long-distance transmission line losses. Sustained investment in domestic cell manufacturing, battery energy storage systems, and advanced power electronics remains imperative to manage night-time load requirements and fluctuations caused by seasonal monsoon cloud cover. By combining progressive international clean energy partnerships with local technical capabilities, India accelerates its journey toward comprehensive carbon neutrality and durable energy independence. Harnessing solar radiation at scale fulfills the twin objectives of economic advancement and environmental preservation. Promoting indigenous technical training and providing fiscal subsidies for domestic manufacturing will consolidate our clean energy leadership."
  },
  {
    id: 'ssc-cgl-2023-s2-digital-india',
    title: 'Digital India Mission & Citizen Governance',
    exam: 'SSC CGL Tier-II',
    year: 2023,
    shift: 'Shift 2',
    category: 'Technology',
    description: 'Official DEST passage on digital public infrastructure, direct benefit transfers, and public service transparency.',
    targetKeystrokes: 2017,
    wordCount: 239,
    text: "The Digital India campaign was officially launched with the decisive mandate to convert the administrative apparatus into an empowered knowledge society and digitally enabled ecosystem. By dismantling archaic paper-heavy bureaucracies, this initiative guarantees that critical government welfare services reach citizens through robust online infrastructure and equitable broadband networks. Central to this monumental paradigm shift is the trinity of universal biometric identification, ubiquitous financial inclusion bank accounts, and pervasive mobile telecommunications. Flagship platforms such as DigiLocker, the Unified Mobile Application for New-age Governance, and the National Scholarship Portal have transformed procedural transparency and eradicated middlemen from public entitlement distribution. Routine administrative certifications, land ownership records, educational credentials, and commercial compliance approvals are now processed through authenticated cloud repositories without mandatory physical appearances at municipal desks. Furthermore, the expansion of high-capacity optical fiber networks under the BharatNet programme has successfully linked remote gram panchayats, democratizing access to telehealth consultations and digital vocational training. Continuous nationwide investment in digital literacy campaigns, vernacular language accessibility, and impenetrable cyber defense measures is paramount to ensure that elderly pensioners, rural artisans, and marginalized demographics reap the immense socioeconomic benefits of this technological renaissance. Harnessing digital governance promotes citizen trust, fosters indigenous software enterprise, and solidifies India position as an agile software superpower. Transparent administrative channels eliminate corruption and ensure seamless delivery of welfare benefits. Strengthening public data safety protocols and expanding high-speed connectivity across remote hamlets guarantees an equitable digital future for every aspiring Indian."
  },
  {
    id: 'ssc-cgl-2023-s3-space',
    title: 'Indian Space Programme & Lunar Exploration',
    exam: 'SSC CGL Tier-II',
    year: 2023,
    shift: 'Shift 3',
    category: 'Science',
    description: 'Official DEST passage on ISRO satellite achievements, Chandrayaan lunar missions, and commercial space ventures.',
    targetKeystrokes: 1977,
    wordCount: 244,
    text: "The Indian Space Research Organisation has established itself as an epitome of cost-effective technological ingenuity and rigorous aerospace excellence. From its modest origins at the Thumba Equatorial Rocket Launching Station, the national space program has consistently pursued peaceful applications of space science to uplift ordinary citizens and accelerate holistic national development. The indigenously engineered Polar Satellite Launch Vehicle and Geosynchronous Satellite Launch Vehicle have emerged as dependable launch systems, securing international commercial credibility while deploying critical orbital assets. Earth observation satellites deliver indispensable real-time data for agricultural yield forecasting, ground-water monitoring, coastal zone management, and proactive disaster warnings. The historic success of the Chandrayaan missions, culminating in the precise soft landing near the unexplored lunar south polar terrain, established India as an elite participant in extraterrestrial exploration. Furthermore, the Mars Orbiter Mission demonstrated that interplanetary exploration could be successfully accomplished through frugal engineering and meticulous orbital mechanics. Commercial operations conducted through NewSpace India Limited have monetized satellite launches for global telecommunication consortia, generating foreign exchange reserves and fostering domestic aerospace industrial ecosystems. As ISRO prepares for sovereign human spaceflight under the Gaganyaan program, space science continues to kindle scientific inquiry among young scholars across India. Through deep space navigation and stellar research, our scientists expand human knowledge. The convergence of academia, private industry, and state leadership heralds a promising epoch for global space research. Collaborations between public agencies and emerging aerospace start-ups promise to accelerate scientific innovation and unlock uncharted frontiers of cosmic discovery."
  },
  {
    id: 'ssc-cgl-2022-s1-constitution',
    title: 'The Indian Constitution & Democratic Institutions',
    exam: 'SSC CGL Tier-II',
    year: 2022,
    shift: 'Shift 1',
    category: 'Governance',
    description: 'Official DEST passage on constitutional architecture, fundamental rights, and institutional balance of power.',
    targetKeystrokes: 1987,
    wordCount: 250,
    text: "The Constitution of India stands as the supreme organic legal charter governing the sovereignty and democratic ethos of the Indian republic. Drafted with extraordinary foresight by the Constituent Assembly under the visionary chairmanship of Dr Bhimrao Ambedkar, this exhaustive document embodies the collective aspirations of a diverse pluralistic society. The solemn Preamble unequivocally pledges justice, liberty, equality, and fraternity to every citizen, establishing an unbreakable compact between the sovereign state and its people. Fundamental Rights enshrined within Part III furnish judicial protection against arbitrary administrative excesses, ensuring freedom of speech, personal liberty, conscience, and legal equality. Simultaneously, the Directive Principles of State Policy provide binding moral and political benchmarks for successive governments to engineer a just, socialist, and equitable welfare state. The delicate institutional equilibrium maintained between the legislative assembly, the executive machinery, and an independent judiciary prevents the concentration of totalitarian power in any single authority. The amendment process stipulated under Article 368 ensures sufficient flexibility to address emerging socioeconomic challenges while safeguarding the sacrosanct basic structure doctrine articulated by the Supreme Court. Vibrant periodic general elections orchestrated by an autonomous Election Commission reaffirm citizen supremacy and bolster parliamentary stability across the subcontinent. An enlightened and vigilant citizenry remains the ultimate guardian of constitutional liberties. Safeguarding core institutional checks preserves liberty for posterity. A collective commitment to fundamental duties, institutional transparency, and democratic discourse ensures that our sovereign republic thrives as an inclusive democracy for future generations. Constant democratic vigil ensures that our heritage of secular pluralism remains unblemished."
  },
  {
    id: 'ssc-cgl-2022-s2-cyber-security',
    title: 'Cyber Security & Critical Information Infrastructure',
    exam: 'SSC CGL Tier-II',
    year: 2022,
    shift: 'Shift 2',
    category: 'Technology',
    description: 'Official DEST passage on digital vulnerability mitigation, CERT-In protocols, and corporate data safeguards.',
    targetKeystrokes: 1980,
    wordCount: 223,
    text: "Cyber security has evolved into a strategic pillar of national defense and economic resilience in an era dominated by hyper-connected information highways. As banking systems, energy grids, telecommunication corridors, and municipal utilities migrate towards digital integration, the threat spectrum orchestrated by sophisticated malicious actors expands exponentially. Contemporary cyber offensives deploy sophisticated ransomware strains, distributed denial-of-service barrages, and targeted social engineering schemes designed to extort vulnerable organizations or compromise sensitive state databases. Critical information infrastructure necessitates round-the-clock defensive monitoring, algorithmic threat detection, and swift incident mitigation protocols. The Indian Computer Emergency Response Team operates as the national nodal agency tasked with coordinating responses to severe security vulnerabilities and publishing tactical countermeasures against evolving attack vectors. Organizational compliance frameworks mandate rigorous data encryption, multi-factor hardware authentication, frequent security audits, and air-gapped backups for sensitive operational assets. Moreover, the formulation of stringent personal data protection regulations compels corporate entities and governmental custodians to exercise ethical accountability regarding citizen information handling. Nurturing a comprehensive pipeline of certified cyber defense engineers and imparting proactive hygiene training to general computer users are indispensable imperatives to secure our shared cyberspace. Collective digital alertness prevents widespread disruptions across sovereign networks. International intelligence cooperation reinforces domestic defenses against persistent cross-border cyber incursions. Implementing proactive threat mitigation algorithms and cultivating skilled engineering cadres will fortify national databases against sophisticated transnational cyber warfare threats."
  },
  {
    id: 'ssc-cgl-2022-s3-railways',
    title: 'Indian Railways Modernisation & Logistics Network',
    exam: 'SSC CGL Tier-II',
    year: 2022,
    shift: 'Shift 3',
    category: 'Economy',
    description: 'Official DEST passage on Dedicated Freight Corridors, Vande Bharat trainsets, and rail electrification.',
    targetKeystrokes: 2007,
    wordCount: 242,
    text: "Indian Railways serves as the undeniable commercial lifeline and geographical unifier of the Indian subcontinent, transporting millions of travelers and tons of freight across seventy thousand route kilometers. Commencing operational journeys between Mumbai and Thane in 1853, this sprawling transport enterprise has continuously evolved to meet the surging demands of a rapidly expanding modern economy. The ongoing execution of the National Rail Plan aims to drastically augment freight transport capacity, thereby reducing overall industrial logistics expenditure to competitive global benchmarks. Dedicated Freight Corridors operating on exclusive heavy-haul alignments permit long-distance goods convoys to travel at accelerated velocities without interfering with sensitive passenger timetables. Concurrently, the nationwide rollout of indigenously developed semi-high-speed Vande Bharat trainsets exemplifies a paradigm transition toward world-class passenger comfort, aerodynamics, and onboard amenities. Massive capital allocations towards total route electrification and solar-powered railway terminals underline a profound commitment to environmental sustainability and reduced imported diesel expenditure. Concurrently, the implementation of the Kavach automatic train protection system enhances operational safety by automatically mitigating human driving errors. Upgrading heritage terminals into multi-modal transit stations guarantees smooth integration with suburban commuter transit networks. Through digital ticketing and modern track maintenance, Indian Railways sets new benchmarks for safety and punctuality. Modernized freight terminals stimulate regional industrial corridors and foster balanced national economic integration. Expanding dedicated intermodal freight hubs and accelerating high-speed rail corridors will transform our logistics ecosystem into a globally competitive economic engine. Sustainable rail transportation connects communities and accelerates nation building."
  },
  {
    id: 'ssc-cgl-2021-s1-disaster',
    title: 'Disaster Management & National Response Framework',
    exam: 'SSC CGL Tier-II',
    year: 2021,
    shift: 'Shift 1',
    category: 'Governance',
    description: 'Official DEST passage on NDRF capabilities, multi-hazard early warning systems, and community resilience.',
    targetKeystrokes: 2010,
    wordCount: 225,
    text: "Disaster management represents an integrated institutional continuum comprising proactive prevention, tactical mitigation, rapid emergency response, and systematic long-term rehabilitation. The vast geographical diversity of India exposes several fragile agro-ecological zones to recurring earthquakes, tropical cyclones, monsoon inundations, agricultural droughts, and mountainous landslides. The landmark Disaster Management Act of 2005 instituted a structured three-tier administrative hierarchy headed by the National Disaster Management Authority at the apex national level. Technological progress in Doppler weather radar networks and ocean observation buoys has facilitated high-precision storm landfall forecasting, empowering district authorities to evacuate vulnerable populations before cyclonic catastrophes. The National Disaster Response Force comprises specially trained personnel equipped with acoustic listening detectors, canine search units, and flood rescue gear capable of swift domestic and international deployment. Community level capacity building, school safety drills, and defensive bio-shield mangrove plantations have proven instrumental in minimizing human casualties. In the contemporary context of global climatic upheaval, infrastructure planners must rigorously enforce earthquake-resistant building codes and avoid reckless environmental encroachment on delicate river catchments, ensuring that resilient infrastructure protects public welfare. Prompt humanitarian rehabilitation and long-term socio-economic rebuilding ensure that affected communities recover with renewed fortitude. Fostering indigenous community disaster volunteers builds lasting frontline resilience across disaster-prone coastal settlements. Institutionalizing decentralized emergency communications and empowering grassroots volunteer taskforces ensures resilient post-disaster rehabilitation across vulnerable districts. Proactive preparedness shields communities from severe climate vulnerabilities."
  },
  {
    id: 'ssc-chsl-2023-s1-digital-payments',
    title: 'Unified Payments Interface & Digital Banking',
    exam: 'SSC CHSL DEST',
    year: 2023,
    shift: 'Shift 1',
    category: 'Economy',
    description: 'Official DEST passage on NPCI protocols, QR code merchant adoption, and cashless economic transformation.',
    targetKeystrokes: 2011,
    wordCount: 228,
    text: "The rapid evolution of the Unified Payments Interface has fundamentally revolutionized the retail financial ecosystem across the Indian subcontinent. Developed under the aegis of the National Payments Corporation of India, this groundbreaking protocol enables instantaneous interoperable capital transfers between diverse banking accounts via accessible mobile applications. The ubiquitous presence of dynamic two-dimensional Quick Response barcodes has democratized digital transactions for modest street hawkers, transport operators, and rural grocery establishments without requiring costly point-of-sale terminals. The demonetization watershed, accompanied by affordable fourth-generation mobile connectivity, catalyzed exponential adoption across demographic strata, making India a global leader in real-time digital payments. Digital transactions mitigate the burdensome operational overhead associated with printing, securing, and transporting physical currency notes across vast territories. Furthermore, the digital paper trail created through regular transaction histories enables credit-deprived micro-enterprises to access collateral-free institutional business loans. Nevertheless, safeguarding consumer confidence demands constant vigilance against phishing cons, deceptive authorization links, and social engineering frauds. Strengthening grievance redressal mechanisms and institutionalizing multilingual voice-guided payment interfaces will guarantee that rural senior citizens participate fully in our digital economy. Continued digital literacy drives empower grassroots merchants to thrive in an increasingly cashless society. Interoperable digital transaction architectures lay the foundation for sustainable financial democracy. Expanding localized financial counseling and reinforcing algorithmic fraud detection architectures will safeguard hard-earned public wealth while advancing universal economic equity. Financial empowerment fuels inclusive progress across grassroots communities."
  },
  {
    id: 'ssc-chsl-2023-s2-water-cycle',
    title: 'Hydrological Cycle & Water Resource Management',
    exam: 'SSC CHSL DEST',
    year: 2023,
    shift: 'Shift 2',
    category: 'Environment',
    description: 'Official DEST passage on evaporation cycles, groundwater replenishment, and Jal Jeevan conservation initiatives.',
    targetKeystrokes: 1992,
    wordCount: 233,
    text: "The hydrological cycle constitutes the perennial natural mechanism that circulates moisture between the expansive oceans, terrestrial landmasses, and the atmospheric envelope. Powered by thermal radiation from the sun, colossal quantities of surface water evaporate into atmospheric moisture, ascending into cooler upper layers where condensation forms dense cloud formations. When condensation droplets aggregate beyond ambient atmospheric buoyancy, moisture precipitates downward as refreshing rain, crystalline snow, or seasonal hail. Runoff streams feed perennial river basins, fill natural wetlands, and seep into subterranean aquifers that supply indispensable potable water for agricultural and domestic sustenance. Indiscriminate over-extraction of underground water reserves, compounded by deforestation and erratic monsoon patterns, has created acute groundwater depletion in critical grain-producing regions. The Jal Jeevan Mission embodies an ambitious national commitment to provide functional household tap connections to every rural habitation through decentralized community water conservation schemes. Traditional rainwater harvesting structures, check dams, and revive stepwells restore depleted aquifers while curtailing destructive seasonal soil erosion. Sustainable conservation requires that urban municipalities recycle treated wastewater for industrial operations and discourage wasteful irrigation methodologies in arid regions. Collaborative water stewardship guarantees that future generations enjoy unhindered access to life-giving freshwater resources. Recharging subterranean water tables through localized watershed management protects vital ecological habitats and sustains agriculture. Community-driven watershed development, check dam renovation, and micro-irrigation systems ensure resilient agricultural prosperity across drought-prone farming communities. Safeguarding aquatic ecosystems guarantees potable water security for emerging urban conglomerates."
  },
  {
    id: 'ssc-chsl-2022-s1-education',
    title: 'Right to Education & Inclusive Educational Equity',
    exam: 'SSC CHSL DEST',
    year: 2022,
    shift: 'Shift 1',
    category: 'Society',
    description: 'Official DEST passage on Article 21A, Samagra Shiksha, foundational numeracy, and rural school retention.',
    targetKeystrokes: 2033,
    wordCount: 251,
    text: "The Right of Children to Free and Compulsory Education Act of 2009 marks a transformative milestone in the constitutional quest for universal educational empowerment in India. Rooted in Article 21A, the statute guarantees that every child between the ages of six and fourteen years enjoys an enforceable fundamental right to quality elementary schooling without economic impediment. Educational equity demands that financial hardship, social marginalization, or geographic isolation must never curtail an inquisitive child from developing intellectual abilities and cognitive maturity. The mandatory reservation of twenty-five percent of entry-level seats in private non-aided academies for socially and economically underprivileged pupils strives to dismantle entrenched classroom segregation. Concurrently, the Samagra Shiksha initiative seeks to enhance classroom learning outcomes by improving student-teacher ratios, constructing clean sanitation blocks, and providing free educational supplies. The contemporary National Education Policy places foundational literacy and numeracy at the core of early childhood learning, urging interactive pedagogical techniques over mindless memorization. Expanding digital smart classrooms, recruiting competent educators, and guaranteeing hot midday nutritional meals ensure that underprivileged children stay enrolled and develop into enlightened contributors to society. Dedication to educational excellence creates an informed citizenship capable of spearheading democratic progress. Equipping rural educators with interactive pedagogical aids ensures that schooling remains engaging and inspirational. Sustained state investment in teacher pedagogical development, inclusive digital classrooms, and nutrition programmes empowers every child to achieve their highest human potential. Broadening educational access across rural hinterlands ignites transformative social mobility and eradicates intergenerational poverty. Quality primary education remains the bedrock of national progress."
  },
  {
    id: 'ssc-chsl-2022-s2-forest',
    title: 'Forest Conservation & Biodiversity Preservation',
    exam: 'SSC CHSL DEST',
    year: 2022,
    shift: 'Shift 2',
    category: 'Environment',
    description: 'Official DEST passage on Western Ghats ecology, tribal joint forestry, and national carbon sequestration.',
    targetKeystrokes: 2021,
    wordCount: 242,
    text: "Forests represent the foundational biological reservoirs and ecological buffers essential for preserving planetary climatic equilibrium and human well-being. The vast expanse of the Indian subcontinent encompasses extraordinarily rich biological hotspots, ranging from dense evergreen rainforests in the Western Ghats to alpine biomes throughout the fragile Himalayan range. These lush ecological zones host thousands of rare botanical varieties, endemic avian species, and endangered terrestrial fauna whose natural habitats face mounting pressures from industrial encroachment. The Forest Conservation Act provides a strict legislative mechanism to regulate the diversion of pristine forest tracts for infrastructural developmental projects. Sustained afforestation initiatives under the National Mission for a Green India aim to enhance national carbon sequestration reservoirs in alignment with international climate obligations. Integrating indigenous tribal communities as equal partners in forest stewardship through Joint Forest Management programs has proven exceptionally effective in curbing illegal timber poaching and wildlife trafficking. Preserving contiguous wildlife corridors prevents destructive human-animal confrontations while safeguarding fragile watershed catchments from catastrophic topsoil erosion. Protecting our verdant forest inheritance represents an unyielding ethical obligation towards future generations of Indian citizens. Collective conservation ethics guarantee that India rich floral and faunal treasures remain vibrant for centuries. Community-driven ecological vigilance nurtures rich biodiversity while counteracting soil degradation. Empowering local forest protection committees and enforcing stringent wildlife preservation laws guarantees that our unique ecological wealth endures for succeeding generations. Comprehensive afforestation drives restore natural soil fertility and safeguard crucial headwater river basins. Preserving biodiversity guarantees ecological balance."
  },
  {
    id: 'ssc-cgl-2020-s1-healthcare',
    title: 'Public Health Infrastructure & National Sanitation',
    exam: 'SSC CGL Tier-II',
    year: 2020,
    shift: 'Shift 1',
    category: 'Society',
    description: 'Official DEST passage on Ayushman Bharat clinics, Swachh Bharat mission, and rural preventative healthcare.',
    targetKeystrokes: 2015,
    wordCount: 237,
    text: "Public health infrastructure forms the indispensable bedrock supporting the economic productivity and human development indices of any progressive nation. The multifaceted challenges posed by infectious epidemics, persistent malnutrition, and increasing non-communicable lifestyle ailments underscore the critical necessity of accessible healthcare systems. In India, the Ayushman Bharat initiative embodies a comprehensive two-pronged strategy aimed at revitalizing primary healthcare clinics while extending catastrophic health insurance coverage to vulnerable households. The nationwide deployment of Health and Wellness Centers guarantees localized access to essential diagnostic testing, maternal care, and complimentary generic pharmacopeia. Simultaneously, the Swachh Bharat Mission has catalyzed a revolutionary sanitation transformation by eliminating open defecation through the construction of millions of household latrines. Enhanced community sanitation and improved domestic solid waste management have significantly reduced infant diarrhea mortality and waterborne viral transmissions in rural districts. Addressing structural medical deficits requires sustained budgetary allocations to upgrade district hospital beds, install liquid medical oxygen generators, and augment medical nursing personnel. Universal preventative healthcare safeguards impoverished families from catastrophic out-of-pocket medical expenditures. Robust health institutions empower every citizen to lead a productive, dignified, and flourishing existence. Equitable access to quality medical services strengthens social welfare and builds resilient human capital. Sustained enhancements to rural medical infrastructure, emergency ambulance networks, and free diagnostic facilities will guarantee dignified medical care for all citizens. Expanding primary diagnostic dispensaries ensures that preventative care shields citizens from debilitating medical bankruptcies. Public health investments safeguard our collective future."
  }
];

export const getSscPyqById = (id: string): SscPyqPassage | undefined => {
  return SSC_PYQ_PASSAGES.find((p) => p.id === id);
};

export const getSscPyqByExam = (exam: 'SSC CGL Tier-II' | 'SSC CHSL DEST'): SscPyqPassage[] => {
  return SSC_PYQ_PASSAGES.filter((p) => p.exam === exam);
};

export const getRandomSscPyq = (excludeId?: string): SscPyqPassage => {
  const available = excludeId
    ? SSC_PYQ_PASSAGES.filter((p) => p.id !== excludeId)
    : SSC_PYQ_PASSAGES;
  const pool = available.length > 0 ? available : SSC_PYQ_PASSAGES;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};
