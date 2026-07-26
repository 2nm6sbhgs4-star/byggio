import { altanIllustrations } from './altanIllustrations'
import { plattaIllustrations, husgrundIllustrations, murIllustrations } from './armeringIllustrations'
import { staketIllustrations } from './staketIllustrations'
import { blomladorIllustrations } from './blomladorIllustrations'

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

const bradDimensioner: Record<string, { bradbredd: number; prisPerM: number; namn: string }> = {
  '22x95': { bradbredd: 0.095, prisPerM: 20, namn: '22×95 mm obehandlad furu' },
  '22x120': { bradbredd: 0.12, prisPerM: 24, namn: '22×120 mm obehandlad furu' },
  'lark': { bradbredd: 0.07, prisPerM: 38, namn: '21×70 mm lärk, obehandlad' },
}

const bottenTyper: Record<string, { namn: string; getRows: (bottenArea: number) => ResultRow[] }> = {
  trall: {
    namn: 'Trallbotten (dränerande springor)',
    getRows: (bottenArea) => [
      { label: 'Bottenbrädor (samma virke, lagda med springor)', quantity: bottenArea * 10, unit: 'm', decimals: 1, pricePerUnit: 22 },
    ]
  },
  markduk: {
    namn: 'Markduk (ingen botten)',
    getRows: (bottenArea) => [
      { label: 'Markduk/fiberduk', quantity: bottenArea, unit: 'm²', decimals: 1, pricePerUnit: 15 },
    ]
  },
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
          'Mät upp och markera ytan med snöre och käppar. Kontrollera avvattningen redan nu – ytan bör luta svagt bort från huset så att vatten inte blir stående och tränger in i konstruktionen.',
          'Schakta bort matjord (den håller fukt, komprimeras ojämnt och kan ruttna) och packa istället ett bärlager av grus eller makadam. Bärlagret fördelar plattans tyngd jämnt och dränerar bort vatten underifrån.',
          'Bygg en formsättning i trä runt kanten, i rätt höjd och våg. Formen håller den flytande betongen på plats och bestämmer plattans slutliga höjd och lutning – kontrollera noga med vattenpass innan du fortsätter.',
          'Lägg ut armeringsnät och lyft det ca 3–5 cm med distansklossar så det hamnar centrerat i betongen. Armeringen tar upp de dragkrafter som uppstår när plattan belastas eller rör sig av temperaturskillnader; ligger nätet i botten gör det ingen nytta.',
          'Blanda och gjut betongen i ett sammanhängande arbetspass om möjligt, så plattan blir enhetlig. Jämna till ytan med en rätskiva som dras mot formkanterna för en plan yta, och arbeta bort eventuella luftfickor.',
          'Låt betongen härda i minst en vecka innan full belastning – den fortsätter dock att hårdna i flera veckor till. Håll ytan fuktig eller skyddad de första dygnen så den inte torkar ut för fort och spricker.',
        ],
        stepIllustrations: plattaIllustrations,
        tools: [
          { name: 'Markvibrator (packa bärlager)', pricePerDay: 370 },
          { name: 'Betongvisp (visp till borrmaskin, för mindre mängder)', pricePerDay: 120 },
          { name: 'Betongblandare, tombola (roterande trumma, för större mängder)', pricePerDay: 280 },
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
          { key: 'kantbalkshojd', label: 'Kantbalkens höjd', unit: 'cm', default: '30' },
        ],
        calculate: (v) => {
          const area = v.langd * v.bredd
          const betongVolym = area * (v.betongtjocklek / 100)
          const isoleringVolym = area * (v.isoleringstjocklek / 100)
          const armeringArea = area * 1.1

          const omkrets = 2 * (v.langd + v.bredd)
          const kantbalksbredd = 0.3
          const kantbalkVolym = omkrets * kantbalksbredd * (v.kantbalkshojd / 100)
          const langsjarnLopmeter = omkrets * 4 // 4 st Ø12 K-järn runt hela kantbalken
          const antalByglar = Math.ceil(omkrets / 0.5) + 1 // byglar cc 500
          const bygelLangd = 2 * (kantbalksbredd - 0.05) + 2 * (v.kantbalkshojd / 100 - 0.05) + 0.1

          return [
            { label: 'Betong (m³, fabriksblandad)', quantity: betongVolym, unit: 'm³', decimals: 2, pricePerUnit: 2200 },
            { label: 'Cellplastisolering', quantity: isoleringVolym, unit: 'm³', decimals: 2, pricePerUnit: 1400 },
            { label: 'Armeringsnät (150×150/Ø6 mm)', quantity: armeringArea, unit: 'm²', decimals: 1, pricePerUnit: 95 },
            { label: `Kantbalk, betong (300×${v.kantbalkshojd} mm)`, quantity: kantbalkVolym, unit: 'm³', decimals: 2, pricePerUnit: 2200 },
            { label: 'Kantbalksarmering, längsgående Ø12 K-järn (4 st)', quantity: langsjarnLopmeter, unit: 'm', decimals: 1, pricePerUnit: 14 },
            { label: 'Kantbalksarmering, byglar Ø10 K-järn cc 500', quantity: antalByglar, unit: 'st', decimals: 0, pricePerUnit: Math.round(bygelLangd * 11 * 100) / 100 },
          ]
        },
        steps: [
          'Schakta ur till fast, orörd botten och packa ett bärlager av grus eller makadam. Grunden måste vila på fast mark – lös fyllning sätter sig ojämnt över tid och kan spräcka plattan.',
          'Lägg ut cellplastisolering enligt vald tjocklek. Isoleringen under plattan hindrar kylan i marken från att tränga upp genom huset och motverkar tjälskjutning; ju tjockare isolering desto varmare golv och lägre uppvärmningskostnad.',
          'Montera kantelement runt hela ytan och lägg ut armeringsnät ovanpå isoleringen. Kantelementen fungerar både som form vid gjutningen och som permanent isolering i plattans kant, medan armeringen tar upp krympnings- och belastningskrafter i betongen.',
          'Gjut samtidigt en kantbalk längs hela ytterkanten. Den armeras med 4 st Ø12 K-järn som löper runt hela kanten, hopbundna med byglar (Ø10 K-järn) med cc 500 mm mellanrum – kantbalken stelnar upp plattans kant och tar upp de större punktlaster (t.ex. från väggar och pelare) som annars bara skulle vila på isoleringen.',
          'Dra in rör för vatten, avlopp, el och eventuell golvvärme innan gjutning. Allt som ska ligga under eller i plattan måste vara på plats och kontrollerat tätt nu – efter gjutning går det bara att komma åt genom att bila upp betongen.',
          'Gjut plattan och jämna till ytan med en rätskiva mot kantelementens överkant, som ger dig rätt höjd och lutning automatiskt.',
          'Låt härda och skydda mot uttorkning och frost de första dygnen – frysning i ohärdad betong kan spränga sönder strukturen permanent, så täck och/eller värm vid behov om det är kallt ute.',
        ],
        stepIllustrations: husgrundIllustrations,
        tools: [
          { name: 'Markvibrator (packa bärlager)', pricePerDay: 370 },
          { name: 'Betongvisp (visp till borrmaskin, för mindre mängder)', pricePerDay: 120 },
          { name: 'Betongblandare, tombola (roterande trumma, för större mängder)', pricePerDay: 280 },
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
          'Gräv ur och lägg en stabil grund/fundament under muren, ner till frostfritt djup. Utan det kan tjällyftning över vintrarna gradvis flytta eller spräcka muren.',
          'Bygg formsättning på båda sidor av muren och håll den på plats med distanser i rätt avstånd. Formen håller den flytande betongen på plats tills den härdat och avgör murens tjocklek och form.',
          'Placera armeringsnät eller armeringsjärn centrerat i formen. En stödmur belastas av jordtryck från sidan som vill böja och spräcka den – armeringen tar upp just dessa böjkrafter, och behovet ökar ju högre muren är.',
          'Blanda och gjut betongen i omgångar om ca 30–50 cm åt gången, och vibrera varje lager. Vibreringen får betongen att fylla ut formen helt och driver ut luftbubblor som annars gör muren porös och svagare.',
          'Låt formen sitta kvar minst några dygn innan du river den – betongen måste hinna få tillräcklig hållfasthet för att bära sin egen vikt själv. Räkna med längre tid i kallt väder.',
          'Se till att muren har dränering bakom sig om den ska hålla emot jordmassor. Utan dränering bygger vattentryck upp bakom muren, vilket kraftigt ökar belastningen och kan få den att luta eller välta.',
        ],
        stepIllustrations: murIllustrations,
        tools: [
          { name: 'Betongvisp (visp till borrmaskin, för mindre mängder)', pricePerDay: 120 },
          { name: 'Betongblandare, tombola (roterande trumma, för större mängder)', pricePerDay: 280 },
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

  blomlador: {
    fields: [
      { key: 'antal', label: 'Antal lådor', unit: 'st', default: '1' },
      { key: 'langd', label: 'Längd (per låda)', unit: 'cm' },
      { key: 'bredd', label: 'Bredd (per låda)', unit: 'cm' },
      { key: 'hojd', label: 'Höjd (per låda)', unit: 'cm', default: '40' },
      {
        key: 'bradimension', label: 'Fasadbrädor, dimension', unit: '', type: 'select', default: '22x95',
        options: [
          { value: '22x95', label: '22×95 mm obehandlad furu' },
          { value: '22x120', label: '22×120 mm obehandlad furu' },
          { value: 'lark', label: '21×70 mm lärk, obehandlad' },
        ]
      },
      {
        key: 'botten', label: 'Botten', unit: '', type: 'select', default: 'trall',
        options: [
          { value: 'trall', label: 'Trallbotten (dränerande springor)' },
          { value: 'markduk', label: 'Markduk (ingen botten)' },
        ]
      },
    ],
    calculate: (v, raw) => {
      const bradInfo = bradDimensioner[raw.bradimension] ?? bradDimensioner['22x95']
      const antalRader = Math.max(1, Math.round((v.hojd / 100) / bradInfo.bradbredd))
      const omkrets = 2 * (v.langd + v.bredd) / 100
      const bradLopmeter = omkrets * antalRader * v.antal
      const hornregelLopmeter = 4 * (v.hojd / 100) * v.antal
      const skruvAtgang = antalRader * 4 * v.antal

      const bottenInfo = bottenTyper[raw.botten] ?? bottenTyper['trall']
      const bottenArea = (v.langd * v.bredd / 10000) * v.antal
      const bottenRows = bottenInfo.getRows(bottenArea)

      return [
        { label: `Fasadbrädor (${bradInfo.namn})`, quantity: bradLopmeter, unit: 'm', decimals: 1, pricePerUnit: bradInfo.prisPerM },
        { label: 'Hörnreglar 34×34 mm', quantity: hornregelLopmeter, unit: 'm', decimals: 1, pricePerUnit: 15 },
        { label: 'Skruv (4,0×40 mm, träskruv)', quantity: skruvAtgang, unit: 'st', decimals: 0, pricePerUnit: 1.5 },
        ...bottenRows,
      ]
    },
    steps: [
      'Bestäm mått och kapa fyra hörnreglar (t.ex. 34×34 mm) i lådans höjd per låda. Reglarna är lådans bärande stomme som alla brädor skruvas fast i, så se till att de är exakt lika långa – annars blir lådan skev.',
      'Skruva fast den första brädraden runt hörnreglarna nedtill och kontrollera med en vinkelhake att alla fyra hörn blir exakt 90 grader. Ett snett första varv förstärks i varje rad du bygger på, så lägg extra omsorg här.',
      'Bygg på med resterande rader brädor uppåt, en i taget, och kontrollera regelbundet med vattenpass att lådan står rakt. Lämna ett par millimeters glapp mellan brädorna så virket kan svälla och krympa med fukten utan att spricka eller bukta.',
      'Borra dräneringshål i botten, eller lägg en trallbotten med springor mellan brädorna. Utan dränering blir jorden vattendränkt och rötterna kan kvävas eller ruttna.',
      'Ställ lådan på ett par klossar eller lägg markduk under om den ska stå direkt på jord eller altan, så botten inte ligger i ständig fukt och ruttnar i förtid.',
      'Olja virket med linolja eller en utomhusolja avsedd för odlingslådor innan du fyller lådan med jord – det förlänger livslängden avsevärt, särskilt i de utsatta hörnskarvarna. Använd aldrig tryckimpregnerat virke eller impregneringsmedel till odlingslådor, eftersom kemikalierna kan läcka ut i jorden där du odlar.',
    ],
    stepIllustrations: blomladorIllustrations,
    tools: [
      { name: 'Cirkelsåg', own: true },
      { name: 'Skruvdragare/borrmaskin', own: true },
      { name: 'Vattenpass', own: true },
      { name: 'Vinkelhake', own: true },
    ],
  },
}