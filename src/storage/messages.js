export const messages = (refferCode = 0) => {
  const mArray = [
    `Если вы швейная фабрика и ищете новых заказчиков – попробуйте <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a>. Он находит контакты заказчиков по ИНН, имени, почте и другим данным.`,
    `Шьёте на заказ, но не знаете где искать заказчиков? Я использую <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> – он помогает найти их контакты по открытым источникам.`,
    `Надоело искать клиентов вручную? Через <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> я нашёл сразу несколько заказчиков – бот ищет по ИНН, почтам и именам.`,
    `Если вы производитель одежды – советую <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a>. Удобно искать заказчиков по ИНН или даже имени – бот выдаёт телефоны, мейлы, Telegram.`,
    `С помощью <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> вышел на несколько новых заказчиков. Бот ищет по открытым данным: ИНН, имя, почта и т.д.`,
    `Раньше не знал, где искать заказы. Теперь просто вбиваю ИНН или имя в <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> – и получаю контакты заказчиков.`,
    `Бот <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> помогает швейным фабрикам находить заказчиков. Выдаёт телефоны, мейлы и Telegram по ИНН, имени и другим данным.`,
    `Хотите найти заказчиков на пошив? Попробуйте <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> – находит реальные контакты через открытые источники.`,
    `Для фабрик, кто ищет новых клиентов – <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> помогает быстро получить контакты заказчиков: от телефонов до почт и Telegram.`,
    `Если вы работаете с производством одежды – используйте <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a>. Поиск заказчиков по открытым источникам работает отлично.`,
    `Раньше искал заказчиков через знакомых. Теперь просто вбиваю данные в <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> – и получаю нужные контакты.`,
    `Совет для производств: ищите заказчиков через <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a>. Находит по ИНН, имени, e-mail – выдаёт всё, что нужно для связи.`,
    `Шьёте одежду? Найдите заказчиков через <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> – просто введите ИНН, имя или e-mail.`,
    `Нашёл постоянного заказчика через <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a>. Очень полезный бот для швейных фабрик.`,
    `Фабрикам, кто хочет новых клиентов: <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> помогает выходить на заказчиков напрямую через открытые данные.`,
    `Нужны заказы? <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> ищет контакты заказчиков по ИНН и имени. Работает быстро и удобно.`,
    `Бот <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> упрощает поиск заказчиков для швейных производств. Выдаёт почты, телефоны и Telegram-аккаунты.`,
    `Шьёте? Хотите больше заказов? Просто пробейте потенциальных заказчиков через <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a>.`,
    `Устали искать клиентов вручную? <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> помогает найти нужные контакты буквально за пару минут.`,
    `Нужно расширять производство? Используйте <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> – бот покажет, как связаться с заказчиком напрямую.`,
    `Контакты заказчиков теперь в Telegram. Запустите <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> – и получите телефоны, мейлы и другое.`,
    `Ищете новых заказчиков? Просто введите данные в <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> – и получите их контакты.`,
    `С <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> вы находите нужных заказчиков без посредников – всё через открытые источники.`,
    `Фабрикам, которые ищут стабильные заказы: <a href="https://t.me/searcher_wb_bot?start=ref_${refferCode}">Searcher Bot</a> поможет найти заказчиков и их контакты по базе.`,
  ]
  const mIndex = Math.floor(Math.random() * mArray.length)

  return mArray[mIndex]
};