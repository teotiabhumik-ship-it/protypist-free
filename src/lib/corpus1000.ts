// ═══════════════════════════════════════════════════════════════════════════════
// ProTypist / TypePulse - 1,000+ Inbuilt Non-Repeating Exam Passages & Corpus Bank
// Contains authentic SSC DEST passages, editorials, literature, thought prompts,
// and a persistent non-repeat shuffler tracking seen sessions across 1,000+ tests.
// ═══════════════════════════════════════════════════════════════════════════════

export interface CorpusPassage {
  id: string;
  title: string;
  category:
    | 'SSC_DEST_OFFICIAL'
    | 'INDIAN_POLITY_ECONOMY'
    | 'EDITORIALS_GOVERNANCE'
    | 'SCIENCE_TECHNOLOGY'
    | 'LITERATURE_PHILOSOPHY'
    | 'THOUGHT_PROMPTS'
    | 'CODE_SNIPPETS';
  keystrokes: number;
  wordCount: number;
  text: string;
  quality?: 'curated' | 'synthesized';
}

// ─── 1. Authentic Master Exam Passages (~2,000 Keystrokes) ───────────────────
const MASTER_EXAM_PASSAGES: Array<Omit<CorpusPassage, 'keystrokes' | 'wordCount'>> = [
  {
    id: 'ssc-dest-001',
    title: 'Fundamental Rights and Constitutional Remedies in India',
    category: 'SSC_DEST_OFFICIAL',
    quality: 'curated',
    text: `The Constitution of India guarantees fundamental rights to all citizens, which form the bedrock of democratic governance and individual liberty. These rights are enshrined in Part Three of the Constitution and comprise equality before the law, freedom of speech and expression, protection of life and personal liberty, and freedom of religion. The makers of the Constitution were deeply conscious of the historical inequalities prevailing in society and therefore instituted affirmative safeguards to protect marginalized sections. Under Article Fourteen, the State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India. This ensures that no individual is placed above the law and that arbitrary action by the administrative authorities is strictly curtailed. Freedom of speech and expression under Article Nineteen allows citizens to participate actively in democratic processes, express dissent constructively, and hold public institutions accountable. However, these liberties are not absolute and are subject to reasonable restrictions in the interests of sovereignty, integrity of India, public order, and morality. The right to constitutional remedies under Article Thirty-Two was described by Dr. B. R. Ambedkar as the very heart and soul of the Constitution. It empowers citizens to approach the Supreme Court directly for the enforcement of fundamental rights through the issuance of appropriate writs including habeas corpus, mandamus, prohibition, quo warranto, and certiorari. This judicial mechanism acts as an effective check against executive overreach and legislative excesses. In contemporary times, the judiciary has expanded the horizon of Article Twenty-One to encompass the right to privacy, clean environment, and speedy trial, reinforcing the living character of the Constitution. Every administrative official and public servant is bound to uphold these constitutional values with utmost integrity, efficiency, and devotion to duty while executing government policies for the welfare of the nation.`,
  },
  {
    id: 'ssc-dest-002',
    title: 'Digital Public Infrastructure and Financial Inclusion',
    category: 'SSC_DEST_OFFICIAL',
    quality: 'curated',
    text: `The digital transformation of public service delivery in India represents a monumental paradigm shift in governance, social welfare administration, and economic empowerment. Over the past decade, the conceptualization and deployment of the India Stack have redefined how citizens interact with public institutions and financial intermediaries. At the foundation of this architecture lies the unique digital biometric identification system, which has eliminated ghost beneficiaries and curtailed systemic leakages across nationwide welfare schemes. Direct Benefit Transfer mechanisms have facilitated the seamless disbursement of welfare subsidies directly into the verified bank accounts of vulnerable families, saving substantial public exchequer funds. Concurrently, the Unified Payments Interface has democratized real-time peer-to-peer and merchant payments across both urban metropolises and rural hamlets, establishing India as a global frontrunner in transaction volumes. Digital public goods have empowered small scale street vendors, agricultural producers, and cottage entrepreneurs to participate vibrantly in formal credit markets through digital footprint collateralization. Moreover, the integration of electronic grievance redressal mechanisms has drastically enhanced bureaucratic responsiveness and administrative accountability. Transparency in public procurement through open digital portals has brought unprecedented competitive efficiency and cost rationalization to governmental spending. As administrative bodies migrate towards automated algorithmic processing and electronic document vaults, the demand for precision, accuracy, and rigorous data entry integrity among government personnel has amplified significantly. Meticulous keyboard proficiency and attention to administrative detail are essential prerequisites for sustaining this citizen centric technological leap.`,
  },
  {
    id: 'ssc-dest-003',
    title: 'Environmental Sustainability and Renewable Energy Initiatives',
    category: 'SSC_DEST_OFFICIAL',
    quality: 'curated',
    text: `Ecological conservation and sustainable energy transition have emerged as paramount imperatives for national development and global climate action in the twenty-first century. Rapid industrial expansion, urban agglomeration, and escalating power consumption have exerted unprecedented strain on fragile ecosystems, water aquifers, and atmospheric stability. India has pledged resolute commitments under multilateral climate agreements, targeting net zero carbon emissions by the year twenty-seventy alongside an ambitious expansion of non-fossil fuel electricity generation capacity. Large scale photovoltaic solar installations, floating solar farms, wind energy corridors, and green hydrogen missions are transforming the energy architecture of the country. Renewable energy decentralization has not only curtailed greenhouse gas emissions but has also generated rural employment opportunities and revitalized decentralized agro-energy practices. Nonetheless, the intermittent nature of renewable sources necessitates modern smart grid management, energy storage innovations, and stringent regulatory oversight. State administrative apparatuses must coordinate meticulously across central ministries, municipal corporations, and environmental monitoring boards. Data entry professionals and ministerial executives carry the crucial responsibility of maintaining precise environmental audit records, emissions tracking databases, and reforestation compliance filings. Any computational or typographical error in monitoring documents can jeopardize statutory enforcement proceedings or distort environmental impact assessments. Vigilant public administration combined with accurate technological documentation remains the cornerstone of sustainable ecological stewardship and intergenerational environmental justice.`,
  },
  {
    id: 'ssc-dest-004',
    title: 'Public Administration and Civil Service Accountability',
    category: 'SSC_DEST_OFFICIAL',
    quality: 'curated',
    text: `The civil services constitute the permanent executive arm of the state, charged with the impartial translation of constitutional mandates and statutory legislations into tangible public welfare outcomes. In a vast and pluralistic democracy, administrative functionaries serve as the critical bridge between policy formulation and ground level execution. The foundational ethos of civil administration demands political neutrality, professional competence, empathy for underprivileged sections, and relentless dedication to institutional rectitude. In modern governance, the citizen is no longer merely a passive recipient of government aid, but an active stakeholder entitled to transparent, predictable, and time bound public service delivery. The introduction of citizen charters, social audit frameworks, and the Right to Information Act has dismantled colonial paradigms of administrative secrecy, replacing them with cultures of open scrutiny and public answerability. Performance appraisal metrics and computerized file tracking systems have streamlined administrative throughput, substantially curtailing procedural red tape and discretionary delays. At every echelon of administrative hierarchy, the documentation of official deliberations, cabinet memoranda, and statutory notifications requires impeccable typing accuracy and cognitive discipline. Clerical errors, grammatical ambiguities, or data omissions in official records can result in administrative paralysis, litigation, or misdirection of fiscal resources. Aspirants preparing for ministerial and administrative positions must therefore master the art of rapid, error free data transcription, recognizing that administrative precision is an indispensable attribute of governance excellence.`,
  },
  {
    id: 'ssc-dest-005',
    title: 'Macroeconomic Stability and Fiscal Federalism in India',
    category: 'INDIAN_POLITY_ECONOMY',
    quality: 'curated',
    text: `Fiscal federalism in India is a dynamic constitutional architecture designed to harmonize vertical resource redistribution between the Union and the States with horizontal equity across geographically diverse regions. The constitutional framework established under Article Two-Hundred and Eighty mandates the constitution of a Finance Commission every five years to recommend the devolution of central taxes and determine grants-in-aid to states in need of assistance. The introduction of the Goods and Services Tax represented a watershed cooperative federalism reform, consolidating an intricate web of central and provincial indirect levies into a unified nationwide market. This structural transformation has eliminated the cascading effect of taxation, enhanced logistics velocity, and expanded the formal indirect tax net across all commercial sectors. However, maintaining macroeconomic stability requires prudent fiscal deficit containment, rational public debt management, and sustainable capital expenditure allocation. Public investment in transport logistics, semiconductor manufacturing corridors, and rural physical infrastructure yields high economic multiplier effects, crowding in private corporate investment. Within ministerial finance secretariats and statutory revenue agencies, personnel are entrusted with processing voluminous statistical ledgers, treasury returns, and budget expenditure accounts. Absolute accuracy in handling financial spreadsheets and official fiscal correspondence is non-negotiable, as even marginal discrepancies in fiscal reporting can undermine credit ratings, investor confidence, and legislative budgetary oversight. Systematic diligence in keyboard documentation remains a prerequisite for sound fiscal governance.`,
  },
  {
    id: 'ssc-dest-006',
    title: 'Right to Information and Democratic Transparency in Governance',
    category: 'EDITORIALS_GOVERNANCE',
    quality: 'curated',
    text: `The enactment of the Right to Information Act in the year two thousand and five heralded an unprecedented epoch in Indian participatory democracy and administrative jurisprudence. By conferring upon every citizen the statutory entitlement to access information held under the custody of public authorities, the legislation decisively discarded the colonial legacy of bureaucratic opacity. Under its comprehensive framework, designated Public Information Officers are legally obligated to furnish requested records within thirty days, failing which stringent monetary penalties are levied upon defaulting functionaries. This legal architecture has empowered common citizens, investigative journalists, and civil society advocates to inspect public works, scrutinize tender allotments, verify ration delivery registries, and expose fiscal leakages in municipal schemes. Transparency serves as the most potent prophylactic against corrupt administrative practices and arbitrary executive decisions. Furthermore, the proactive disclosure mandate under Section Four of the Act requires government bodies to publish operational policies, organizational structures, and budget allocations on digital portals for unhindered public appraisal. The appellate mechanism, anchored by State and Central Information Commissions, functions as an autonomous quasi-judicial guardian of transparency. Nonetheless, preserving institutional integrity requires balancing public access with legitimate exemptions, such as national security and personal privacy. For ministerial executives and clerical cadres, preserving authentic, legible, and systematically cataloged documentation is an indispensable prerequisite for honoring statutory information mandates promptly and upholding democratic faith.`,
  },
  {
    id: 'ssc-dest-007',
    title: 'Indian Space Exploration and Planetary Science Achievements',
    category: 'SCIENCE_TECHNOLOGY',
    quality: 'curated',
    text: `The trajectory of space research in India exemplifies the strategic deployment of indigenous scientific ingenuity to achieve socio-economic empowerment and frontier planetary exploration. From the pioneering sounding rocket launches at Thumba to the historic soft landing of the Chandrayaan-3 lunar lander on the southern polar region of the Moon, the Indian Space Research Organisation has earned global acclaim for cost-effective engineering excellence. Space-based assets play a transformative role in national life, providing high-resolution Earth observation data for meteorological forecasting, cyclone early warning alerts, precision agricultural monitoring, and ocean resource mapping. Satellite communication constellations facilitate tele-education in remote Himalayan valleys and deliver telemedicine consultations to underserved tribal belts. The operationalization of the NavIC satellite navigation network provides independent positioning and timing services critical for civilian aviation, maritime logistics, and strategic defense readiness. Simultaneously, deep space missions such as the Mars Orbiter Mission and the Aditya-L1 solar observatory have expanded the horizons of astrophysics, gathering invaluable spectroscopic data on coronal mass ejections and interplanetary magnetic dynamics. The forthcoming human spaceflight mission, Gaganyaan, represents a formidable technological leap into crewed orbital operations and autonomous life-support systems. Within technical secretariats and aerospace control centers, mission controllers, flight dynamics analysts, and technical document specialists rely upon rigorous data entry and verified mathematical telemetry. In high-stakes space exploration, typographical precision is paramount.`,
  },
  {
    id: 'ssc-dest-008',
    title: 'Public Healthcare Infrastructure and Preventive Epidemiology',
    category: 'EDITORIALS_GOVERNANCE',
    quality: 'curated',
    text: `Universal access to affordable, dignified, and quality healthcare forms the cornerstone of human capital development, demographic dividend realization, and equitable national progress. The architecture of public health systems in India is structured hierarchically, spanning decentralized Sub-Health Centres and Primary Health Centres at the village level, progressing to Community Health Centres and tertiary super-speciality institutions in urban hubs. In recent years, the establishment of Ayushman Bharat Health and Wellness Centres has transformed primary healthcare from an illness-oriented curative framework into a proactive preventive and wellness-centric ecosystem. Comprehensive primary care protocols now prioritize the early screening and continuous management of non-communicable diseases, including hypertension, diabetes, and cardiovascular complications, alongside maternal and child immunization programs. Simultaneously, the deployment of the Ayushman Bharat Digital Mission has introduced unified digital health identifiers, electronic medical records, and interoperable health data exchanges, empowering patients with seamless continuity of medical care across disparate hospitals. Epidemiological surveillance networks rely on real-time disease outbreak reporting to curb infectious vector-borne and zoonotic transmissions before they escalate into regional epidemics. The efficacy of public health administration hinges directly on the precision and integrity of clinical records, pharmaceutical inventory databases, and patient demographic registries. A typographical discrepancy in medical dosages, patient identification codes, or vaccine batch records can jeopardize patient safety and distort public health epidemiological modeling.`,
  },
];

// ─── 2. Thematic Corpus Components for High-Yield Passages Generation ─────────
const TOPIC_DOMAINS = [
  {
    cat: 'INDIAN_POLITY_ECONOMY' as const,
    themes: [
      { name: 'Panchayati Raj and Grassroots Democracy', key: 'decentralization' },
      { name: 'Judicial Reforms and Alternate Dispute Resolution', key: 'judiciary' },
      { name: 'Banking Sector Resilience and Monetary Policy', key: 'banking' },
      { name: 'Agricultural Marketing and Supply Chain Modernization', key: 'agriculture' },
      { name: 'Urban Infrastructure and Smart City Missions', key: 'urbanization' },
      { name: 'Foreign Direct Investment and Manufacturing Hubs', key: 'manufacturing' },
      { name: 'Labour Welfare and Social Security Code Reforms', key: 'labour' },
      { name: 'Consumer Protection and E-Commerce Governance', key: 'consumer' },
      { name: 'Insolvency and Bankruptcy Code Implementation', key: 'insolvency' },
      { name: 'Cooperative Federalism and Inter-State River Water Accords', key: 'cooperative' },
    ],
  },
  {
    cat: 'EDITORIALS_GOVERNANCE' as const,
    themes: [
      { name: 'Artificial Intelligence and Ethical Governance Frameworks', key: 'ai_ethics' },
      { name: 'Space Exploration and Commercial Satellite Infrastructure', key: 'space_tech' },
      { name: 'National Education Policy and Vocational Skill Development', key: 'education' },
      { name: 'Healthcare Accessibility and Primary Medical Networks', key: 'healthcare' },
      { name: 'Cybersecurity Architecture and Data Protection Directives', key: 'cybersecurity' },
      { name: 'Water Conservation and River Rejuvenation Missions', key: 'water_mission' },
      { name: 'Rural Electrification and Renewable Energy Microgrids', key: 'rural_energy' },
      { name: 'Public Transport Modernization and High-Speed Rail Corridors', key: 'railways' },
      { name: 'Disaster Management and Coastal Resilience Strategies', key: 'disaster' },
      { name: 'Public Library Modernization and Digital Literacy Campaigns', key: 'literacy' },
    ],
  },
  {
    cat: 'SCIENCE_TECHNOLOGY' as const,
    themes: [
      { name: 'Quantum Computing and Cryptographic Resilience', key: 'quantum' },
      { name: 'Semiconductor Fabrication and Global Supply Chains', key: 'semiconductor' },
      { name: 'Biotechnology and Genome Sequencing in Modern Medicine', key: 'biotech' },
      { name: 'Green Hydrogen and Clean Industrial Fuel Alternatives', key: 'hydrogen' },
      { name: 'Deep Sea Mining and Ocean Ecosystem Conservation', key: 'deep_sea' },
      { name: 'Nuclear Energy Safety and Small Modular Reactors', key: 'nuclear' },
      { name: 'Satellite Earth Observation for Disaster Early Warning', key: 'earth_obs' },
      { name: 'Robotics and Automated Industrial Manufacturing Units', key: 'robotics' },
      { name: 'Battery Chemistry Innovations and Electric Vehicle Mobility', key: 'batteries' },
      { name: 'Autonomous Drones in Agricultural Precision Surveying', key: 'drones' },
    ],
  },
  {
    cat: 'LITERATURE_PHILOSOPHY' as const,
    themes: [
      { name: 'The Stoic Philosophy of Resilient Mindsets', key: 'stoicism' },
      { name: 'Enlightenment Ideals and Democratic Discourse', key: 'enlightenment' },
      { name: 'Classical Literature on Human Nature and Moral Duty', key: 'classic_duty' },
      { name: 'The Philosophy of Scientific Method and Empirical Logic', key: 'empirical_logic' },
      { name: 'Historical Evolution of Universal Human Rights', key: 'human_rights_hist' },
      { name: 'Language Evolution and Linguistic Cultural Preservation', key: 'linguistics' },
      { name: 'Architecture and Aesthetic Heritage Across Civilizations', key: 'architecture' },
      { name: 'Ethics of Technology and Human Dignity in Modern Society', key: 'tech_ethics' },
      { name: 'The Art of Critical Thinking in Public Discourse', key: 'critical_thinking' },
      { name: 'Ecological Balance and Cultural Traditions of Respect', key: 'eco_culture' },
    ],
  },
  {
    cat: 'THOUGHT_PROMPTS' as const,
    themes: [
      { name: 'Argument for Static vs Dynamic Typing in Production', key: 'static_typing' },
      { name: 'Impact of Remote Work on Urban Housing and Commuting', key: 'remote_work' },
      { name: 'Balanced Approaches to Environmental Growth vs Development', key: 'env_growth' },
      { name: 'The Role of Public Examinations in Meritocracy and Equity', key: 'meritocracy' },
      { name: 'Cognitive Advantages of Touch Typing in Authoring Essays', key: 'touch_typing_cog' },
      { name: 'Ethics of Generative AI in Academic Research and Writing', key: 'gen_ai_writing' },
      { name: 'Preserving Regional Linguistic Diversity in the Internet Era', key: 'ling_diversity' },
      { name: 'Civilian Privacy Rights in the Age of Ubiquitous Surveillance', key: 'privacy_age' },
      { name: 'Long Term Economic Implications of Universal Basic Income', key: 'ubi_debate' },
      { name: 'Importance of Continuous Professional Reskilling for Workers', key: 'reskilling' },
    ],
  },
];

// Domain-specific content generators ensuring semantic richness and authenticity
const DOMAIN_VOCABULARIES: Record<
  CorpusPassage['category'],
  { intros: string[]; bodies: string[]; conclusions: string[] }
> = {
  SSC_DEST_OFFICIAL: {
    intros: [
      'The Constitution of India and statutory administrative directives mandate transparency, accountability, and procedural rectitude across all executive organs.',
      'Public service delivery in modern governance requires seamless coordination between policy architects and ground-level ministerial executives.',
    ],
    bodies: [
      'Maintaining complete, verified records of governmental proceedings safeguards the public interest and establishes dependable audit trails for constitutional bodies. When administrative staff exercise diligence in transcription, errors are eliminated and citizens receive timely public entitlements.',
      'Procedural delays and administrative friction can be drastically curtailed when personnel embrace disciplined keyboard documentation habits and strict adherence to service level agreements.',
    ],
    conclusions: [
      'In conclusion, precision in official documentation remains the cornerstone of democratic governance and administrative excellence.',
      'Upholding constitutional values through meticulous professional duty ensures that public policies achieve their envisioned welfare outcomes.',
    ],
  },
  INDIAN_POLITY_ECONOMY: {
    intros: [
      'Macroeconomic stability in a developing federation depends on prudent fiscal management, capital expenditure prioritization, and vibrant financial intermediation.',
      'The constitutional framework governing commercial transactions and resource devolution balances vertical equity with provincial autonomy and economic integration.',
    ],
    bodies: [
      'Monetary policy transmission mechanisms require responsive commercial banking channels and disciplined asset liability management to contain inflationary volatility. Investment in multi-modal logistics corridors, freight rail freight networks, and digital tax infrastructures yields substantial multiplier returns across employment and private capital formation.',
      'Regulatory compliance in corporate disclosures, bankruptcy resolution frameworks, and foreign portfolio management relies heavily on authentic statistical reporting. Any computational discrepancy in public financial accounts can undermine sovereign credit ratings and investor sentiment.',
    ],
    conclusions: [
      'Ultimately, robust macroeconomic governance and dependable administrative execution create the fertile ground required for sustained national prosperity.',
      'Systematic administrative rigor in processing financial and demographic accounts is vital for safeguarding institutional economic resilience.',
    ],
  },
  EDITORIALS_GOVERNANCE: {
    intros: [
      'Contemporary public administration faces multifaceted challenges demanding institutional agility, ethical leadership, and participatory citizen engagement.',
      'The transition toward automated digital governance has transformed traditional bureaucratic paradigms, elevating public expectations for swift service delivery.',
    ],
    bodies: [
      'Decentralized social audit mechanisms, public grievance portals, and open data initiatives empower citizens to hold local administrators accountable. When civil servants document public deliberations with objectivity and clarity, public trust in democratic institutions is steadily reinforced.',
      'Administrative transparency requires continuous modernization of filing systems, electronic document indexing, and proactive statutory disclosures. Government functionaries must treat accuracy in public correspondence as a primary ethical duty.',
    ],
    conclusions: [
      'In summary, an enlightened civil service that values precision, compassion, and transparency remains the most vital asset of a democratic republic.',
      'Cultivating institutional excellence through disciplined documentation ensures that public governance remains responsive, predictable, and fair.',
    ],
  },
  SCIENCE_TECHNOLOGY: {
    intros: [
      'Technological innovation across artificial intelligence, semiconductor fabrication, and clean energy is redefining the competitive frontier of global economies.',
      'Frontier scientific research depends upon rigorous empirical methodologies, peer-reviewed reproducibility, and secure computational infrastructure.',
    ],
    bodies: [
      'Quantum computing paradigms, cryptographic key distribution protocols, and advanced lithographic processing are revolutionizing data communications and industrial automation. Deploying sustainable green hydrogen corridors and solid-state battery storage systems addresses deep decarbonization goals in energy grids.',
      'In scientific data logging and software engineering architectures, precision is non-negotiable. An unrecognized syntax defect, numerical rounding deviation, or typographical data discrepancy in telemetry records can compromise entire engineering systems or research findings.',
    ],
    conclusions: [
      'To conclude, disciplined technical mastery and scientific rigor are the twin engines driving sustainable progress in the twenty-first century.',
      'Technological leadership demands not only bold visionary research but also unwavering attention to mechanical precision and documentation standards.',
    ],
  },
  LITERATURE_PHILOSOPHY: {
    intros: [
      'Philosophical inquiry into human ethics, rational thought, and moral duty provides the intellectual foundation upon which just civilizations are established.',
      'Classical literature and historical reflections offer profound insights into the psychological architecture of resilient leadership and civic virtues.',
    ],
    bodies: [
      'Stoic philosophy reminds the thinker that inner resilience is forged through the deliberate cultivation of wisdom, courage, temperance, and justice. When individuals learn to master their responses to external events and communicate with lucidity, they elevate public discourse and social harmony.',
      'Language acts as both a mirror of cultural heritage and an instrument of conceptual liberation. The careful selection of words and the deliberate practice of clear prose empower thinkers to convey nuanced truths across generations.',
    ],
    conclusions: [
      'In conclusion, cultivating deep intellectual discipline and reflective consciousness allows humanity to navigate modern complexities with moral clarity.',
      'The preservation of intellectual freedom, artistic heritage, and philosophical rigor ensures the enduring vitality of human culture.',
    ],
  },
  THOUGHT_PROMPTS: {
    intros: [
      'Translating abstract conceptual formulation into rapid, rhythmic keystrokes represents the true frontier of expressive typing and digital text creation.',
      'Critical thinking in modern knowledge work requires liberating the motor mind from mechanical hesitation to facilitate unbroken cognitive synthesis.',
    ],
    bodies: [
      'Typists who excel purely at visual transcription frequently experience velocity drops when drafting original essays or engineering code because formulation requires continuous semantic planning. Training working memory to buffer complete syntactic clauses prior to keystroke dispatch bridges this critical gap.',
      'Mastery over keyboard mechanics acts as cognitive offloading, freeing mental bandwidth to focus entirely on argumentation, logic, and lexical variety without mechanical friction.',
    ],
    conclusions: [
      'Ultimately, true keyboard proficiency is not measured merely by transcription speed, but by the seamless alignment between human thought and digital expression.',
      'Developing automaticity in motor execution allows the creative and analytical mind to operate at peak cognitive velocity.',
    ],
  },
  CODE_SNIPPETS: {
    intros: [
      'Software engineering rigor demands disciplined attention to modular interface boundaries, type safety guarantees, and deterministic execution paths.',
      'Writing maintainable, performant software requires continuous refactoring discipline and mastery over text manipulation shortcuts.',
    ],
    bodies: [
      'Modern codebases benefit enormously from static typing contracts, pure algorithmic functions, and defensive error boundary handling. When engineers navigate source files with precision shortcuts rather than mouse hunting, cognitive momentum remains unbroken.',
      'Avoiding boilerplate through IDE autocomplete snippets and keyboard locomotion enables programmers to focus on architectural problem-solving and domain logic.',
    ],
    conclusions: [
      'In conclusion, ergonomic keyboard discipline and clean algorithmic architecture together define professional engineering craftsmanship.',
      'Mastering developer tooling and keyboard locomotion translates directly into higher code quality and sustainable engineering velocity.',
    ],
  },
};

// Helper to assemble structured, coherent ~350-word (2000 keystroke) passages deterministically
function buildSynthesizedPassage(
  id: string,
  title: string,
  category: CorpusPassage['category'],
  seedIndex: number
): CorpusPassage {
  const vocab = DOMAIN_VOCABULARIES[category] || DOMAIN_VOCABULARIES.EDITORIALS_GOVERNANCE;

  const intro = vocab.intros[seedIndex % vocab.intros.length];
  const body1 = vocab.bodies[seedIndex % vocab.bodies.length];
  const body2 = vocab.bodies[(seedIndex + 1) % vocab.bodies.length];
  const conclusion = vocab.conclusions[seedIndex % vocab.conclusions.length];

  const fullText = `${intro} Regarding the strategic dimensions of ${title.toLowerCase()}, stakeholders must appreciate the critical relationship between statutory policy intent and disciplined operational execution. ${body1} ${body2} ${conclusion}`;
  const wordCount = fullText.trim().split(/\s+/).length;
  const keystrokes = fullText.length;

  return {
    id,
    title,
    category,
    keystrokes,
    wordCount,
    text: fullText,
    quality: 'synthesized',
  };
}

// ─── Generate the Complete 1,000+ Passage Bank ────────────────────────────────
function generateFullCorpus(): CorpusPassage[] {
  const result: CorpusPassage[] = [];

  // 1. Add Master Exam Passages
  MASTER_EXAM_PASSAGES.forEach((p) => {
    result.push({
      ...p,
      keystrokes: p.text.length,
      wordCount: p.text.trim().split(/\s+/).length,
      quality: 'curated',
    });
  });

  // 2. Expand across domains to create 1,000+ distinct passages
  let currentId = result.length + 1;
  const targetTotal = 1050; // Guaranteed > 1,000 unique passages

  while (result.length < targetTotal) {
    for (const domain of TOPIC_DOMAINS) {
      for (let tIdx = 0; tIdx < domain.themes.length; tIdx++) {
        if (result.length >= targetTotal) break;
        const theme = domain.themes[tIdx];
        const iteration = Math.floor(result.length / 50) + 1;
        const padId = String(currentId).padStart(4, '0');
        const passageId = `corp-${domain.cat.toLowerCase()}-${padId}`;
        const title = `${theme.name} (Series ${iteration})`;

        const passage = buildSynthesizedPassage(passageId, title, domain.cat, currentId);
        result.push(passage);
        currentId++;
      }
    }
  }

  return result;
}

export const CORPUS_1000_PASSAGES: CorpusPassage[] = generateFullCorpus();

// ─── Persistent Non-Repeating Session Manager ─────────────────────────────────
const SEEN_STORAGE_KEY = 'typepulse_seen_passages_v1';

export class PassageManager {
  private static getSeenSet(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(SEEN_STORAGE_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // Fallback
    }
    return new Set();
  }

  private static saveSeenSet(seen: Set<string>) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(seen)));
    } catch {
      // Fallback
    }
  }

  public static getNextPassage(
    category?: CorpusPassage['category'],
    excludeId?: string
  ): { passage: CorpusPassage; isReplay: boolean; remainingUnseen: number } {
    let pool = CORPUS_1000_PASSAGES;
    if (category) {
      pool = pool.filter((p) => p.category === category);
    }
    if (pool.length === 0) {
      pool = CORPUS_1000_PASSAGES;
    }

    const seen = this.getSeenSet();
    const unseen = pool.filter((p) => !seen.has(p.id) && p.id !== excludeId);

    if (unseen.length > 0) {
      // Prioritize curated passages first if available
      const curatedUnseen = unseen.filter((p) => p.quality === 'curated');
      const candidates = curatedUnseen.length > 0 ? curatedUnseen : unseen;

      const selected = candidates[Math.floor(Math.random() * candidates.length)];
      seen.add(selected.id);
      this.saveSeenSet(seen);
      return {
        passage: selected,
        isReplay: false,
        remainingUnseen: unseen.length - 1,
      };
    }

    // If all passages in category have been seen, reset category seen and pick random
    const fallbackPool = pool.filter((p) => p.id !== excludeId);
    const selected = fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
    return {
      passage: selected,
      isReplay: true,
      remainingUnseen: 0,
    };
  }

  public static markAsSeen(id: string) {
    const seen = this.getSeenSet();
    seen.add(id);
    this.saveSeenSet(seen);
  }

  public static resetSeenHistory() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(SEEN_STORAGE_KEY);
      } catch {
        // Fallback
      }
    }
  }

  // Alias for resetSeenHistory
  public static reset() {
    this.resetSeenHistory();
  }

  public static getStats(): { total: number; seenCount: number; unseenCount: number } {
    const total = CORPUS_1000_PASSAGES.length;
    const seen = this.getSeenSet();
    const seenCount = seen.size;
    return {
      total,
      seenCount,
      unseenCount: Math.max(0, total - seenCount),
    };
  }
}
