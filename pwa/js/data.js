// M.I.K.A - Complete Content Data

// ===== ARALIN 1 =====
const ARALIN_1 = [
  {
    id: 'aktibiti1',
    title: 'Aktibiti 1',
    subtitle: 'Alamin',
    type: 'image-audio',
    bg: 'assets/images/aktibiti1-bg.png',
    bgWidth: 1536, bgHeight: 1024,
    audio: 'assets/audio/aktibiti1.m4a',
    audioX: 56.583, audioY: 85.474
  },
  {
    id: 'aktibiti2',
    title: 'Aktibiti 2',
    subtitle: 'Tuklasin',
    type: 'hotspots',
    instruction: 'Panuto: Pindutin ang larawan upang malaman ang angkop na salita, kahulugan, at pangungusap.',
    hotspots: [
      {
        img: 'assets/images/act2-1.png',
        title: 'LUMBAY',
        content: 'Kahulugan: Matinding kalungkutan\n\nPangungusap: Ramdam niya ang lumbay habang nakaupo.'
      },
      {
        img: 'assets/images/act2-2.png',
        title: 'NANGANGAMBA',
        content: 'Kahulugan: Nakararamdam ng takot\n\nPangungusap: Nangangamba ako dahil sa paparating na bagyo.'
      }
    ]
  },
  {
    id: 'aktibiti2_2',
    title: 'Aktibiti 2.2',
    subtitle: 'Tuklasin',
    type: 'hotspots',
    instruction: 'Panuto: Pindutin ang larawan upang malaman ang angkop na salita, kahulugan, at pangungusap.',
    hotspots: [
      {
        img: 'assets/images/act2.2.-1.png',
        title: 'Pagliyag',
        content: 'Kahulugan: Pagkagusto o paghanga sa isang tao o bagay.\n\nHalimbawa: Nakaramdam si Juana ng pagliyag kay Don Juan.'
      },
      {
        img: 'assets/images/act2.2-2.png',
        title: 'Hungkag',
        content: 'Kahulugan: Walang laman o pakiramdam na walang kabuluhan.\n\nHalimbawa: Naging hungkag ang kanyang pakiramdam dahil sa panagimpan.'
      },
      {
        img: 'assets/images/act2.2-3.png',
        title: 'Malasutla',
        content: 'Kahulugan: Makinis at malambot na parang seda.\n\nHalimbawa: Malasutla ang buhok ni Maria Blanca matapos suklayin.'
      }
    ]
  },
  {
    id: 'aktibiti3',
    title: 'Aktibiti 3',
    subtitle: 'Unawain',
    type: 'drag-drop',
    instruction: 'Basahin ang pangungusap punan ng akmang salita upang makumpleto ang diwa. I-drag ang salita sa patlang.',
    words: ['Mapanglaw', 'Nangangamba', 'Hungkag', 'Malasutla', 'pagliyag'],
    slides: [
      {
        sentences: [
          { parts: ['1. Ipinakita niya ang kanyang ', ' sa magulang sa pamamagitan ng paggalang at pagtulong sa bahay.'], correct: 'pagliyag' },
          { parts: ['2. Naging ', ' ang kanyang pakiramdam dahil sa panaginip.'], correct: 'Hungkag' },
          { parts: ['3. ', ' ang buhok ni Maria Blanca matapos suklayin.'], correct: 'Malasutla' },
          { parts: ['4. ', ' ako dahil sa paparating na bagyo.'], correct: 'Nangangamba' },
          { parts: ['5. ', ' ang pakiramdam ng buong pamilya nang mabalitaan ang lungkot na balita.'], correct: 'Mapanglaw' }
        ]
      }
    ]
  },
  {
    id: 'aktibiti4',
    title: 'Aktibiti 4',
    subtitle: 'Subukin',
    type: 'quiz',
    questions: [
      {
        text: 'Ito ay nangangahulugang walang laman; walang saysay o kabuluhan.',
        choices: ['hungkag', 'walang pakinabang', 'walang gamit'],
        correct: 0
      },
      {
        text: 'Ito ay nangangahulugang pagmamahal o pagkagusto sa isang tao o bagay; pagkahumaling.',
        choices: ['pagliyag', 'pangarap', 'pagnanasa'],
        correct: 0
      },
      {
        text: 'Ito ay nangangahulugang makinis at malambot tulad ng sutla.',
        choices: ['malasutla', 'malambot', 'kahalihalina'],
        correct: 0
      },
      {
        text: 'Ito ay nangangahulugang nakararamdam ng takot o pag-aalala; nababahala.',
        choices: ['nangangamba', 'nangingilabot', 'nagdaramdam'],
        correct: 0
      },
      {
        text: 'Ito ay nangangahulugang malungkot, malamlam, o walang kasiyahan ang damdamin o kapaligiran.',
        choices: ['mapanglaw', 'masalimuot', 'nagdurusa'],
        correct: 0
      }
    ]
  },
  {
    id: 'aktibiti5',
    title: 'Aktibiti 5',
    subtitle: 'Gamitin',
    type: 'drag-drop',
    instruction: 'Basahin ang maikling kuwento at punan ng tamang salita ang mga patlang. I-drag ang salita sa patlang.',
    words: ['mangamba', 'mapanglaw', 'hungkag', 'malasutla', 'pagliyag'],
    slides: [
      {
        words: ['pagliyag', 'malasutla', 'hungkag'],
        sentences: [
          { image: 'assets/images/act5-3.png', parts: ['Tuwing hapon, sa ilalim ng lumang mangga sa kanilang bakuran, madalas magbasa ng libro si Lira. Mahilig niyang hawakan ang kanyang ', ' at mahabang buhok habang iniisip ang mga pangarap niya sa buhay.'], correct: 'malasutla' }
        ]
      },
      {
        words: ['pangamba', 'mapanglaw', 'pagliyag'],
        sentences: [
          { image: 'assets/images/act5-4.png', parts: ['Isang araw, napansin niyang tila nag-iiba na ang nararamdaman niya para kay Marco, ang bago nilang kaklase. Hindi niya maipaliwanag ang kakaibang ', ' na kanyang nararamdaman. Sa tuwing magngingitian sila, para bang lumiliwanag ang kanyang mundo.'], correct: 'pagliyag' }
        ]
      },
      {
        words: ['mangamba', 'mapanglaw', 'hungkag'],
        sentences: [
          { image: 'assets/images/act5-5.png', parts: ['Ngunit isang linggo ang lumipas, hindi pumasok si Marco. Nagsimulang ', ' si Lira. Marami siyang naiisip may sakit kaya ito o lumipat na ng paaralan?'], correct: 'mangamba' },
          { parts: ['Habang nakaupo siya muli sa ilalim ng mangga, tila naging ', ' ang paligid. Kahit ang huni ng mga ibon ay parang malungkot sa kanyang pandinig.'], correct: 'mapanglaw' }
        ]
      },
      {
        words: ['mangamba', 'hungkag', 'pagliyag'],
        sentences: [
          { image: 'assets/images/act5-6.png', parts: ['Nang mabalitaan niyang lilipat na pala ng tirahan si Marco, pakiramdam ni Lira ay may bahagi ng kanyang puso ang naging ', '. Ngunit naunawaan niyang minsan, ang pagliyag ay hindi palaging nagtatapos sa saya. Ito rin ay nagtuturo ng pagtanggap at paglago.'], correct: 'hungkag' }
        ]
      }
    ]
  }
];

// ===== ARALIN 2 =====
const ARALIN_2 = [
  {
    id: 'a2_aktibiti1',
    title: 'Aktibiti 1',
    subtitle: 'Basahin at Unawain',
    type: 'poem-audio',
    instruction: 'Basahin ang isang tula at bigyang pansin ang mga nakadiing salita.',
    poemTitle: 'Sa Landas ng Pangarap',
    audio: 'assets/audio/aralin2-aktibiti1.mp3',
    stanzas: [
      {
        lines: [
          { text: 'Sa simula ng aking ', bold: 'pakikipagsapalaran,' },
          { text: 'Baon ang tapang at pag-asang tangan;' },
          { text: 'Ngunit may mga taong ', bold: '\u2018di maginoo,' },
          { text: 'Na humahadlang sa aking mithiing totoo.' }
        ]
      },
      {
        lines: [
          { text: 'Isang ', bold: 'balintuna', after: ' ang aking natuklasan,' },
          { text: 'Habang ako\u2019y tumutulong, ako\u2019y hinusgahan;' },
          { text: 'Sa bigat ng suliranin ako\u2019y ', bold: 'dumaing,' },
          { text: 'Ngunit hindi sumuko sa hamon ng hangin.' }
        ]
      },
      {
        lines: [
          { text: 'Sa huli\u2019y aking natamo ang tagumpay,' },
          { text: 'Pagkilala\u2019t tuwa\u2019y aking napag-alay;' },
          { text: 'At bilang tanda ng wagas na pagsinta,' },
          { text: 'Isang mainit na ', bold: 'hagkan', after: ' ang gantimpala.' }
        ]
      }
    ]
  }
];

// ===== LESSONS REGISTRY =====
const LESSONS = {
  aralin1: { title: 'Aralin 1', activities: ARALIN_1 },
  aralin2: { title: 'Aralin 2', activities: ARALIN_2 }
};

// Default - starts with Aralin 1
let ACTIVITIES = ARALIN_1;
