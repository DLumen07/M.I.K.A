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
    instruction: 'Panuto: Basahin ang bawat tanong at piliin ang tamang sagot mula sa mga pagpipilian.',
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
  },
  {
    id: 'a2_aktibiti2',
    title: 'Aktibiti 2',
    subtitle: 'Pagtatapat ng Kahulugan',
    type: 'word-match',
    instruction: 'Tukuyin ang kahulugan ng sumusunod na mga salita. Piliin ang salita at itapat sa tamang kahulugan nito.',
    pairs: [
      {
        word: '\u2018Di maginoo',
        definition: 'Hindi nagpapakita ng mabuting asal o pag-uugaling marangal.'
      },
      {
        word: 'Balintuna',
        definition: 'Isang pahayag o sitwasyon na tila magkasalungat ngunit may mas malalim na kahulugan; may pagkakasalungatan.'
      },
      {
        word: 'Pakikipagsapalaran',
        definition: 'Paglalakbay o gawain na may kasamang panganib o hamon.'
      },
      {
        word: 'Hagkan',
        definition: 'Halikan; pagdampi ng labi bilang tanda ng pagmamahal o paggalang.'
      },
      {
        word: 'Dumaing',
        definition: 'Nagpahayag ng sakit, lungkot, o hinaing; dahil sa nararamdamang hirap.'
      }
    ]
  },
  {
    id: 'a2_aktibiti3',
    title: 'Aktibiti 3',
    subtitle: 'Unawain',
    type: 'drag-drop',
    instruction: 'Basahin ang talata at piliin sa kahon ang akmang salita na hinihingi sa bawat patlang. Piliin ang salitang nasa kahon.',
    words: ['dumaing', 'balintuna', 'hagkan', 'pakikipagsapalaran', '\u2018di maginoo'],
    slides: [
      {
        words: ['dumaing', 'balintuna', 'hagkan'],
        sentences: [
          { parts: ['Isang ', ' na sitwasyon dahil siya\u2019y nagsasakripisyo para sa iba.'], correct: 'balintuna' },
          { parts: ['Sa sobrang pagod ay siya\u2019y ', ','], correct: 'dumaing' },
          { parts: ['ngunit sa huli ay sinalubong siya ng isang mainit na ', ' bilang pagkilala.'], correct: 'hagkan' }
        ]
      },
      {
        words: ['pakikipagsapalaran', '\u2018di maginoo', 'balintuna'],
        sentences: [
          { parts: ['Sa kanyang ', ', maraming hamon ang kanyang hinarap.'], correct: 'pakikipagsapalaran' },
          { parts: ['Tinawag siyang ', ' ng mga taong hindi nakaunawa sa kanyang layunin.'], correct: '\u2018di maginoo' }
        ]
      }
    ]
  },
  {
    id: 'a2_aktibiti4',
    title: 'Aktibiti 4',
    subtitle: 'Subukin',
    type: 'quiz',
    instruction: 'Panuto: Basahin ang bawat tanong at piliin ang tamang sagot mula sa mga pagpipilian.',
    questions: [
      {
        text: 'Ang paglalakbay ni Andres sa malayong lugar upang hanapin ang kanyang kapalaran ay isang halimbawa ng __________.',
        choices: ['pakikipagsapalaran', 'balintuna', 'dumaing'],
        correct: 0
      },
      {
        text: 'Tinawag siyang __________ dahil sa kanyang bastos at hindi maayos na pag-uugali sa mga nakatatanda.',
        choices: ['\u2018di maginoo', 'balintuna', 'hagkan'],
        correct: 0
      },
      {
        text: 'Isang __________ na sitwasyon ang nangyari nang ang taong tumulong sa iba ay siya pang napagbintangan.',
        choices: ['balintuna', 'pakikipagsapalaran', '\u2018di maginoo'],
        correct: 0
      },
      {
        text: 'Sa sobrang sakit ng kanyang sugat, siya ay napahawak sa kanyang dibdib at __________ sa kirot.',
        choices: ['dumaing', 'pakikipagsapalaran', '\u2018di maginoo'],
        correct: 0
      },
      {
        text: 'Bilang tanda ng pagmamahal at pagbati, siya ay binigyan ng isang mainit na __________ ng kanyang ina.',
        choices: ['hagkan', 'dumaing', 'balintuna'],
        correct: 0
      }
    ]
  },
  {
    id: 'a2_aktibiti5',
    title: 'Aktibiti 5',
    subtitle: 'Tama o Mali',
    type: 'true-false',
    instruction: 'Panuto: Basahin ang bawat pangungusap. Tukuyin kung ito ay Tama o Mali batay sa kahulugan ng mga salita mula sa akdang binasa.',
    questions: [
      {
        text: 'Ang salitang <em>hagkan</em> ay nagpapakita ng resolusyon o positibong wakas sa kuwento.',
        answer: false
      },
      {
        text: 'Ang <em>\u2018di maginoo</em> ay tumutukoy sa isang taong may mabuting asal at kagalang-galang.',
        answer: false
      },
      {
        text: 'Ang <em>balintuna</em> ay isang sitwasyong tila magkasalungat ngunit may mas malalim na kahulugan.',
        answer: true
      },
      {
        text: 'Ang <em>pakikipagsapalaran</em> ay nangangahulugang pag-iwas sa hamon at panganib.',
        answer: false
      },
      {
        text: 'Ang <em>dumaing</em> ay nangangahulugang nagpahayag ng sakit, lungkot, o hinaing.',
        answer: true
      }
    ]
  }
];

// ===== ARALIN 3 — Mga Idyoma =====
const ARALIN_3 = [
  // ── Aktibiti 1: Hotspot Quiz (emoji cues) ──
  {
    id: 'a3_aktibiti1',
    title: 'Aktibiti 1',
    subtitle: 'Tukuyin ang Idyoma',
    type: 'quiz',
    instruction: 'Panuto: Tingnan ang emoji at basahin ang paglalarawan. Piliin ang tamang idyoma na angkop dito.',
    questions: [
      {
        text: '😔 Isang taong malungkot',
        choices: ['Laylay ang Balikat', 'Maitim ang Budhi', 'Balat-kalabaw'],
        correct: 0
      },
      {
        text: '🗣️ Nag-uusap nang seryoso',
        choices: ['Mahal na Tao', 'Buksan ang Dibdib', 'Laylay ang Balikat'],
        correct: 1
      },
      {
        text: '😈 May masamang plano',
        choices: ['Balat-kalabaw', 'Maitim ang Budhi', 'Buksan ang Dibdib'],
        correct: 1
      },
      {
        text: '💪 Hindi tinatablan ng tukso',
        choices: ['Balat-kalabaw', 'Laylay ang Balikat', 'Mahal na Tao'],
        correct: 0
      },
      {
        text: '❤️ Labis na pinahahalagahan',
        choices: ['Maitim ang Budhi', 'Mahal na Tao', 'Balat-kalabaw'],
        correct: 1
      }
    ]
  },

  // ── Aktibiti 2: Matching Type ──
  {
    id: 'a3_aktibiti2',
    title: 'Aktibiti 2',
    subtitle: 'Pagtatapat ng Idyoma',
    type: 'word-match',
    instruction: 'Panuto: I-drag ang kahulugan mula sa Hanay B papunta sa tamang idyoma sa Hanay A.',
    pairs: [
      { word: 'Balat-kalabaw', definition: 'Matigas ang ulo / hindi tumatanggap ng payo' },
      { word: 'Buksan ang Dibdib', definition: 'Magtapat ng nararamdaman' },
      { word: 'Laylay ang Balikat', definition: 'Malungkot o nawalan ng pag-asa' },
      { word: 'Mahal na Tao', definition: 'Taong iniibig o pinahahalagahan' },
      { word: 'Maitim ang Budhi', definition: 'May masamang hangarin' }
    ]
  },

  // ── Aktibiti 3: Fill in the Blanks ──
  {
    id: 'a3_aktibiti3',
    title: 'Aktibiti 3',
    subtitle: 'Punan ang Patlang',
    type: 'drag-drop',
    instruction: 'Basahin ang pangungusap at i-drag ang tamang idyoma sa patlang.',
    words: ['balat-kalabaw', 'buksan ang dibdib', 'laylay ang balikat', 'mahal na tao', 'maitim ang budhi'],
    slides: [
      {
        sentences: [
          { parts: ['1. Dahil sa kanyang pagiging ', ', hindi siya nakinig sa payo ng kanyang ina.'], correct: 'balat-kalabaw' },
          { parts: ['2. Nagpasya siyang ', ' upang ipahayag ang kanyang tunay na damdamin.'], correct: 'buksan ang dibdib' },
          { parts: ['3. Nang siya\'y mabigo, siya\'y ', ' habang nakaupo sa sulok.'], correct: 'laylay ang balikat' },
          { parts: ['4. Sa kabila ng lahat, nanatili siyang isang ', ' sa puso ng kanyang pamilya.'], correct: 'mahal na tao' },
          { parts: ['5. Ngunit ang kanyang kaibigan ay may ', ' kaya siya\'y nagawang lokohin.'], correct: 'maitim ang budhi' }
        ]
      }
    ]
  },

  // ── Aktibiti 4: Single Choice Quiz ──
  {
    id: 'a3_aktibiti4',
    title: 'Aktibiti 4',
    subtitle: 'Subukin',
    type: 'quiz',
    questions: [
      {
        text: 'Alin sa mga idyoma ang nagpapakita ng pinakamasamang katangian ng isang tao?',
        choices: ['balat-kalabaw', 'buksan ang dibdib', 'laylay ang balikat', 'mahal na tao', 'maitim ang budhi'],
        correct: 4
      },
      {
        text: 'Alin sa mga idyoma ang nagpapakita ng pagiging bukas at tapat sa damdamin?',
        choices: ['balat-kalabaw', 'buksan ang dibdib', 'laylay ang balikat', 'mahal na tao', 'maitim ang budhi'],
        correct: 1
      },
      {
        text: 'Alin sa mga idyoma ang nagpapakita ng matinding kalungkutan o pagkabigo?',
        choices: ['balat-kalabaw', 'buksan ang dibdib', 'laylay ang balikat', 'mahal na tao', 'maitim ang budhi'],
        correct: 2
      },
      {
        text: 'Alin sa mga idyoma ang tumutukoy sa taong matigas ang ulo at hindi tumatanggap ng payo?',
        choices: ['balat-kalabaw', 'buksan ang dibdib', 'laylay ang balikat', 'mahal na tao', 'maitim ang budhi'],
        correct: 0
      },
      {
        text: 'Alin sa mga idyoma ang tumutukoy sa taong minamahal at pinahahalagahan?',
        choices: ['balat-kalabaw', 'buksan ang dibdib', 'laylay ang balikat', 'mahal na tao', 'maitim ang budhi'],
        correct: 3
      }
    ]
  },

  // ── Aktibiti 5: Branching Scenario ──
  {
    id: 'a3_aktibiti5',
    title: 'Aktibiti 5',
    subtitle: 'Sitwasyon',
    type: 'drag-drop',
    instruction: 'Basahin ang bawat sitwasyon at i-drag ang tamang idyoma sa patlang.',
    words: ['balat-kalabaw', 'buksan ang dibdib', 'laylay ang balikat', 'mahal na tao', 'maitim ang budhi'],
    slides: [
      {
        sentences: [
          { parts: ['1. Paulit-ulit na pinagsabihan si Leo ng kanyang guro tungkol sa kanyang pagliban sa klase, ngunit hindi pa rin siya nagbago at hindi nakinig sa mga payo. Pumapasok lamang kung gusto. Anong idyoma ang pinakaangkop? — ', ''], correct: 'balat-kalabaw' },
          { parts: ['2. Matapos ang matagal na hindi pagkakaunawaan, nag-usap sina Ana at kaibigan. Inamin niya ang pagkakamali at ibinahagi ang tunay niyang nararamdaman. Anong idyoma ang pinakaangkop? — ', ''], correct: 'buksan ang dibdib' },
          { parts: ['3. Hindi natanggap si Carlo sa paligsahan kahit pinaghandaan niya ito nang matagal. Tahimik siyang umupo sa sulok at tila nawalan ng gana. Anong idyoma ang pinakaangkop? — ', ''], correct: 'laylay ang balikat' },
          { parts: ['4. Araw-araw na inaalagaan ni Rosa ang kanyang lola. Lagi niyang inuuna ang kapakanan nito dahil napakalapit nito sa kanyang puso. Anong idyoma ang pinakaangkop? — ', ''], correct: 'mahal na tao' },
          { parts: ['5. Nagkunwari si Ben na tutulungan ang kanyang kaklase, ngunit palihim niyang kinuha ang proyekto nito at inangkin bilang kanya. Anong idyoma ang pinakaangkop? — ', ''], correct: 'maitim ang budhi' }
        ]
      }
    ]
  }
];

// ===== LESSONS REGISTRY =====
const LESSONS = {
  aralin1: { title: 'Aralin 1', activities: ARALIN_1 },
  aralin2: { title: 'Aralin 2', activities: ARALIN_2 },
  aralin3: { title: 'Aralin 3', activities: ARALIN_3 }
};

// Default - starts with Aralin 1
let ACTIVITIES = ARALIN_1;
