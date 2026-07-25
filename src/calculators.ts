import { altanIllustrations } from './altanIllustrations'
import { plattaIllustrations, husgrundIllustrations, murIllustrations } from './armeringIllustrations'
import { staketIllustrations } from './staketIllustrations'

export type FieldOption = { value: string; label: string }

export type Field = {
  key: string
  label: string
  unit: string
  default?: string
  type?: 'number' | 'select'
  options?: FieldOption[]
}

export type ResultRow = {
  label: string
  quantity: number
  unit: string
  decimals?: number
  pricePerUnit?: number
}

export type Tool = {
  name: string
  pricePerDay?: number
  own?: boolean
}

export type CalculatorVariant = {
  key: string
  label: string
  fields: Field[]
  calculate: (v: Record<string, number>, raw: Record<string, string>) => ResultRow[]
  steps?: string[]
  stepIllustrations?: string[]
  tools?: Tool[]
}

export type CalculatorConfig = {
  fields?: Field[]
  calculate?: (v: Record<string, number>, raw: Record<string, string>) => ResultRow[]
  steps?: string[]
  stepIllustrations?: string[]
  tools?: Tool[]
  variants?: CalculatorVariant[]
}

const trallDimensioner: Record<string, { bradbredd: number; prisPerM2: number; namn: string }> = {
  '28x120': { bradbredd: 0.12, prisPerM2: 220, namn: '28×120 mm tryckimpregnerad' },
  '28x145': { bradbredd: 0.145, prisPerM2: 260, namn: '28×145 mm tryckimpregnerad' },
  'larktrall': { bradbredd: 0.12, prisPerM2: 450, namn: '28×120 mm lärk' },
  'komposit': { bradbredd: 0.14, prisPerM2: 750, namn: 'Komposittrall 140 mm' },
}

const regelDimensioner: Record<string, { prisPerM: number; namn: string }> = {
  '45x95': { prisPerM: 35, namn: '45×95 mm' },
  '45x145': { prisPerM: 45, namn: '45×145 mm' },
  '45x170': { prisPerM: 55, namn: '45×170 mm' },
  '45x220': { prisPerM: 70, namn: '45×220 mm' },
}

const plintTyper: Record<string, { pris: number; namn: string }> = {
  betongplint: { pris: 89, namn: 'Betongplint' },
  markskruv: { pris: 249, namn: 'Markskruv' },
}

const stolpDimensioner: Record<string, { pris: number; namn: string }> = {
  '70x70': { pris: 99, namn: '70×70 mm' },
  '95x95': { pris: 149, namn: '95×95 mm' },
  '120x120': { pris: 229, namn: '120×120 mm' },
}

const staketRegelDimensioner: Record<string, { prisPerM: number; namn: string }> = {
  '34x45': { prisPerM: 18, namn: '34×45 mm' },
  '45x70': { prisPerM: 28, namn: '45×70 mm' },
  '45x95': { prisPerM: 35, namn: '45×95 mm' },
}

const fastmetoder: Record<string, { namn: string; getRows: (antalStolpar: number) => ResultRow[] }> = {
  betong: {
    namn: 'Betong',
    getRows: (antalStolpar) => [
      { label: 'Betong (25 kg-säck, ca 2/stolpe)', quantity: antalStolpar * 2, unit: 'st', decimals: 0, pricePerUnit: 89 },
    ]
  },
  grus: {
    namn: 'Packad singel/grus',
    getRows: (antalStolpar) => [
      { label: 'Singel/grus (ca 0,05 m³/stolpe)', quantity: antalStolpar * 0.05, unit: 'm³', decimals: 2, pricePerUnit: 350 },
    ]
  },
  markspets: {
    namn: 'Markspets (slå ner)',
    getRows: (antalStolpar) => [
      { label: 'Markspets/markankare', quantity: antalStolpar, unit: 'st', decimals: 0, pricePerUnit: 179 },
    ]
  },
}

export const calculators: Record<string, CalculatorConfig> = {
  altan: {
    fields: [
      { key: 'langd', label: 'Längd', unit: 'm' },
      { key: 'bredd', label: 'Bredd', unit: 'm' },
      {
        key: 'tralldimension', label: 'Trädimension (trall)', unit: '', type: 'select', default: '28x120',
        options: [
          { value: '28x120', label: '28×120 mm tryckimpregnerad' },
          { value: '28x145', label: '28×145 mm tryckimpregnerad' },
          { value: 'larktrall', label: '28×120 mm lärk' },
          { value: 'komposit', label: 'Komposittrall 140 mm' },
        ]
      },
      {
        key: 'barlinadimension', label: 'Bärlinedimension (bärande, mot plintarna)', unit: '', type: 'select', default: '45x170',
        options: [
          { value: '45x145', label: '45×145 mm' },
          { value: '45x170', label: '45×170 mm' },
          { value: '45x220', label: '45×220 mm' },
        ]
      },
      {
        key: 'mellanregeldimension', label: 'Mellanregeldimension (mellan bärlinorna)', unit: '', type: 'select', default: '45x95',
        options: [
          { value: '45x95', label: '45×95 mm' },
          { value: '45x145', label: '45×145 mm' },
          { value: '45x170', label: '45×170 mm' },
        ]
      },
      {
        key: 'plinttyp', label: 'Typ av plint', unit: '', type: 'select', default: 'betongplint',
        options: [
          { value: 'betongplint', label: 'Betongplint' },
          { value: 'markskruv', label: 'Markskruv' },
        ]
      },
    ],
    calculate: (v, raw) => {
      const regelavstand = 60
      const plintavstand = 150

      const trallInfo = trallDimensioner[raw.tralldimension] ?? trallDimensioner['28x120']
      const barlinaInfo = regelDimensioner[raw.barlinadimension] ?? regelDimensioner['45x170']
      const mellanregelInfo = regelDimensioner[raw.mellanregeldimension] ?? regelDimensioner['45x95']
      const plintInfo = plintTyper[raw.plinttyp] ?? plintTyper['betongplint']

      const area = v.langd * v.bredd
      const antalBarlinor = 2
      const barlinorLopmeter = antalBarlinor * v.langd
      const antalMellanreglar = Math.ceil((v.bredd * 100) / regelavstand) + 1
      const mellanreglarLopmeter = antalMellanreglar * v.langd
      const trallAtgang = area * 1.1
      const trallskruvAtgang = Math.ceil(area * 35)

      const plintarPerBarlina = Math.ceil((v.langd * 100) / plintavstand) + 1
      const antalPlintar = plintarPerBarlina * antalBarlinor
      const antalBalkskor = antalMellanreglar * 2

      const ankarskruvPlint = antalPlintar * 2
      const ankarskruvBalksko = antalBalkskor * 4
      const totalAnkarskruv = ankarskruvPlint + ankarskruvBalksko

      return [
        { label: plintInfo.namn, quantity: antalPlintar, unit: 'st', decimals: 0, pricePerUnit: plintInfo.pris },
        { label: `Trall (${trallInfo.namn})`, quantity: trallAtgang, unit: 'm²', decimals: 1, pricePerUnit: trallInfo.prisPerM2 },
        { label: `Bärlinor, bärande (${barlinaInfo.namn})`, quantity: barlinorLopmeter, unit: 'm', decimals: 1, pricePerUnit: barlinaInfo.prisPerM },
        { label: `Mellanreglar (${mellanregelInfo.namn})`, quantity: mellanreglarLopmeter, unit: 'm', decimals: 1, pricePerUnit: mellanregelInfo.prisPerM },
        { label: 'Trallskruv', quantity: trallskruvAtgang, unit: 'st', decimals: 0, pricePerUnit: 1.5 },
        { label: 'Balkskor (45 mm, mellanregel–bärlina)', quantity: antalBalkskor, unit: 'st', decimals: 0, pricePerUnit: 18 },
        { label: 'Ankarskruv (40 mm)', quantity: totalAnkarskruv, unit: 'st', decimals: 0, pricePerUnit: 2.5 },
      ]
    },
    steps: [
      'Markera altanens läge och kontrollera med kommunen om bygglov krävs (t.ex. vid högre höjd eller nära tomtgräns).',
      'Gräv och lägg plintar eller markskruvar längs långsidorna, med jämna mellanrum enligt plintavstånd.',
      'Montera bärlinorna ovanpå plintarna – detta är de bärande reglarna som tar altanens hela vikt, så använd alltid en grövre dimension här (minst 45×170 mm, grövre vid längre spann) än mellanreglarna. Se till att de ligger i våg och är fästa med ankarskruv i plintarna.',
      'Lägg mellanreglarna tvärs över bärlinorna med c/c 60 cm, fästa med balkskor. Mellanreglarna kan vara klenare (t.ex. 45×95 mm) eftersom de bara bär trallen och fördelar lasten vidare till bärlinorna.',
      'Skruva fast trallen vinkelrätt mot mellanreglarna, lämna någon millimeters mellanrum mellan brädorna för dränering.',
      'Såga kanterna raka och montera eventuell kantlist eller trappsteg.',
    ],
    stepIllustrations: altanIllustrations,
    tools: [
      { name: 'Jordborr (för plinthål)', pricePerDay: 400 },
      { name: 'Vattenpass', own: true },
      { name: 'Cirkelsåg', own: true },
      { name: 'Skruvdragare/borrmaskin', own: true },
      { name: 'Spade', own: true },
    ],
  },

  'armering-betong': {
    variants: [
      {
        key: 'platta',
        label: 'Platta på mark',
        fields: [
          { key: 'langd', label: 'Längd', unit: 'm' },
          { key: 'bredd', label: 'Bredd', unit: 'm' },
          { key: 'tjocklek', label: 'Tjocklek', unit: 'cm', default: '10' },
        ],
        calculate: (v) => {
          const area = v.langd * v.bredd
          const betongVolym = area * (v.tjocklek / 100)
          const armeringArea = area * 1.1
          const antalSackar = Math.ceil(betongVolym / 0.033)
          return [
            { label: 'Betong (25 kg-säck)', quantity: antalSackar, unit: 'st', decimals: 0, pricePerUnit: 89 },
            { label: 'Armeringsnät (150×150/Ø6 mm)', quantity: armeringArea, unit: 'm²', decimals: 1, pricePerUnit: 95 },
          ]
        },
        steps: [
          'Mät upp och markera ytan, kontrollera avvattning så vatten inte blir stående.',
          'Schakta bort matjord och packa ett bärlager av grus eller makadam.',
          'Bygg en formsättning i trä runt kanten, i rätt höjd och våg.',
          'Lägg ut armeringsnät, lyft det något med distansklossar.',
          'Blanda och gjut betongen, jämna till ytan med en rätskiva.',
          'Låt betongen härda i minst en vecka innan full belastning.',
        ],
        stepIllustrations: plattaIllustrations,
        tools: [
          { name: 'Markvibrator (packa bärlager)', pricePerDay: 370 },
          { name: 'Betongblandare', pricePerDay: 200 },
          { name: 'Rätskiva', own: true },
          { name: 'Spade/skottkärra', own: true },
        ],
      },
      {
        key: 'husgrund',
        label: 'Husgrund',
        fields: [
          { key: 'langd', label: 'Längd', unit: 'm' },
          { key: 'bredd', label: 'Bredd', unit: 'm' },
          { key: 'betongtjocklek', label: 'Betongtjocklek', unit: 'cm', default: '15' },
          { key: 'isoleringstjocklek', label: 'Isoleringstjocklek', unit: 'cm', default: '30' },
        ],
        calculate: (v) => {
          const area = v.langd * v.bredd
          const betongVolym = area * (v.betongtjocklek / 100)
          const isoleringVolym = area * (v.isoleringstjocklek / 100)
          const armeringArea = area * 1.1
          return [
            { label: 'Betong (m³, fabriksblandad)', quantity: betongVolym, unit: 'm³', decimals: 2, pricePerUnit: 2200 },
            { label: 'Cellplastisolering', quantity: isoleringVolym, unit: 'm³', decimals: 2, pricePerUnit: 1400 },
            { label: 'Armeringsnät (150×150/Ø6 mm)', quantity: armeringArea, unit: 'm²', decimals: 1, pricePerUnit: 95 },
          ]
        },
        steps: [
          'Schakta ur till fast botten och packa ett bärlager.',
          'Lägg ut cellplastisolering enligt vald tjocklek.',
          'Montera kantelement och lägg ut armeringsnät.',
          'Dra in rör för vatten, avlopp och el innan gjutning om det behövs.',
          'Gjut plattan och jämna till ytan.',
          'Låt härda och skydda mot uttorkning och frost de första dygnen.',
        ],
        stepIllustrations: husgrundIllustrations,
        tools: [
          { name: 'Markvibrator (packa bärlager)', pricePerDay: 370 },
          { name: 'Betongblandare', pricePerDay: 200 },
          { name: 'Rätskiva', own: true },
        ],
      },
      {
        key: 'mur',
        label: 'Stödmur / mur',
        fields: [
          { key: 'langd', label: 'Längd', unit: 'm' },
          { key: 'hojd', label: 'Höjd', unit: 'm' },
          { key: 'tjocklek', label: 'Tjocklek', unit: 'cm', default: '20' },
        ],
        calculate: (v) => {
          const volym = v.langd * v.hojd * (v.tjocklek / 100)
          const armeringArea = v.langd * v.hojd * 1.1
          const antalSackar = Math.ceil(volym / 0.033)
          return [
            { label: 'Betong (25 kg-säck)', quantity: antalSackar, unit: 'st', decimals: 0, pricePerUnit: 89 },
            { label: 'Armeringsnät (150×150/Ø8 mm)', quantity: armeringArea, unit: 'm²', decimals: 1, pricePerUnit: 120 },
          ]
        },
        steps: [
          'Gräv ur och lägg en stabil grund/fundament under muren.',
          'Bygg formsättning på båda sidor av muren.',
          'Placera armeringsnät eller armeringsjärn centrerat i formen.',
          'Blanda och gjut betongen i omgångar, vibrera bort luftbubblor.',
          'Låt formen sitta kvar minst några dygn innan du river den.',
          'Se till att muren har dränering bakom sig om den ska hålla emot jordmassor.',
        ],
        stepIllustrations: murIllustrations,
        tools: [
          { name: 'Betongblandare', pricePerDay: 200 },
          { name: 'Betongvibrator', pricePerDay: 300 },
          { name: 'Spade', own: true },
        ],
      },
    ]
  },

  staket: {
    fields: [
      { key: 'langd', label: 'Total längd', unit: 'm' },
      { key: 'hojd', label: 'Höjd', unit: 'cm', default: '180' },
      { key: 'stolpavstand', label: 'Stolpavstånd', unit: 'cm', default: '180' },
      {
        key: 'stolpdimension', label: 'Stolpdimension (bärande, gjuts/slås i marken)', unit: '', type: 'select', default: '95x95',
        options: [
          { value: '70x70', label: '70×70 mm – låga staket, under 100 cm' },
          { value: '95x95', label: '95×95 mm – standard, upp till ca 150 cm' },
          { value: '120x120', label: '120×120 mm – höga/vindutsatta insynsskydd' },
        ]
      },
      {
        key: 'regeldimension', label: 'Regeldimension (vågräta reglar mellan stolparna)', unit: '', type: 'select', default: '45x70',
        options: [
          { value: '34x45', label: '34×45 mm – lätta, låga staket' },
          { value: '45x70', label: '45×70 mm – standard' },
          { value: '45x95', label: '45×95 mm – höga eller täta insynsskyddande staket' },
        ]
      },
      {
        key: 'fastmetod', label: 'Fästmetod för stolpar', unit: '', type: 'select', default: 'betong',
        options: [
          { value: 'betong', label: 'Betong' },
          { value: 'grus', label: 'Packad singel/grus' },
          { value: 'markspets', label: 'Markspets (slå ner)' },
        ]
      },
    ],
    calculate: (v, raw) => {
      const antalStolpar = Math.ceil((v.langd * 100) / v.stolpavstand) + 1
      const brädorPerMeter = 100 / 12
      const antalBrador = Math.ceil(v.langd * brädorPerMeter)
      const brädskruvAtgang = antalBrador * 4

      const stolpInfo = stolpDimensioner[raw.stolpdimension] ?? stolpDimensioner['95x95']
      const regelInfo = staketRegelDimensioner[raw.regeldimension] ?? staketRegelDimensioner['45x70']
      // Staket över ca 120 cm bör ha en tredje regelrad så brädorna inte buktar av vind- och egenlast.
      const antalRader = v.hojd > 120 ? 3 : 2
      const regelLopmeter = antalRader * v.langd
      const regelskruvAtgang = antalStolpar * antalRader * 2

      const fastmetod = fastmetoder[raw.fastmetod] ?? fastmetoder['betong']
      const fastmetodRows = fastmetod.getRows(antalStolpar)

      return [
        { label: `Stolpar, bärande (${stolpInfo.namn})`, quantity: antalStolpar, unit: 'st', decimals: 0, pricePerUnit: stolpInfo.pris },
        { label: `Reglar, ${antalRader} rader (${regelInfo.namn})`, quantity: regelLopmeter, unit: 'm', decimals: 1, pricePerUnit: regelInfo.prisPerM },
        { label: 'Brädor', quantity: antalBrador, unit: 'st', decimals: 0, pricePerUnit: 59 },
        { label: 'Skruv (brädor mot reglar)', quantity: brädskruvAtgang, unit: 'st', decimals: 0, pricePerUnit: 1.5 },
        { label: 'Skruv (reglar mot stolpar)', quantity: regelskruvAtgang, unit: 'st', decimals: 0, pricePerUnit: 2 },
        ...fastmetodRows,
      ]
    },
    steps: [
      'Markera staketets sträckning med snöre och mät ut stolparnas placering enligt valt avstånd.',
      'Gräv eller borra hål för stolparna, minst 70–80 cm djupt beroende på tjäle och jordart. Stolparna är staketets bärande, vindupptagande del – ju högre och mer vindutsatt staketet är, desto grövre dimension behövs (95×95 mm som standard, 120×120 mm för höga insynsskydd).',
      'Sätt stolparna i våg och gjut eller packa fast dem ordentligt.',
      'Låt stolparna stå stadigt (och betongen härda om du gjutit) innan du fortsätter.',
      'Montera de vågräta reglarna mellan stolparna: 2 rader (upptill och nedtill) räcker för staket upp till ca 120 cm, men lägg till en tredje rad i mitten för högre staket så brädorna inte buktar. Reglarna bär hela brädpanelens vikt och vindlast – välj grövre regeldimension (t.ex. 45×95 mm) ju högre och tätare staketet är.',
      'Skruva fast brädorna på reglarna med jämna mellanrum, och kontrollera fortlöpande att allt är i våg.',
    ],
    stepIllustrations: staketIllustrations,
    tools: [
      { name: 'Jordborr (för stolphål)', pricePerDay: 400 },
      { name: 'Vattenpass', own: true },
      { name: 'Cirkelsåg', own: true },
      { name: 'Skruvdragare', own: true },
    ],
  },
}