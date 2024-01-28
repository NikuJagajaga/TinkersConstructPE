const translate = (text: string, ...parameters: any) => {
	text = Translation.translate(text);
	if (parameters.length > 0) {
		return java.lang.String.format(text, parameters.map((obj: any) => "" + obj));
	}
	return text;
};

///
// SMELTERY -> LIQUIDS
///

Translation.addTranslation("TConstruct: Buckets", {
    de: "TConstruct: Eimer",
    id: "TConstruct: Ember",
    it: "TConstruct: Secchi",
    ja: "TConstruct: バケツ",
    ko: "TConstruct: 양동이",
    pl: "TConstruct: Wiadra",
    pt: "TConstruct: Baldes",
    ru: "TConstruct: Жидкости",
    sv: "TConstruct: Hinkar",
    uk: "TConstruct: Відра",
    zh: "TConstruct: 桶"
});
Translation.addTranslation("Molten Iron", {
	de: "Geschmolzenes Eisen",
	id: "Besi Leleh",
	it: "Ferro fuso",
	ja: "溶融した鉄", ko: "녹은 철",
	pl: "Stopione żelazo",
	pt: "Ferro Derretido",
	ru: "Расплавленное железо",
	sv: "Nedsmält järn",
	uk: "Розплавлене залізо",
	zh: "熔融铁"
});
Translation.addTranslation("Molten Iron Bucket", {
	de: "Eimer aus geschmolzenem Eisen",
	id: "Ember Besi Leleh",
	it: "Secchio di ferro fuso",
	ja: "溶融した鉄入りバケツ",
	ko: "녹은 철 양동이",
	pl: "Wiadro stopionego żelaza",
	pt: "Balde de Ferro Derretido",
	ru: "Ведро расплавленного железа",
	sv: "Hink med nedsmält järn",
	uk: "Відро розплавленого заліза",
	zh: "熔融铁桶"
});
Translation.addTranslation("Molten Gold", {
	de: "Geschmolzenes Gold",
	id: "Molten Gold",
	it: "Oro fuso",
	ja: "溶融した金", ko: "녹은 금",
	pl: "Stopione złoto",
	pt: "Ouro Derretido",
	ru: "Расплавленное золото",
	sv: "Nedsmält guld",
	uk: "Розплавлене золото",
	zh: "熔融金"
});
Translation.addTranslation("Molten Gold Bucket", {
	de: "Eimer aus geschmolzenem Gold",
	id: "Molten Gold Bucket",
	it: "Secchio d'oro fuso",
	ja: "溶融した金入りバケツ",
	ko: "녹은 금 양동이",
	pl: "Wiadro stopionego złota",
	pt: "Balde de Ouro Derretido",
	ru: "Ведро расплавленного золото",
	sv: "Hink med nedsmält guld",
	uk: "Відро розплавленого золота",
	zh: "熔融金桶"
});
Translation.addTranslation("Molten Pigiron", {
	de: "Geschmolzenes Roheisen",
	id: "Molten Pigiron",
	it: "Ferro di maiale fuso",
	ja: "溶融した銑鉄",
	ko: "녹은 돼지 선철",
	pl: "Stopione świńskie żelazo",
	pt: "Ferro-Porco Derretido",
	ru: "Расплавленный чугун",
	sv: "Nedsmält grisjärn",
	uk: "Розплавлене свиняче залізо",
	zh: "熔融生铁"
});
Translation.addTranslation("Molten Pigiron Bucket", {
	de: "Eimer aus geschmolzenem Roheisen",
	id: "Molten Pigiron Bucket",
	it: "Secchio di ferro di maiale fuso",
	ja: "溶融した銑鉄入りバケツ",
	ko: "녹은 돼지 선철 양동이",
	pl: "Wiadro stopionego świńskiego żelaza",
	pt: "Balde de Ferro-Porco Derretido",
	ru: "Ведро расплавленного чугуна",
	sv: "Hink med nedsmält grisjärn",
	uk: "Відро розплавленого свинячого заліза",
	zh: "熔融生铁桶"
});
Translation.addTranslation("Molten Cobalt", {
	de: "Geschmolzenes Kobalt",
	id: "Molten Cobalt",
	it: "Cobalto fuso",
	ja: "溶融したコバルト",
	ko: "녹은 코발트",
	pl: "Stopiony kobalt",
	pt: "Cobalto Derretido",
	ru: "Расплавленный кобальт",
	sv: "Nedsmält kobolt",
	uk: "Розплавлений кобальт",
	zh: "熔融钴"
});
Translation.addTranslation("Molten Cobalt Bucket", {
	de: "Eimer mit geschmolzenem Kobalt",
	id: "Molten Cobalt Bucket",
	it: "Secchio di cobalto fuso",
	ja: "溶融したコバルト入りバケツ",
	ko: "녹은 코발트 양동이",
	pl: "Wiadro stopionego kobaltu",
	pt: "Balde de Cobalto Derretido",
	ru: "Ведро расплавленного кобальта",
	sv: "Hink med nedsmält kobolt",
	uk: "Відро розплавленого кобальту",
	zh: "熔融钴桶"
});
Translation.addTranslation("Molten Ardite", {
    de: "Geschmolzenes Ardite",
    id: "Ardite Leleh",
    it: "Ardite Fuso",
    ja: "溶融したアルダイト",
    ko: "녹은 아르다이트",
    pl: "Stopione ardite",
    pt: "Ardite Derretido",
    ru: "Расплавленный ардит",
    sv: "Nedsmält Ardite",
    uk: "Розплавлене ардиту",
    zh: "熔融阿迪特"
});
Translation.addTranslation("Molten Ardite Bucket", {
    de: "Eimer mit geschmolzenem Ardite",
    id: "Ember Ardite Leleh",
    it: "Secchio di Ardite Fuso",
    ja: "溶融したアルダイトのバケツ",
    ko: "녹은 아르다이트 양동이",
    pl: "Wiadro stopionego ardite",
    pt: "Balde de Ardite Derretido",
    ru: "Ведро расплавленного ардита",
    sv: "Hink med nedsmält Ardite",
    uk: "Відро розплавленого ардиту",
    zh: "熔融阿迪特桶"
});
Translation.addTranslation("Molten Manyullyn", {
	de: "Geschmolzener Manyullyn",
	id: "Molten Manyullyn",
	it: "Manyullyn fuso",
	ja: "溶融したマンユリン",
	ko: "녹은 마뉼린",
	pl: "Stopiony Manyullyn",
	pt: "Manyullyn Derretida",
	ru: "Расплавленный манюллин",
	sv: "Nedsmält manyullyn",
	uk: "Розплавлений маньюлін",
	zh: "熔融玛玉灵"
});
Translation.addTranslation("Molten Manyullyn Bucket", {
	de: "Geschmolzener Manyullyn-Eimer",
	id: "Molten Manyullyn Bucket",
	it: "Secchio di Manyullyn fuso",
	ja: "溶融したマンユリン入りバケツ",
	ko: "녹은 마뉼린 양동이",
	pl: "Wiadro stopionego Manyullynu",
	pt: "Balde de Manyullyn Derretida",
	ru: "Ведро расплавленного манюллина",
	sv: "Hink med nedsmält manyullyn",
	uk: "Відро розплавленого маньюліну",
	zh: "熔融玛玉灵桶"
});
Translation.addTranslation("Molten Knightslime", {
	de: "Geschmolzener Ritterschleim",
	id: "Molten Knightslime",
	it: "Slime del cavaliere fuso",
	ja: "溶融したナイトスライム",
	ko: "녹은 기사슬라임",
	pl: "Stopiony rycerski szlam",
	pt: "Cavaleiro-Slime Derretido",
	ru: "Расплавленная слизь из короля слизней",
	sv: "Nedsmält riddarslem",
	uk: "Розплавлений лицарський слиз",
	zh: "熔融骑士史莱姆"
});
Translation.addTranslation("Molten Knightslime Bucket", {
	de: "Geschmolzener Knightslime-Eimer",
	id: "Molten Knightslime Bucket",
	it: "Secchio di slime del cavaliere fuso",
	ja: "溶融したナイトスライム入りバケツ",
	ko: "녹은 기사슬라임 양동이",
	pl: "Wiadro stopionego rycerskiego szlamu",
	pt: "Balde de Cavaleiro-Slime Derretido",
	ru: "Ведро расплавленной слизи из короля слизней",
	sv: "Hink med nedsmält riddarslem",
	uk: "Відро розплавленого лицарського слизу",
	zh: "熔融骑士史莱姆桶"
});
Translation.addTranslation("Molten Aluminum Brass", {
    de: "Geschmolzenes Aluminium-Bronze",
    id: "Besi Perunggu Aluminium Leleh",
    it: "Bronzo Alluminio Fuso",
    ja: "溶融したアルミニウムブロンズ",
    ko: "녹은 알루미늄 브론즈",
    pl: "Stopiony brąz aluminiowy",
    pt: "Bronze de Alumínio Derretido",
    ru: "Расплавленная алюминиевая бронза",
    sv: "Nedsmält aluminiumbrons",
    uk: "Розплавлений алюмінієвий бронза",
    zh: "熔融铝青铜"
});
Translation.addTranslation("Molten Aluminum Bucket", {
    de: "Eimer mit geschmolzenem Aluminium",
    id: "Ember Aluminium Leleh",
    it: "Secchio di Alluminio Fuso",
    ja: "溶融したアルミニウムのバケツ",
    ko: "녹은 알루미늄 양동이",
    pl: "Wiadro stopionego aluminium",
    pt: "Balde de Alumínio Derretido",
    ru: "Ведро расплавленной алюминиевой бронзы",
    sv: "Hink med nedsmält aluminium",
    uk: "Відро розплавленого алюмінієвого бронзи",
    zh: "熔融铝桶"
});
Translation.addTranslation("Molten Brass", {
	de: "Geschmolzenes Messing",
	id: "Molten Brass",
	it: "Ottone fuso",
	ja: "溶融した黄銅", ko: "녹은 황동",
	pl: "Stopiony mosiądz",
	pt: "Latão Derretido",
	ru: "Расплавленная латунь",
	sv: "Nedsmält mässing",
	uk: "Розплавлена латунь",
	zh: "熔融黄铜"
});
Translation.addTranslation("Molten Brass Bucket", {
	de: "Eimer aus geschmolzenem Messing",
	id: "Molten Brass Bucket",
	it: "Secchio di ottone fuso",
	ja: "溶融した黄銅入りバケツ",
	ko: "녹은 황동 양동이",
	pl: "Wiadro stopionego mosiądzu",
	pt: "Balde de Latão Derretido",
	ru: "Ведро расплавленной латуни",
	sv: "Hink med nedsmält mässing",
	uk: "Відро розплавленої латуні",
	zh: "熔融黄铜桶"
});
Translation.addTranslation("Molten Copper", {
	de: "Geschmolzenes Kupfer",
	id: "Molten Copper",
	it: "Rame fuso",
	ja: "溶融した銅", ko: "녹은 구리",
	pl: "Stopiona miedź",
	pt: "Cobre Derretido",
	ru: "Расплавленная медь",
	sv: "Nedsmält koppar",
	uk: "Розплавлена мідь",
	zh: "熔融铜"
});
Translation.addTranslation("Molten Copper Bucket", {
	de: "Eimer aus geschmolzenem Kupfer",
	id: "Molten Copper Bucket",
	it: "Secchio di rame fuso",
	ja: "溶融した銅入りバケツ",
	ko: "녹은 구리 양동이",
	pl: "Wiadro stopionej miedzi",
	pt: "Balde de Cobre Derretido",
	ru: "Ведро расплавленной меди",
	sv: "Hink med nedsmält koppar",
	uk: "Відро розплавленої міді",
	zh: "熔融铜桶"
});
Translation.addTranslation("Molten Tin", {
	de: "Geschmolzenes Zinn",
	id: "Molten Tin",
	it: "Stagno fuso",
	ja: "溶融した錫", ko: "녹은 주석",
	pl: "Stopiona cyna",
	pt: "Estanho Derretido",
	ru: "Расплавленное олово",
	sv: "Nedsmält tenn",
	uk: "Розплавлене олово",
	zh: "熔融锡"
});
Translation.addTranslation("Molten Tin Bucket", {
	de: "Eimer aus geschmolzenem Zinn",
	id: "Molten Tin Bucket",
	it: "Secchio di stagno fuso",
	ja: "溶融した錫入りバケツ",
	ko: "녹은 주석 양동이",
	pl: "Wiadro stopionej cyny",
	pt: "Balde de Estanho Derretido",
	ru: "Ведро расплавленного олова",
	sv: "Hink med nedsmält tenn",
	uk: "Відро розплавленого олова",
	zh: "熔融锡桶"
});
Translation.addTranslation("Molten Bronze", {
	de: "Geschmolzene Bronze",
	id: "Molten Bronze",
	it: "Bronzo fuso",
	ja: "溶融した青銅", ko: "녹은 청동",
	pl: "Stopiony brąz",
	pt: "Bronze Derretido",
	ru: "Расплавленная бронза",
	sv: "Nedsmält brons",
	uk: "Розплавлена бронза",
	zh: "熔融青铜"
});
Translation.addTranslation("Molten Bronze Bucket", {
	de: "Eimer aus geschmolzener Bronze",
	id: "Molten Bronze Bucket",
	it: "Secchio di bronzo fuso",
	ja: "溶融した青銅入りバケツ",
	ko: "녹은 청동 양동이",
	pl: "Wiadro stopionego brązu",
	pt: "Balde de Bronze Derretido",
	ru: "Ведро расплавленной бронзы",
	sv: "Hink med nedsmält brons",
	uk: "Відро розплавленої бронзи",
	zh: "熔融青铜桶"
});
Translation.addTranslation("Molten Zinc", {
	de: "Geschmolzenes Zink",
	id: "Molten Zinc",
	it: "Zinco fuso",
	ja: "溶融した亜鉛", ko: "녹은 아연",
	pl: "Stopiony cynk",
	pt: "Zinco Derretido",
	ru: "Расплавленный цинк",
	sv: "Nedsmält zink",
	uk: "Розплавлений цинк",
	zh: "熔融锌"
});
Translation.addTranslation("Molten Zinc Bucket", {
	de: "Eimer für geschmolzenes Zink",
	id: "Molten Zinc Bucket",
	it: "Secchio di zinco fuso",
	ja: "溶融した亜鉛入りバケツ",
	ko: "녹은 아연 양동이",
	pl: "Wiadro stopionego cynku",
	pt: "Balde de Zinco Derretido",
	ru: "Ведро расплавленного цинка",
	sv: "Hink med nedsmält zink",
	uk: "Відро розплавленого цинку",
	zh: "熔融锌桶"
});
Translation.addTranslation("Molten Lead", {
	de: "Geschmolzenes Blei",
	id: "Molten Lead",
	it: "Piombo fuso",
	ja: "溶融した鉛", ko: "녹은 납",
	pl: "Stopiony ołów",
	pt: "Chumbo Derretido",
	ru: "Расплавленный свинец",
	sv: "Nedsmält bly",
	uk: "Розплавлений свинець",
	zh: "熔融铅"
});
Translation.addTranslation("Molten Lead Bucket", {
	de: "Geschmolzener Bleieimer",
	id: "Molten Lead Bucket",
	it: "Secchio di piombo fuso",
	ja: "溶融した鉛入りバケツ",
	ko: "녹은 납 양동이",
	pl: "Wiadro stopionego ołowiu",
	pt: "Balde de Chumbo Derretido",
	ru: "Ведро расплавленного свинца",
	sv: "Hink med nedsmält bly",
	uk: "Відро розплавленого свинцю",
	zh: "熔融铅桶"
});
Translation.addTranslation("Molten Nickel", {
	de: "Geschmolzenes Nickel",
	id: "Molten Nickel",
	it: "Nichel fuso",
	ja: "溶融したニッケル",
	ko: "녹은 니켈",
	pl: "Stopiony nikiel",
	pt: "Níquel Derretido",
	ru: "Расплавленный никель",
	sv: "Nedsmält nickel",
	uk: "Розплавлений нікель",
	zh: "熔融镍"
});
Translation.addTranslation("Molten Nickel Bucket", {
	de: "Eimer für geschmolzenes Nickel",
	id: "Molten Nickel Bucket",
	it: "Secchio di nichel fuso",
	ja: "溶融したニッケル入りバケツ",
	ko: "녹은 니켈 양동이",
	pl: "Wiadro stopionego niklu",
	pt: "Balde de Níquel Derretido",
	ru: "Ведро расплавленного никеля",
	sv: "Hink med nedsmält nickel",
	uk: "Відро розплавленого нікелю",
	zh: "熔融镍桶"
});
Translation.addTranslation("Molten Silver", {
	de: "Geschmolzenes Silber",
	id: "Molten Silver",
	it: "Argento fuso",
	ja: "溶融した銀", ko: "녹은 은",
	pl: "Stopione srebro",
	pt: "Prata Derretida",
	ru: "Расплавленное серебро",
	sv: "Nedsmält silver",
	uk: "Розплавлене срібло",
	zh: "熔融银"
});
Translation.addTranslation("Molten Silver Bucket", {
	de: "Geschmolzener Silbereimer",
	id: "Molten Silver Bucket",
	it: "Secchio d'argento fuso",
	ja: "溶融した銀入りバケツ",
	ko: "녹은 은 양동이",
	pl: "Wiadro stopionego srebra",
	pt: "Balde de Prata Derretida",
	ru: "Ведро расплавленного серебра",
	sv: "Hink med nedsmält silver",
	uk: "Відро розплавленого срібла",
	zh: "熔融银桶"
});
Translation.addTranslation("Molten Electrum", {
	de: "Geschmolzenes Elektrum",
	id: "Molten Electrum",
	it: "Elettro fuso",
	ja: "溶融したエレクトラム",
	ko: "녹은 호박금",
	pl: "Stopione elektrum",
	pt: "Electrio Derretido",
	ru: "Расплавленный электрум",
	sv: "Nedsmält elektrum",
	uk: "Розплавлений електрум",
	zh: "熔融琥珀金"
});
Translation.addTranslation("Molten Electrum Bucket", {
	de: "Eimer mit geschmolzenem Elektrum",
	id: "Molten Electrum Bucket",
	it: "Secchio di Elettro fusa",
	ja: "溶融したエレクトラム入りバケツ",
	ko: "녹은 호박금 양동이",
	pl: "Wiadro stopionego elektrum",
	pt: "Balde de Electrio Derretido",
	ru: "Ведро расплавленного электрума",
	sv: "Hink med nedsmält elektrum",
	uk: "Відро розплавленого електруму",
	zh: "熔融琥珀金桶"
});
Translation.addTranslation("Molten Steel", {
	de: "Geschmolzener Stahl",
	id: "Molten Steel",
	it: "Acciaio fuso",
	ja: "溶融した鋼鉄", ko: "녹은 강철",
	pl: "Stopiona stal",
	pt: "Aço Derretido",
	ru: "Расплавленная сталь",
	sv: "Nedsmält stål",
	uk: "Розплавлена сталь",
	zh: "熔融钢"
});
Translation.addTranslation("Molten Steel Bucket", {
	de: "Eimer aus geschmolzenem Stahl",
	id: "Molten Steel Bucket",
	it: "Secchio di acciaio fuso",
	ja: "溶融した鋼鉄入りバケツ",
	ko: "녹은 강철 양동이",
	pl: "Wiadro stopionej stali",
	pt: "Balde de Aço Derretido",
	ru: "Ведро расплавленной стали",
	sv: "Hink med nedsmält stål",
	uk: "Відро розплавленої сталі",
	zh: "熔融钢桶"
});
Translation.addTranslation("Molten Aluminum", {
	de: "Geschmolzenes Aluminium",
	id: "Molten Aluminum",
	it: "Alluminio fuso",
	ja: "溶融したアルミニウム",
	ko: "녹은 알루미늄",
	pl: "Stopione aluminium",
	pt: "Aluminio Derretido",
	ru: "Расплавленный алюминий",
	sv: "Nedsmält aluminium",
	uk: "Розплавлений алюміній",
	zh: "熔融铝"
});
Translation.addTranslation("Molten Aluminum Bucket", {
	de: "Eimer für geschmolzenes Aluminium",
	id: "Molten Aluminum Bucket",
	it: "Secchio di alluminio fuso",
	ja: "溶融したアルミニウム入りバケツ",
	ko: "녹은 알루미늄 양동이",
	pl: "Wiadro stopionego aluminium",
	pt: "Balde de Aluminio Derretido",
	ru: "Ведро расплавленного алюминия",
	sv: "Hink med nedsmält aluminium",
	uk: "Відро розплавленого алюмінію",
	zh: "熔融铝桶"
});
Translation.addTranslation("Seared Stone", {
	de: "Versengter Stein",
	id: "Seared Stone",
	it: "Pietra scottata",
	ja: "焼成石", ko: "그을린 돌",
	pl: "Suszony kamień",
	pt: "Pedra Carbonizada",
	ru: "Обожженный камень",
	sv: "Bränd sten",
	uk: "Обпалений камінь",
	zh: "焦黑石"
});
Translation.addTranslation("Seared Stone Bucket", {
	de: "Seared Stone Bucket",
	id: "Ember Batu hangus Leleh",
	it: "Secchio di pietra scottata",
	ja: "溶融した焼成石入りバケツ",
	ko: "녹은 그을린 돌 양동이",
	pl: "Wiadro suszonego kamienia",
	pt: "Balde de Pedra Carbonizada",
	ru: "Ведро обожженного камня",
	sv: "Hink med bränd sten",
	uk: "Відро обпаленого каменю",
	zh: "焦黑熔石桶"
});
Translation.addTranslation("Molten Obsidian", {
	de: "Geschmolzener Obsidian",
	id: "Obsidian Leleh",
	it: "Ossidiana fusa",
	ja: "溶融した黒曜石",
	ko: "녹은 흑요석",
	pl: "Stopiony obsydian",
	pt: "Obsidian Derretida",
	ru: "Расплавленный обсидиан",
	sv: "Nedsmält obsidian",
	uk: "Розплавлений обсидіан",
	zh: "熔融黑曜石"
});
Translation.addTranslation("Molten Obsidian Bucket", {
	de: "Eimer aus geschmolzenem Obsidian",
	id: "Ember Obsidian Leleh",
	it: "Secchio di ossidiana fusa",
	ja: "溶融した黒曜石入りバケツ",
	ko: "녹은 흑요석 양동이",
	pl: "Wiadro stopionego obsydianu",
	pt: "Balde de Obsidian Derretida",
	ru: "Ведро расплавленного обсидиана",
	sv: "Hink med nedsmält obsidian",
	uk: "Відро розплавленого обсидіану",
	zh: "熔融黑曜石桶"
});
Translation.addTranslation("Molten Clay", {
	de: "Geschmolzener Ton",
	id: "Terakota Leleh",
	it: "Argilla fusa",
	ja: "溶融した粘土", ko: "녹은 점토",
	pl: "Stopiona glina",
	pt: "Argila Derretida",
	ru: "Расплавленная глина",
	sv: "Nedsmält gyttja",
	uk: "Розплавлена глина",
	zh: "熔融黏土"
});
Translation.addTranslation("Molten Clay Bucket", {
	de: "Geschmolzener Lehmeimer",
	id: "Ember Terakota Leleh",
	it: "Secchio di argilla fusa",
	ja: "溶融した粘土入りバケツ",
	ko: "녹은 점토 양동이",
	pl: "Wiadro stopionej gliny",
	pt: "Balde de Argila Derretida",
	ru: "Ведро расплавленной глины",
	sv: "Hink med nedsmält lera",
	uk: "Відро розплавленої глини",
	zh: "熔融黏土桶"
});
Translation.addTranslation("Liquid Dirt", {
    de: "Flüssiger Schmutz",
    id: "Lumpur Cair",
    it: "Fango Liquido",
    ja: "液体の泥",
    ko: "액체 진흙",
    pl: "Ciekły Brud",
    pt: "Lama Líquida",
    ru: "Жидкая земля",
    sv: "Flytande smuts",
    uk: "Рідка земля",
    zh: "液态泥土"
});
Translation.addTranslation("Liquid Dirt Bucket", {
    de: "Eimer mit flüssigem Schmutz",
    id: "Ember Lumpur Cair",
    it: "Secchio di Fango Liquido",
    ja: "液体の泥のバケツ",
    ko: "액체 진흙 양동이",
    pl: "Wiadro Ciekłego Brudu",
    pt: "Balde de Lama Líquida",
    ru: "Ведро жидкой земли",
    sv: "Hink med flytande smuts",
    uk: "Відро рідкої землі",
    zh: "液态泥桶"
});
Translation.addTranslation("Molten Emerald", {
	de: "Geschmolzener Smaragd",
	id: "Zamrud Leleh",
	it: "Smeraldo fuso",
	ja: "溶融したエメラルド",
	ko: "녹은 에메랄드",
	pl: "Stopiony szmaragd",
	pt: "Esmeralda Derretida",
	ru: "Расплавленный изумруд",
	sv: "Nedsmält smaragd",
	uk: "Розплавлений смарагд",
	zh: "熔融绿宝石"
});
Translation.addTranslation("Molten Emerald Bucket", {
	de: "Geschmolzener Smaragdeimer",
	id: "Ember Zamrud Leleh",
	it: "Secchio di smeraldo fuso",
	ja: "溶融したエメラルド入りバケツ",
	ko: "녹은 에메랄드 양동이",
	pl: "Wiadro stopionego szmaragdu",
	pt: "Balde de Esmeralda Derretida",
	ru: "Ведро расплавленного изумруда",
	sv: "Hink med nedsmält smaragd",
	uk: "Відро розплавленого смарагду",
	zh: "熔融绿宝石桶"
});
Translation.addTranslation("Molten Glass", {
	de: "Geschmolzenes Glas",
	id: "Kaca Leleh",
	it: "Vetro fuso",
	ja: "溶融したガラス",
	ko: "녹은 유리",
	pl: "Stopione szkło",
	pt: "Vidro Derretido",
	ru: "Расплавленное стекло",
	sv: "Nedsmält glas",
	uk: "Розплавлене скло",
	zh: "熔融玻璃"
});
Translation.addTranslation("Molten Glass Bucket", {
	de: "Eimer aus geschmolzenem Glas",
	id: "Ember Kaca Leleh",
	it: "Secchio di vetro fuso",
	ja: "溶融したガラス入りバケツ",
	ko: "녹은 유리 양동이",
	pl: "Wiadro stopionego szkła",
	pt: "Balde de Vidro Derretido",
	ru: "Ведро расплавленного стекла",
	sv: "Hink med nedsmält glas",
	uk: "Відро розплавленого скла",
	zh: "熔融玻璃桶"
});
Translation.addTranslation("Blood", { de: "Blut", id: "Blood", it: "Sangue", ja: "血", ko: "피", pl: "Krew", pt: "Sangue", ru: "Кровь", sv: "Blod", uk: "Кров", zh: "血" });
Translation.addTranslation("Bucket o' Blood", {
	de: "Bucket of Blood",
	id: "Ember Darah",
	it: "Secchio di sangue",
	ja: "血液入りバケツ",
	ko: "피 양동이",
	pl: "Wiadro krwi",
	pt: "Balde de Sangue",
	ru: "Ведро крови",
	sv: "Blodhink",
	uk: "Відро крови",
	zh: "血桶"
});
Translation.addTranslation("Liquid Purple Slime", {
    de: "Flüssiger lila Schleim",
    id: "Lumpur Ungu Cair",
    it: "Melma Viola Liquida",
    ja: "液体の紫スライム",
    ko: "액체 보라색 슬라임",
    pl: "Ciekły fioletowy śluz",
    pt: "Lama Roxa Líquida",
    ru: "Жидкая фиолетовая слизь",
    sv: "Flytande lila slem",
    uk: "Рідка фіолетова слизь",
    zh: "液态紫色史莱姆"
});
Translation.addTranslation("Liquid Purple Slime Bucket", {
    de: "Eimer mit flüssigem lila Schleim",
    id: "Ember Lumpur Ungu Cair",
    it: "Secchio di Melma Viola Liquida",
    ja: "液体の紫スライムのバケツ",
    ko: "액체 보라색 슬라임 양동이",
    pl: "Wiadro ciekłego fioletowego śluzu",
    pt: "Balde de Lama Roxa Líquida",
    ru: "Ведро жидкой фиолетовой слизи",
    sv: "Hink med flytande lila slem",
    uk: "Відро рідкої фіолетової слизі",
    zh: "液态紫色史莱姆桶"
});

///
// SMELTERY -> BLOCKS
///

Translation.addTranslation("[TConstuct]: Invalid alloy recipe -> %s", {
    de: "[TConstruct]: Ungültiges Legierungsrezept -> %s",
    id: "[TConstruct]: Resep paduan tidak valid -> %s",
    it: "[TConstruct]: Ricetta di lega non valida -> %s",
    ja: "[TConstruct]: 無効な合金レシピ -> %s",
    ko: "[TConstruct]: 잘못된 합금 레시피 -> %s",
    pl: "[TConstruct]: Nieprawidłowy przepis na stop -> %s",
    pt: "[TConstruct]: Receita de liga inválida -> %s",
    ru: "[TConstruct]: Некорректный рецепт сплава -> %s",
    sv: "[TConstruct]: Ogiltigt legeringsrecept -> %s",
    uk: "[TConstruct]: Некоректний рецепт сплаву -> %s",
    zh: "[TConstruct]: 无效的合金配方 -> %s"
});
Translation.addTranslation("Grout", {
	de: "Mörtel", id: "Grout", it: "Grout", ja: "グラウト", ko: "그라우트",
	pl: "Zaprawa",
	pt: "Grout",
	ru: "Цементный раствор",
	sv: "Grout", uk: "Цемент", zh: "砖泥"
});
Translation.addTranslation("Seared Brick", {
	de: "Angebrannter Ziegel",
	id: "Seared Brick",
	it: "Mattone scottato",
	ja: "焼成レンガ", ko: "그을린 벽돌",
	pl: "Suszona kamienna cegła",
	pt: "Tijolo Carbonizado",
	ru: "Обожженный кирпич",
	sv: "Bränd tegelsten",
	uk: "Обпалена цеглина",
	zh: "焦黑砖"
});
Translation.addTranslation("Seared Stone", {
	de: "Versengter Stein",
	id: "Seared Stone",
	it: "Pietra scottata",
	ja: "焼成石", ko: "그을린 돌",
	pl: "Suszony kamień",
	pt: "Pedra Carbonizada",
	ru: "Обожженный камень",
	sv: "Bränd sten",
	uk: "Обпалений камінь",
	zh: "焦黑石"
});
Translation.addTranslation("Seared Cobblestone", {
	de: "Versengter Kopfsteinpflaster",
	id: "Seared Cobblestone",
	it: "Ciottoli scottati",
	ja: "焼成丸石",
	ko: "그을린 조약돌",
	pl: "Suszony bruk",
	pt: "Pedregulho Carbonizado",
	ru: "Обожженный булыжник",
	sv: "Bränd kullersten",
	uk: "Обпалений кругляк",
	zh: "焦黑圆石"
});
Translation.addTranslation("Seared Paver", {
	de: "Verbrannte Pflastersteine",
	id: "Seared Paver",
	it: "Pavimentazione scottata",
	ja: "舗装された焼成石",
	ko: "매끄러운 그을린 돌",
	pl: "Suszona kafelka chodnikowa",
	pt: "Asfalto Carbonizado",
	ru: "Обожженная брусчатка",
	sv: "Bränd gatsten",
	uk: "Обпалена бруківка",
	zh: "焦黑地砖"
});
Translation.addTranslation("Seared Bricks", {
	de: "Angebrannte Ziegel",
	id: "Seared Bricks",
	it: "Mattoni scottati",
	ja: "焼成レンガ", ko: "그을린 벽돌",
	pl: "Suszone kamienne cegły",
	pt: "Tijolos Carbonizados",
	ru: "Обожженные кирпичи",
	sv: "Bränd mursten",
	uk: "Обпалена цегла",
	zh: "焦黑砖块"
});
Translation.addTranslation("Cracked Seared Bricks", {
	de: "Gebrochene verbrannte Ziegel",
	id: "Cracked Seared Bricks",
	it: "Mattoni scottati incrinati",
	ja: "ひび割れた焼成レンガ",
	ko: "금 간 그을린 벽돌",
	pl: "Popękane suszone kamienne cegły",
	pt: "Tijolos Rachados Carbonizados",
	ru: "Потрескавшиеся обожженные кирпичи",
	sv: "Sprucket bränt tegel",
	uk: "Тріснута обпалена цегла",
	zh: "裂纹焦黑砖块"
});
Translation.addTranslation("Fancy Seared Bricks", {
	de: "Ausgefallene verbrannte Ziegel",
	id: "Fancy Seared Bricks",
	it: "Mattoni scottati di lusso",
	ja: "おしゃれな焼成レンガ",
	ko: "장식된 그을린 벽돌",
	pl: "Ozdobne suszone kamienne cegły",
	pt: "Tijolo Extravagante Carbonizado",
	ru: "Причудливые обожженные кирпичи",
	sv: "Snyggt bränt tegel",
	uk: "Вишукана обпалена цегла",
	zh: "精致焦黑砖块"
});
Translation.addTranslation("Square Seared Bricks", {
    de: "Quadratische gebrannte Ziegel",
    id: "Bata Bakar Kotak",
    it: "Mattoni Bruciati Quadrati",
    ja: "焼き締められた四角いレンガ",
    ko: "사각형 모양의 구운 벽돌",
    pl: "Kwadratowe wypalone cegły",
    pt: "Tijolos Queimados Quadrados",
    ru: "Квадратные обожженные кирпичи",
    sv: "Kvadratiska brända tegelstenar",
    uk: "Квадратні випалені цегли",
    zh: "方形烧制砖块"
});
Translation.addTranslation("Seared Road", {
    de: "Gebrannte Straße",
    id: "Jalan Bakar",
    it: "Strada Bruciata",
    ja: "焼き締められた道",
    ko: "구운 도로",
    pl: "Wypalona droga",
    pt: "Estrada Queimada",
    ru: "Обожженная тропа",
    sv: "Bränd väg",
    uk: "Випалена дорога",
    zh: "烧制道路"
});
Translation.addTranslation("Seared Creeperface", {
    de: "Gebranntes Creeper-Gesicht",
    id: "Wajah Creeper Bakar",
    it: "Faccia di Creeper Bruciata",
    ja: "焼き締められたクリーパーの顔",
    ko: "구운 크리퍼 얼굴",
    pl: "Wypalona twarz Creepera",
    pt: "Rosto Queimado do Creeper",
    ru: "Обожженная резная брусчатка",
    sv: "Bränd Creeperansikte",
    uk: "Випалене обличчя Кріпера",
    zh: "烧制苦力怕脸"
});
Translation.addTranslation("Triangle Seared Bricks", {
	de: "Dreieck angebratene Ziegel",
	id: "Triangle Seared Bricks",
	it: "Triangolo di mattoni scottati",
	ja: "三角柄の焼成レンガ",
	ko: "조각된 그을린 벽돌",
	pl: "Trójkątne suszone kamienne cegły",
	pt: "Tijolo Triangular Carbonizado",
	ru: "Треугольные обожженные кирпичи",
	sv: "Bränt tegel med triangelmönster",
	uk: "Трикутна обпалена цегла",
	zh: "三角纹焦黑砖块"
});
Translation.addTranslation("Small Seared Bricks", {
    de: "Kleine gebrannte Ziegel",
    id: "Bata Bakar Kecil",
    it: "Mattoncini Bruciati",
    ja: "焼き締められた小さなレンガ",
    ko: "작은 구운 벽돌",
    pl: "Małe wypalone cegły",
    pt: "Tijolos Queimados Pequenos",
    ru: "Обожженные кирпичики",
    sv: "Små brända tegelstenar",
    uk: "Випалені цеглики",
    zh: "小烧制砖块"
});
Translation.addTranslation("Seared Tiles", {
    de: "Gebrannte Fliesen",
    id: "Lantai Bakar",
    it: "Piastrelle Bruciate",
    ja: "焼き締められたタイル",
    ko: "구운 타일",
    pl: "Wypalone płytki",
    pt: "Azulejos Queimados",
    ru: "Обожженная плитка",
    sv: "Brända plattor",
    uk: "Випалена плитка",
    zh: "烧制瓷砖"
});
Translation.addTranslation("Seared Tanks", {
    de: "Gebrannte Tanks",
    id: "Tangki Bakar",
    it: "Serbatoi Bruciati",
    ja: "焼き締められたタンク",
    ko: "구운 탱크",
    pl: "Wypalone zbiorniki",
    pt: "Tanques Queimados",
    ru: "Обоженные резервуары",
    sv: "Brända tankar",
    uk: "Випалені резервуари",
    zh: "烧制储罐"
});
Translation.addTranslation("Seared Fuel Tank", {
	de: "Versengter Kraftstofftank",
	id: "Seared Fuel Tank",
	it: "Serbatoio di carburante scottato",
	ja: "焼成石の燃料タンク",
	ko: "그을린 연료 탱크",
	pl: "Suszony kamienny zbiornik paliwowy",
	pt: "Tanque de Combustivel Carbonizado",
	ru: "Обожженный жидкостный резервуар",
	sv: "Bränd bränsletank",
	uk: "Обпалений паливний резервуар",
	zh: "焦黑燃料储罐"
});
Translation.addTranslation("Seared Fuel Gauge", {
	de: "Versengte Tankanzeige",
	id: "Seared Fuel Gauge",
	it: "Indicatore del carburante scottato",
	ja: "焼成石の燃料ゲージ",
	ko: "그을린 연료 계기 탱크",
	pl: "Suszony kamienny mierniczy zbiornik paliwowy",
	pt: "Indicador de Combustivel Carbonizado",
	ru: "Обожженный топливомерный резервуар",
	sv: "Bränd bränslemätare",
	uk: "Обпалений паливний вимірювач",
	zh: "焦黑燃料量器"
});
Translation.addTranslation("Seared Ingot Tank", {
	de: "Versengter Barrentank",
	id: "Seared Ingot Tank",
	it: "Serbatoio del lingotto scottato",
	ja: "焼成石のインゴットタンク",
	ko: "그을린 금속 탱크",
	pl: "Suszony kamienny zbiornik na metale",
	pt: "Tanque de Lingote Carbonizado",
	ru: "Обожженный резервуар для слитков",
	sv: "Bränd tackatank",
	uk: "Обпалений злитковий резервуар",
	zh: "焦黑材料储罐"
});
Translation.addTranslation("Seared Ingot Gauge", {
	de: "Seared Barrenlehre",
	id: "Seared Ingot Gauge",
	it: "Indicatore del lingotto scottato",
	ja: "焼成石のインゴットゲージ",
	ko: "그을린 금속 계기 탱크",
	pl: "Suszony kamienny zbiornik mierniczy na metale",
	pt: "Medidor de Lingote Carbonizado",
	ru: "Обожженный слиткомерный резервуар",
	sv: "Bränd tackamätare",
	uk: "Обпалений злитковий вимірювач",
	zh: "焦黑材料量器"
});
Translation.addTranslation("Seared Drain", {
	de: "Versengter Abfluss",
	id: "Seared Drain",
	it: "Scolo scottato",
	ja: "焼成石のドレン",
	ko: "그을린 배출구",
	pl: "Suszony kamienny odpływ",
	pt: "Escorrimento Carbonizado",
	ru: "Обожженный слив",
	sv: "Bränd brunn",
	uk: "Випалений злив",
	zh: "焦黑排液孔"
});
Translation.addTranslation("Seared Faucet", {
	de: "Versengter Wasserhahn",
	id: "Seared Faucet",
	it: "Rubinetto scottato",
	ja: "焼成石の蛇口",
	ko: "그을린 주조용 꼭지",
	pl: "Suszona kamienna rynna",
	pt: "Torneira Carbonizada",
	ru: "Обожженный кран",
	sv: "Bränd kran",
	uk: "Обпалений кран",
	zh: "焦黑浇注口"
});
Translation.addTranslation("Casting Table", {
	de: "Gießtisch",
	id: "Casting Table",
	it: "Tavolo di fusione",
	ja: "鋳造台", ko: "주조대",
	pl: "Stół odlewniczy",
	pt: "Mesa de Fundição",
	ru: "Литейный стол",
	sv: "Avgjutningsbänk",
	uk: "Ливарний стіл",
	zh: "铸件台"
});
Translation.addTranslation("Casting Basin", {
	de: "Gießbecken",
	id: "Casting Basin",
	it: "Bacinella di fusione",
	ja: "鋳造鉢", ko: "쇳물받이",
	pl: "Kocioł odlewniczy",
	pt: "Bacia de Fundição",
	ru: "Литейный резервуар",
	sv: "Avgjutningskar",
	uk: "Ливарний резервуар",
	zh: "铸造盆"
});
Translation.addTranslation("Smeltery Controller", {
	de: "Schmelzsteuerung",
	id: "Smeltery Controller",
	it: "Controllore della fonderia",
	ja: "乾式製錬炉コントローラー",
	ko: "제련소 관리기",
	pl: "Kontroler pieca metalurgicznego",
	pt: "Controlador de fundição",
	ru: "Контроллер плавильни",
	sv: "Smältverkskontroll",
	uk: "Контролер плавильні",
	zh: "冶炼炉控制器"
});
Translation.addTranslation("Smeltery", {
	de: "Schmelzerei",
	id: "Smeltery",
	it: "Fonderia",
	ja: "乾式製錬炉", ko: "제련소",
	pl: "Piec metalurgiczny",
	pt: "Fundição",
	ru: "Плавильня",
	sv: "Smältverk",
	uk: "Плавильня",
	zh: "冶炼炉"
});
Translation.addTranslation("Dump", {
    de: "Entsorgen",
    id: "Buang",
    it: "Svuota",
    ja: "ダンプ",
    ko: "버리기",
    pl: "Wyrzuć",
    pt: "Descartar",
    ru: "Слив",
    sv: "Dumpa",
    uk: "Скинути",
    zh: "倾倒"
});
Translation.addTranslation("Invalid block inside the structure", {
	de: "Ungültiger Block innerhalb der Struktur",
	id: "Invalid block inside the structure",
	it: "Blocco non valido all'interno della struttura",
	ja: "構造内に無効なブロックがあります",
	ko: "구조물 내부의 블록이 잘못되었습니다",
	pl: "Nieprawidłowy blok we wnętrzu struktury",
	pt: "Bloco inválido dentro da estrutura",
	ru: "Недопустимый блок внутри структуры",
	sv: "Ogiltigt block inuti strukturen",
	uk: "Invalid block inside the structure",
	zh: "结构内部存在无效方块"
});

///
// RESOURCES
///

Translation.addTranslation("Ores", {
    de: "Erze",
    id: "Batu",
    it: "Minerali",
    ja: "鉱石",
    ko: "광석",
    pl: "Rudy",
    pt: "Minérios",
    ru: "Руды",
    sv: "Malm",
    uk: "Руди",
    zh: "矿石"
});
Translation.addTranslation("Cobalt Ore", {
    de: "Kobalterz",
    id: "Batu Kobalt",
    it: "Minerale di Cobalto",
    ja: "コバルト鉱石",
    ko: "코발트 광석",
    pl: "Ruda Kobaltu",
    pt: "Minério de Cobalto",
    ru: "Кобальтовая руда",
    sv: "Koboltmalm",
    uk: "Кобальтова руда",
    zh: "钴矿石"
});
Translation.addTranslation("Ardite Ore", {
    de: "Arditerz",
    id: "Batu Ardite",
    it: "Minerale di Ardite",
    ja: "アルダイト鉱石",
    ko: "아르다이트 광석",
    pl: "Ruda Ardytu",
    pt: "Minério de Ardite",
    ru: "Ардитовая руда",
    sv: "Arditmalm",
    uk: "Ардитова руда",
    zh: "阿迪特矿石"
});
Translation.addTranslation("Block of Knightslime", {
	de: "Knightslime-Block",
	id: "Blok Knightslime",
	it: "Blocco di slime del cavaliere",
	ja: "ナイトスライムブロック",
	ko: "기사슬라임 블록",
	pl: "Blok rycerskiego szlamu",
	pt: "Bloco de Cavaleiro-Slime",
	ru: "Блок слизи из короля слизней",
	sv: "Riddarslemsblock",
	uk: "Блок лицарського слизу",
	zh: "骑士史莱姆块"
});
Translation.addTranslation("Block of Cobalt", {
	de: "Kobaltblock",
	id: "Block Kobalt",
	it: "Blocco di cobalto",
	ja: "コバルトブロック",
	ko: "코발트 블록",
	pl: "Blok kobaltu",
	pt: "Bloco de Cobalto",
	ru: "Кобальтовый блок",
	sv: "Koboltblock",
	uk: "Кобальтовий блок",
	zh: "钴块"
});
Translation.addTranslation("Block of Ardite", {
    de: "Arditblock",
    id: "Blok Ardite",
    it: "Blocco di Ardite",
    ja: "アルダイトブロック",
    ko: "아르다이트 블록",
    pl: "Blok Ardytu",
    pt: "Bloco de Ardite",
    ru: "Ардитовый блок",
    sv: "Arditblock",
    uk: "Ардитовий блок",
    zh: "阿迪特方块"
});
Translation.addTranslation("Block of Manyullyn", {
	de: "Block von Manyullyn",
	id: "Blok Manyullyn",
	it: "Blocco di Manyullyn",
	ja: "マンユリンブロック",
	ko: "마뉼린",
	pl: "Block Manyullynu",
	pt: "Bloco de Manyullyn",
	ru: "Блок манюллина",
	sv: "Manyullynblock",
	uk: "Маньюліновий блок",
	zh: "玛玉灵块"
});
Translation.addTranslation("Block of Pigiron", {
	de: "Roheisenblock",
	id: "Blok Besi Gubal",
	it: "Blocco di ferro di maiale",
	ja: "銑鉄ブロック",
	ko: "돼지 선철 블록",
	pl: "Blok świńskiego żelaza",
	pt: "Bloco de Ferro-Porco",
	ru: "Чугунный блок",
	sv: "Grisjärnsblock",
	uk: "Блок свинячого заліза",
	zh: "生铁块"
});
Translation.addTranslation("Block of Aluminum Brass", {
    de: "Block aus Aluminiumbronze",
    id: "Blok Perunggu Aluminium",
    it: "Blocco di Bronzo Alluminio",
    ja: "アルミニウムブロンズブロック",
    ko: "알루미늄 브론즈 블록",
    pl: "Blok Brązu Aluminium",
    pt: "Bloco de Bronze de Alumínio",
    ru: "Блок алюминиевой бронзы",
    sv: "Block av Aluminiumbrons",
    uk: "Блок алюмінієвого бронзи",
    zh: "铝青铜方块"
});
Translation.addTranslation("Knightslime Ingot", {
	de: "Knightslime-Barren",
	id: "Batangan Knightslime",
	it: "Lingotto di slime del cavaliere",
	ja: "ナイトスライムインゴット",
	ko: "기사슬라임 주괴",
	pl: "Sztabka rycerskiego szlamu",
	pt: "Lingote de Cavaleiro-Slime",
	ru: "Слизневый слиток из короля слизней",
	sv: "Riddarslemstacka",
	uk: "Злиток лицарського слизу",
	zh: "骑士史莱姆锭"
});
Translation.addTranslation("Cobalt Ingot", {
	de: "Kobaltbarren",
	id: "Batangan Kobalt",
	it: "Lingotto di cobalto",
	ja: "コバルトインゴット",
	ko: "코발트 주괴",
	pl: "Sztabka kobaltu",
	pt: "Lingote de Cobalto",
	ru: "Кобальтовый слиток",
	sv: "Kobolttacka",
	uk: "Кобальтовий злиток",
	zh: "钴锭"
});
Translation.addTranslation("Ardite Ingot", {
    de: "Arditbarren",
    id: "Bilah Ardite",
    it: "Lingotto di Ardite",
    ja: "アルダイトインゴット",
    ko: "아르다이트 주괴",
    pl: "Sztabka Ardytu",
    pt: "Lingote de Ardite",
    ru: "Ардитовый слиток",
    sv: "Arditbar",
    uk: "Ардитовий слиток",
    zh: "阿迪特锭"
});
Translation.addTranslation("Manyullyn Ingot", {
	de: "Manyullyn-Barren",
	id: "Batangan Manyullyn",
	it: "Lingotto di Manyullyn",
	ja: "マンユリンインゴット",
	ko: "마뉼린 주괴",
	pl: "Sztabka Manyullynu",
	pt: "Lingote de Manyullyn",
	ru: "Слиток манюллина",
	sv: "Manyullyntacka",
	uk: "Маньюліновий злиток",
	zh: "玛玉灵锭"
});
Translation.addTranslation("Pigiron Ingot", {
	de: "Roheisenbarren",
	id: "Batangan Besi Gubal",
	it: "Lingotto Di ferro di maiale",
	ja: "銑鉄インゴット",
	ko: "돼지 선철 주괴",
	pl: "Sztabka świńskiego żelaza",
	pt: "Lingote de Ferro-Porco",
	ru: "Чугунный слиток",
	sv: "Grisjärnstacka",
	uk: "Злиток свинячого заліза",
	zh: "生铁锭"
});
Translation.addTranslation("Aluminum Brass Ingot", {
    de: "Aluminiumbronze-Barren",
    id: "Bilah Perunggu Aluminium",
    it: "Lingotto di Bronzo Alluminio",
    ja: "アルミニウムブロンズインゴット",
    ko: "알루미늄 브론즈 주괴",
    pl: "Sztabka Brązu Aluminium",
    pt: "Lingote de Bronze de Alumínio",
    ru: "Слиток алюминиевой бронзы",
    sv: "Aluminiumbronsbar",
    uk: "Слиток алюмінієвого бронзи",
    zh: "铝青铜锭"
});
Translation.addTranslation("Knightslime Nugget", {
	de: "Knightslime-Nugget",
	id: "Nugget Knightslime",
	it: "Pepita di slime del cavaliere",
	ja: "ナイトスライム塊",
	ko: "기사슬라임 조각",
	pl: "Bryłka rycerskiego szlamu",
	pt: "Pepita de Cavaleiro-Slime",
	ru: "Слизневый самородок из короля слизней",
	sv: "Riddarslemsklimp",
	uk: "Шматочок лицарського слизу",
	zh: "骑士史莱姆粒"
});
Translation.addTranslation("Cobalt Nugget", {
	de: "Kobalt-Nugget",
	id: "Nugget Kobalt",
	it: "Pepita di cobalto",
	ja: "コバルト塊", ko: "코발트 조각",
	pl: "Bryłka kobaltu",
	pt: "Pepita de Cobalto",
	ru: "Кобальтовый самородок",
	sv: "Koboltklimp",
	uk: "Кобальтовий самородок",
	zh: "钴粒"
});
Translation.addTranslation("Ardite Nugget", {
    de: "Ardit-Nugget",
    id: "Nugget Ardite",
    it: "Pepita di Ardite",
    ja: "アルダイトナゲット",
    ko: "아르다이트 너겟",
    pl: "Nugget Ardytu",
    pt: "Nugget de Ardite",
    ru: "Ардитовый самородок",
    sv: "Arditnugget",
    uk: "Ардитовий самородок",
    zh: "阿迪特金块"
});
Translation.addTranslation("Manyullyn Nugget", {
	de: "Manyullyn-Nugget",
	id: "Nugget Manyullyn",
	it: "Pepita di Manyullyn",
	ja: "マンユリン塊", ko: "마뉼린 조각",
	pl: "Bryłka Manyullynu",
	pt: "Pepita de Manyullyn",
	ru: "Манюллиновый самородок",
	sv: "Manyullynklimp",
	uk: "Шматочок маньюліну",
	zh: "玛玉灵粒"
});
Translation.addTranslation("Pigiron Nugget", {
	de: "Roheisennugget",
	id: "Nugget Besi Gubal",
	it: "Pepita di ferro di maiale",
	ja: "銑鉄塊",
	ko: "돼지 선철 조각",
	pl: "Bryłka świńskiego żelaza",
	pt: "Pepita de Ferro-Porco",
	ru: "Чугунный самородок",
	sv: "Grisjärnsklimp",
	uk: "Шматочок свинячого заліза",
	zh: "生铁粒"
});
Translation.addTranslation("Aluminum Brass Nugget", {
    de: "Aluminiumbronze-Nugget",
    id: "Nugget Perunggu Aluminium",
    it: "Pepita di Bronzo Alluminio",
    ja: "アルミニウムブロンズナゲット",
    ko: "알루미늄 브론즈 너겟",
    pl: "Nugget Brązu Aluminium",
    pt: "Nugget de Bronze de Alumínio",
    ru: "Самородок алюминиевой бронзы",
    sv: "Aluminiumbronsnugget",
    uk: "Самородок алюмінієвого бронзи",
    zh: "铝青铜金块"
});
Translation.addTranslation("Paper Stack", {
    de: "Papierstapel",
    id: "Tumpukan Kertas",
    it: "Pila di Carta",
    ja: "紙の束",
    ko: "종이 묶음",
    pl: "Stos Papieru",
    pt: "Pilha de Papel",
    ru: "Стопка бумаги",
    sv: "Pappersbunt",
    uk: "Стопка паперу",
    zh: "纸堆"
});
Translation.addTranslation("Lavawood", {
	de: "Lavaholz",
	id: "Kayu Lava",
	it: "Legno di lava",
	ja: "ラヴァウッド", ko: "용암나무",
	pl: "Lawowe drewno",
	pt: "Lavawood",
	ru: "Лавадерево",
	sv: "Lavaträ",
	uk: "Лаводерево",
	zh: "熔岩木"
});
Translation.addTranslation("Blue Slime", {
    de: "Blaue Schleimkugel",
    id: "Slime Biru",
    it: "Slime Blu",
    ja: "青いスライム",
    ko: "파란 슬라임",
    pl: "Niebieski szlam",
    pt: "Slime Azul",
    ru: "Синяя слизь",
    sv: "Blå slem",
    uk: "Синя слиз"
});
Translation.addTranslation("Purple Slime", {
    de: "Lila Schleimkugel",
    id: "Slime Ungu",
    it: "Slime Viola",
    ja: "紫のスライム",
    ko: "보라색 슬라임",
    pl: "Fioletowy szlam",
    pt: "Slime Roxo",
    ru: "Фиолетовая слизь",
    sv: "Lila slem",
    uk: "Фіолетова слизь"
});

Translation.addTranslation("Slimy Mud", {
    de: "Schleimiger Schlamm",
    id: "Lumpur Lendir",
    it: "Fango Viscido",
    ja: "ぬめぬめ泥",
    ko: "끈적끈적한 진흙",
    pl: "Śliski błoto",
    pt: "Lama Pegajosa",
    ru: "Склизкая грязь",
    sv: "Klibbigt gyttja",
    uk: "Склизька грязь"
});
Translation.addTranslation("Blue Slimy Mud", {
    de: "Blauer schleimiger Schlamm",
    id: "Lumpur Lendir Biru",
    it: "Fango Viscido Blu",
    ja: "青いぬめぬめ泥",
    ko: "파란 끈적끈적한 진흙",
    pl: "Niebieskie śliskie błoto",
    pt: "Lama Pegajosa Azul",
    ru: "Синяя склизкая грязь",
    sv: "Blå klibbigt gyttja",
    uk: "Синя склизька грязь"
});
Translation.addTranslation("Magma Slimy Mud", {
    de: "Magmahaftender Schlamm",
    id: "Lumpur Lava Lendir",
    it: "Fango Viscido di Magma",
    ja: "マグマのぬめぬめ泥",
    ko: "마그마 끈적끈적한 진흙",
    pl: "Śliskie błoto magmy",
    pt: "Lama Pegajosa de Magma",
    ru: "Склизкая грязь из магмы",
    sv: "Magma klibbigt gyttja",
    uk: "Склизька грязь з магми"
});
Translation.addTranslation("Slime Crystal", {
    de: "Schleimkristall",
    id: "Kristal Slime",
    it: "Cristallo di Slime",
    ja: "スライムクリスタル",
    ko: "슬라임 크리스탈",
    pl: "Kryształ szlamu",
    pt: "Cristal de Slime",
    ru: "Слизневый кристалл",
    sv: "Slemkristall",
    uk: "Слизовий кристал"
});
Translation.addTranslation("Blue Slime Crystal", {
    de: "Blauer Schleimkristall",
    id: "Kristal Slime Biru",
    it: "Cristallo di Slime Blu",
    ja: "青いスライムクリスタル",
    ko: "파란 슬라임 크리스탈",
    pl: "Niebieski kryształ szlamu",
    pt: "Cristal de Slime Azul",
    ru: "Синий слизневый кристалл",
    sv: "Blå slemkristall",
    uk: "Синій слизовий кристал"
});
Translation.addTranslation("Magma Slime Crystal", {
    de: "Magmaschleimkristall",
    id: "Kristal Slime Magma",
    it: "Cristallo di Slime di Magma",
    ja: "マグマスライムクリスタル",
    ko: "마그마 슬라임 크리스탈",
    pl: "Kryształ szlamu magmy",
    pt: "Cristal de Slime de Magma",
    ru: "Слизневый кристалл из магмы",
    sv: "Magma Slemkristall",
    uk: "Слизовий кристал з магми",
    zh: "岩浆史莱姆结晶"
});
Translation.addTranslation("Clear Glass", {
	de: "Klares Glas",
	id: "Kaca Bersih",
	it: "Vetro limpido",
	ja: "クリアガラス", ko: "투명한 유리",
	pl: "Czyste szkło",
	pt: "Vidro Claro",
	ru: "Прозрачное стекло",
	sv: "Genomskinligt glas",
	uk: "Чисте скло",
	zh: "通透玻璃"
});
Translation.addTranslation("Seared Glass", {
	de: "Seared Glass",
	id: "Seared Glass",
	it: "Vetro scottato",
	ja: "焼成ガラス", ko: "그을린 유리",
	pl: "Szkło hartowane",
	pt: "Vidro Carbonizado",
	ru: "Обожженное стекло",
	sv: "Bränt glas",
	uk: "Обпалене скло",
	zh: "焦黑玻璃"
});

///
// PATTERNS
///

Translation.addTranslation("Pattern", {
	de: "Muster",
	id: "Pattern",
	it: "Modello",
	ja: "パターン", ko: "나무 틀",
	pl: "Szablon",
	pt: "Moldes", ru: "Шаблон",
	sv: "Mönster",
	uk: "Шаблон", zh: "模具"
});
Translation.addTranslation("TConstruct: Sand Cast", {
    id: "TConstruct: Cetak Pasir",
    it: "TConstruct: Colata di Sabbia",
    ja: "TConstruct: 砂型",
    ko: "TConstruct: 모래 폼",
    pl: "TConstruct: Piasek Odlewany",
    pt: "TConstruct: Molde de Areia",
    ru: "TConstruct: Песочные формы",
    sv: "TConstruct: Sand Formar",
    uk: "TConstruct: Піщаний ливар",
    zh: "TConstruct: 沙形"
});
Translation.addTranslation("Blank Sand Cast", {
	de: "Leerer Sandguss",
	id: "Tuangan Pasir Kosong",
	it: "Stampo di sabbia vuoto",
	ja: "空の砂型",
	ko: "비어있는 모래 금형",
	pl: "Pusta piaskowa forma",
	pt: "Molde de Areia Vazio",
	ru: "Песочный шаблон",
	sv: "Blank sandavgjutning",
	uk: "Пуста піщана форма",
	zh: "空白沙子铸模"
});
Translation.addTranslation("Pickaxe Head Sand Cast", {
    id: "Bagian Alat Penggaruk Heading Sand Cast",
    it: "Testa Pala Sand Cast",
    ja: "採鉱具首 Sand Cast",
    ko: "곡괭이 머리 Form Sand Cast",
    pl: "Głowa Młota Piaskowej Formy",
    pt: "Cabeça da Pá Sand Cast",
    ru: "Песочная форма для наконечника кирки",
    sv: "Sandform för Skärbräda Huvud",
    uk: "Санд-форми для основи кирки",
    zh: "挖掘头 Sand Cast 模具"
});
Translation.addTranslation("Shovel Head Sand Cast", {
    id: "Bagian Alat Lampu Sand Cast",
    it: "Testa Pala Sand Cast",
    ja: "シャVEL首 Sand Cast",
    ko: "삽 머리 Form Sand Cast",
    pl: "Głowa Łopaty Piaskowej Formy",
    pt: "Cabeça do Pá Sand Cast",
    ru: "Песочная форма для наконечника лопаты",
    sv: "Sandform för Spade Huvud",
    uk: "Санд-форми для основи лопати",
    zh: "铲子头 Sand Cast 模具"
});
Translation.addTranslation("Axe Head Sand Cast", {
    id: "Bagian Alat Capitan Sand Cast",
    it: "Testa Ascia Sand Cast",
    ja: "アクス首 Sand Cast",
    ko: "도끼 머리 Form Sand Cast",
    pl: "Topór Głowy Piaskowej Formy",
    pt: "Cabeça do Machado Sand Cast",
    ru: "Песочная форма для наконечника топора",
    sv: "Sandform för Yxa Huvud",
    uk: "Санд-форми для основи сокири",
    zh: "斧头 Sand Cast 模具"
});
Translation.addTranslation("Broad Axe Head Sand Cast", {
	de: "Breiter Axtkopf im Sandguss",
	id: "Tuangan Kepala Kapak Lebar Pasir",
	it: "Stampo di sabbia per teste di ascia grande",
	ja: "大斧頭の砂型",
	ko: "넓은면 도끼 머리 모래 금형",
	pl: "Piaskowa forma szerokiej głowicy siekiery",
	pt: "Molde de Areia para Cabeça de Machado Grande",
	ru: "Песочная форма для наконечника секиры",
	sv: "Sandavgjutning för bredyxhuvud",
	uk: "Піщана форма для наконечника сокири-колуна",
	zh: "板斧刃沙子铸模"
});
Translation.addTranslation("Sword Blade Head Sand Cast", {
    id: "Kepala Pisau Sand Cast",
    it: "Lama della Spada Sand Cast",
    ja: "剣刀首 Sand Cast",
    ko: "검 날개 Form Sand Cast",
    pl: "Miecz Klingi Piaskowej Formy",
    pt: "Lâmina da Espada Sand Cast",
    ru: "Песочная форма для лезвия меча",
    sv: "Sandform för Svärdsspets",
    uk: "Санд-форми для клинка меча",
    zh: "剑刃 Sand Cast 模具"
});
Translation.addTranslation("Hammer Head Sand Cast", {
	de: "Hammerkopf im Sandguss",
	id: "Tuangan Kepala Palu Pasir",
	it: "Stampo di sabbia per testa di martello",
	ja: "ハンマー頭の砂型",
	ko: "망치 머리 모래 금형",
	pl: "Piaskowa forma głowicy młota",
	pt: "Molde de Areia para Cabeça de Martelo",
	ru: "Песочная форма для наконечника молота",
	sv: "Sandavgjutning för hammarhuvud",
	uk: "Піщана форма для наконечника молота",
	zh: "锤头沙子铸模"
});
Translation.addTranslation("Excavator Head Sand Cast", {
    id: "Eksavator Bagian Ranjang Sand Cast",
    it: "Testa Escavatore Sand Cast",
    ja: "エキサベータ頭 Sand Cast",
    ko: "고 grader 부 Form Sand Cast",
    pl: "Ładowarki Świadła Piaskowej Formy",
    pt: "Cabeça do Escavador Sand Cast",
    ru: "Песочная форма для наконечника экскаватора",
    sv: "Sandform för Grävmaskinsdelen",
    uk: "Санд-форми для екскаваторного обладнання",
    zh: "掘进机头 Sand Cast 模具"
});
Translation.addTranslation("Tool Rod Sand Cast", {
    id: "Rod Alat Sand Cast",
    it: "Manico Attrezzo Sand Cast",
    ja: "ツールロッド Sand Cast",
    ko: "도구 융 Form Sand Cast",
    pl: "Narzędzie Rączki Piaskowej Formy",
    pt: "Haste de Ferramenta Sand Cast",
    ru: "Песочная форма для рукоятки инструмента",
    sv: "Sandform för Verktygsstång",
    uk: "Санд-форми для інструментальної ручки",
    zh: "工具杆 Sand Cast 模具"
});
Translation.addTranslation("Tough Tool Rod Sand Cast", {
    id: "Rod Alat Tebal Sand Cast",
    it: "Manico Strumento Robusto Sand Cast",
    ja: "強いツールロッド Sand Cast",
    ko: "튼튼한 도구 융 Form Sand Cast",
    pl: "Silna Narzędziowa Rączka Piaskowej Formy",
    pt: "Haste de Ferramenta Forte Sand Cast",
    ru: "Песочная форма для крепкой рукоятки инструмента",
    sv: "Sandform för robusta verktygshylsan",
    uk: "Сильна санд-форми для інструментальної ручки",
    zh: "强大的工具杆 Sand Cast 模具"
});
Translation.addTranslation("Binding Sand Cast", {
    id: "Bindings Sand Cast",
    it: "Fissaggio Sand Cast",
    ja: "バインディング Sand Cast",
    ko: "묶음 Form Sand Cast",
    pl: "Sklejanie Piaskowej Formy",
    pt: "Fixação Sand Cast",
    ru: "Песочная форма для крепления",
    sv: "Sandform för Bundering",
    uk: "Санд-форми для з'єднань",
    zh: "固定 Sand Cast 模具"
});
Translation.addTranslation("Tough Binding Sand Cast", {
    id: "Bindings Kuat Sand Cast",
    it: "Fissaggio Robusto Sand Cast",
    ja: "強力なバインディング Sand Cast",
    ko: "강력한 묶음 Form Sand Cast",
    pl: "Mocne Sklejanie Piaskowej Formy",
    pt: "Fixação Forte Sand Cast",
    ru: "Песочная форма для крепкого крепления",
    sv: "Sandform för stark bundering",
    uk: "Сильна санд-форми для з'єднань",
    zh: "强固的固定 Sand Cast 模具"
});
Translation.addTranslation("Wide Guard Sand Cast", {
    id: "Penghalang Lebar Sand Cast",
    it: "Guardia Larga Sand Cast",
    ja: "ワイドガード Sand Cast",
    ko: "워이드가드 Form Sand Cast",
    pl: "Szeroka Ochrona Piaskowej Formy",
    pt: "Guarda Larga Sand Cast",
    ru: "Песочная форма для широкой карды",
    sv: "Sandform für bredd skydd",
    uk: "Широкий захист Санд-форми",
    zh: "宽 Protection Sand Cast 模具"
});
Translation.addTranslation("Large Plate Sand Cast", {
	de: "Sandguss für große Platten",
	id: "Tuangan Piringan Besar Pasir",
	it: "Stampo di sabbia per piastre grande",
	ja: "大板の砂型",
	ko: "큰 플레이트 모래 금형",
	pl: "Piaskowa forma dużej płyty",
	pt: "Molde de Areia para Placa Larga ",
	ru: "Песочная форма для большой пластины",
	sv: "Sandavgjutning för stor plåt",
	uk: "Піщана форма для великої пластини",
	zh: "大板沙子铸模"
});
Translation.addTranslation("Ingot Sand Cast", {
	de: "Barren-Sandguss",
	id: "Tuangan Batangan Pasir",
	it: "Stampo di sabbia per lingotti",
	ja: "インゴットの砂型",
	ko: "주괴 모래 금형",
	pl: "Piaskowa forma sztabki",
	pt: "Molde de Areia para Lingotes",
	ru: "Песочная форма для слитка",
	sv: "Sandavgjutning för tacka",
	uk: "Піщана форма для злитка",
	zh: "锭沙子铸模"
});
Translation.addTranslation("Nugget Sand Cast", {
	de: "Nugget-Sandguss",
	id: "Tuangan Nugget Pasir",
	it: "Stampo di sabbia per pepite",
	ja: "塊の砂型",
	ko: "조각 모래 금형",
	pl: "Piaskowa forma bryłki",
	pt: "Molde de Areia para Pepitas",
	ru: "Песочная форма для самородка",
	sv: "Sandavgjutning för klimp",
	uk: "Піщана форма для шматочка",
	zh: "粒沙子铸模"
});
Translation.addTranslation("Gem Sand Cast", {
	de: "Edelstein-Sandguss",
	id: "Tuangan Permata Pasir",
	it: "Stampo di sabbia per gemme",
	ja: "宝石の砂型",
	ko: "보석 모래 금형",
	pl: "Piaskowa forma klejnotu",
	pt: "Molde de Areia para Gemas",
	ru: "Песочная форма для самоцвета",
	sv: "Sandavgjutning för ädelsten",
	uk: "Піщана форма для самоцвіту",
	zh: "宝石沙子铸模"
});
Translation.addTranslation("Plate Sand Cast", {
    id: "Piring Pasir Sand Cast",
    it: "Piastrella Sabbia Fusione",
    ja: "プレート Sand Cast",
    ko: "판 Form Sand Cast",
    pl: "Blacha Piaskowej Formy",
    pt: "Prancha Sand Cast",
    ru: "Песочная форма для пластины",
    sv: "Sandform för Plåt",
    uk: "Латунна Плита Санд-форми",
    zh: "板 Sand Cast 模具"
});
Translation.addTranslation("Gear Sand Cast", {
	de: "Zahnrad-Sandguss",
	id: "Tuangan Gir Pasir",
	it: "Stampo di sabbia per ingranaggi",
	ja: "歯車の砂型",
	ko: "톱니 모래 금형",
	pl: "Piaskowa forma koła zębatego",
	pt: "Molde de Areia para Engrenagem",
	ru: "Песочная форма для шестерни",
	sv: "Sandavgjutning för kugghjul",
	uk: "Піщана форма для шестірні",
	zh: "齿轮沙子铸模"
});
Translation.addTranslation("TConstruct: Clay Cast", {
    id: "TConstruct: Bentuk Tanah Liat",
    it: "TConstruct: Modelli di Argilla",
    ja: "TConstruct：クレYフォーム",
    ko: "TConstruct: 수lad형",
    pl: "TConstruct: Glina Odlewów",
    pt: "TConstruct: Modelos de Barro",
    ru: "TConstruct: Глиняные формы",
    sv: "TConstruct: Lerskulpturer",
    uk: "TConstruct: Літійні форми",
    zh: "TConstruct: 陶器模具"
});
Translation.addTranslation("Pickaxe Head Clay Cast", {
    id: "Bentuk Tanah Liat Untuk Kepekaan Palu",
    it: "Modello d'Argilla per la Testa Piccone",
    ja: "クレYピッカヘッド",
    ko: "곡괭이 헤드 수lad형",
    pl: "Glina Głowicy Kilofa",
    pt: "Modelo de Enxó de Barro",
    ru: "Глиняная форма для наконечника кирки",
    sv: "Lergjutning av skaft till yxa",
    uk: "Літійна форма сокири",
    zh: "铲头陶器模具"
});
Translation.addTranslation("Shovel Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk kepalanya Palet",
    it: "Modello d'Argilla per la Testa Zappa",
    ja: "ショVELHEADクレY",
    ko: "삽 헤드 수lad형",
    pl: "Glina Łopaty",
    pt: "Modelo de Pá Mineração de Barro",
    ru: "Глиняная форма для наконечника лопаты",
    sv: "Lergjutning av spade",
    uk: "Літійна форма лопати",
    zh: "铲子陶器模具"
});
Translation.addTranslation("Axe Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Kekepaan Tongseng",
    it: "Modello d'Argilla per la Testa Ascia",
    ja: "アクスヘッドクレY",
    ko: "도끼 헤드 수lad형",
    pl: "Topór Gliny",
    pt: "Modelo de Machado de Barro",
    ru: "Глиняная форма для наконечника топора",
    sv: "Lergjutning av yxa",
    uk: "Літійна форма сокири",
    zh: "斧头陶器模具"
});
Translation.addTranslation("Broad Axe Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Kekepaan Parangs",
    it: "Modello d'Argilla per la Testa Broadaxe",
    ja: "ブロードアクスヘッドクレY",
    ko: "넓은 도끼 헤드 수lad형",
    pl: "Sekira Gliny",
    pt: "Modelo de Hacha Ampla de Barro",
    ru: "Глиняная форма для наконечника секиры",
    sv: "Lergjutning av stora yxa",
    uk: "Літійна форма серпи",
    zh: "大斧头陶器模具"
});
Translation.addTranslation("Sword Blade Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Pedang",
    it: "Modello d'Argilla per la Lama Spada",
    ja: "ソードブレードヘッドクレY",
    ko: "Espada 블레이드 헤드 수lad형",
    pl: "Miecz Gliniany",
    pt: "Modelo de Lâmina de Espada de Barro",
    ru: "Глиняная форма для лезвия меча",
    sv: "Lergjutning av svärdslamell",
    uk: "Літійна форма меча",
    zh: "剑刃陶器模具"
});
Translation.addTranslation("Hammer Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Kepala Lesung",
    it: "Modello d'Argilla per la Testa Martello",
    ja: "ハマーヘッドクレY",
    ko: "모트 Hammer head 수lad형",
    pl: "Młot garncarzowski",
    pt: "Modelo da Cabeça do Martelo de Barro",
    ru: "Глиняная форма для наконечника молота",
    sv: "Lergjutning av slägga",
    uk: "Літійна форма кувалди",
    zh: "锤头陶器模具"
});
Translation.addTranslation("Excavator Head Clay Cast", {
    id: "Bentuk Tanah Liat untuk Kepala Eksaktor",
    it: "Modello d'Argilla per la Testa Escavatore",
    ja: "エキサベイターヘッドクレY",
    ko: "Eksakseeta head 수lad형",
    pl: "Łopata garncarzowska",
    pt: "Modelo da Cabeca do Retroescavadeira de Barro",
    ru: "Глиняная форма для наконечника экскаватора",
    sv: "Lergjutning av grävarmark",
    uk: "Літійна форма екскаватора",
    zh: "挖掘机头陶器模具"
});
Translation.addTranslation("Tool Rod Clay Cast", {
    id: "Bentuk Tanah Liat untuk Batang Alat",
    it: "Modello d'Argilla per il Manico Strumento",
    ja: "ツールロッドクレY",
    ko: "도구 로드 수lad형",
    pl: "Rączka narzędzia gliniane",
    pt: "Modelo da Varão de Ferramenta de Barro",
    ru: "Глиняная форма для рукоятки инструмента",
    sv: "Lergjutning av verktygsstång",
    uk: "Літійна форма держака інструменту",
    zh: "工具杆陶器模具"
});
Translation.addTranslation("Tough Tool Rod Clay Cast", {
    id: "Bentuk Tanah Liat untuk Batang Alat Tebal",
    it: "Modello d'Argilla per il Manico Strumento Robusto",
    ja: "ツーグhttロッドクレY",
    ko: "단단한 도구 로드 수lad형",
    pl: "Silna rączka narzędziowa glinianym odlaniem",
    pt: "Modelo para Vareta de Ferramenta Forte de Barro",
    ru: "Глиняная форма для крепкой рукоятки инструмента",
    sv: "Lergjutning av stark verktygshantel",
    uk: "Літійна форма міцної ручки інструменту",
    zh: "强力工具杆陶器模具"
});
Translation.addTranslation("Binding Clay Cast", {
    id: "Bentuk Tanah Liat untuk Penjepit",
    it: "Modello d'Argilla per l'Attacco",
    ja: "バインディングクレY",
    ko: "바인딩 수lad형",
    pl: "Glinka na wiązanie",
    pt: "Modelo de Ligação de Barro",
    ru: "Глиняная форма для крепления",
    sv: "Lerlindning av bindningsdetalj",
    uk: "Літійна форма кріплення",
    zh: "结合陶器模具"
});
Translation.addTranslation("Tough Binding Clay Cast", {
    id: "Bentuk Tanah Liat untuk Pengikatan yang Kuat",
    it: "Modello d'Argilla per Attacco Resistente",
    ja: "トゥフフバインディングクレY",
    ko: "강력한 묶음 수lad형",
    pl: "Ciężkie wiązanie glinianego odlewu",
    pt: "Modelo de Ligação Firme de Barro",
    ru: "Глиняная форма для крепкого крепления",
    sv: "Lergjutform för kraftigt bindemedel",
    uk: "Літійна форма міцного зв'язування",
    zh: "结实结合陶器模具"
});
Translation.addTranslation("Wide Guard Clay Cast", {
    id: "Bentuk Tanah Liat untuk Pelindung yang Lembaran",
    it: "Modello d'Argilla per Paraurti Largo",
    ja: "ワイドガードクレY",
    ko: "폭죽 가드 수lad형",
    pl: "Szeroka tarcza glinianego odlewu",
    pt: "Modelo de Proteção Larga de Barro",
    ru: "Глиняная форма для широкой карды",
    sv: "Lergjutform för bred sköld",
    uk: "Літійна форма широкої охоронної плити",
    zh: "宽面防护板陶器模具"
});
Translation.addTranslation("Large Plate Clay Cast", {
    id: "Bentuk Tanah Liat untuk Piring Besar",
    it: "Modello d'Argilla per Piastrella Grande",
    ja: "ラージプレートクレY",
    ko: "큰 플레이트 수lad형",
    pl: "Duży płyta glinianego odlewu",
    pt: "Modelo de Prancha Grande de Barro",
    ru: "Глиняная форма для большой пластины",
    sv: "Lergjutform för stor platta",
    uk: "Літійна форма великої пластини",
    zh: "大平板陶器模具"
});
Translation.addTranslation("Ingot Clay Cast", {
    id: "Bentuk Tanah Liat untuk Ingota",
    it: "Modello d'Argilla per Getto",
    ja: "インゴットクレY",
    ko: "añ그고t 수lad형",
    pl: "Blok glinianego odlewu",
    pt: "Modelo de Gusa de Barro",
    ru: "Глиняная форма для слитка",
    sv: "Lergjutform för ingot",
    uk: "Літійна форма зливка",
    zh: "铸件陶器模具"
});
Translation.addTranslation("Nugget Clay Cast", {
    id: "Bentuk Tanah Liat untuk Nugget",
    it: "Modello d'Argilla per Pepita",
    ja: "ナッゲットクレY",
    ko: "누겟t 수lad형",
    pl: "Ziarenko glinianego odlewu",
    pt: "Modelo de Garimpo de Barro",
    ru: "Глиняная форма для самородка",
    sv: "Lergjutform för nuggat",
    uk: "Літійна форма самородка",
    zh: "金矿陶器模具"
});
Translation.addTranslation("Gem Clay Cast", {
    id: "Bentuk Tanah Liat untuk Batu Permata",
    it: "Modello d'Argilla per Gemma Preziosa",
    ja: "GEMクレY",
    ko: "보석 수lad형",
    pl: "Forma glinianej klejnotów",
    pt: "Modelo de Joia de Barro",
    ru: "Глиняная форма для самоцвета",
    sv: "Lergjutform för ädelsten",
    uk: "Літійна форма дорогоцінного каменю",
    zh: "宝石陶器模具"
});
Translation.addTranslation("Plate Clay Cast", {
    id: "Bentuk Tanah Liat untuk Piring",
    it: "Modello d'Argilla per Lastra",
    ja: "PLATEクレY",
    ko: "판 수lad형",
    pl: "Płytka glinianego odlewu",
    pt: "Modelo de Placa de Barro",
    ru: "Глиняная форма для пластины",
    sv: "Lergjutform för plåt",
    uk: "Літійна форма пластини",
    zh: "坯片陶器模具"
});
Translation.addTranslation("Gear Clay Cast", {
    id: "Bentuk Tanah Liat untuk Roda Gigi",
    it: "Modello d'Argilla per Ingranaggio",
    ja: "ギアクレY",
    ko: "기어 수lad형",
    pl: "Łopatka glinianego odlewu",
    pt: "Engrenagem do Modelo de Barro",
    ru: "Глиняная форма для шестерни",
    sv: "Lergjutform för växellår",
    uk: "Літійна форма колеса",
    zh: "齿轮陶器模具"
});
Translation.addTranslation("TConstruct: Casts", {
    id: "TConstruct: Cetakan",
    it: "TConstruct: Modelli di Colata",
    ja: "TConstruct: キャスト",
    ko: "TConstruct: 주 Lad형",
    pl: "TConstruct: Formy Odlewnicze",
    pt: "TConstruct: Moldes",
    ru: "TConstruct: Литейные формы",
    sv: "TConstruct: gjuteriformer",
    uk: "TConstruct: ливарні форми",
    zh: "TConstruct: 铸造形状"
});
Translation.addTranslation("Pickaxe Head Cast", {
    id: "Bentuk Cangkul Kepala Wijen",
    it: "Modello della Testa Piccone",
    ja: "ピカックヘッドキャスト",
    ko: "채굴도구 탑재부 수lad형",
    pl: "Odlew głowicy kilofa",
    pt: "Modelo da Cabeca do Pavão",
    ru: "Форма для наконечника кирки",
    sv: "Gjutform för yxahead",
    uk: "Літійна форма накінечника кирки",
    zh: "挖掘工具头部铸造型"
});
Translation.addTranslation("Shovel Head Cast", {
    id: "Cetakan Bagian Atas Sabit",
    it: "Modello della testa pala",
    ja: "ショベルヘッドキャスト",
    ko: "삽 머리 주 Lad형",
    pl: "Odlew głowni łopaty",
    pt: "Modelo da lâmina da pá",
    ru: "Форма для наконечника лопаты",
    sv: "Gjutform för spadhuvud",
    uk: "Літійна форма накінечника лопати",
    zh: "铲子头部铸造型"
});
Translation.addTranslation("Axe Head Cast", {
    id: "Cetakan Bagian Atas Tajam",
    it: "Modello della testa ascia",
    ja: "アクセヘッドキャスト",
    ko: "도끼 머리 주 Lad형",
    pl: "Odlew topora",
    pt: "Modelo da lâmina do machado",
    ru: "Форма для наконечника топора",
    sv: "Gjutform för yxhuvud",
    uk: "Літійна форма сокири",
    zh: "斧头部铸造型"
});
Translation.addTranslation("Broad Axe Head Cast", {
    id: "Cetakan Bagian Atas Paling Layak",
    it: "Modello della testa scure",
    ja: "ブロードアクセヘッドキャスト",
    ko: "넓은 도끼 머리 주 Lad형",
    pl: "Odlew szerokotorowej sekiry",
    pt: "Modelo da lâmina larga do machado",
    ru: "Форма для наконечника секиры",
    sv: "Gjutform för bredyxa",
    uk: "Літійна форма широкої сокири",
    zh: "宽刀头铸造型"
});
Translation.addTranslation("Sword Blade Head Cast", {
    id: "Cetakan Bagian Depan Pedang",
    it: "Modello della lama della spada",
    ja: "ソードブレードヘッドキャスト",
    ko: "검 가위 주 Lad형",
    pl: "Odlew ostrza miecza",
    pt: "Modelo da lâmina da espada",
    ru: "Форма для лезвия меча",
    sv: "Gjutform för svärdsblad",
    uk: "Літійна форма клинка меча",
    zh: "剑刃铸造型"
});
Translation.addTranslation("Hammer Head Cast", {
    id: "Cetakan Bagian Atas Peluh",
    it: "Modello della testa martello",
    ja: "ハンマーヘッドキャスト",
    ko: "모chel 머리 주 Lad형",
    pl: "Odlew głowni młota",
    pt: "Modelo da cabeça do martelo",
    ru: "Форма для наконечника молота",
    sv: "Gjutform för hammarens huvud",
    uk: "Літійна форма накінечника молотка",
    zh: "锤头部铸造型"
});
Translation.addTranslation("Excavator Head Cast", {
    id: "Cetakan Bagian Atas Ekskavator",
    it: "Modello per la testa pale escavatore",
    ja: "エクスカバターヘッドキャスト",
    ko: "발굴기 헤드 주 Lad형",
    pl: "Odlew głowy ładowarki",
    pt: "Modelo de cabeça do escavador",
    ru: "Форма для наконечника экскаватора",
    sv: "Gjutform för grävschaufels huvud",
    uk: "Літійна форма накінечника екскаватора",
    zh: "挖掘机头部铸造型"
});
Translation.addTranslation("Tool Rod Cast", {
    id: "Cetakan Batang Alat",
    it: "Modello del manico dell'attrezzo",
    ja: "ツールロッドキャスト",
    ko: "도구 바느질 주 Lad형",
    pl: "Odlew rękojeści narzędzia",
    pt: "Modelo do eixo do instrumento",
    ru: "Форма для рукоятки инструмента",
    sv: "Gjutform för verktygets skaft",
    uk: "Літійна форма держака інструменту",
    zh: "工具杆铸造型"
});
Translation.addTranslation("Tough Tool Rod Cast", {
    id: "Cetakan Batang Alat Kekuatan Tinggi",
    it: "Modello del manico robusto dell'attrezzo",
    ja: "強化ツールロッドキャスト",
    ko: "강력한 도구 바느질 주 Lad형",
    pl: "Odlew wytrzymałej rękojeści narzędzia",
    pt: "Modelo do eixo resistente do instrumento",
    ru: "Форма для крепкой рукоятки инструмента",
    sv: "Gjutform för ett starkt verktygsskaft",
    uk: "Літійна форма міцної держаки інструменту",
    zh: "强度高的工具杆铸造型"
});
Translation.addTranslation("Binding Cast", {
    id: "Cetak Perekat",
    it: "Modello di fissaggio",
    ja: "バインディングキャスト",
    ko: "부속 장착 주 Lad형",
    pl: "Odlew elementu montażowego",
    pt: "Modelo de fixação",
    ru: "Форма для крепления",
    sv: "Gjutform för bindningselement",
    uk: "Літійна форма Elementu зв'язування",
    zh: "固定件铸造型"
});
Translation.addTranslation("Tough Binding Cast", {
    id: "Cetak Perekat Kuat",
    it: "Modello di fissaggio robusto",
    ja: "強化バインディングキャスト",
    ko: "강력한 부속 장착 주 Lad형",
    pl: "Odlew wytrzymałego elementu montażowego",
    pt: "Modelo de fixação reforçada",
    ru: "Форма для крепкого крепления",
    sv: "Gjutform för ett starkt bindnings-element",
    uk: "Літійна форма міцного Elementu зв'язування",
    zh: "强度高的固定件铸造型"
});
Translation.addTranslation("Wide Guard Cast", {
    id: "Cetak Pelindung Lebar",
    it: "Modello della guardia larga",
    ja: "ワイドガードキャスト",
    ko: "넓은 가드 주 Lad형",
    pl: "Odlew szerokiej osłony",
    pt: "Modelo da guarda ampla",
    ru: "Форма для широкой карды",
    sv: "Gjutform för bred skyddsdel",
    uk: "Літійна форма широкої захисної планки",
    zh: "宽面护板铸造型"
});
Translation.addTranslation("Large Plate Cast", {
    id: "Cetak Plat Besar",
    it: "Modello della lastra grande",
    ja: "ラージプレートキャスト",
    ko: "큰 판자 주 Lad형",
    pl: "Odlew dużej płyty",
    pt: "Modelo da lâmina grande",
    ru: "Форма для большой пластины",
    sv: "Gjutform för stor plåt",
    uk: "Літійна форма великої пластини",
    zh: "大平板铸造型"
});
Translation.addTranslation("Ingot Cast", {
    id: "Cetak Ingota",
    it: "Modello del lingotto",
    ja: "インゴットキャスト",
    ko: "인그от 주 Lad형",
    pl: "Odlew ingotu",
    pt: "Modelo de lingote",
    ru: "Форма для слитка",
    sv: "Gjutform för ingot",
    uk: "Літійна форма злитку",
    zh: "铸铁块铸造型"
});
Translation.addTranslation("Nugget Cast", {
    id: "Cetak Nugget",
    it: "Modello del nugget",
    ja: "ナゲットキャスト",
    ko: "누гре트 주 Lad형",
    pl: "Odlew samorodka",
    pt: "Modelo de nugget",
    ru: "Форма для самородка",
    sv: "Gjutform för nugget",
    uk: "Літійна форма самородка",
    zh: "金矿石铸造型"
});
Translation.addTranslation("Gem Cast", {
    id: "Cetak Permata",
    it: "Modello della gemma",
    ja: "ジェムキャスト",
    ko: "보석 주 Lad형",
    pl: "Odlew kamienia szlachetnego",
    pt: "Modelo de gema",
    ru: "Форма для самоцвета",
    sv: "Gjutform för ädelsten",
    uk: "Літійна форма дорогоцінного каміння",
    zh: "宝石铸造型"
});
Translation.addTranslation("Plate Cast", {
    id: "Cetak Las",
    it: "Modello della lastra",
    ja: "プレートキャスト",
    ko: "판자 주 Lad형",
    pl: "Odlew płyty",
    pt: "Modelo de lâmina",
    ru: "Форма для пластины",
    sv: "Gjutform för plåt",
    uk: "Літійна форма пластини",
    zh: "板形铸造型"
});
Translation.addTranslation("Gear Cast", {
    id: "Cetak Roda Gigi",
    it: "Modello dell'ingranaggio",
    ja: "ギアキャスト",
    ko: "톱니 주 Lad형",
    pl: "Odlew zębatego koła",
    pt: "Modelo de engrenagem",
    ru: "Форма для шестерни",
    sv: "Gjutform för kuggverk",
    uk: "Літійна форма колеса зубчастого",
    zh: "齿轮铸造型"
});

///
// TABLES
///

Translation.addTranslation("Part Builder", {
	de: "Teilebauer",
	id: "Part Builder",
	it: "Costruttore di parti",
	ja: "部品作成台", ko: "부품 제작대",
	pl: "Konstruktor części",
	pt: "Montador de Peças",
	ru: "Сборщик деталей",
	sv: "Delbyggare",
	uk: "Збирач деталей",
	zh: "部件制造台"
});
Translation.addTranslation("Here you can craft tool parts to fulfill your tinkering fantasies.", {
	de: "Hier können Sie Werkzeugteile herstellen, um Ihre Bastelfantasien zu erfüllen.",
	id: "Here you can craft tool parts to fulfill your tinkering fantasies.",
	it: "Qui puoi creare parti di utensili per soddisfare le tue fantasie di armeggiatore.",
	ja: "あなたのティンカーとしての夢を叶える道具の部品を作れます。",
	ko: "상상했었던 모든 도구 부품을 제작할 수 있습니다.",
	pl: "Tutaj możesz wytwarzać części narzędzi dla zaspokojenia swoich majsterkowiczowskich fantazji.",
	pt: "Aqui você pode criar peças de ferramentas para realizar suas fantasias tinkers.",
	ru: "Здесь вы можете создавать части инструментов для воплощения своих литейных фантазий.",
	sv: "Här kan du tillverka verktygsdelar för att ge utlopp för din kreativitet.",
	uk: "Тут ти можеш створювати інструментні деталі для справдження своїх інженерних фантазій.",
	zh: "在这里你能制作工具部件，从而实现你的工匠之梦。"
});
Translation.addTranslation("To craft a part simply put a blank pattern into the left slot and select the part you want. The remaining slot holds the material you want to craft your part out of.", {
	de: "Um ein Teil herzustellen, legen Sie einfach ein leeres Muster in den linken Schlitz und wählen Sie das gewünschte Teil aus. Der verbleibende Schlitz hält das Material, aus dem Sie Ihr Teil herstellen möchten.",
	id: "To craft a part simply put a blank pattern into the left slot and select the part you want. The remaining slot holds the material you want to craft your part out of.",
	it: "Per creare una parte basta mettere un modello vuoto nello slot di sinistra e selezionare la parte che vuoi. Il restante slot contiene il materiale con cui vuoi creare la tua parte.",
	ja: "部品を作るには、左のスロットに空のパターンを入れて作成したい部品を選択します。残りのスロットには部品を作るための素材を置きます。",
	ko: "왼쪽 슬롯에 빈 틀을 넣고, 원하는 부품을 선택하면 부품이 제작됩니다. 나머지 슬롯에 도구의 재료를 넣어야 합니다.",
	pl: "Aby wytworzyć część po prostu umieść pusty szablon do slotu po lewej i wybierz część, jakiej potrzebujesz. Drugi slot przechowuje materiał, z którego ma być wykonana część.",
	pt: "Para criar uma peça basta colocar um molde vazio no slot esquerdo e selecionar a peça desejada. O slot restante detém o material do qual você quer confeccionar sua peça.",
	ru: "Чтобы изготовить деталь, положите шаблон в левый слот и выберите нужную часть. В оставшийся слот помещается материал, из которого вы хотите изготовить деталь.",
	sv: "För att tillverka en del lägger du ett blankt mönster i platsen till vänster och väljer den del du vill ha. Den återstående platsen är materialet du vill tillverka din del utav.",
	uk: "Щоб створити деталь, просто розмістіть пустий шаблон у лівому слоті й обери бажану деталь. В инший слот покладіть матеріал, з якого ви хочете створити деталь.",
	zh: "要制作一个工具部件，你需要将模具放入左侧的空槽，并选择目标部件类型。接着在右侧的槽中放入材料，即可制成对应材料的对应部件。"
});
Translation.addTranslation("Title", {
    de: "Titel",
    id: "Judul",
    it: "Titolo",
    ja: "タイトル",
    ko: "제목",
    pl: "Tytuł",
    pt: "Título",
    ru: "Название",
    sv: "Rubrik",
    uk: "Заголовок",
    zh: "标题"
});
Translation.addTranslation("Description", {
    de: "Beschreibung",
    id: "Deskripsi",
    it: "Descrizione",
    ja: "説明",
    ko: "설명",
    pl: "Opis",
    pt: "Descrição",
    ru: "Описание",
    sv: "Beskrivning",
    uk: "Описание",
    zh: "描述"
});
Translation.addTranslation("Head", {
	de: "Kopf", id: "Head", it: "Testa", ja: "ヘッド部", ko: "머리",
	pl: "Głowica",
	pt: "Cabeça",
	ru: "Наконечник",
	sv: "Huvud",
	uk: "Наконечник",
	zh: "顶端"
});
Translation.addTranslation("Durability: ", {
	de: "Haltbarkeit: ",
	id: "Durability: ",
	it: "Durabilità: ",
	ja: "耐久度: ", ko: "내구도: ",
	pl: "Wytrzymałość:",
	pt: "Durabilidade: ",
	ru: "Прочность: ",
	sv: "Hållbarhet: ",
	uk: "Міцність: ",
	zh: "耐久度："
});
Translation.addTranslation("Mining Tier: ", {
	de: "Erntestufe: ",
	id: "Harvest Tier: ",
	it: "Livello di raccolta: ",
	ja: "採掘ランク: ",
	ko: "채굴 등급: ",
	pt: "Nivel de Coleta: ",
	ru: "Добывает: ",
	sv: "Grävnivå: ",
	uk: "Рівень добування: ",
	zh: "采掘等级："
});
Translation.addTranslation("Mining Speed: ", {
	de: "Mining-Geschw.: ",
	id: "Mining Speed: ",
	it: "Velocità di scavo: ",
	ja: "採掘速度: ",
	ko: "채굴 속도: ",
	pl: "Szybkość kopania:",
	pt: "Velocidade de Mineração: ",
	ru: "Эффективность: ",
	sv: "Grävhastighet: ",
	uk: "Швидкість добування: ",
	zh: "采掘速度："
});
Translation.addTranslation("Melee Damage: ", {
	de: "Angr.-Schaden: ",
	id: "Attack Damage: ",
	it: "Danno d'attacco: ",
	ja: "攻撃力: ",
	ko: "공격 피해: ",
	pl: "Obrażenia:",
	pt: "Dano de Ataque: ",
	ru: "Урон: ",
	sv: "Attackskada: ",
	uk: "Шкода від атаки: ",
	zh: "攻击伤害："
});
Translation.addTranslation("Handle", {
	de: "Handle", id: "Handle",
	it: "Gestione",
	ja: "持ち手", ko: "손잡이", pl: "Trzon",
	pt: "Manuseio",
	ru: "Рукоять",
	sv: "Skaft",
	uk: "Стержень",
	zh: "手柄"
});
Translation.addTranslation("Multiplier: ", {
    de: "Multiplikator: ",
    id: "Multiplikator: ",
    it: "Moltiplicatore: ",
    ja: "係数: ", ko: "곱셈 계수: ",
    pl: "Współczynnik wielokrotności: ",
    pt: "Multiplicador: ",
    ru: "Множитель: ",
    sv: "Multiplikatör: ",
    uk: "Множник: ",
    zh: "乘數器："
});
Translation.addTranslation("Durability: ", {
	de: "Haltbarkeit: ",
	id: "Durability: ",
	it: "Durabilità: ",
	ja: "耐久度: ", ko: "내구도: ",
	pl: "Wytrzymałość:",
	pt: "Durabilidade: ",
	ru: "Прочность: ",
	sv: "Hållbarhet: ",
	uk: "Міцність: ",
	zh: "耐久度："
});
Translation.addTranslation("Extra", {
	de: "Extra", id: "Extra", it: "Extra", ja: "締め具",
	ko: "추가적인 부품",
	pl: "Dodatek",
	pt: "Extra",
	ru: "Дополнительно",
	sv: "Extra",
	uk: "Додатково",
	zh: "附件"
});
Translation.addTranslation("Material value: %s", {
	de: "Materialwert: %s",
	id: "Material value: %s",
	it: "Valore materiale: %s",
	ja: "素材値: %s",
	ko: "재료의 양: %s",
	pl: "Ilość materiału: %s",
	pt: "Valor do Material: %s",
	ru: "Кол-во материала: %s",
	sv: "Materialvärde: %s",
	uk: "Вартість матеріалу: %s",
	zh: "材料值：%s"
});
Translation.addTranslation("Tool Forge", {
	de: "Werkzeugschmiede",
	id: "Tool Forge",
	it: "Fucina degli strumenti",
	ja: "道具鋳造工", ko: "도구 대장간",
	pl: "Mistrz majsterkowania",
	pt: "Forja de ferramentas",
	ru: "Кузня для инструментов",
	sv: "Verktygssmedja",
	uk: "Інструментна кузня",
	zh: "工具锻造"
});
Translation.addTranslation("Repair & Modify", {
	de: "Reparieren & Modifizieren",
	id: "Repair & Modify",
	it: "Ripara e modifica",
	ja: "修理と変更",
	ko: "수리 & 수식어",
	pl: "Napraw i modyfikuj",
	pt: "Repare & Modifique",
	ru: "Компоновщик",
	sv: "Reparera och modifiera",
	uk: "Ремонт і модифікація",
	zh: "修复与强化"
});
Translation.addTranslation("Modifiers", {
	de: "Modifikatoren",
	id: "Modifiers",
	it: "Modificatori",
	ja: "改造", ko: "수식어",
	pl: "Modyfikacje",
	pt: "Modificador",
	ru: "Модификаторы",
	sv: "Modifierare",
	uk: "Модифікатори",
	zh: "强化物"
});
Translation.addTranslation("Modifiers: ", {
	de: "Modifikatoren: ",
	id: "Modifiers: ",
	it: "Modificatori: ",
	ja: "改造: ", ko: "수식어: ",
	pl: "Modyfikacje: ",
	pt: "Modificador: ",
	ru: "Модификаторы: ",
	sv: "Modifierare: ",
	uk: "Модифікатори: ",
	zh: "强化物："
});
Translation.addTranslation("Unknown slot type %s", {
	de: "Unbekannter Slot-Typ %s",
	id: "Unknown slot type %s",
	it: "Tipo di slot %s sconosciuto",
	ja: "未知のスロットタイプです: %s",
	ko: "'%s'은(는) 알 수 없는 종류의 슬롯입니다",
	pt: "Tipo de slot desconhecido %s",
	ru: "Unknown slot type %s",
	sv: "%s är en okänd platstyp",
	uk: "Невідомий тип слоту %s",
	zh: "未知槽位类型%s"
});
Translation.addTranslation("Unknown modifier %s", {
    de: "Unbekannter Modifikator %s",
    id: "Modifier yang tidak dikenal %s",
    it: "Modificatore sconosciuto %s",
    ja: "%s desconocidoの修正子",
    ko: "%s 미지의 모디파이어",
    pl: "Nieznany modyfikator %s",
    pt: "Modificador desconhecido %s",
    ru: "Неизвестный модификатор %s",
    sv: "Okänd modifierare %s",
    uk: "Невідомий модифікатор %s",
    zh: "%s 未知调整值"
});
Translation.addTranslation("Unknown mining tier %s", {
    de: "Unbekanntes Bergbau-Stadium %s",
    id: "Tingkat penambangan yang tidak dikenali %s",
    it: "Livello di estrazione sconosciuto %s",
    ja: "%s desconocidoの採掘レベル",
    ko: "%s 미상known 채굴 티어",
    pl: "Nieznany poziom kopania %s",
    pt: "nível de mineração desconhecida %s",
    ru: "Неизвестный уровень добычи %s",
    sv: "Okänt gruvnivå %s",
    uk: "Невідомий рівень видобутку %s",
    zh: "%s 未知矿业等级"
});
Translation.addTranslation("Unknown material %s", {
    de: "Unbekanntes Material %s",
    id: "Bahan yang tidak dikenal %s",
    it: "Materiale sconosciuto %s",
    ja: "%s desconocidoの材料",
    ko: "%s 미지의 소재",
    pl: "Nieznane materiał %s",
    pt: "Matéria desconhecida %s",
    ru: "Неизвестный материал %s",
    sv: "Okänt material %s",
    uk: "Невідома речовина %s",
    zh: "%s 未知材料"
});
Translation.addTranslation("Tinker Station", {
	de: "Bastelstation",
	id: "Tinker Station",
	it: "Stazione dell'armeggiatore",
	ja: "ティンカー台",
	ko: "대장장이 작업대",
	pl: "Stacja majsterkowania",
	pt: "Estação Tinker",
	ru: "Литейная станция",
	sv: "Tinkerstation",
	uk: "Інженерна станція",
	zh: "工匠站"
});
Translation.addTranslation("Level: ", {
    de: "Ebene: ",
    id: "Tingkat: ",
    it: "Livello: ",
    ja: "レベル：",
    ko: "레벨 :",
    pl: "Poziom: ",
    pt: "Nível: ",
    ru: "Уровень: ",
    sv: "Nivå: ",
    uk: "Рівень: ",
    zh: "級別："
});
Translation.addTranslation("XP: ", {
    de: "EP: ",
    id: "EXP: ",
    it: "Punti esperienza: ",
    ja: "ＸＰ：",
    ko: "경험치 :",
    pl: "PK: ",
    pt: "xp: ",
    ru: "Опыт: ",
    sv: "UP: ",
    uk: "Досвід:",
    zh: "經驗值："
});

///
// TOOLS
///

Translation.addTranslation("Pickaxe Head", {
	de: "Spitzhackenkopf",
	id: "Kepala Beliung",
	it: "Testa del Piccone",
	ja: "つるはしの頭",
	ko: "곡괭이 머리",
	pl: "Głowica Kilofa",
	pt: "Cabeça de Picareta",
	ru: "Наконечник кирки",
	sv: "Pikhackehuvud",
	uk: "Насадка кирки",
	zh: "镐头"
});
Translation.addTranslation("Shovel Head", {
	de: "Schaufelkopf",
	id: "Kepala Sekop",
	it: "Testa della Pala",
	ja: "シャベルの頭", ko: "삽 머리",
	pl: "Głowica Łopaty",
	pt: "Cabeça de Pá",
	ru: "Наконечник лопаты",
	sv: "Spadehuvud",
	uk: "Насадка лопати",
	zh: "铲头"
});
Translation.addTranslation("Axe Head", {
	de: "Axtkopf",
	id: "Kepala Kapak",
	it: "Testa dell'Ascia",
	ja: "斧の頭", ko: "도끼 머리",
	pl: "Głowica Topora",
	pt: "Cabeça de Machado",
	ru: "Наконечник топора",
	sv: "Yxhuvud",
	uk: "Насадка топора",
	zh: "斧头"
});
Translation.addTranslation("Broad Axe Head", {
	de: "Breiter Axtkopf",
	id: "Kepala Kapak Lebar",
	it: "Testa dell'Ascia Larga",
	ja: "広斧ヘッド", ko: "넓은 도끼 머리",
	pl: "Szeroka Głowica Topora",
	pt: "Cabeça de Machado Largo",
	ru: "Наконечник тесака",
	sv: "Bred Yxhuvud",
	uk: "Насадка широкої сокири",
	zh: "宽斧头"
});
Translation.addTranslation("Sword Blade", {
	de: "Schwertklinge",
	id: "Pisau Pedang",
	it: "Lama della Spada",
	ja: "剣の刃", ko: "검 검",
	pl: "Ostrze Miecza",
	pt: "Lâmina de Espada",
	ru: "Лезвие секиры",
	sv: "Svärdblad",
	uk: "Лезо меча",
	zh: "剑刃"
});
Translation.addTranslation("Hammer Head", {
	de: "Hammerkopf",
	id: "Kepala Palu",
	it: "Testa del Martello",
	ja: "ハンマーヘッド", ko: "망치 머리",
	pl: "Głowica Młota",
	pt: "Cabeça de Martelo",
	ru: "Наконечник молота",
	sv: "Hammarehuvud",
	uk: "Насадка молота",
	zh: "锤头"
});
Translation.addTranslation("Excavator Head", {
	de: "Baggerschaufelkopf",
	id: "Kepala Excavator",
	it: "Testa dell'Escavatore",
	ja: "掘削ヘッド", ko: "굴착기 헤드",
	pl: "Głowica Koparki",
	pt: "Cabeça Escavadora",
	ru: "Наконечник экскаватора",
	sv: "Grävmaskinshuvud",
	uk: "Насадка екскаватора",
	zh: "挖掘头"
});
Translation.addTranslation("Tool Rod", {
	de: "Werkzeugstange",
	id: "Tang Alat",
	it: "Astina Strumento",
	ja: "ツールロッド", ko: "도구 막대",
	pl: "Pręt Narzędziowy",
	pt: "Haste de Ferramenta",
	ru: "Рукоятка инструмента",
	sv: "Verktygsstång",
	uk: "Важіль інструменту",
	zh: "工具杆"
});
Translation.addTranslation("Tough Tool Rod", {
	de: "Robuste Werkzeugstange",
	id: "Tang Alat yang Kokoh",
	it: "Astina Strumento Resistente",
	ja: "頑丈なツールロッド", ko: "튼튼한 도구 막대",
	pl: "Wytrzymały Pręt Narzędziowy",
	pt: "Haste de Ferramenta Resistente",
	ru: "Крепкая рукоятка инструмента",
	sv: "Stark Verktygsstång",
	uk: "Міцний Важіль інструменту",
	zh: "坚固的工具杆"
});
Translation.addTranslation("Binding", {
	de: "Binder",
	id: "Pengikat",
	it: "Vincolo",
	ja: "バインディング", ko: "바인딩",
	pl: "Więzadło",
	pt: "Vínculo",
	ru: "Крепление",
	sv: "Bindning",
	uk: "З'єднання",
	zh: "绑定"
});
Translation.addTranslation("Tough Binding", {
	de: "Robuster Binder",
	id: "Pengikat Kuat",
	it: "Legatura Resistente",
	ja: "頑丈なバインディング", ko: "튼튼한 바인딩",
	pl: "Wytrzymałe Wiązanie",
	pt: "Vínculo Resistente",
	ru: "Крепкое крепление",
	sv: "Starkt Fäste",
	uk: "Міцне З'єднання",
	zh: "坚固的绑定"
});
Translation.addTranslation("Wide Guard", {
	de: "Breite Schutzkappe",
	id: "Penjaga Lebar",
	it: "Guardia Larga",
	ja: "広いガード",
	ko: "넓은 가드",
	pl: "Szeroka Ochrona",
	pt: "Guarda Larga",
	ru: "Широкая карда",
	sv: "Bred Vakt",
	uk: "Широкий Захист",
	zh: "宽护手"
});
Translation.addTranslation("Large Plate", {
	de: "Große Platte",
	id: "Pelat Besar",
	it: "Piastra Grande",
	ja: "大きな板", ko: "큰 판",
	pl: "Duża Płyta",
	pt: "Placa Grande",
	ru: "Большая пластина",
	sv: "Stor Platta",
	uk: "Велика Пластина",
	zh: "大板"
});
Translation.addTranslation("Broken %s", {
	de: "Kaputtes %s",
	id: "%s Rusak",
	it: "%s Rotto",
	ja: "壊れた%s", ko: "고장난 %s",
	pl: "Uszkodzony %s",
	pt: "%s Quebrado",
	ru: "%s (разрушено)",
	sv: "Brott %s",
	uk: "Розбите %s",
	zh: "损坏的%s"
});
Translation.addTranslation("Pickaxe", {
	de: "Spitzhacke",
	id: "Pickaxe",
	it: "Piccone",
	ja: "ツルハシ", ko: "곡괭이", pl: "Kilof",
	pt: "Picareta",
	ru: "Кирка", sv: "Hacka", uk: "Кайло", zh: "镐"
});
Translation.addTranslation("The Pickaxe is a precise mining tool. It is effective on stone and ores. It breaks blocks, OK?", {
	de: "Die Spitzhacke ist ein präzises Bergbauwerkzeug. Sie ist effektiv bei Steinen und Erzen. Sie bricht Blöcke, OK?",
	id: "The Pickaxe is a precise mining tool. It is effective on stone and ores. It breaks blocks, OK?",
	it: "Il piccone è un preciso strumento da miniera. È efficace sulla pietra e sui minerali. Rompe i blocchi, ok?",
	ja: "ツルハシは精密な採掘道具です。石や鉱石に効果的です。そのブロックを壊しても大丈夫？",
	ko: "곡괭이는 정밀한 채굴 도구입니다. 돌과 광석을 효과적으로 채굴할 수 있습니다. 간단히 말하면, 블록을 부수는 도구입니다.",
	pl: "Kilof jest precyzyjnym narzędziem do kopania. Działa dobrze na skały i rudy. Kilof kopie, OK?",
	pt: "A picareta é uma ferramenta de mineração. Ela é muito efetiva para minerar pedras e minérios. Isso quebra blocos, Certo?",
	ru: "Кирка самый точный шахтерский инструмент. Очень эффективна для добычи камня и руд. Она ломает блоки, ясно?",
	sv: "Hackan är ett ensidigt grävverktyg. Den är effektiv på sten och malm. Den bryter block, hajar du?",
	uk: "Кайло є точним шахтарським знаряддям. Воно ефективне для добування блоків і руд. Воно ламає блоки, ясно?",
	zh: "镐是一种精准型采矿工具，能够高效挖掘石头、矿石等石类方块。挖方块用的，懂？"
});
Translation.addTranslation("Shovel", {
	de: "Schaufel",
	id: "Sekop",
	it: "Pala",
	ja: "シャベル", ko: "삽",
	pl: "Łopata",
	pt: "Pá",
	ru: "Лопата",
	sv: "Skyffel",
	uk: "Лопата",
	zh: "铲子"
});
Translation.addTranslation("The Shovel digs up dirt. It is effective on dirt, sand, gravel, and snow. Just don't dig your own grave!", {
	de: "Die Schaufel gräbt Erde aus. Sie ist effektiv auf Erde, Sand, Kies und Schnee. Graben Sie einfach nicht Ihr eigenes Grab!",
	id: "Sekop menggali tanah. Ini efektif pada tanah, pasir, kerikil, dan salju. Hanya jangan menggali kuburanmu sendiri!",
	it: "La Pala scava la terra. È efficace su terra, sabbia, ghiaia e neve. Basta non scavare la propria fossa!",
	ja: "シャベルは土を掘り起こします。土、砂、砂利、雪に効果的です。ただし、自分の墓を掘らないでください！",
	ko: "삽은 흙을 파내는 데 사용됩니다. 흙, 모래, 자갈 및 눈에서 효과적입니다. 그냥 자신의 무덤을 파지 마세요!",
	pl: "Łopata kopie ziemię. Jest skuteczna na ziemi, piasku, żwirze i śniegu. Po prostu nie kop swojego własnego grobu!",
	pt: "A Pá escava terra. É eficaz em terra, areia, cascalho e neve. Apenas não cave sua própria cova!",
	ru: "Лопата нужна для копания земли. Очень эффективна на земле, песке, гравии и снегу. Просто не выкапывай собственную могилу!",
	sv: "Skyffeln gräver upp jord. Den är effektiv på jord, sand, grus och snö. Gräva bara inte din egen grav!",
	uk: "Лопата потрібна для копання землі. Дуже ефективна на землі, піску, гравій і снігу. Просто не копайте свій власний могильник!",
	zh: "铲子挖起土壤。 它对土壤、沙子、碎石和雪很有效。 只是不要挖自己的坟墓！"
});
Translation.addTranslation("Hatchet", {
	de: "Beil",
	id: "Kapak",
	it: "Scuretta",
	ja: "斧", ko: "손도끼",
	pl: "Toporek",
	pt: "Machadinha",
	ru: "Тесак",
	sv: "Huggare",
	uk: "Сокира",
	zh: "斧头"
});
Translation.addTranslation("The Hatchet chops up wood and makes short work of leaves. It also makes for a passable weapon. Chop chop!", {
	de: "Das Beil zerhackt Holz und erledigt Blätter im Handumdrehen. Es macht auch eine akzeptable Waffe. Hack hack!",
	id: "Kapak menebang kayu dan dengan cepat menyelesaikan daun. Ini juga membuat senjata yang layak. Potong potong!",
	it: "La Scuretta trita legno e fa un lavoro rapido sulle foglie. Può anche essere un'arma passabile. Taglia taglia!",
	ja: "斧は木材を切り刻み、葉を短時間で処理します。それはまあまあの武器にもなります。チョップ チョップ!",
	ko: "손도끼는 나무를 베어내고 잎사귀를 빠르게 처리합니다. 또한 어느 정도는 무기로 사용할 만합니다. 찍어 찍어!",
	pl: "Toporek sieka drewno i szybko radzi sobie z liśćmi. Może również stanowić znośną broń. Siekaj, siekaj!",
	pt: "A Machadinha corta madeira e faz um trabalho rápido com folhas. Também pode ser uma arma aceitável. Corta corta!",
	ru: "Тесак срубает древесину и быстро справляется с листвой. Это также делает его неплохим оружием. Боньк, боньк!",
	sv: "Huggaren hackar upp trä och gör kort arbete med löv. Det gör också en acceptabelt vapen. Hacka hacka!",
	uk: "Сокира рубає деревину і швидко справляється з листям. Це також робить його прийнятною зброєю. Боньк, боньк!",
	zh: "斧头砍伐木材，轻松解决树叶。 它也可以成为一种可以接受的武器。 砍砍！"
});
Translation.addTranslation("Mattock", {
	de: "Mattock",
	id: "Mattock",
	it: "Mattock",
	ja: "マトック", ko: "매톡",
	pl: "Motyka",
	pt: "Chibanca",
	ru: "Заточенная мотыга",
	sv: "Jordhacka",
	uk: "Кайломотика",
	zh: "鹤嘴锄"
});
Translation.addTranslation("The Cutter Mattock is a versatile farming tool. It is effective on wood, dirt, and plants. It also packs quite a punch.", {
	de: "Die Hacke ist ein vielseitiges landwirtschaftliches Werkzeug. Es ist effektiv auf Holz, Erde und Pflanzen. Es hat auch eine ziemliche Wirkung.",
	id: "Cutter Mattock adalah alat pertanian serbaguna. Ini efektif pada kayu, tanah, dan tanaman. Ini juga memberikan pukulan yang cukup besar.",
	it: "La Zappa Tagliente è uno strumento agricolo versatile. È efficace su legno, terra e piante. Ha anche un bel pugno.",
	ja: "カッターマトックは多目的な農業ツールです。木材、土壌、植物に効果的です。また、かなりのパンチも持っています。",
	ko: "커터 매토크는 다용도 농업 도구입니다. 나무, 흙, 식물에 효과적입니다. 또한 상당한 타격을 가지고 있습니다.",
	pl: "Kosiarka Motyka to wszechstronne narzędzie rolnicze. Jest skuteczny na drewnie, ziemi i roślinach. Ma też spory cios.",
	pt: "A Enxada Cortadora é uma ferramenta agrícola versátil. É eficaz em madeira, terra e plantas. Também tem um bom impacto.",
	ru: "Заточенная мотыга прекрасный инструмент для сельского хозяйства. Очень эффективна на древесине, земле и растениях. Она также наносит неплохой урон.",
	sv: "Hackan är ett mångsidigt jordbruksverktyg. Den är effektiv på trä, jord och växter. Den har också en ganska kraftig slagkraft.",
	uk: "Заточена мотика чудовий інструмент для сільського господарства. Дуже ефективна на деревині, землі та рослинах. Вона також завдає непоганого удару.",
	zh: "削铲镐是一种多功能的农业工具。它对木材、土壤和植物都很有效。它也有相当的冲击力。"
});
Translation.addTranslation("Broad Sword", {
	de: "Breitschwert",
	id: "Pedang Lebar",
	it: "Spada Larga",
	ja: "広剣", ko: "넓은 검",
	pl: "Szeroki Miecz",
	pt: "Espada Larga",
	ru: "Секира",
	sv: "Bredsverd",
	uk: "Широкий меч",
	zh: "宽剑"
});
Translation.addTranslation("The Broad Sword is a universal weapon. Sweep attacks keep enemy hordes at bay. Also good against cobwebs!", {
	de: "Das Breitschwert ist eine universelle Waffe. Schwungangriffe halten feindliche Horden in Schach. Auch gut gegen Spinnweben!",
	id: "Pedang Lebar adalah senjata serba guna. Serangan sapuan menahan gerombolan musuh. Juga bagus melawan jaring laba-laba!",
	it: "La Spada Larga è un'arma universale. Gli attacchi ampi tengono a bada le orde nemiche. Ottima anche contro le ragnatele!",
	ja: "ブロードソードは汎用武器です。スウィープ攻撃で敵の群れを寄せ付けません。また、クモの巣にも効果的です！",
	ko: "브로드 소드는 범용 무기입니다. 스윕 공격으로 적의 무리를 멀리 유지합니다. 거미줄에도 효과적입니다!",
	pl: "Szeroki Miecz to uniwersalna broń. Ataki zamiatania powstrzymują hordy wrogów. Dobry też przeciwko pajęczynom!",
	pt: "A Espada Larga é uma arma universal. Ataques em varredura mantêm hordas inimigas afastadas. Também é eficaz contra teias de aranha!",
	ru: "Секира универсальное оружие. Сметающие все на своем пути атаки сдерживают врагов на расстоянии. Также неплоха против паутины!",
	sv: "Det breda svärdet är ett universellt vapen. Svepande attacker håller fiendehorder på avstånd. Bra även mot spindelnät!",
	uk: "Широка меч універсальна зброя. Замахи атак зупиняють ворожі зграї на відстані. Також добре проти павутини!",
	zh: "宽剑是一种通用武器。 横扫攻击可以阻挡敌人的大军。 也对蜘蛛网很有效！"
});
Translation.addTranslation("Hammer", {
	de: "Hammer",
	id: "Palu",
	it: "Martello",
	ja: "ハンマー", ko: "망치",
	pl: "Młotek",
	pt: "Martelo",
	ru: "Молот",
	sv: "Hammar",
	uk: "Молот",
	zh: "锤子"
});
Translation.addTranslation("The Hammer is a broad mining tool. It harvests blocks in a wide range. Also effective against undead.", {
	de: "Der Hammer ist ein breites Bergbaugerät. Es erntet Blöcke in einem weiten Bereich. Auch effektiv gegen Untote.",
	id: "Palu adalah alat penambangan yang luas. Ini mengumpulkan blok dalam jangkauan yang luas. Juga efektif melawan mayat hidup.",
	it: "Il Martello è un ampio attrezzo da miniera. Raccoglie blocchi in un'ampia area. Anche efficace contro gli non morti.",
	ja: "ハンマーは広範な採掘ツールです。広範囲でブロックを収穫します。また、アンデッドにも効果的です。",
	ko: "망치는 넓은 채굴 도구입니다. 넓은 범위에서 블록을 수확합니다. 또한 좀비에게 효과적입니다.",
	pl: "Młotek to szerokie narzędzie górnicze. Zbiera bloki na szerokim obszarze. Skuteczny także przeciwko nieumarłym.",
	pt: "O Martelo é uma ferramenta de mineração ampla. Ele colhe blocos em uma ampla área. Também eficaz contra mortos-vivos.",
	ru: "Молот используется для раскапывания шахт. Добывает блоки в большом радиусе. Также эффективен против нежити.",
	sv: "Hammar är ett brett gruvarbetsverktyg. Det skördar block på ett brett område. Även effektivt mot odöda.",
	uk: "Молот широкий гірничий інструмент. Він збирає блоки на широкій території. Також ефективний проти неживих.",
	zh: "锤子是一种广泛的采矿工具。它在广"
});

Translation.addTranslation("Excavator", {
	de: "Bagger",
	id: "Excavator",
	it: "Scavatore",
	ja: "エクスカベーター", ko: "야전삽",
	pl: "Duża łopata",
	pt: "Escavadora",
	ru: "Экскаватор",
	sv: "Utgrävare",
	uk: "Землечерпалка",
	zh: "开掘铲"
});
Translation.addTranslation("The Excavator is a broad digging tool. It digs up large areas of soil and snow in a wide range. Terraforming!", {
	de: "Der Bagger ist ein breites Grabwerkzeug. Er gräbt große Erd- und Schneeflächen in einem weiten Bereich aus. Terraforming!",
	id: "The Excavator is a broad digging tool. It digs up large areas of soil and snow in a wide range. Terraforming!",
	it: "L'escavatore è un grande strumento di scavo. Scava grandi aree di terreno e neve in un ampio raggio. Terraformazione!",
	ja: "エクスカベーターは大型の掘り道具です。広範囲の土や雪を一度に掘り起こせます。テラフォーミング！",
	ko: "야전삽은 광범위한 굴착 도구입니다. 넓은 범위의 흙과 눈을 파낼 수 있습니다. 지형을 평탄화하세요!",
	pl: "Duża łopata jest dużym narzędziem do kopania w ziemi. Niszczy dużą ilość gleby i śniegu na raz. Terraformacja!",
	pt: "A Escavadora é uma ferramenta grande muito útil para a escavação. Ele escava grandes áreas de solo e neve em larga escala. Terraformando!",
	ru: "Экскаватор используется для раскапывания кратеров. Выкапывает участки земли и снега в большом радиусе. Терраформирование!",
	sv: "Utgrävaren är ett mångsidigt grävverktyg. Den gräver upp större områden av jord och snö i ett brett område. Terraformering!",
	uk: "Землечерпалка є широким копальним знаряддям. Вона викопує велику площу ґрунту й снігу в широкому радіусі. Тераформування!",
	zh: "开掘铲是一种范围型挖掘工具，能单次挖掘一整片区域内的泥土和雪。改天换地！"
});
Translation.addTranslation("Tree chopping in progress...", {
	de: "Baumfällung läuft...",
	id: "Penebangan pohon sedang berlangsung...",
	it: "Abbattimento degli alberi in corso...",
	ja: "木を切る作業中...",
	ko: "나무 베기 진행 중...",
	pl: "Trwa wycinka drzew...",
	pt: "Derrubada de árvores em andamento...",
	ru: "Продолжается измельчение дерева...",
	sv: "Trädhuggning pågår...",
	uk: "Йде подрібнення дерева...",
	zh: "正在砍树..."
});
Translation.addTranslation("Lumber Axe", {
	de: "Holzfälleraxt",
	id: "Kapak Kayu",
	it: "Ascia da Boscaiolo",
	ja: "伐採斧",
	ko: "벌목 도끼",
	pl: "Topór Leśnika",
	pt: "Machado de Lenhador",
	ru: "Топор лесника",
	sv: "Timber Yxa",
	uk: "Топір Лісоруба",
	zh: "伐木斧"
});
Translation.addTranslation("The Lumber Axe is a broad chopping tool. It can fell entire trees in one swoop or gather wood in a wide range. Timber!", {
	de: "Die Holzfälleraxt ist ein breites Werkzeug zum Fällen von Bäumen. Sie kann ganze Bäume auf einmal fällen oder Holz in einem weiten Bereich sammeln. Holz vor der Hütte!",
	id: "Kapak kayu adalah alat pemotongan yang lebar. Ini dapat menebang seluruh pohon dalam satu kali tebas atau mengumpulkan kayu dalam jangkauan yang luas. Kayu!",
	it: "L'ascia da boscaiolo è uno strumento di abbattimento ampio. Può abbattere interi alberi in un colpo solo o raccogliere legna in un'ampia area. Legna!",
	ja: "伐採斧は幅広い切り込みツールです。一度に木を全て切り倒すか、広範囲で木材を収集することができます。材木！",
	ko: "벌목 도끼는 넓은 벌목 도구입니다. 한 번에 전체 나무를 베거나 넓은 범위에서 나무를 수확할 수 있습니다. 재목!",
	pl: "Topór Leśnika to szerokie narzędzie do wycinki drzew. Może obalić całe drzewa za jednym zamachem lub zbierać drewno na szerokim obszarze. Drewno!",
	pt: "O Machado de Lenhador é uma ferramenta ampla para cortar. Pode derrubar árvores inteiras em um único golpe ou coletar madeira em uma ampla área. Madeira!",
	ru: "Топор лесника используется для измельчения леса. Он может добыть сразу все дерево или собрать древесину в большом радиусе. Лесоповал!",
	sv: "Timber Yxan är ett brett huggverktyg. Den kan fälla hela träd på en gång eller samla trä på ett brett område. Timmer!",
	uk: "Топір Лісоруба це широкий інструмент для вирубування дерев. Він може валити цілі дерева одним махом або збирати деревину на широкій території. Дерево!",
	zh: "伐木斧是一种宽阔的砍伐工具。 它可以一次性砍倒整棵树，或者在广泛的范围内收集木材。 木材！"
});


///
// TOOLS -> MATERIALS
///

Translation.addTranslation("Wooden %s", {
	de: "Holz %s",
	id: "%s kayu",
	it: "%s in legno",
	ja: "木製の%s", ko: "나무 %s",
	pl: "%s z drewna",
	pt: "%s de madeira",
	ru: "%s из древесины",
	sv: "Trä %s",
	uk: "%s з дерева",
	zh: "木制%s"
});
Translation.addTranslation("Wooden", {
	de: "Holz",
	id: "Kayu",
	it: "Di legno",
	ja: "木製", ko: "나무",
	pl: "Drewniany",
	pt: "De madeira",
	ru: "Древесина",
	sv: "Trä",
	uk: "Дерев'яний",
	zh: "木制"
});
Translation.addTranslation("Stone %s", {
	de: "Stein %s",
	id: "%s batu",
	it: "%s in pietra",
	ja: "石の%s", ko: "돌 %s",
	pl: "%s z kamienia",
	pt: "%s de pedra",
	ru: "%s из камня",
	sv: "Sten %s",
	uk: "%s з каменю",
	zh: "石制%s"
});
Translation.addTranslation("Stone", {
	de: "Stein",
	id: "Batu",
	it: "Di pietra",
	ja: "石", ko: "돌",
	pl: "Kamienny",
	pt: "De pedra",
	ru: "Камень",
	sv: "Sten",
	uk: "Кам'яний",
	zh: "石制"
});
Translation.addTranslation("Flint %s", {
	de: "Feuerstein %s",
	id: "%s batu krikil",
	it: "%s in selce",
	ja: "燧石の%s", ko: "부싯돌 %s",
	pl: "%s z krzemienia",
	pt: "%s de sílex",
	ru: "%s из кремния",
	sv: "Flinta %s",
	uk: "%s з кременю",
	zh: "燧石%s"
});
Translation.addTranslation("Flint", {
	de: "Feuerstein",
	id: "Krikil",
	it: "Selce",
	ja: "燧石", ko: "부싯돌",
	pl: "Krzemień",
	pt: "Sílex",
	ru: "Кремень",
	sv: "Flinta",
	uk: "Кремінь",
	zh: "燧石"
});
Translation.addTranslation("Cactus %s", {
	de: "Kaktus %s",
	id: "%s kaktus",
	it: "%s di cactus",
	ja: "サボテンの%s", ko: "선인장 %s",
	pl: "%s z kaktusa",
	pt: "%s de cacto",
	ru: "%s из кактусов",
	sv: "Kaktus %s",
	uk: "%s з кактусу",
	zh: "仙人掌%s"
});
Translation.addTranslation("Cactus", {
	de: "Kaktus",
	id: "Kaktus",
	it: "Cactus",
	ja: "サボテン",
	ko: "선인장",
	pl: "Kaktus",
	pt: "Cacto",
	ru: "Кактус",
	sv: "Kaktus",
	uk: "Кактус",
	zh: "仙人掌"
});
Translation.addTranslation("Obsidian %s", {
	de: "Obsidian %s",
	id: "%s obsidian",
	it: "%s di ossidiana",
	ja: "黒曜石の%s",
	ko: "흑요석 %s",
	pl: "%s z obsydianu",
	pt: "%s de obsidiana",
	ru: "%s из обсидиана",
	sv: "Obsidian %s",
	uk: "%s з обсидіану",
	zh: "黑曜石%s"
});
Translation.addTranslation("Obsidian", {
	de: "Obsidian",
	id: "Obsidian",
	it: "Ossidiana",
	ja: "黒曜石",
	ko: "흑요석",
	pl: "Obsydian",
	pt: "Obsidiana",
	ru: "Обсидиан",
	sv: "Obsidian",
	uk: "Обсидіан",
	zh: "黑曜石"
});
Translation.addTranslation("Prismarine %s", {
	de: "Prismarin %s",
	id: "%s prismarine",
	it: "%s di prismarino",
	ja: "プリズマリンの%s",
	ko: "프리즈마린 %s",
	pl: "%s z prismarynu",
	pt: "%s de prismarinho",
	ru: "%s из призмарина",
	sv: "Prismarin %s",
	uk: "%s з призмарину",
	zh: "水晶石%s"
});
Translation.addTranslation("Prismarine", {
	de: "Prismarin",
	id: "Prismarine",
	it: "Prismarino",
	ja: "プリズマリン",
	ko: "프리즈마린",
	pl: "Prismaryn",
	pt: "Prismarinho",
	ru: "Призмарин",
	sv: "Prismarin",
	uk: "Призмарин",
	zh: "水晶石"
});
Translation.addTranslation("Netherrack %s", {
	de: "Netherstein %s",
	id: "%s netherrack",
	it: "%s di netherrack",
	ja: "ネザーラックの%s",
	ko: "네더랙 %s",
	pl: "%s z netherrack",
	pt: "%s de netherrack",
	ru: "%s из незерака",
	sv: "Netherrack %s",
	uk: "%s з незераку",
	zh: "地狱岩%s"
});
Translation.addTranslation("Netherrack", {
	de: "Netherstein",
	id: "Netherrack",
	it: "Netherrack",
	ja: "ネザーラック",
	ko: "네더랙",
	pl: "Netherrack",
	pt: "Netherrack",
	ru: "Незерак",
	sv: "Netherrack",
	uk: "Незерак",
	zh: "地狱岩"
});
Translation.addTranslation("End Stone %s", {
	de: "Endstein %s",
	id: "%s batu akhir",
	it: "%s di pietra dell'End",
	ja: "エンドストーンの%s",
	ko: "엔드 스톤 %s",
	pl: "%s z kamienia końcowego",
	pt: "%s de pedra do fim",
	ru: "%s из эндерняка",
	sv: "Endsten %s",
	uk: "%s з ендерняку",
	zh: "末地石%s"
});
Translation.addTranslation("End Stone", {
	de: "Endstein",
	id: "Batu Akhir",
	it: "Pietra dell'End",
	ja: "エンドストーン",
	ko: "엔드 스톤",
	pl: "Kamień Końcowy",
	pt: "Pedra do Fim",
	ru: "Эндерняк",
	sv: "Endsten",
	uk: "Ендерняк",
	zh: "末地石"
});
Translation.addTranslation("Bone %s", {
	de: "Knochen %s",
	id: "%s tulang",
	it: "%s di osso",
	ja: "骨の%s",
	ko: "뼈 %s",
	pl: "%s z kości",
	pt: "%s de osso",
	ru: "%s из костей",
	sv: "Ben %s",
	uk: "%s з кісток",
	zh: "骨头%s"
});
Translation.addTranslation("Bone", {
	de: "Knochen",
	id: "Tulang",
	it: "Osso",
	ja: "骨",
	ko: "뼈",
	pl: "Kość",
	pt: "Osso",
	ru: "Кость",
	sv: "Ben",
	uk: "Кістка",
	zh: "骨头"
});
Translation.addTranslation("Paper %s", {
	de: "Papier %s",
	id: "%s kertas",
	it: "%s di carta",
	ja: "紙の%s",
	ko: "종이 %s",
	pl: "%s z papieru",
	pt: "%s de papel",
	ru: "%s из бумаги",
	sv: "Papper %s",
	uk: "%s з паперу",
	zh: "纸%s"
});
Translation.addTranslation("Paper", {
	de: "Papier",
	id: "Kertas",
	it: "Carta",
	ja: "紙",
	ko: "종이",
	pl: "Papier",
	pt: "Papel",
	ru: "Бумага",
	sv: "Papper",
	uk: "Папір",
	zh: "纸"
});
Translation.addTranslation("Sponge %s", {
	de: "Schwamm %s",
	id: "%s spons",
	it: "%s di spugna",
	ja: "スポンジの%s",
	ko: "스펀지 %s",
	pl: "%s z gąbki",
	pt: "%s de esponja",
	ru: "%s из губок",
	sv: "Svamp %s",
	uk: "%s з губок",
	zh: "海绵%s"
});
Translation.addTranslation("Sponge", {
	de: "Schwamm",
	id: "Spons",
	it: "Spugna",
	ja: "スポンジ",
	ko: "스펀지",
	pl: "Gąbka",
	pt: "Esponja",
	ru: "Губка",
	sv: "Svamp",
	uk: "Губка",
	zh: "海绵"
});

Translation.addTranslation("Firewood %s", {
    de: "%s aus Feuerholz",
    id: "%s kayu api",
    it: "%s legna da ardere",
    ja: "%s 火 ligne",
    ko: "%s 열매나무",
    pl: "%s opału",
    pt: "%s lenha",
    ru: "%s из огнедерева",
    sv: "%s bränsleved",
    uk: "%s дров",
    zh: "%s 木材"
});
Translation.addTranslation("Firewood", {
    de: "Feuerholz",
    id: "Kayu api",
    it: "Legna da ardere",
    ja: "火 ligne",
    ko: "열매나무",
    pl: "Opał",
    pt: "Lenha",
    ru: "Огнедерево",
    sv: "Bränsleved",
    uk: "Дрова",
    zh: "木材"
});
Translation.addTranslation("Slime %s", {
	de: "Schleim %s",
	id: "%s lendir",
	it: "%s di slime",
	ja: "スライムの%s",
	ko: "슬라임 %s",
	pl: "%s ze śluzu",
	pt: "%s de slime",
	ru: "%s из слизи",
	sv: "Slem %s",
	uk: "%s з слизу",
	zh: "史莱姆%s"
});
Translation.addTranslation("Slime", {
	de: "Schleim",
	id: "Slime",
	it: "Slime",
	ja: "スライム",
	ko: "슬라임",
	pl: "Śluz",
	pt: "Slime",
	ru: "Слизь",
	sv: "Slem",
	uk: "Слизь",
	zh: "史莱姆"
});
Translation.addTranslation("Blue Slime %s", {
	de: "Blauer Schleim %s",
	id: "%s lendir biru",
	it: "%s di slime blu",
	ja: "青いスライムの%s",
	ko: "파란 슬라임 %s",
	pl: "%s ze śluzu niebieskiego",
	pt: "%s de slime azul",
	ru: "%s из синей слизи",
	sv: "Blå slem %s",
	uk: "%s з синьої слизу",
	zh: "蓝色史莱姆%s"
});
Translation.addTranslation("Blue Slime", {
	de: "Blauer Schleim",
	id: "Slime Biru",
	it: "Slime Blu",
	ja: "青いスライム",
	ko: "파란 슬라임",
	pl: "Niebieski Śluz",
	pt: "Slime Azul",
	ru: "Синяя слизь",
	sv: "Blå slem",
	uk: "Синя слизь",
	zh: "蓝色史莱姆"
});
Translation.addTranslation("Magma Slime %s", {
	de: "Magmaschleim %s",
	id: "%s lendir magma",
	it: "%s di slime di magma",
	ja: "マグマスライムの%s",
	ko: "마그마 슬라임 %s",
	pl: "%s ze śluzu magmy",
	pt: "%s de slime de magma",
	ru: "%s из магмовой слизи",
	sv: "Magmaslem %s",
	uk: "%s з магмової слизу",
	zh: "岩浆史莱姆%s"
});
Translation.addTranslation("Magma Slime", {
	de: "Magmaschleim",
	id: "Slime Magma",
	it: "Slime di magma",
	ja: "マグマスライム",
	ko: "마그마 슬라임",
	pl: "Śluz Magmy",
	pt: "Slime de magma",
	ru: "Магмовая слизь",
	sv: "Magmaslem",
	uk: "Магмова слизь",
	zh: "岩浆史莱姆"
});
Translation.addTranslation("Knightslime %s", {
	de: "Ritterschleim %s",
	id: "%s lendir ksatria",
	it: "%s di slime cavaliere",
	ja: "ナイトスライムの%s",
	ko: "나이트 슬라임 %s",
	pl: "%s ze śluzu rycerskiego",
	pt: "%s de slime de cavaleiro",
	ru: "%s из короля слизней",
	sv: "Riddarslem %s",
	uk: "%s з короля слизнів",
	zh: "骑士史莱姆%s"
});
Translation.addTranslation("Knightslime", {
	de: "Ritterschleim",
	id: "Slime Ksatria",
	it: "Slime Cavaliere",
	ja: "ナイトスライム",
	ko: "나이트 슬라임",
	pl: "Śluz Rycerski",
	pt: "Slime de Cavaleiro",
	ru: "Слизь из короля слизней",
	sv: "Riddarslem",
	uk: "Слизь короля слизнів",
	zh: "骑士史莱姆"
});
Translation.addTranslation("Iron %s", {
	de: "Eisen %s",
	id: "%s besi",
	it: "%s di ferro",
	ja: "鉄の%s",
	ko: "철 %s",
	pl: "%s z żelaza",
	pt: "%s de ferro",
	ru: "%s из железа",
	sv: "Järn %s",
	uk: "%s з заліза",
	zh: "铁%s"
});
Translation.addTranslation("Iron", {
	de: "Eisen",
	id: "Besi",
	it: "Ferro",
	ja: "鉄",
	ko: "철",
	pl: "Żelazo",
	pt: "Ferro",
	ru: "Железо",
	sv: "Järn",
	uk: "Залізо",
	zh: "铁"
});
Translation.addTranslation("Pigiron %s", {
	de: "Schweineisen %s",
	id: "%s besi babi",
	it: "%s di ghisa",
	ja: "ピッグアイアンの%s",
	ko: "돼지철 %s",
	pl: "%s z żelaza hutniczego",
	pt: "%s de ferro de porco",
	ru: "%s из чугуна",
	sv: "Grisjärn %s",
	uk: "%s з чавуну",
	zh: "猪铁%s"
});
Translation.addTranslation("Pigiron", {
	de: "Schweineisen",
	id: "Besi Babi",
	it: "Ghisa",
	ja: "ピッグアイアン",
	ko: "돼지철",
	pl: "Żelazo Hutnicze",
	pt: "Ferro de Porco",
	ru: "Чугун",
	sv: "Grisjärn",
	uk: "Чавун",
	zh: "猪铁"
});
Translation.addTranslation("Cobalt %s", {
	de: "Kobalt %s",
	id: "%s kobalt",
	it: "%s di cobalto",
	ja: "コバルトの%s",
	ko: "코발트 %s",
	pl: "%s z kobaltu",
	pt: "%s de cobalto",
	ru: "%s из кобальта",
	sv: "Kobolt %s",
	uk: "%s з кобальту",
	zh: "钴%s"
});
Translation.addTranslation("Cobalt", {
	de: "Kobalt",
	id: "Kobalt",
	it: "Cobalto",
	ja: "コバルト",
	ko: "코발트",
	pl: "Kobalt",
	pt: "Cobalto",
	ru: "Кобальт",
	sv: "Kobolt",
	uk: "Кобальт",
	zh: "钴"
});
Translation.addTranslation("Ardite %s", {
	de: "Ardit %s",
	id: "%s ardit",
	it: "%s di ardite",
	ja: "アーダイトの%s",
	ko: "아르다이트 %s",
	pl: "%s z ardycie",
	pt: "%s de ardite",
	ru: "%s из ардита",
	sv: "Ardit %s",
	uk: "%s з ардиту",
	zh: "硬化%s"
});
Translation.addTranslation("Ardite", {
	de: "Ardit",
	id: "Ardit",
	it: "Ardite",
	ja: "アーダイト",
	ko: "아르다이트",
	pl: "Ardycie",
	pt: "Ardite",
	ru: "Ардит",
	sv: "Ardit",
	uk: "Ардит",
	zh: "硬化"
});
Translation.addTranslation("Manyullyn %s", {
	de: "Manyullyn %s",
	id: "%s manyullyn",
	it: "%s di manyullyn",
	ja: "マニュリンの%s",
	ko: "마뉴린 %s",
	pl: "%s z manyullyn",
	pt: "%s de manyullyn",
	ru: "%s из манюллина",
	sv: "Manyullyn %s",
	uk: "%s з манюліну",
	zh: "曼尼林%s"
});
Translation.addTranslation("Manyullyn", {
	de: "Manyullyn",
	id: "Manyullyn",
	it: "Manyullyn",
	ja: "マニュリン",
	ko: "마뉴린",
	pl: "Manyullyn",
	pt: "Manyullyn",
	ru: "Манюллин",
	sv: "Manyullyn",
	uk: "Манюлін",
	zh: "曼尼林"
});
Translation.addTranslation("Copper %s", {
	de: "Kupfer %s",
	id: "%s tembaga",
	it: "%s di rame",
	ja: "銅の%s",
	ko: "구리 %s",
	pl: "%s z miedzi",
	pt: "%s de cobre",
	ru: "%s из меди",
	sv: "Koppar %s",
	uk: "%s з міді",
	zh: "铜%s"
});
Translation.addTranslation("Copper", {
	de: "Kupfer",
	id: "Tembaga",
	it: "Rame",
	ja: "銅",
	ko: "구리",
	pl: "Miedź",
	pt: "Cobre",
	ru: "Медь",
	sv: "Koppar",
	uk: "Мідь",
	zh: "铜"
});
Translation.addTranslation("Bronze %s", {
	de: "Bronze %s",
	id: "%s perunggu",
	it: "%s di bronzo",
	ja: "ブロンズの%s",
	ko: "청동 %s",
	pl: "%s z brązu",
	pt: "%s de bronze",
	ru: "%s из бронзы",
	sv: "Brons %s",
	uk: "%s з бронзи",
	zh: "青铜%s"
});
Translation.addTranslation("Bronze", {
	de: "Bronze",
	id: "Perunggu",
	it: "Bronzo",
	ja: "ブロンズ",
	ko: "청동",
	pl: "Brąz",
	pt: "Bronze",
	ru: "Бронза",
	sv: "Brons",
	uk: "Бронза",
	zh: "青铜"
});
Translation.addTranslation("Lead %s", {
	de: "Blei %s",
	id: "%s timah",
	it: "%s di piombo",
	ja: "鉛の%s",
	ko: "납 %s",
	pl: "%s z ołowiu",
	pt: "%s de chumbo",
	ru: "%s из свинца",
	sv: "Bly %s",
	uk: "%s з свинцю",
	zh: "铅%s"
});
Translation.addTranslation("Lead", {
	de: "Blei",
	id: "Timah",
	it: "Piombo",
	ja: "鉛",
	ko: "납",
	pl: "Ołów",
	pt: "Chumbo",
	ru: "Свинец",
	sv: "Bly",
	uk: "Свинець",
	zh: "铅"
});
Translation.addTranslation("Silver %s", {
	de: "Silber %s",
	id: "%s perak",
	it: "%s di argento",
	ja: "銀の%s",
	ko: "은 %s",
	pl: "%s z srebra",
	pt: "%s de prata",
	ru: "%s из серебра",
	sv: "Silver %s",
	uk: "%s зі срібла",
	zh: "银%s"
});
Translation.addTranslation("Silver", {
	de: "Silber",
	id: "Perak",
	it: "Argento",
	ja: "銀",
	ko: "은",
	pl: "Srebro",
	pt: "Prata",
	ru: "Серебро",
	sv: "Silver",
	uk: "Срібло",
	zh: "银"
});
Translation.addTranslation("Electrum %s", {
	de: "Elektrum %s",
	id: "%s elektro",
	it: "%s di elettro",
	ja: "エレクトラムの%s",
	ko: "전기 %s",
	pl: "%s z elektrum",
	pt: "%s de eletrum",
	ru: "%s из электрума",
	sv: "Elektrum %s",
	uk: "%s з електруму",
	zh: "电金%s"
});
Translation.addTranslation("Electrum", {
	de: "Elektrum",
	id: "Elektro",
	it: "Elettro",
	ja: "エレクトラム",
	ko: "전기",
	pl: "Elektrum",
	pt: "Eletrum",
	ru: "Электрум",
	sv: "Elektrum",
	uk: "Електрум",
	zh: "电金"
});
Translation.addTranslation("Steel %s", {
	de: "Stahl %s",
	id: "%s baja",
	it: "%s di acciaio",
	ja: "鋼の%s",
	ko: "강철 %s",
	pl: "%s ze stali",
	pt: "%s de aço",
	ru: "%s из стали",
	sv: "Stål %s",
	uk: "%s зі сталі",
	zh: "钢%s"
});
Translation.addTranslation("Steel", {
	de: "Stahl",
	id: "Baja",
	it: "Acciaio",
	ja: "鋼",
	ko: "강철",
	pl: "Stal",
	pt: "Aço",
	ru: "Сталь",
	sv: "Stål",
	uk: "Сталь",
	zh: "钢"
});

///
// TOOLS -> MODIFIERS
///

Translation.addTranslation("Haste", {
	de: "Eile", id: "Haste",
	it: "Sollecitudine",
	ja: "加速",
	ko: "성급함",
	pl: "Pośpieszny",
	pt: "Pressa",
	ru: "Спешка",
	sv: "Skyndsamhet",
	uk: "Квапливість",
	zh: "急迫"
});
Translation.addTranslation("Luck", {
	de: "Glück", id: "Luck",
	it: "Fortuna",
	ja: "ラッキー", ko: "운",
	pl: "Szczęśliwy",
	pt: "Sorte", ru: "Удача", sv: "Tur",
	uk: "Удачливо",
	zh: "幸运"
});
Translation.addTranslation("Sharper", {
	de: "Schärfer",
	id: "Sharper",
	it: "Affilatezza",
	ja: "超鋭利",
	ko: "뾰족함",
	pl: "Ostrzejszy",
	pt: "Mais Afiado",
	ru: "Острота",
	sv: "Mer skärpa",
	uk: "Гострішість",
	zh: "锋利"
});
Translation.addTranslation("Diamond", {
	de: "Diamant",
	id: "Diamond",
	it: "Diamante",
	ja: "ダイヤモンド", ko: "다이아몬드",
	pl: "Diament",
	pt: "Diamante",
	ru: "Алмаз",
	sv: "Diamant",
	uk: "Діамант",
	zh: "钻石"
});
Translation.addTranslation("Emerald", {
	de: "Smaragd",
	id: "Emerald",
	it: "Smeraldo",
	ja: "エメラルド", ko: "에메랄드",
	pl: "Szmaragd",
	pt: "Esmeralda",
	ru: "Изумруд",
	sv: "Smaragd",
	uk: "Смарагд",
	zh: "绿宝石"
});
Translation.addTranslation("Silky Cloth", {
	de: "Seidiger Stoff",
	id: "Kain Sutra",
	it: "Panno di seta",
	ja: "シルキークロス",
	ko: "비단결 천",
	pl: "Jedwabista tkanina",
	pt: "Pano de Seda",
	ru: "Шелковая ткань",
	sv: "Silkestyg",
	uk: "Шовкова тканина",
	zh: "丝绢"
});
Translation.addTranslation("Silky Jewel", {
	de: "Seidiges Juwel",
	id: "Permata Halus",
	it: "Gioiello di seta",
	ja: "シルキージュエル",
	ko: "비단결 보석",
	pl: "Jedwabisty klejnot",
	pt: "Jóia de Seda",
	ru: "Шелковый самоцвет",
	sv: "Silkesjuvel",
	uk: "Шовковий самоцвіт",
	zh: "裹绸宝石"
});
Translation.addTranslation("Silky", {
	de: "Seidig", id: "Silky", it: "Setoso", ja: "シルキー", ko: "비단결",
	pl: "Jedwabisty",
	pt: "Sedoso",
	ru: "Шелковистость",
	sv: "Silkeslent",
	uk: "Шовковість",
	zh: "丝触"
});
Translation.addTranslation("Reinforcement", {
    de: "Verstärkung",
    id: "Penguatan",
    it: "Rafforzamento",
    ja: "強化",
    ko: "강화",
    pl: "Wzmocnienie",
    pt: "Reforço",
    ru: "Укрепитель",
    sv: "förstärkning",
    uk: "Посилення",
    zh: "加强"
});
Translation.addTranslation("Reinforced", {
	id: "Reinforced",
	it: "Rinforzato",
	ja: "補強", ko: "보강",
	pl: "Wzmocniony",
	pt: "Reforçado",
	ru: "Прочность",
	sv: "Förstärkt",
	uk: "Укріплення",
	zh: "加固"
});
Translation.addTranslation("Beheading", {
    de: "Enthauptung",
    id: "Pemotongan Kepala",
    it: "Decapitazione",
    ja: "首切り",
    ko: "머리 자르기",
    pl: "Dekapitacja",
    pt: "Decapitação",
    ru: "Отсечение",
    sv: "Avrättning",
    uk: "Деcapitation",
    zh: "斩首"
})
Translation.addTranslation("Graveyard Soil", {
    de: "Friedhofserde",
    id: "Tanah Perkuburan",
    it: "Terra di un Cimitero",
    ja: "墓地土",
    ko: "무덤 토양",
    pl: "Ziemia cmentarna",
    pt: "Terra do Cemitério",
    ru: "Кладбищенская почва",
    sv: "Kyrkogårdsjord",
    uk: "Цвинтарна земля",
    zh: "坟 earth"
})
Translation.addTranslation("Consecrated Soil", {
    de: "Geweihte Erde",
    id: "Tanah Berkhatan",
    it: "Terra Consacrata",
    ja: "聖なる土",
    ko: "성스러운 토양",
    pl: "Ziemia poświęcona",
    pt: "Terra Sagrada",
    ru: "Освященная почва",
    sv: "Helgad jord",
    uk: "Свята земля",
    zh: "圣地 earth"
})
Translation.addTranslation("Smite", {
	de: "Schlag", id: "Smite",
	it: "Anatema",
	ja: "アンデッド特効",
	ko: "강타",
	pl: "Pogromca nieumarłych",
	pt: "Golpe", ru: "Небесная кара", sv: "Heligt",
	uk: "Небесна кара",
	zh: "亡灵杀手"
});
Translation.addTranslation("Bane of Arthropods", {
    de: "Der Fluch der Gliedertiere",
    id: "Hukum Serangga",
    it: "Flagello degli Artropodi",
    ja: "甲殻動物の苦",
    ko: "충수동물의 anseong",
    pl: "Plaga stawonogów",
    pt: "Fléau dos Artrópodes",
    ru: "Бич членистоногих",
    sv: "Gliederfotingarnas förbannelse",
    uk: "Прокляття Членистоногих",
    zh: "arthropoda的灾难"
})
Translation.addTranslation("Fiery", {
	de: "Feurig", id: "Fiery",
	it: "Ardente",
	ja: "灼熱", ko: "불꽃",
	pl: "Ognisty",
	pt: "Ardente",
	ru: "Воспламенение",
	sv: "Brännhet",
	uk: "Вогнистість",
	zh: "怒火"
});
Translation.addTranslation("Necrotic Bone", {
	de: "Nekrotischer Knochen",
	id: "Necrotic Bone",
	it: "Osso necrotico",
	ja: "ネクロボーン",
	ko: "영혼이 깃든 뼈",
	pl: "Nekrotyczna kość",
	pt: "Osso Necrosado",
	ru: "Некротическая кость",
	sv: "Nekrotiskt ben",
	uk: "Некротична кістка",
	zh: "噬生之骨"
});
Translation.addTranslation("Necrotic", {
	de: "Nekrotisch",
	id: "Necrotic",
	it: "Necrotico",
	ja: "ネクロマンシー",
	ko: "사령의 가시",
	pl: "Nekrotyczny",
	pt: "Necrosado",
	ru: "Некроз",
	sv: "Nekrotiskt",
	uk: "Некротичність",
	zh: "噬生"
});
Translation.addTranslation("Knockback", {
	de: "Rückschlag",
	id: "Knockback",
	it: "Contraccolpo",
	ja: "ノックバック", ko: "밀치기", pl: "Odrzut",
	pt: "Repulsão",
	ru: "Отбрасывание",
	sv: "Knuff",
	uk: "Відкидування",
	zh: "击退"
});
Translation.addTranslation("Ball of Moss", {
    de: "Moosballen",
    id: "Bola moss",
    it: "Palla di muschio",
    ja: "モスボール",
    ko: "머드 구슬",
    pl: "Kula mchu",
    pt: "Bola de líquen",
    ru: "Комок мха",
    sv: "Mossboll",
    uk: "Куля моху",
    zh: "苔球"
});
Translation.addTranslation("Mending Moss", {
    de: "Heilender Moos",
    id: "Moss regenerasi",
    it: "Muschio riparatore",
    ja: "回復の苔",
    ko: "치유의 머드",
    pl: "Naprawiający mch",
    pt: "Líquen restaurador",
    ru: "Мох восстановления",
    sv: "Återställande mossa",
    uk: "Відновлювальний мох",
    zh: "治愈苔"
});
Translation.addTranslation("Mending Moss requires at least 10 levels", {
    de: "Erfordert mindestens Stufe 10 für Heilenden Moos",
    id: "Regenerasi moss membutuhkan minimal level 10",
    it: "Il muschio curativo richiede almeno livello 10",
    ja: "回復の苔がレベル10以上必要です",
    ko: "치유의 머드는 최소 10级이 필요합니다.",
    pl: "Naprawiający mch wymaga co najmniej poziomu 10",
    pt: "Requer pelo menos nível 10 para o Líquen Restaurador",
    ru: "Мох восстановления требует по крайней мере 10 уровня",
    sv: "Återställande mossa kräver minst nivå 10",
    uk: "Відновлювальний мох вимагає принаймні 10 рівнів",
    zh: "治愈苔需要至少10级"
});
Translation.addTranslation("Mending", {
	"de": "Reparatur",
	"id": "Perbaikan",
	"it": "Riparazione",
	"ja": "修復",
	"ko": "수리",
	"pl": "Poprawka",
	"pt": "Conservar",
	"ru": "Починка",
	"sv": "Rätta",
	"uk": "Ремонт",
	"zh": "维修"
});
Translation.addTranslation("Shulking", {
	"de": "Schwebend",
	"id": "Membeku",
	"it": "Sospeso",
	"ja": "シャーキング",
	"ko": "쉬��ing",
	"pl": "Płynący w powietrzu",
	"pt": "Flutuando",
	"ru": "Левитация",
	"sv": "Svävande",
	"uk": "Утримання в повітрі",
	"zh": "漂浮"
});
Translation.addTranslation("Web", {
	"de": "Netz",
	"id": "Jaringan",
	"it": "Ragnatela",
	"ja": "ウェブ",
	"ko": "거미줄",
	"pl": "Siateczka",
	"pt": "Teia",
	"ru": "Запутанность",
	"sv": "Nät",
	"uk": "Павутина",
	"zh": "网状物"
});

///
// TOOLS -> LEVELING
///

Translation.addTranslation("Clumsy", {
    de: "Ungeschickt",
    id: "Klumpsuka",
    it: "Sgraziato",
    ja: "不器用",
    ko: "헛디짓",
    pl: "Nieporadny",
    pt: "Torpe",
    ru: "Неловкий",
    sv: "Utkastad",
    uk: "Невмілий",
    zh: "笨手笨脚"
});
Translation.addTranslation("Your %s has reached level %s.", {
    de: "Deine %s hat Level %s erreicht.",
    id: "Anda mencapai tingkat %s pada %s Anda.",
    it: "La tua %s ha raggiunto il livello %s.",
    ja: "あなたの%sがレベル%sに到達しました。",
    ko: "당신의 %s이 %s 레벨에 도달했습니다.",
    pl: "Twoje %s osiągnęło nowy poziom %s.",
    pt: "Seu %s alcançou o nível %s.",
    ru: "Ваш %s достиг нового уровня %s.",
    sv: "Ditt %s har nått upp till nivå %s.",
    uk: "Ваше %s досягло рівня %s.",
    zh: "你的%s已经升级到了%s等级。"
});
Translation.addTranslation("Comfortable", {
    de: "Bequem",
    id: "Mudah",
    it: "Aggraziato",
    ja: "快適",
    ko: "편안한",
    pl: "Wygodny",
    pt: "Confortável",
    ru: "Удобный",
    sv: "Komfortabel",
    uk: "Зручний",
    zh: "舒适"
});
Translation.addTranslation("You begin to feel comfortable handling the %s.", {
    de: "Du fängst an, dich mit dem %s wohl zu fühlen.",
    id: "Anda mulai merasa nyaman memegang %s.",
    it: "Inizi a sentirti a tuo agio nel maneggiare il %s.",
    ja: "あなたは、%sを持っていると快適に感じ始めます。",
    ko: "당신은 %s를 조작하는 것이 불편하지 않게 느껴집니다.",
    pl: "Zaczynasz poczuwać się komfortowo, obsługując %s.",
    pt: "Você começa a se sentir à vontade com o manipuleio do %s.",
    ru: "Вам становится непривычно удобно держать %s.",
    sv: "Du börjar kännas bekväm med att hantera %s.",
    uk: "Ви починаєте відчувати себе комфортно з обробкою %s.",
    zh: "您开始觉得操作%s更自然了。"
});
Translation.addTranslation("Accustomed", {
	de: "Gewohnt",
	id: "Terbiasa",
	it: "Abituato",
	ja: "慣れた",
	ko: "익숙한",
	pl: "Przyzwyczajony",
	pt: "Habitual",
	ru: "Привычный",
	sv: "Van",
	uk: "Звичний",
	zh: "习惯的"
});
Translation.addTranslation("You are now accustomed to the weight of the %s.", {
	de: "Du bist nun an das Gewicht des %s gewöhnt.",
	id: "Anda sekarang terbiasa dengan berat %s.",
	it: "Ora sei abituato al peso del %s.",
	ja: "今では%sの重さに慣れました。",
	ko: "이제 %s의 무게에 익숙해졌습니다.",
	pl: "Teraz jesteś przyzwyczajony do wagi %s.",
	pt: "Agora você está habituado ao peso de %s.",
	ru: "Вы привыкаете к стати собственного %s.",
	sv: "Du är nu van vid vikten av %s.",
	uk: "Ви звикли до ваги %s.",
	zh: "你现在已经习惯了%s的重量。"
});
Translation.addTranslation("Adept", {
	de: "Versiert",
	id: "Mahir",
	it: "Adepto",
	ja: "熟練した",
	ko: "숙련된",
	pl: "Biegły",
	pt: "Apto",
	ru: "Самородок",
	sv: "Kunnig",
	uk: "Майстерний",
	zh: "熟练的"
});
Translation.addTranslation("You have become adept at handling the %s.", {
	de: "Du bist geschickt im Umgang mit dem %s geworden.",
	id: "Anda telah menjadi mahir dalam menangani %s.",
	it: "Sei diventato abile nel gestire %s.",
	ja: "%sの取り扱いに熟練しました。",
	ko: "%s를 다루는 데에 숙련되었습니다.",
	pl: "Stałeś się biegły w obsłudze %s.",
	pt: "Você se tornou apto para lidar com %s.",
	ru: "Вас смело можно назвать самородком в работе с %s.",
	sv: "Du har blivit kunnig på att hantera %s.",
	uk: "Ви стали майстерним у володінні %s.",
	zh: "你已经熟练地处理%s了。"
});
Translation.addTranslation("Expert", {
	de: "Experte",
	id: "Ahli",
	it: "Esperto",
	ja: "専門家",
	ko: "전문가",
	pl: "Ekspert",
	pt: "Perito",
	ru: "Эксперт",
	sv: "Expert",
	uk: "Експерт",
	zh: "专家"
});
Translation.addTranslation("You are now an expert at using the %s!", {
	de: "Du bist jetzt ein Experte darin, %s zu benutzen!",
	id: "Anda sekarang ahli dalam menggunakan %s!",
	it: "Ora sei un esperto nell'uso di %s!",
	ja: "今や%sの使い方に精通しています！",
	ko: "이제 %s 사용에 대해 전문가입니다!",
	pl: "Teraz jesteś ekspertem w korzystaniu z %s!",
	pt: "Agora você é um perito em usar %s!",
	ru: "Вы настоящий эксперт в использовании %s!",
	sv: "Du är nu en expert på att använda %s!",
	uk: "Ви тепер справжній експерт у використанні %s!",
	zh: "您现在是%s的专家了！"
});
Translation.addTranslation("Master", {
	de: "Meister",
	id: "Mahir",
	it: "Maestro",
	ja: "マスター",
	ko: "마스터",
	pl: "Mistrz",
	pt: "Mestre",
	ru: "Мастер",
	sv: "Mästare",
	uk: "Майстер",
	zh: "大师"
});
Translation.addTranslation("You have mastered the %s!", {
	de: "Du hast %s gemeistert!",
	id: "Anda telah menguasai %s!",
	it: "Hai padroneggiato %s!",
	ja: "%sをマスターしました！",
	ko: "%s를 마스터하셨습니다!",
	pl: "Opanowałeś %s!",
	pt: "Você dominou %s!",
	ru: "Вы мастерски отточили свои навыки с %s!",
	sv: "Du har bemästrat %s!",
	uk: "Ви володієте майстерністю з %s!",
	zh: "您已经精通了%s！"
});
Translation.addTranslation("Grandmaster", {
	de: "Großmeister",
	id: "Grandmaster",
	it: "Gran Maestro",
	ja: "グランドマスター",
	ko: "그랜드마스터",
	pl: "Arcymistrz",
	pt: "Grão-Mestre",
	ru: "Профессионал",
	sv: "Stor Mästare",
	uk: "Великий майстер",
	zh: "大师级别"
});
Translation.addTranslation("You have grandmastered the %s!", {
	de: "Du hast das %s großmeisterhaft gemeistert!",
	id: "Anda telah menjadi grandmaster dari %s!",
	it: "Hai padroneggiato alla perfezione %s!",
	ja: "%sをグランドマスターしました！",
	ko: "%s를 그랜드마스터하셨습니다!",
	pl: "Opanowałeś %s na poziomie arcymistrzowskim!",
	pt: "Você se tornou um grão-mestre em %s!",
	ru: "Вы настоящий профессионал в использовании %s!",
	sv: "Du har bemästrat %s på stor mästarnivå!",
	uk: "Ви справжній великий майстер у використанні %s!",
	zh: "您已经达到%s的大师级水平！"
});
Translation.addTranslation("Heroic", {
	de: "Heroisch",
	id: "Heroik",
	it: "Eroico",
	ja: "英雄的",
	ko: "영웅적인",
	pl: "Heroiczny",
	pt: "Heroico",
	ru: "Героический",
	sv: "Hjältemodig",
	uk: "Героїчний",
	zh: "英勇的"
});
Translation.addTranslation("You feel like you could fulfill mighty deeds with your %s!", {
	de: "Du fühlst dich, als könntest du mit deinem %s mächtige Taten vollbringen!",
	id: "Anda merasa seolah-olah Anda bisa melakukan perbuatan luar biasa dengan %s Anda!",
	it: "Ti senti come se potessi compiere imprese potenti con il tuo %s!",
	ja: "あなたは自分の%sで偉業を成し遂げることができる気がします！",
	ko: "당신은 %s로 위대한 업적을 이룰 수 있을 것 같습니다!",
	pl: "Czujesz, że mógłbyś dokonać potężnych czynów za pomocą swojego %s!",
	pt: "Você sente que poderia cumprir feitos poderosos com o seu %s!",
	ru: "Вы начинаете чувствовать, что могли бы совершать невероятное со своим %s!",
	sv: "Du känner att du skulle kunna utföra mäktiga bedrifter med din %s!",
	uk: "Ви відчуваєте, що могли б виконувати величезні справи з вашим %s!",
	zh: "您觉得您可以用您的%s实现伟大的壮举！"
});
Translation.addTranslation("Legendary", {
	de: "Legendär",
	id: "Legendaris",
	it: "Leggendario",
	ja: "伝説的",
	ko: "전설적인",
	pl: "Legendarny",
	pt: "Lendário",
	ru: "Легендарный",
	sv: "Legendarisk",
	uk: "Легендарний",
	zh: "传奇的"
});
Translation.addTranslation("You and your %s are living legends!", {
	de: "Du und dein %s seid lebende Legenden!",
	id: "Anda dan %s Anda adalah legenda hidup!",
	it: "Tu e il tuo %s siete leggende viventi!",
	ja: "あなたとあなたの%sは生きている伝説です！",
	ko: "당신과 당신의 %s는 살아있는 전설입니다!",
	pl: "Ty i twój %s jesteście żywymi legendami!",
	pt: "Você e o seu %s são lendas vivas!",
	ru: "Вы и ваш %s настоящие живые легенды!",
	sv: "Du och din %s är levande legender!",
	uk: "Ви та ваш %s - живі легенди!",
	zh: "你和你的%s是活着的传奇！"
});
Translation.addTranslation("Godlike", {
	de: "Göttlich",
	id: "Seperti Dewa",
	it: "Divino",
	ja: "神々しい",
	ko: "신처럼 강력한",
	pl: "Boski",
	pt: "Divino",
	ru: "Богоподобный",
	sv: "Gudalik",
	uk: "Богоподібний",
	zh: "如神一般"
});
Translation.addTranslation("No god could stand in the way of you and your %s!", {
	de: "Kein Gott könnte sich dir und deinem %s in den Weg stellen!",
	id: "Tidak ada dewa yang bisa menghalangi Anda dan %s Anda!",
	it: "Nessun dio potrebbe ostacolare te e il tuo %s!",
	ja: "どの神もあなたとあなたの%sの前に立ちふさがることはできません！",
	ko: "어떤 신도 당신과 당신의 %s의 길에 섰을 수 없을 것입니다!",
	pl: "Żaden bóg nie mógłby stanąć na drodze między tobą a twoim %s!",
	pt: "Nenhum deus poderia ficar no caminho entre você e o seu %s!",
	ru: "Не дай бог кто-то станет на пути перед вами и вашим %s!",
	sv: "Ingen gud kunde stå i vägen för dig och din %s!",
	uk: "Ні один бог не зміг би встояти на шляху між тобою та твоїм %s!",
	zh: "没有神灵能阻挡你和你的%s的道路！"
});
Translation.addTranslation("Awesome", {
	de: "Fantastisch",
	id: "Mengagumkan",
	it: "Fantastico",
	ja: "すばらしい", ko: "멋진",
	pl: "Niesamowity",
	pt: "Impressionante",
	ru: "Умопомрачительный",
	sv: "Fantastisk",
	uk: "Дивовижний",
	zh: "令人敬畏的"
});
Translation.addTranslation("Your %s is pure awesome.", {
	de: "Dein %s ist einfach fantastisch.",
	id: "%s Anda benar-benar mengagumkan.",
	it: "Il tuo %s è semplicemente fantastico.",
	ja: "あなたの%sは本当に素晴らしいです。",
	ko: "당신의 %s는 정말 멋집니다.",
	pl: "Twój %s jest czysto niesamowity.",
	pt: "Seu %s é pura impressionante.",
	ru: "Ваш %s просто умопомрачителен.",
	sv: "Din %s är ren fantastisk.",
	uk: "Ваш %s просто дивовижний.",
	zh: "你的%s真是太棒了。"
});
Translation.addTranslation("Hacker", {
	de: "Hacker",
	id: "Peretas",
	it: "Hacker",
	ja: "ハッカー", ko: "해커",
	pl: "Haker",
	pt: "Hacker",
	ru: "Хакер",
	sv: "Hackare",
	uk: "Хакер",
	zh: "黑客"
});

///
// INTEGRATIONS
///

Translation.addTranslation("Part Building", {
    de: "Teilmontage",
    id: "Pembangunan bagian",
    it: "Assemblaggio di parti",
    ja: "パーツ組み立て",
    ko: "부품 조립",
    pl: "Montaż części",
    pt: "Construção de peças",
    ru: "Сборка деталей",
    sv: "Delbyggnad",
    uk: "Монтаж деталей",
    zh: "零件组装"
});
Translation.addTranslation("Melting", {
	de: "Schmelzen",
	id: "Melting",
	it: "Fusione",
	ja: "溶融", ko: "용해",
	pl: "Topienie",
	pt: "Fundição",
	ru: "Переплавка",
	sv: "Nedsmältning",
	uk: "Розплавлення",
	zh: "熔炼"
});
Translation.addTranslation("Melt", {
    de: "Schmelzen",
    id: "Mencairkan",
    it: "Sciogliere",
    ja: "溶かす",
    ko: "용융하다",
    pl: "Topienie",
    pt: "Derreter",
    ru: "Плавка",
    sv: "Smälta",
    uk: "Плавлення",
    zh: "熔化"
});
Translation.addTranslation("Alloying", {
	de: "Legieren",
	id: "Alloying",
	it: "Lega", ja: "合金化", ko: "합금",
	pl: "Mieszanie metali",
	pt: "Ligamento",
	ru: "Смешивание",
	sv: "Legering",
	uk: "Сплавляння",
	zh: "合金"
});
Translation.addTranslation("Alloy", {
    de: "Legierung",
    id: "Logam campuran",
    it: "Lega",
    ja: "合金", ko: "합금",
    pl: "Stop",
    pt: "Aleação",
    ru: "Смесь",
    sv: "Legering",
    uk: "Легування",
    zh: "合金"
});
Translation.addTranslation("Item Casting", {
    de: "Gegenstandsguss",
    id: "Penempaan barang",
    it: "Fonderia oggetto",
    ja: "アイテム・キャスティング",
    ko: "아이템 주입",
    pl: "Odlew przedmiotów",
    pt: "Couro do item",
    ru: "Литье предметов",
    sv: "Objektgjutning",
    uk: "Виливка предметів",
    zh: "物品冶炼"
});
Translation.addTranslation("Block Casting", {
    de: "Blockguss",
    id: "Pengecoran blok",
    it: "Colata blocco",
    ja: "ブロック・キャスティング",
    ko: "블록 주입",
    pl: "Blok odlewnictwo",
    pt: "Couro de bloco",
    ru: "Литье блоков",
    sv: "Blockgjutning",
    uk: "Виливка блоків",
    zh: "方块冶炼"
});
// Translation.addTranslation("Cast item is consumed on casting", {
// 	de: "Gegossener Gegenstand wird beim Zaubern verbraucht",
// 	id: "Cast item is consumed on casting",
// 	it: "L'oggetto di stampo si consuma al momento dello stampo",
// 	ja: "型はなくなります",
// 	ko: "이 아이템은 주조할 때 소모됩니다",
// 	pl: "Forma niszczy się przy odlewaniu",
// 	pt: "O item fundido é consumido na fundição",
// 	ru: "Форма расходуется во время литья",
// 	sv: "Avgjutningen konsumeras vid gjutning",
// 	uk: "Предмет-форма витрачається при литті",
// 	zh: "消耗铸模"
// });
Translation.addTranslation("Consumes cast", {
    de: "Verbraucht Form",
    id: "Memakai pemutus",
    it: "Consuma il fascio",
    ja: "キャストを消費する",
    ko: "시전을 소비합니다.",
    pl: "Zużywa zaklęcie",
    pt: "Consome lançamento",
    ru: "Расходует форму",
    sv: "Konsumerar besvärjning",
    uk: "Витрачає замовляння",
    zh: "耗费施法"
});
Translation.addTranslation("%s s", { de: "%s s", id: "%s s", it: "%s s", ja: "%s秒", ko: "%s초", pl: "%s s", pt: "%s s", ru: "%s сек", sv: "%s s", uk: "%s с", zh: "%s秒" });
Translation.addTranslation("%s°C", { de: "%s°C", id: "%s°C", it: "%s°C", ja: "%s°C", ko: "%s°C", pl: "%s°C", pt: "%s°C", ru: "%s°C", sv: "%s°C", uk: "%s°C", zh: "%s℃" });
