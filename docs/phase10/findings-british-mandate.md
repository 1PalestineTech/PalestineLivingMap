# Findings: British Mandate era (19 events)

**Counts:** 4 ok, 13 corrected, 2 need an owner decision (nakba-1947-1948 and izz-ad-din-al-qassam-killed-1935). Several "corrected" events also carry items for the owner, mainly missing perspectives or missing context in the summary. The clear fixes, and nothing contested, are in `patches-british-mandate.json`.

## Top issues

1. **Dead link in two editorNotes.** fall-of-haifa-1948 and end-of-mandate-israel-declaration-1948 both point to `sample-nakba-1948`, which no longer exists. The overlap they mean is with nakba-1947-1948.
2. **Nakba figure.**
   - The summary names Wikipedia in its own text ("per Wikipedia's summary…").
   - The event ends in 1948, although its sources run to 1949.
   - A UN figure is available to use instead: the UN Conciliation Commission estimated 711,000 refugees in 1949. UNRWA's final 1949 estimate of 726,000 comes from Morris (2004, p. 602), as cited on Wikipedia.
   - The UNISPAL page is published by the UN Division for Palestinian Rights, and its perspective should be labelled that way.
   - No current Israeli-side scholarly view is listed, only the old official Israeli account of a voluntary flight.
3. **Arab Revolt.**
   - The Encyclopedia.com article is by Rashid Khalidi. It is not a quotation of Walid Khalidi, whose own figures (5,032 dead, 14,760 wounded) come via Hughes 2019, p. 377.
   - The official figures (more than 2,000 killed, 108 hanged) come from Levenberg 1993, not Hughes.
   - The summary says the strike was called by the Arab Higher Committee. In fact local committees began it on 19 April 1936, and the Committee was formed on 25 April.
4. **Deir Yassin.** The range of the dead should not run up to 254 as if all were scholarly estimates. Scholarly estimates run from 93 (Pappé) to 140 (Hogan), with Morris at 100-110. The figure of 254 announced at the time is widely seen as inflated.
5. **1929 disturbances: Shaw Commission.** Shaw found no established connection between the Mufti and the agitators, but said he "must accept a share in the responsibility". Snell did not dissent: he signed the report with a note of reservation that blamed the Mufti more.

## Consistency across the 1948 events

- The dates agree across entries:
  - partition, 29 November 1947
  - Deir Yassin, 9 April 1948
  - Haifa, 21-22 April
  - Israeli declaration, 14 May, and Arab armies' entry, 15 May
  - Lydda and Ramle, 11-13 July (era 1948-1967)
  - Resolution 194, 11 December 1948
- The numbers agree across entries:
  - Haifa: about 15,000 fled on 21-22 April, and about 4,000 Arabs remained by mid-May.
  - Lydda and Ramle: 50,000-70,000 expelled, according to Morris.
  - Nakba: more than 700,000.
- **Inconsistencies:**
  - nakba-1947-1948 ends in 1948, while its sources run to 1949. The Wikipedia infobox gives 31 December 1947 to 20 July 1949.
  - The Haifa summary says the British withdrew from key positions on 20 and 21 April. The 20 April date is not on the Wikipedia page read.
- **Gap:** the 1948-1967 era has no Nakba or refugee entry; the Lydda-Ramle and Resolution 194 entries lean on nakba-1947-1948. Either extend that event to 1949 or add a 1949 refugee event.

## Per-event findings

### nakba-1947-1948
- **Verdict:** needs owner decision.
- **Checked:** UNISPAL "About the Nakba" (loaded and read); Wikipedia "1948 Palestinian expulsion and flight" (raw).
- **Findings:**
  - UNISPAL supports the first perspective (militia attacks after partition; more than half the population permanently displaced) but gives no total.
  - Wikipedia gives more than 700,000 people, about half the Arab population. It also gives the UN Conciliation Commission's 1949 estimate of 711,000 refugees outside Israel, UNRWA's final 1949 estimate of 726,000 (Morris 2004, p. 602), and dates from 31 December 1947 to 20 July 1949.
- **Proposed patch:**
  - Summary: "more than 700,000 … were expelled or fled; the UN Conciliation Commission estimated 711,000 refugees in 1949", with the Wikipedia mention removed from the summary text.
  - Owner decisions: change `dateEnd` to 1949; add a current Israeli-side view (for example Morris 2004 or Karsh); relabel the first perspective as the UN Division for Palestinian Rights.

### balfour-declaration-1917
- **Verdict:** corrected (editorNote).
- **Checked:** the declaration text on Avalon; Wikipedia (raw).
- **Findings:**
  - The summary matches the text.
  - Each of these points is cited to a scholarly source on Wikipedia:
    - War Cabinet decision on 31 October (Hurewitz 1979, p. 102)
    - publication on 9 November (Schneer 2010, p. 342)
    - petition by the Muslim-Christian Association on 3 November 1918 (Wasserstein 1991, p. 31)
    - breach of the McMahon correspondence (Shlaim 2005)
  - Optional context: Appendix IV of the Anglo-American Committee report (on Avalon) gives a population of about 689,000 before the First World War, about 85,000 of them Jews.

### san-remo-and-mandate-1920-1923
- **Verdict:** corrected (editorNote).
- **Checked:** the Mandate text on Avalon; Wikipedia "San Remo conference" and "Mandate for Palestine".
- **Findings:**
  - 22 July 1922 is when the draft was sent to the League (Klieman); 24 July is the Council's approval, which matches Avalon.
  - Entry into force on 29 September 1923 is confirmed, but by Wikipedia only.
  - The Arab legal perspective is missing. UNSCOP's report (chapter II, paragraph 160), quoted on Wikipedia, records the Arab view that the Mandate contradicted Article 22 of the League Covenant and denied self-determination. Read it on Wikisource before adding it.

### nebi-musa-disturbances-1920
- **Verdict:** ok.
- **Checked:** Hansard, 29 April 1920; the Palin report (ANU transcription); Wikipedia.
- **Findings:**
  - Hansard: the violence began on 4 April and flared until 8 April, with about 250 casualties, nine-tenths of them Jewish.
  - Palin found that "no case of general bias" against the Administration was made out. He also called the withdrawal of troops "an error of judgment" and listed Arab grievances (*Survey of Palestine*, vol. 1, p. 17, via Wikipedia). This could source the Arab perspective.

### jaffa-riots-1921
- **Verdict:** corrected (note on sources[1]).
- **Checked:** Hansard (Lords), 8 June 1921; the Haycraft report on JVL (terms of reference and summary only, no casualty table); Wikipedia.
- **Findings:**
  - The summary is supported. The JVL page title now gives 10 August 1921.
  - Casualties: 47 Jews and 48 Arabs killed, according to Haycraft via Wikipedia; an early telegram gave 30 Jews and 10 Arabs.
  - Haganah reprisals from 2 May are not mentioned.
  - An Arab perspective can come from the Hansard debate already cited (the appeal of the Haifa Moslem Committee).

### white-paper-and-census-1922
- **Verdict:** ok.
- **Checked:** the 1922 White Paper on Avalon; Wikipedia on the 1922 census.
- **Findings:**
  - All figures are confirmed (Barron, Table I). The groups listed sum to 755,728 of 757,182, so the summary's "including" is right.
  - Cite Barron directly (the 1923 government volume, archive.org/details/PalestineCensus1922) once it has been opened.
  - A source for the Arab Delegation's position is still needed.

### supreme-muslim-council-1921
- **Verdict:** corrected (summary).
- **Checked:** Encyclopedia.com (the Supreme Muslim Council and al-Husayni entries); Wikipedia.
- **Findings:**
  - The Mufti was appointed in 1921, not "1921 or 1922". The first council election was on 9 January 1922 (40 of 47 votes).
  - Whether the council was dissolved in 1937 is disputed: Encyclopedia.com says it was; Wikipedia says it continued until 1948-51.

### disturbances-1929
- **Verdict:** corrected (second perspective).
- **Checked:** Encyclopedia.com "Hebron Massacre" (with Shaw excerpts) and "Shaw Commission"; Wikipedia.
- **Findings:**
  - Confirmed: the dates, 65-68 dead in Hebron, and totals of 133 Jews and 116 Arabs killed.
  - Shaw also recorded Jewish attacks, mostly in retaliation, including the attack on the Nebi Akasha mosque on 26 August.
  - The Shaw Commission point above (issue 5) applies here.
  - A named source for the Arab account is still needed.

### hope-simpson-passfield-1930
- **Verdict:** ok.
- **Checked:** Encyclopedia.com; Wikipedia (Hope Simpson and Passfield pages).
- **Findings:**
  - The content is confirmed. The report date is given as 30 August (Encyclopedia.com) or as dated 1 October and released 21 October (Wikipedia), so month precision is right.
  - MacDonald's letter of February 1931 was known to Palestinians as the "Black Letter".
  - A Zionist perspective is needed: according to Wikipedia, Zionists saw the White Paper as a retreat from the Balfour commitments. The full report is on HathiTrust (mdp.39015008167853).

### izz-ad-din-al-qassam-killed-1935
- **Verdict:** needs owner decision.
- **Checked:** Encyclopedia.com; Wikipedia.
- **Findings:**
  - Confirmed: three of his followers were killed with him.
  - Sources give 19 or 20 November, so month precision is right.
  - The size of his group differs: "several hundred" (Encyclopedia.com) against 12 men (Laurens).
  - Missing context: the manhunt followed the killing of the Jewish police sergeant Moshe Rosenfeld on 8 November 1935, which his group was believed to have carried out (Hughes 2019; Laurens).
  - Both perspectives listed are sympathetic to Qassam; a second view is needed.

### arab-revolt-1936-1939
- **Verdict:** corrected (summary and two perspectives).
- **Checked:** Encyclopedia.com (article by Rashid Khalidi); OSU Origins (only partly extractable); Wikipedia.
- **Findings:**
  - The attribution and strike-date errors in issue 3 above.
  - The Wikipedia infobox gives about 500 Jews killed (*Survey of Palestine*, pp. 38-49) and 262 British killed (Levenberg).

### peel-commission-partition-1937
- **Verdict:** corrected (date, precision, and an added source).
- **Checked:** JVL; Wikipedia; Appendix IV of the Anglo-American Committee report (Avalon).
- **Findings:**
  - The date of 7 July 1937 is confirmed.
  - The land shares of 17%, 75% and 8% come from JVL and should be attributed to it, because a Wikipedia quotation gives 20% for the Jewish state.
  - The proposed transfer was of up to 225,000 Arabs and 1,250 Jews (Wikipedia).
  - The Arab Higher Committee's rejection dated 11 October 1938 (JVL) belongs to the later Woodhead stage. Arab rejection was already clear in 1937, at the Bludan conference of 8 September 1937.
  - The Zionist response, previously missing, can now be sourced: Appendix IV and the 20th Zionist Congress (August 1937).

### white-paper-1939
- **Verdict:** corrected (editorNote).
- **Checked:** the full text on Avalon; Wikipedia.
- **Findings:**
  - Immigration: 10,000 a year for five years plus 25,000 refugees, 75,000 in all. The supposed conflict with the US despatch does not exist.
  - The Commons vote was on 23 May 1939. The 17 May date is unconfirmed, so month precision is right.
  - The Arab reaction could form a perspective (all via Wikipedia): the Arab Higher Committee called the White Paper insufficient (Honig 2013); Haj Amin al-Husayni rejected it in June 1939 (Khalaf 1991, p. 283); the National Defence Party was willing to accept it.

### jewish-immigration-1930s
- **Verdict:** ok.
- **Checked:** FRUS despatch (61,854 immigrants in 1935, confirmed); the 1931 census on JVL (174,610 Jews of 1,035,821, confirmed); Wikipedia on the 1931 census.
- **Findings:**
  - "Peaking" is our own inference: the despatch compares 1935 only with 1936-39.
  - The claim about Arab opposition can be sourced to Appendix IV of the Anglo-American Committee report (the demands of the 1936 strike) and to the text of the 1939 White Paper.

### king-david-hotel-bombing-1946
- **Verdict:** corrected (added source and coordinates).
- **Checked:** Wikipedia (raw); Hansard, 23 July 1946 (found and read).
- **Findings:**
  - 91 people were killed: 41 Arabs, 28 British and 17 Jews (Hoffman 2020).
  - Begin claimed 25-27 minutes' warning was given; Clarke puts the first call 15 minutes before the blast. The British statement after the inquest is known via Koestler 1949.
  - Owner decision: the summary leaves out that the attack answered Operation Agatha, that the Haganah authorised it (Sneh's letter of 1 July 1946), and that the Jewish Agency condemned it.
- **Coordinates:** fix to 31.7744, 35.2225 (Wikipedia).

### un-partition-plan-1947
- **Verdict:** corrected (added source).
- **Checked:** the text of Resolution 181 on Wikisource (read); Wikipedia.
- **Findings:**
  - The text confirms the economic union, the special international regime for Jerusalem, and the end of the Mandate by 1 August 1948. The vote of 33 to 13 with 10 abstentions is confirmed.
  - The Arab state was to have about 43% of the land (Wikipedia, citing MERIP).
- **Proposed patch:** add the resolution text as a source.

### deir-yassin-1948
- **Verdict:** corrected (summary).
- **Checked:** Wikipedia (raw). The ICRC translation was not fetched again.
- **Findings:**
  - The death-toll issue (issue 4 above). The patch keeps 254 but labels it as the figure announced at the time.
  - The Haganah commander Shaltiel approved the attack and Palmach units joined it; the Jewish Agency and the Haganah condemned it.
- **Coordinates:** ok (31.7858, 35.1781).

### fall-of-haifa-1948
- **Verdict:** corrected (editorNote and coordinates).
- **Checked:** Wikipedia "Battle of Haifa" (raw).
- **Findings:**
  - Morris's figures are confirmed. Kimche gives about 300 Arab dead.
  - Walid Khalidi's 2008 article in the *Journal of Palestine Studies* would give the first perspective a scholarly anchor.
  - The editorNote still points to `sample-nakba-1948` (issue 1 above).
- **Coordinates:** fix to 32.8192, 34.9992. The current point is about 2.9 km off, on Mount Carmel.

### end-of-mandate-israel-declaration-1948
- **Verdict:** corrected (editorNote and coordinates).
- **Checked:** the declaration on Avalon (read); Wikipedia on the 1948 war.
- **Findings:**
  - The appeal for "full and equal citizenship" is confirmed, and the text defines no borders.
  - Iraqi, Syrian, Jordanian and Egyptian forces crossed in on 15 May (Tal 2004, via Wikipedia).
  - The editorNote still points to `sample-nakba-1948` (issue 1 above).
- **Coordinates:** fix to Independence Hall, 32.0628, 34.7708 (about 2.7 km off).

## Not read
PalQuest and Britannica (not tried, because both are known to block fetches); the full Shaw and Hope Simpson reports; the *Journal of Palestine Studies* articles (Khalidi, Shapira); and the ICRC/Hogan page, which was not fetched again.
