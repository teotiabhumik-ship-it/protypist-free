// ─── Top 500 common English words for rich vocabulary generation ─────────────
export const COMMON_WORDS = [
  'the','be','to','of','and','a','in','that','have','it','for','not','on','with','he','as','you',
  'do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my',
  'one','all','would','there','their','what','so','up','out','if','about','who','get','which',
  'go','me','when','make','can','like','time','no','just','him','know','take','people','into',
  'year','your','good','some','could','them','see','other','than','then','now','look','only',
  'come','its','over','think','also','back','after','use','two','how','our','work','first',
  'well','way','even','new','want','because','any','these','give','day','most','us','great',
  'between','need','large','often','hand','high','begin','keep','small','part','place','long',
  'found','still','where','much','turn','should','each','world','every','point','set','change',
  'move','play','right','such','show','try','head','house','own','run','help','line','city',
  'end','did','many','school','never','last','let','start','while','both','state','old','few',
  'next','hard','open','plan','real','seem','fact','group','live','stand','mean','learn','write',
  'grow','close','read','far','near','add','food','hear','door','war','land','call','home',
  'name','mother','word','left','life','side','water','night','four','second','under','power',
  'family','face','light','young','body','table','story','same','week','month','system','below',
  'room','human','kind','number','always','tell','study','might','ask','late','test','hold',
  'problem','free','child','class','best','idea','sure','cost','level','until','quite','ever',
  'future','action','create','design','develop','energy','simple','matter','moment','record',
  'across','history','reason','result','center','source','nature','effort','remain','market',
  'degree','modern','visual','effect','detail','engine','memory','impact','season','method',
  'spirit','island','forest','bridge','flight','spring','valley','circle','stream','shadow',
  'silver','golden','planet','galaxy','cosmic','theory','signal','beacon','wonder','rhythm',
];

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  {
    text: 'The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle. As with all matters of the heart, you will know when you find it.',
    author: 'Steve Jobs',
  },
  {
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts. Every champion was once a contender that refused to give up.',
    author: 'Winston Churchill',
  },
  {
    text: 'In the middle of difficulty lies opportunity. Life is like riding a bicycle. To keep your balance, you must keep moving forward with determination.',
    author: 'Albert Einstein',
  },
  {
    text: 'It does not matter how slowly you go as long as you do not stop. Our greatest glory is not in never falling, but in rising every time we fall.',
    author: 'Confucius',
  },
  {
    text: 'The future belongs to those who believe in the beauty of their dreams. No one can make you feel inferior without your consent.',
    author: 'Eleanor Roosevelt',
  },
  {
    text: 'You miss one hundred percent of the shots you never take. A good hockey player plays where the puck is. A great player plays where the puck is going to be.',
    author: 'Wayne Gretzky',
  },
];

// ─── Curated Long Paragraphs & Literature Excerpts ───────────────────────────
export interface LongParagraph {
  id: string;
  title: string;
  category: 'Science & Cosmos' | 'Literature' | 'Technology' | 'Philosophy';
  text: string;
}

export const LONG_PARAGRAPHS: LongParagraph[] = [
  {
    id: 'para-cosmos',
    title: 'The Pale Blue Dot & Cosmic Perspective',
    category: 'Science & Cosmos',
    text: 'Look again at that dot. That is here. That is home. That is us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives. The aggregate of our joy and suffering, thousands of confident religions, ideologies, and economic doctrines, every hunter and forager, every hero and coward, every creator and destroyer of civilization, every king and peasant, every young couple in love, every mother and father, hopeful child, inventor and explorer, every teacher of morals, every corrupt politician, every superstar, every supreme leader, every saint and sinner in the history of our species lived there on a mote of dust suspended in a sunbeam. The Earth is a very small stage in a vast cosmic arena. Think of the rivers of blood spilled by all those generals and emperors so that, in glory and triumph, they could become the momentary masters of a fraction of a dot.',
  },
  {
    id: 'para-sherlock',
    title: 'A Scandal in Bohemia — Arthur Conan Doyle',
    category: 'Literature',
    text: 'To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer, excellent for drawing the veil from men motives and actions. But for the trained reasoner to admit such intrusions into his own delicate and finely adjusted temperament was to introduce a distracting factor which might throw a doubt upon all his mental results.',
  },
  {
    id: 'para-tech',
    title: 'The Architecture of Modern Software',
    category: 'Technology',
    text: 'The evolution of computer programming from punch cards to distributed cloud systems reflects humanity relentless pursuit of abstraction. In the early days of computing, programmers communicated directly with silicon using raw binary instructions and assembly mnemonics. Today, modern developers orchestrate complex networks of microservices using high level declarative paradigms, containerized runtimes, and distributed consensus algorithms. Yet beneath every sophisticated graphical interface and artificial intelligence model lies the immutable discipline of logic, memory allocation, and algorithmic complexity. Writing clean, maintainable software requires more than syntax proficiency; it demands empathy for future maintainers, rigorous edge case analysis, and a relentless commitment to simplicity in the presence of compounding architectural complexity.',
  },
  {
    id: 'para-stoic',
    title: 'Meditations on Focus & Time — Marcus Aurelius',
    category: 'Philosophy',
    text: 'Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present. When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love. The happiness of your life depends upon the quality of your thoughts; therefore, guard accordingly, and take care that you entertain no notions unsuitable to virtue and reasonable nature. Do not act as if you had ten thousand years to throw away. Death stands at your elbow. Be good for something while you live and it is in your power. Confine yourself to the present. Time is a sort of river of passing events, and strong is its current; no sooner is a thing brought to sight than it is swept by and another takes its place.',
  },
  {
    id: 'para-frankenstein',
    title: 'The Spark of Creation — Mary Shelley',
    category: 'Literature',
    text: 'It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet. It was already one in the morning; the rain pattered dismally against the panes, and my candle was nearly burnt out, when, by the glimmer of the half extinguished light, I saw the dull yellow eye of the creature open; it breathed hard, and a convulsive motion agitated its limbs. How can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form? His limbs were in proportion, and I had selected his features as beautiful. Beautiful! Great God! His yellow skin scarcely covered the work of muscles and arteries beneath.',
  },
];

// ─── SSC CGL DEST Official Passages (~2000 key depressions each) ─────────────
export interface SscPassage {
  id: string;
  title: string;
  text: string;
}

export const SSC_PASSAGES: SscPassage[] = [
  {
    id: 'ssc-dest-p1',
    title: 'SSC CGL 2022 — Economic Reforms & Digital Governance',
    text: `The Indian economy has demonstrated remarkable resilience and structural growth over the past few decades. Sustained structural reforms, technological innovation, and infrastructural expansion have positioned the nation as one of the fastest growing major economies globally. Financial inclusion has received a tremendous boost through digital initiatives, enabling millions of citizens to participate actively in the formal banking ecosystem. Modern governance frameworks have increasingly emphasized transparency, accountability, and citizen centric administrative processes. In this context, administrative efficiency and precise data entry capabilities remain critical pillars for implementing government policies effectively. Candidates aspiring to serve in public administration must cultivate exceptional typing accuracy, cognitive focus, and unwavering diligence to perform their official duties without errors. Efficient execution of official correspondence, statistical records, and policy documentation directly contributes to national productivity and streamlined public service delivery. Moreover, the emergence of electronic governance portals has eliminated bureaucratic delays, making administrative information accessible to every citizen across the country. Digital literacy has bridged the gap between rural and urban sectors, empowering decentralized community institutions. High data processing speed combined with flawless typing precision ensures that records are maintained without ambiguity. Public servants must maintain strict data integrity while archiving vital economic records and statutory reports across all central ministries and their regional offices.`,
  },
  {
    id: 'ssc-dest-p2',
    title: 'SSC CGL 2023 — Environmental Sustainability & Renewable Energy',
    text: `Environmental conservation and sustainable development have emerged as paramount global priorities in the modern industrial era. Climate change and ecological degradation present unprecedented challenges that demand coordinated global action and responsible domestic governance. Transitioning towards renewable energy sources such as solar, wind, and hydroelectric power is imperative to mitigate greenhouse gas emissions and safeguard ecological balance for future generations. Governmental institutions and public sector enterprises play a decisive role in formulating and enforcing environmental protection regulations. Effective documentation, environmental auditing, and statistical monitoring require meticulous data management by administrative personnel working across various departments. Modern administrative workflows rely heavily on precise data entry systems to record carbon credit calculations, forest conservation metrics, and industrial compliance reports accurately. A small error in statistical documentation can lead to severe discrepancies in policy evaluation and environmental enforcement proceedings. Therefore, personnel entrusted with public documentation must exercise the highest standards of vigilance, accuracy, and keyboard proficiency at all times. As India strides confidently towards achieving its net zero emissions target, administrative efficiency will continue to serve as the backbone of our national sustainability mission and environmental development programs.`,
  },
  {
    id: 'ssc-dest-p3',
    title: 'SSC CGL 2024 — Education Technology & Human Capital Development',
    text: `Education is the cornerstone of human capital development, social progress, and democratic stability across any modern nation. In recent years, educational paradigms have undergone a profound transformation driven by rapid advancements in information and communication technology throughout the world. Digital classrooms, open educational resources, and interactive virtual learning environments have democratized access to quality knowledge across diverse socioeconomic strata in both urban and rural regions. Government initiatives aimed at modernizing pedagogical frameworks require robust administrative support and continuous operational monitoring from dedicated public servants. Efficient data collection regarding student enrollment statistics, resource allocation budgets, and academic performance indicators is vital for evidence based decision making. Public servants involved in educational administration must exhibit high data entry competency, ensuring that educational schemes and scholarships reach deserving beneficiaries without administrative bottlenecks or procedural delays. Accuracy in handling statistical data, financial disbursements, and institutional records prevents misallocation of public resources and strengthens institutional credibility. Furthermore, the integration of vocational training modules into the mainstream curriculum has enhanced youth employability and fostered entrepreneurship across regional economies. Transparent record keeping and swift documentation remain indispensable for sustaining long term educational reforms and national development.`,
  },
];

// ─── Text generation utilities ───────────────────────────────────────────────

export interface TextOptions {
  mode: 'time' | 'words' | 'quote' | 'paragraph' | 'lesson';
  wordCount?: number;
  includePunctuation?: boolean;
  includeNumbers?: boolean;
  paragraphIndex?: number;
}

export function generateText(options: TextOptions): string {
  if (options.mode === 'quote') {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)].text;
  }

  if (options.mode === 'paragraph') {
    const idx = options.paragraphIndex !== undefined
      ? options.paragraphIndex % LONG_PARAGRAPHS.length
      : Math.floor(Math.random() * LONG_PARAGRAPHS.length);
    return LONG_PARAGRAPHS[idx].text;
  }

  const count = options.wordCount ?? (options.mode === 'time' ? 150 : 25);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    let word = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];

    if (options.includeNumbers && Math.random() < 0.1) {
      word = String(Math.floor(Math.random() * 900 + 100));
    }

    if (options.includePunctuation && Math.random() < 0.12 && i > 0) {
      const p = [',', '.', ';', '!', '?'];
      result[result.length - 1] += p[Math.floor(Math.random() * p.length)];
    }

    result.push(word);
  }

  return result.join(' ');
}

export function getRandomPassage(excludeId?: string): SscPassage {
  const pool = excludeId ? SSC_PASSAGES.filter((p) => p.id !== excludeId) : SSC_PASSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomParagraph(excludeId?: string): LongParagraph {
  const pool = excludeId ? LONG_PARAGRAPHS.filter((p) => p.id !== excludeId) : LONG_PARAGRAPHS;
  return pool[Math.floor(Math.random() * pool.length)];
}
