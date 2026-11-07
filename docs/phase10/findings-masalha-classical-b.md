# Findings: classical era, part B (Masalha-cited), 12 events

Counts: ok 2, corrected 5, needs owner decision 5. Patches: `patches-masalha-classical-b.json`.

Page method: the Masalha PDF text was read with `mp.mjs` and cross-checked against the book's own index (marked "index" below).

### council-of-chalcedon-451-three-palestines
- **Verdict:** needs owner decision (it duplicates another event; the content is sound).
- **Checked:** Masalha pp. ~106-111 (index: Chalcedon 106, 109-10); Wikipedia "Council of Chalcedon", section "The status of Jerusalem"; the DCBL entry "Juvenalis, bishop of Jerusalem" on Wikisource, read in full.
- **Findings:**
  - Masalha supports every claim: jurisdiction over the "three Palestines", independence from Caesarea and Antioch, and four Arab bishops (Elusa, Gaza, Neila; Shahid 2006a: 523).
  - DCBL independently says that the Juvenal-Maximus compromise in the Seventh Action gave Jerusalem the three Palestines and left Antioch the two Phoenicias and Arabia, and that patriarchal rank followed.
  - "Self-governing" (autocephaly) is Masalha's framing. DCBL tells it as Juvenal's campaign for rank.
- **Proposed patch:** pages 108-109 → 108-110; add DCBL as a source. Whether to merge the two events is the owner's call.
- **Coordinates:** ok (approximate by design).

### council-of-chalcedon-451
- **Verdict:** needs owner decision (duplicate of the event above).
- **Checked:** Masalha p. ~148-149 (index: Chalcedon 148); DCBL.
- **Findings:**
  - The "turning point" claim and the "until today" perspective quote check out.
  - The summary compresses the causes. Masalha links Greek dominance in the Patriarchate to the 6th-century spread of Monophysitism (after Anastasius), not to the council itself.
- **Proposed patch:** pages 149 → 148-149; reworded summary (in the patches file).
- **Coordinates:** ok, though the pin differs slightly from the duplicate's.

### justinian-creates-patriarch-of-aelia-531
- **Verdict:** corrected (pages).
- **Checked:** Masalha pp. ~109-110 (index: Justinian 109, 110); Wikipedia "Pentarchy" and "Council of Chalcedon".
- **Findings:**
  - The book gives 531 and also says the see was a bishopric "until 451". The two statements sit awkwardly together, and the awkwardness is Masalha's. He cites no source.
  - Wikipedia "Pentarchy" also gives 531, but as Justinian's first use of the title "patriarch" for all five great sees, not a title created for Jerusalem alone. It relies on an Italian web essay and the ODCC ("6th-century title").
  - Jerusalem's higher rank dates from 451.
- **Proposed patch:** pages → 109-110. Suggested summary for the owner: "Masalha dates to 531 Justinian's use of the title Patriarch for the head of the church of Aelia Capitolina (Jerusalem). Other accounts describe it as a title Justinian's laws reserved for the bishops of five great sees, Jerusalem among them; the see's higher rank itself dated from the Council of Chalcedon in 451." A primary or scholarly source for 531 (the Codex or the Novels) is still needed.
- **Coordinates:** ok, but precision `area` would be more honest than `exact`.

### mar-saba-monastery-founded-484
- **Verdict:** corrected (pages).
- **Checked:** Masalha pp. ~132-134 (index: Saint Sabbas 132-3); Wikipedia "Sabbas the Sanctified" and "Mar Saba".
- **Findings:**
  - All claims are supported.
  - Wikipedia calls 484 the "traditional" date; worth noting in `editorNote`.
  - The Sabbaite typikon evolved later, so "an early monastic rule" is fine.
  - The UNESCO status comes from Al-Monitor, 9 May 2016, cited by Wikipedia. The UNESCO site itself returned 403.
- **Proposed patch:** pages 133-134 → 132-133.
- **Coordinates:** ok (about 0.3 km from Wikipedia's 31.705, 35.3311).

### imru-al-qais-death-328
- **Verdict:** needs owner decision.
- **Checked:** Masalha pp. ~137-138; Wikipedia "Namara inscription" and "Imru al-Qays I ibn Amr" (citing Bellamy 1985, JAOS 105, and Shahid 2006); the Louvre record AO 4083 (collections.louvre.fr/en/ark:/53355/cl010123278), read; Wikipedia "Ghassanids".
- **Findings:**
  - He died on 7 December 328 (year 223 of the Bostra era).
  - Mainstream sources call him a Lakhmid king, not a Ghassanid. The Ghassanids are first recorded in 473, with Amorkesos, who was a different person. Masalha conflates the two.
  - The inscription says his appointees "became phylarchs for the Romans". It does not say he died in Byzantine service, and it does not mention Palaestina Salutaris.
  - It was found at al-Namara in southern Syria, about 50 km north-east of Bosra.
- **Proposed patch (owner decision):**
  - Title: "Namara inscription records the death of Imru' al-Qays, 'king of all the Arabs'".
  - Summary: "An Arabic epitaph in Nabataean script, found at al-Namara in southern Syria, records the death in 328 of Imru' al-Qays son of 'Amr, called king of all the Arabs. Most scholars identify him as a Lakhmid king. Masalha calls him a Ghassanid ruler and links him to Palaestina Salutaris."
  - Add the Louvre record as a source, and a perspective noting that most scholars date the first Ghassanid record to 473.
  - Alternatively, drop the event.
- **Coordinates:** the Negev point (30.5, 35) has no support. The find site is outside Palestine, so make the event country-wide (`approximate`) and name al-Namara in the summary.

### petros-aspebetos-phylarch-bishop-427
- **Verdict:** ok.
- **Checked:** Masalha pp. ~147-148 (index: Butros/Petros 147); Wikipedia "Euthymius the Great" (citing Fisher 2019, *Rome, Persia, and Arabia*, pp. 95-96, and Cyril of Scythopolis).
- **Findings:**
  - Fisher and Wikipedia agree that "Aspebetos" is probably the Persian title *spahbed*. Juvenal ordained him; he became a priest around 427, later bishop of the Parembolae, and attended Ephesus in 431.
  - Circa 427 is fine; "by 431" is the secure bound.
  - The underlying primary source is Cyril of Scythopolis, *Life of Euthymius* (tr. Price, Cistercian 1991).
- **Proposed patch:** none (an optional `editorNote` on 427 vs 431).
- **Coordinates:** approximate is acceptable. The pin is about 6 km east of the Monastery of Euthymius (31.7922, 35.3361, Wikipedia); moving it there is optional.

### justinian-ghassanid-phylarchates-529
- **Verdict:** corrected (circa).
- **Checked:** Masalha pp. ~139-140 (index: Abu Karib and Harith V both 139-41); Wikipedia "Al-Harith ibn Jabalah", "Abu Karib ibn Jabalah" and "Ghassanids".
- **Findings:**
  - Masalha's claims check out.
  - Wikipedia: Harith reigned c. 528-569 and was raised "c. 529" (Shahid 1995: 82-89), perhaps after the Samaritan revolt of 529.
  - Procopius gives no year for Abu Karib's phylarchate (the "Palm Grove" gift).
  - "Vassal kingdoms" is Masalha's view and is already attributed to him.
- **Proposed patch:** circa false → true.
- **Coordinates:** ok (approximate region).

### battle-of-yarmuk-636
- **Verdict:** corrected (title); summary wording for the owner.
- **Checked:** Masalha pp. ~141-143, 147, 156-157 (index: Yarmuk 141, 143, 157); Wikipedia "Battle of the Yarmuk" and "Ghassanids".
- **Findings:**
  - Masalha, quoting Shahid 2009 (vol. 2, pt. 2: 63-64), says the Ghassanid phylarchate ended in 636. The Jabiyah camp claim and the "preferred the Muslims" quote (Wigram 2004) are accurate.
  - The title "ends Byzantine and Ghassanid rule in Palestine" overstates. Jerusalem fell in 637/638 and Caesarea around 640-641, and Masalha himself gives 636-638.
  - Wikipedia gives 15-20 August 636 and says the last Ghassanid phylarch, Jabala ibn al-Ayham, fought on the Byzantine side (citing Kaegi and Shahid 1995: 634-659). That balances Masalha's claim that the Ghassanids preferred the Muslims.
  - Proposed second source to read: Kaegi, *Byzantium and the Early Islamic Conquests* (CUP 1992).
- **Proposed patch:** new title (in the patches file). Suggested summary for the owner: "In 636 Muslim Arab armies defeated a large Byzantine army near the Yarmuk River, opening Syria and Palestine to conquest; Jerusalem and Caesarea fell over the next few years. Masalha says the battle ended the Ghassanid phylarchates and that many Monophysite Ghassanids preferred the new rulers; Jabiyah became a main Muslim army camp."
- **Coordinates:** approximate is ok. Wikipedia's point (32.8141, 35.9548, itself disputed) is about 7 km north of ours; moving it is optional.

### madaba-mosaic-map-560-565
- **Verdict:** needs owner decision.
- **Checked:** Masalha pp. ~118-120 (index: 118-19); Wikipedia "Madaba Map" (citing Keyser & Scarborough, *Oxford Handbook of Science and Medicine in the Classical World*, OUP 2018, p. 937). The Meimaris essay could not be reached and Britannica returned 403.
- **Findings:**
  - The summary is faithful to Masalha.
  - The scholarly dating window is 542-570: the map shows the Nea church, dedicated in 542, and no buildings later than 570. Suggest `dateStart` 542, `dateEnd` 570, circa, with Masalha's 560-565 given in the text.
  - Masalha says the map never mentions "Canaan" or the "land of Israel". Wikipedia notes that it marks the tribes of Israel and quotes biblical verses, drawing on Eusebius's *Onomasticon*. Add a second view, sourced to Donner, *The Mosaic Map of Madaba* (1992), or Avi-Yonah (IES 1954).
  - Masalha places Madaba in Palaestina Prima; the standard view is Provincia Arabia. Keep that claim out of the summary.
- **Proposed patch:** none.
- **Coordinates:** ok.

### elias-patriarch-jerusalem-494
- **Verdict:** ok (source added).
- **Checked:** Masalha p. ~149-150 (index: Elias 149); Fortescue, "Elias of Jerusalem", *Catholic Encyclopedia* 1909 (newadvent.org), read; Wikipedia "Elias I of Jerusalem".
- **Findings:**
  - Fortescue confirms the main facts: Arab by birth, educated in an Egyptian monastery, expelled in 457, founded a laura near Jericho, ordained by Anastasius, succeeded Sallustius in 494.
  - He was banished to Aila for resisting Anastasius I's anti-Chalcedonian policy: in 513 according to Fortescue, 516 according to Wikipedia.
  - Masalha's link to Euthymius is consistent. The Arabic liturgy claim stays hedged ("possibly").
- **Proposed patch:** add Fortescue as a source.
- **Coordinates:** ok.

### sasanian-conquest-palestine-614
- **Verdict:** corrected (pages).
- **Checked:** Masalha p. ~99 (one sentence); Wikipedia "Sasanian conquest of Jerusalem" and "Byzantine-Sasanian War of 602-628".
- **Findings:**
  - Jerusalem fell in April-May 614, according to Sebeos and Antiochus Strategius. Caesarea, the capital of Palaestina Prima, was taken earlier in the campaign, and a Jewish revolt aided the advance.
  - Byzantium recovered the region by 628-630; Heraclius returned the True Cross on 21 March 630 (Treadgold 1997). Our summary only implies the recovery; suggest adding "Byzantium regained the provinces in 628-630".
  - Casualty figures and the Jewish role are contested and are rightly left out of the summary.
  - Second source to read: Sebeos, tr. Thomson & Howard-Johnston (Liverpool UP 1999).
- **Proposed patch:** pages 98 → 98-99.
- **Coordinates:** ok (country-wide).

### muslim-capture-of-aylah-630
- **Verdict:** needs owner decision.
- **Checked:** Masalha p. 169 (index: Aylah 158-60, 169, 174); Wikipedia "Aqaba" (Ibn Ishaq via F. E. Peters, *Muhammad and the Origins of Islam*, p. 241) and "Expedition of Tabuk" (Ibn Sa'd).
- **Findings:**
  - Masalha says Aylah was "taken over" in 630 (9 AH).
  - The other sources describe a treaty, not a military capture: during the Tabuk expedition the ruler of Aylah agreed to pay tribute (jizya) in return for protection.
  - "First major town" is Masalha's claim and is already attributed to him.
  - The China-trade claim is on p. ~174 (per the index), not p. 169.
- **Proposed patch (owner decision):** title → "Aylah (Aqaba) submits to Muhammad by treaty"; pages → "169, 174". Add Peters (Princeton/SUNY) as a source once it has been read.
- **Coordinates:** ok (29.53, 35 vs Aqaba 29.5319, 35.0056).
