export const groups = [
    //Testing
    {
      type: 'private',
      id: '-1002771236380',
      invite: 'https://t.me/+cj44sl4Cz5ZjNGZi',
      disabled: true,
    },
    {
      type: 'public',
      id: '-4913838685',
      username: '@hdhdjdhdkks',
      disabled: true,
    },
    {
      type: 'private',
      id: '-4988759533',
      invite: 'https://t.me/+Ah-35thTFuc1MjY6',
      disabled: true,
    },
    //Commercial
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1002043718511',
      username: 'shveinyichat',
      invite: 'https://t.me/shveinyichat',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001783314388',
      username: 'zashivayus',
      invite: 'https://t.me/zashivayus',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001271828092',
      username: 'sewingkg',
      invite: 'https://t.me/sewingkg',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001513633452',
      username: 'sewingchatikk',
      invite: 'https://t.me/sewingchatikk',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001226888472',
      username: 'kg599shv',
      invite: 'https://t.me/kg599shv',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001924996711',
      username: 'proizvodstvakg',
      invite: 'https://t.me/proizvodstvakg',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001402560425',
      username: 'odejda_iz_bishkek',
      invite: 'https://t.me/odejda_iz_bishkek',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001292308331',
      username: 'kgshveya',
      invite: 'https://t.me/kgshveya',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001809488386',
      username: 'lecalo',
      invite: 'https://t.me/lecalo',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001751220405',
      username: 'shveykachat',
      invite: 'https://t.me/shveykachat',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1001162061279',
      username: 'shveya_chat',
      invite: 'https://t.me/shveya_chat',
      disabled: false,
    },
    {
      kind: 'peer',
      peerType: 'chat',
      id: '1002199128401',
      username: 'rynok_dordoy',
      invite: 'https://t.me/rynok_dordoy',
      disabled: false,
    },
  ];

  // storage/groups.js
export const groupsTemplate = [
  // 1) Публічна група
  {
    kind: 'public',
    username: 'public_group',     // можна також 't.me/public_group' або '@public_group'
    title: 'Публічна',
  },

  // 2) Приватна по інвайту
  {
    kind: 'invite',
    invite: 'https://t.me/+VALIDINVITEHASH',
    title: 'Приватна з інвайтом',
    threadId: 1234
  },

  // 3) Кешований peer (канал/супергрупа)
  {
    kind: 'peer',
    peerType: 'channel',
    id: -1002771236380,
    accessHash: '1234567890123456789',
    title: 'Канал (кеш)'
  },

  // 4) Кешований peer (звичайний чат)
  {
    kind: 'peer',
    peerType: 'chat',
    id: -123456789,
    title: 'Чат (кеш)'
  },

  // 5) Приклад з неповними даними — теж ок:
  {
    kind: 'public',
    username: 'just_name' // без title/threads — все одно валідно
  },

  // 6) Тимчасово вимкнена група:
  {
    kind: 'invite',
    invite: 'https://t.me/joinchat/OLDHASH',
    disabled: true,
    title: 'Поки не чіпати'
  },
];
