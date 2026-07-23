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
}

const plintTyper: Record<string, { pris: number; namn: string }> = {
  betongplint: { pris: 89, namn: 'Betongplint' },
  markskruv: { pris: 249, namn: 'Markskruv' },
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
        key: 'regeldimension', label: 'Regeldimension', unit: '', type: 'select', default: '45x95',
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
      const regelInfo = regelDimensioner[raw.regeldimension] ?? regelDimensioner['45x95']
      const plintInfo = plintTyper[raw.plinttyp] ?? plintTyper['betongplint']

      const area = v.langd * v.bredd
      const antalReglar = Math.ceil((v.bredd * 100) / regelavstand) + 1
      const reglarLopmeter = antalReglar * v.langd
      const trallAtgang = area * 1.1
      const trallskruvAtgang = Math.ceil(area * 35)

      const plintarPerBarlina = Math.ceil((v.langd * 100) / plintavstand) + 1
      const antalPlintar = plintarPerBarlina * 2
      const antalBalkskor = antalReglar * 2

      const ankarskruvPlint = antalPlintar * 2
      const ankarskruvBalksko = antalBalkskor * 4
      const totalAnkarskruv = ankarskruvPlint + ankarskruvBalksko

      return [
        { label: plintInfo.namn, quantity: antalPlintar, unit: 'st', decimals: 0, pricePerUnit: plintInfo.pris },
        { label: `Trall (${trallInfo.namn})`, quantity: trallAtgang, unit: 'm²', decimals: 1, pricePerUnit: trallInfo.prisPerM2 },
        { label: `Reglar (${regelInfo.namn})`, quantity: reglarLopmeter, unit: 'm', decimals: 1, pricePerUnit: regelInfo.prisPerM },
        { label: 'Trallskruv', quantity: trallskruvAtgang, unit: 'st', decimals: 0, pricePerUnit: 1.5 },
        { label: 'Balkskor (45 mm, regel-bärlina)', quantity: antalBalkskor, unit: 'st', decimals: 0, pricePerUnit: 18 },
        { label: 'Ankarskruv (40 mm)', quantity: totalAnkarskruv, unit: 'st', decimals: 0, pricePerUnit: 2.5 },
      ]
    },
    steps: [
      'Markera altanens läge och kontrollera med kommunen om bygglov krävs (t.ex. vid högre höjd eller nära tomtgräns).',
      'Gräv och lägg plintar eller markskruvar i hörnen och med jämna mellanrum enligt regelavstånd.',
      'Montera bärande reglar ovanpå plintarna, se till att de är i våg.',
      'Lägg mellanreglar enligt valt regelavstånd för stabilt underlag.',
      'Skruva fast trallen vinkelrätt mot reglarna, lämna någon millimeters mellanrum mellan brädorna för dränering.',
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
      const skruvAtgang = antalBrador * 4

      const fastmetod = fastmetoder[raw.fastmetod] ?? fastmetoder['betong']
      const fastmetodRows = fastmetod.getRows(antalStolpar)

      return [
        { label: 'Stolpar', quantity: antalStolpar, unit: 'st', decimals: 0, pricePerUnit: 149 },
        { label: 'Brädor', quantity: antalBrador, unit: 'st', decimals: 0, pricePerUnit: 59 },
        { label: 'Skruv', quantity: skruvAtgang, unit: 'st', decimals: 0, pricePerUnit: 1.5 },
        ...fastmetodRows,
      ]
    },
    steps: [
      'Markera staketets sträckning med snöre och mät ut stolparnas placering enligt valt avstånd.',
      'Gräv eller borra hål för stolparna, minst 70–80 cm djupt beroende på tjäle och jordart.',
      'Sätt stolparna i våg och gjut eller packa fast dem ordentligt.',
      'Låt stolparna stå stadigt (och betongen härda om du gjutit) innan du fortsätter.',
      'Montera vågräta reglar mellan stolparna.',
      'Skruva fast brädorna på reglarna med jämna mellanrum.',
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