import { CardOrigin, createCard } from '../domain/card.js';

const demoSvg = (icon, color) => `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 800 600"
  role="img"
  aria-label="${icon}"
>
  <rect width="800" height="600" rx="40" fill="${color}"/>
  <text
    x="400"
    y="320"
    fill="white"
    font-size="180"
    font-family="sans-serif"
    text-anchor="middle"
    dominant-baseline="middle"
  >${icon}</text>
</svg>
`;

export const seedCards = Object.freeze([
  [
    'seed-fato-5',
    'Quantas horas dura o formato oficial do Techstars Startup Weekend?',
    '54 horas',
    '#3475B2',
    '🚀'
  ],
  [
    'seed-fato-6',
    'Em quantos dias é realizado o Techstars Startup Weekend?',
    '3 dias',
    '#5B4B8A',
    '📅'
  ],
  [
    'seed-fato-7',
    'Quantos continentes receberam eventos do Techstars Startup Weekend Women até março de 2026?',
    '6 continentes',
    '#D94F70',
    '🌎'
  ],
  [
    'seed-fato-8',
    'Quantas cidades participaram do Techstars Startup Weekend Women até março de 2026?',
    '29 cidades',
    '#3475B2',
    '🏙️'
  ],
  [
    'seed-fato-9',
    'Em que ano a Google LLC nasceu oficialmente?',
    '1998',
    '#4285F4',
    '🔎'
  ],
  [
    'seed-fato-10',
    'Qual foi o valor em dólares do cheque que Andy Bechtolsheim entregou a Larry Page e Sergey Brin em 1998?',
    '100000 dólares',
    '#34A853',
    '💰'
  ],
  [
    'seed-fato-11',
    'Em que ano a Tesla foi incorporada?',
    '2003',
    '#CC0000',
    '⚡'
  ],
  [
    'seed-fato-12',
    'Em que ano o Airbnb foi fundado?',
    '2008',
    '#FF5A5F',
    '🏠'
  ],
  [
    'seed-fato-13',
    'Quantos hóspedes foram recebidos pelos anfitriões do Airbnb desde o início da plataforma até 2026?',
    '2,5 bilhões de hóspedes',
    '#FF5A5F',
    '🧳'
  ],
  [
    'seed-fato-14',
    'Quantos milhões de anfitriões o Airbnb informa possuir em 2026?',
    '5,5 milhões de anfitriões',
    '#FF5A5F',
    '🏡'
  ],
  [
    'seed-fato-15',
    'Em que ano o Spotify foi lançado?',
    '2008',
    '#1DB954',
    '🎵'
  ],
  [
    'seed-fato-16',
    'Quantos milhões de assinantes o Spotify havia ultrapassado em 2023?',
    '200 milhões de assinantes',
    '#1DB954',
    '🎧'
  ],
  [
    'seed-fato-17',
    'Em que ano a Amazon Web Services foi lançada?',
    '2006',
    '#FF9900',
    '☁️'
  ],
  [
    'seed-fato-18',
    'Em que ano o Amazon S3 foi lançado?',
    '2006',
    '#FF9900',
    '🗄️'
  ],
  [
    'seed-fato-19',
    'Quantos aplicativos estavam disponíveis quando a App Store foi lançada em 2008?',
    '500 aplicativos',
    '#A855F7',
    '📱'
  ],
  [
    'seed-fato-20',
    'Em que ano a App Store foi lançada?',
    '2008',
    '#A855F7',
    '🛒'
  ],
  [
    'seed-fato-21',
    'Quantos pedidos de patente foram apresentados mundialmente em 2024, em milhões?',
    '3,7 milhões de pedidos',
    '#0F766E',
    '💡'
  ],
  [
    'seed-fato-22',
    'Qual foi o crescimento percentual dos pedidos mundiais de patente em 2024 em relação a 2023?',
    '4,9%',
    '#0F766E',
    '📈'
  ],
  [
    'seed-fato-23',
    'Quantos usuários o Spotify informou possuir no primeiro trimestre de 2026, em milhões?',
    '777 milhões de usuários',
    '#1DB954',
    '👥'
  ],
  [
    'seed-fato-24',
    'Em quantos mercados o Spotify informa estar presente atualmente?',
    '184 mercados',
    '#1DB954',
    '🌐'
  ],
  [
    'seed-fato-25',
    'Em que ano Andrew Hyde criou o Startup Weekend?',
    '2007',
    '#3475B2',
    '🚀'
  ],
  [
    'seed-fato-26',
    'Em que ano o Startup Weekend foi incorporado como organização?',
    '2009',
    '#5B4B8A',
    '🏢'
  ],
  [
    'seed-fato-27',
    'Em que ano aconteceu o primeiro Startup Week em Boulder?',
    '2010',
    '#D94F70',
    '📅'
  ],
  [
    'seed-fato-28',
    'Quantos participantes os eventos Startup Week já haviam alcançado mundialmente em 2016, em milhares?',
    '83 mil participantes',
    '#3475B2',
    '👥'
  ],
  [
    'seed-fato-29',
    'Em que ano a Techstars foi oficialmente incorporada?',
    '2006',
    '#6D28D9',
    '🏢'
  ],
  [
    'seed-fato-30',
    'Em que ano começou a primeira turma do acelerador Techstars?',
    '2007',
    '#7C3AED',
    '🚀'
  ],
  [
    'seed-fato-31',
    'Quantos dólares tinha o primeiro fundo Techstars Ventures lançado em 2009?',
    '5000000 dólares',
    '#16A34A',
    '💰'
  ],
  [
    'seed-fato-32',
    'Quantos milhões de dólares tinha o segundo fundo Techstars Ventures, lançado em 2012?',
    '25 milhões de dólares',
    '#16A34A',
    '💵'
  ],
  [
    'seed-fato-33',
    'Quantos milhões de dólares tinha o terceiro fundo Techstars Ventures, lançado em 2014?',
    '155 milhões de dólares',
    '#16A34A',
    '📈'
  ],
  [
    'seed-fato-34',
    'Em quantas novas cidades o Startup Week se expandiu internacionalmente em 2014?',
    '14 cidades',
    '#0891B2',
    '🌎'
  ],
  [
    'seed-fato-35',
    'Em que ano a Techstars adquiriu a UP Global?',
    '2015',
    '#0F766E',
    '🤝'
  ],
  [
    'seed-fato-36',
    'Quantos anos de existência a Techstars completou em 2026?',
    '20 anos',
    '#F59E0B',
    '🎂'
  ],
  [
    'seed-fato-37',
    'Quantos fundadores a Techstars informa ter apoiado até 2026, em milhares?',
    '11 mil fundadores',
    '#2563EB',
    '👨‍💻'
  ],
  [
    'seed-fato-38',
    'Em que ano a Y Combinator foi fundada?',
    '2005',
    '#F97316',
    '💡'
  ],
  [
    'seed-fato-39',
    'Quantas empresas foram financiadas pela primeira turma de verão da Y Combinator em 2005?',
    '8 empresas',
    '#EA580C',
    '🏭'
  ],
  [
    'seed-fato-40',
    'Quantas empresas se candidataram à primeira turma da Y Combinator em 2005?',
    '200 empresas',
    '#EA580C',
    '📝'
  ],
  [
    'seed-fato-41',
    'Quantos dólares a Y Combinator investia inicialmente por startup em 2005?',
    '12000 dólares',
    '#CA8A04',
    '💰'
  ],
  [
    'seed-fato-42',
    'Quantos dólares a Y Combinator investia inicialmente em uma startup com três fundadores em 2005?',
    '18000 dólares',
    '#CA8A04',
    '👥'
  ],
  [
    'seed-fato-43',
    'Quantos meses durava o programa inicial da Y Combinator em 2005?',
    '3 meses',
    '#7C3AED',
    '⏳'
  ],
  [
    'seed-fato-44',
    'Em que ano o Amazon S3 foi lançado?',
    '2006',
    '#FF9900',
    '☁️'
  ],
  [
    'seed-fato-45',
    'Em que dia de março de 2006 o Amazon S3 foi lançado?',
    '14',
    '#FF9900',
    '📦'
  ],
  [
    'seed-fato-46',
    'Em que ano o Amazon EC2 foi lançado em beta?',
    '2006',
    '#F59E0B',
    '💻'
  ],
  [
    'seed-fato-47',
    'Quantos GB podia ter cada bloco de dados do Amazon S3 no lançamento?',
    '5 GB',
    '#F97316',
    '💾'
  ],
  [
    'seed-fato-48',
    'Qual era a disponibilidade projetada para o Amazon S3 no lançamento, em porcentagem?',
    '99,99%',
    '#16A34A',
    '🛡️'
  ],
  [
    'seed-fato-49',
    'Em que ano a App Store foi lançada?',
    '2008',
    '#A855F7',
    '📱'
  ],
  [
    'seed-fato-50',
    'Quantos aplicativos estavam disponíveis no lançamento da App Store?',
    '500 aplicativos',
    '#9333EA',
    '📲'
  ],
  [
    'seed-fato-51',
    'Quantos aplicativos haviam sido baixados da App Store nos primeiros nove meses?',
    '1000000000 aplicativos',
    '#7E22CE',
    '⬇️'
  ],
  [
    'seed-fato-52',
    'Em quantos meses a App Store alcançou 1 bilhão de downloads?',
    '9 meses',
    '#A855F7',
    '🚀'
  ],
  [
    'seed-fato-53',
    'Em que ano a Tesla começou a produção regular do Roadster?',
    '2008',
    '#DC2626',
    '🚗'
  ],
  [
    'seed-fato-54',
    'Quantos segundos o Tesla Roadster precisava para acelerar de 0 a 60 mph segundo a especificação divulgada em 2008?',
    '3,9 segundos',
    '#EF4444',
    '⚡'
  ],
  [
    'seed-fato-55',
    'Quantos Roadsters haviam sido reservados quando a Tesla iniciou a produção regular em 2008?',
    '900 Roadsters',
    '#B91C1C',
    '🚘'
  ],
  [
    'seed-fato-56',
    'Em que ano o Spotify foi lançado?',
    '2008',
    '#1DB954',
    '🎵'
  ],
  [
    'seed-fato-57',
    'Quantos milhões de assinantes o Spotify ultrapassou em fevereiro de 2023?',
    '200 milhões de assinantes',
    '#15803D',
    '🎧'
  ],
  [
    'seed-fato-58',
    'Em quantos mercados o Spotify estava presente quando ultrapassou 200 milhões de assinantes em 2023?',
    '180 mercados',
    '#16A34A',
    '🌎'
  ],
  [
    'seed-fato-59',
    'Quantos milhões de dólares a Spotify informou ter pago aos detentores de direitos musicais desde sua fundação até dezembro de 2021?',
    '30 bilhões de dólares',
    '#166534',
    '💿'
  ],
  [
    'seed-fato-60',
    'Quantos pedidos de patente foram apresentados mundialmente em 2024?',
    '3725000 pedidos',
    '#0F766E',
    '💡'
  ],
  [
    'seed-fato-61',
    'Quantos pedidos de modelos de utilidade foram apresentados mundialmente em 2024?',
    '3254270 pedidos',
    '#0E7490',
    '⚙️'
  ],
  [
    'seed-fato-62',
    'Quantos pedidos de marcas, em contagem de classes, foram apresentados mundialmente em 2024?',
    '15228300 pedidos',
    '#0891B2',
    '™️'
  ],
  [
    'seed-fato-63',
    'Quantos pedidos de desenhos industriais foram apresentados mundialmente em 2024?',
    '1559400 pedidos',
    '#0369A1',
    '🎨'
  ]
].map(([id, questionText, answerText, color, icon]) =>
  createCard({
    id,
    origin: CardOrigin.SEED,
    question: {
      text: questionText,
      image: demoSvg(icon, color)
    },
    answer: {
      text: answerText,
      image: demoSvg('✓', color)
    },
    now: '2026-09-15T00:00:00.000Z'
  })
));

export async function ensureSeedCards(repository, cards = seedCards) {
  const created = [];

  for (const card of cards) {
    const existing = await repository.find(
      card._id,
      { includeDeleted: true }
    );

    if (!existing) {
      await repository.create(card);
      created.push(card._id);
    }
  }

  return created;
}