# Findings: 1993-present (20 events)

**Counts:** 4 ok, 13 corrected, 3 need an owner decision. The 61 proposed patches are in `patches-1993-present.json`; their "old" values were taken from events.json by script. Every proposed summary is 60 words or fewer.

**Sources that could not be read (none were bypassed):**
- whc.unesco.org: 403 (Cloudflare).
- All icj-cij.org PDFs: 403. The HTML case pages loaded.
- btselem.org: 429.
- Old mfa.gov.il URLs: 404.
- 2001-2009.state.gov: forbidden.
- press.un.org: JavaScript challenge.
- Jewish Virtual Library pages: loaded with no content.

## Top issues
1. **oct-7-attack-and-gaza-war-2023: figures and scope.**
   - The figures are now sourced and dated. OCHA's "Reported impact" snapshot of 28 Oct 2026 gives 74,564 Palestinians killed and 175,770 injured, according to the Gaza Ministry of Health; 74,237 of the dead had been identified as of 7 Oct 2026. On the Israeli side, OCHA gives "over 1,200" killed, according to the Israeli authorities as reported by Israeli media, with 1,162 identified.
   - The figure of 251 hostages is still sourced only to Wikipedia.
   - The UN Commission of Inquiry's genocide finding of 16 Sep 2025, and Israel's rejection of it by Ambassador Meron, are now read on UN News.
   - ICJ case 192 (South Africa v. Israel) is pending. The Court issued provisional-measures orders on 26 Jan, 28 Mar and 24 May 2024.
   - **Owner decision:** split the event into three:
     - (a) the 7 October 2023 attack in southern Israel (one day);
     - (b) the Gaza war, from 7 Oct 2023 to the ceasefire of 10 Oct 2025;
     - (c) a post-ceasefire entry marked ongoing, with figures as of 28 Oct 2026.
2. **unga-non-member-observer-state-2012: the summary is factually wrong.** Resolution 67/19 did not replace "PLO" with "Palestine". The UN press release says the upgrade was without prejudice to the PLO's role.
3. **Dates and facts corrected from primary UN documents.** All three of these were placeholders; each now has real sources that were read.
   - **gaza-war-2014:** 7 July to 26 August 2014, at day precision. Source: the UN Commission report A/HRC/29/52, paragraph 19.
   - **palestinian-legislative-elections-2006:** polling on 25 Jan 2006 with 77% turnout. Source: the EU observer mission's statement.
   - **great-march-of-return-2018:** began 30 Mar 2018; 189 people killed, 183 of them by live ammunition. Source: the UN Commission report A/HRC/40/74. Paragraph 29 records the position of Israel's security forces.
4. **Figures with no named source or date.**
   - **second-intifada-begins-2000:** "one estimate" becomes B'Tselem's count of 3,174 Palestinians and 940 Israelis killed up to the end of 2004.
   - **oslo-ii-interim-agreement-1995:** the undated 60% share for Area C becomes OCHA's 62% (2010).
   - **gaza-war-2008-2009:** adds the UN Fact-Finding Mission's range of Palestinian dead, from 1,166 (Israel's figure) to 1,444 (the Gaza authorities' figure).
5. **Misattributed and missing perspectives.**
   - **oslo-declaration-of-principles-1993:** the Said perspective does not match his LRB article.
   - **icj-advisory-opinion-occupation-2024:** Israel's rejection of the opinion is missing.
   - **jericho-world-heritage-2023:** Israel's condemnation of the listing is missing.
   - **camp-david-summit-2000:** the Malley and Agha article also faults the Palestinians, which the perspective should reflect.

## Per-event findings

### jericho-world-heritage-2023
- **Verdict:** corrected.
- **Checked:** the UNESCO page list/1687 returned 403 (the owner needs to paste it). Read: Al Jazeera, 17 Sep 2023; AP via NBC, 18 Sep 2023; Wikipedia (raw); Wikidata Q2402267.
- **Findings:**
  - The vote was on Sunday 17 Sep 2023, at the World Heritage Committee in Riyadh.
  - Wikidata gives World Heritage ID 1687, which matches our URL. Wikipedia currently cites list/1705, which looks like an error. The owner should confirm on the UNESCO page.
  - "About 10,500 BCE" and "Middle Bronze Age Canaanite city-state" do not appear on any page read. The press quotes UNESCO for a permanent settlement by the 9th-8th millennium BC and a Bronze Age town from about 2600 BC.
  - Israel's Foreign Ministry called the listing a "cynical" use of UNESCO. This should be added as a perspective.
- **Proposed patch:** dateStart → 2023-09-17 at day precision; add the Al Jazeera and AP sources. Not in the JSON: the summary wording, if the UNESCO page does not confirm those two claims; adding the Israeli perspective.
- **Coordinates:** ok.

### oslo-declaration-of-principles-1993
- **Verdict:** corrected.
- **Checked (all read):** the text on Avalon (Articles I, V and XVII); the State Department's Office of the Historian; JTA on the letters of recognition, 10 Sep 1993; Said, *London Review of Books* vol. 15 no. 20; Karsh, *Middle East Quarterly*, Fall 2016.
- **Findings:**
  - The date and the White House venue are confirmed.
  - Article V(3) supports the list of deferred issues.
  - The letters of recognition, dated 9 Sep, came first.
  - The Said perspective is rewritten to match his text, in which he calls the agreement "a Palestinian Versailles". The Karsh quotation is confirmed word for word.
  - The Office of the Historian names Rabin and Abbas as the signers (usually given as Peres and Abbas). Our summary names no signatories, so there is no conflict.
- **Proposed patch:** add 4 sources; update the viewpoint and sourceIndex of perspectives 0 and 1; new claim for perspective 0.
- **Coordinates:** ok.

### hebron-ibrahimi-mosque-attack-1994
- **Verdict:** ok.
- **Checked:** JTA, 27 Jun 1994, and Al Jazeera, 27 Feb 2005 (both read).
- **Findings:**
  - Confirmed: "at least 29" killed, the Shamgar Commission's findings, and the Natshe quotation.
  - Al Jazeera's "twice as many injured" is the only figure for the wounded, so the editorNote stands.
  - The Al Jazeera note dates the division of Hebron into H1 and H2 to 1996. It was the Hebron Protocol of January 1997 (general knowledge, not read). This affects only the source note.
- **Proposed patch:** none.
- **Coordinates:** ok.

### gaza-jericho-agreement-1994
- **Verdict:** ok.
- **Checked:** the agreement text on PA-X, and the Office of the Historian (both read).
- **Findings:** every claim in the summary is supported: signed in Cairo on 4 May 1994; Israeli withdrawal within three weeks; a 24-member Palestinian Authority; Israel keeps the settlements and external security.
- **Proposed patch:** none.
- **Coordinates:** the pin is at 31.9, 35.1, while other country-wide events use 31.9, 35.2. Unifying them is the owner's decision and is not in the JSON.

### israel-jordan-wadi-araba-treaty-1994
- **Verdict:** corrected.
- **Checked:** the full treaty text on PA-X (read).
- **Findings:**
  - Confirmed: signed at the Araba/Arava crossing on 26 Oct 1994 by Rabin and Majali, witnessed by Clinton.
  - Article 3 sets the boundary "without prejudice" to territories under Israeli military government since 1967.
  - Confirmed: the water provisions (Article 6) and Jordan's "present special role" in Jerusalem's Muslim holy shrines (Article 9(2)).
- **Proposed patch:** replace the Wikipedia source with PA-X; spell the name "Abdul Salam Majali" as in the treaty.
- **Coordinates:** move to 29.575, 34.978, Wikipedia's point for the Wadi Araba crossing. The current pin is about 14 km north.

### oslo-ii-interim-agreement-1995
- **Verdict:** corrected.
- **Checked (all read):** the agreement text on PA-X; OCHA's Area C fact sheet of 3 Sep 2010 (62%); OCHA's Area C PDF of Aug 2014 ("over 60 percent", and about 341,000 settlers in Area C). B'Tselem returned 429.
- **Findings:**
  - Confirmed: signed in Washington on 28 Sep 1995; permanent-status talks to start by 4 May 1996.
  - Article XI says Area C was to be handed over gradually. "Remaining under Israeli control" describes what happened later, not what the text says.
  - The 60% figure is the share after 1998 and had no date.
- **Proposed patch:** new summary (58 words); add PA-X and the two OCHA sources.
- **Coordinates:** ok.

### camp-david-summit-2000
- **Verdict:** needs owner decision.
- **Checked:** Malley and Agha, *New York Review of Books*, 9 Aug 2001 (read in full). Could not read: the Jewish Virtual Library page, and the State Department's Trilateral Statement.
- **Findings:**
  - The NYRB article supports the Malley/Agha perspective, but it also blames the Palestinians for offering no counterproposal.
  - **Owner decision, end date:** we have 24 July (from JVL), while Wikipedia gives 11-25 July; the Trilateral Statement was issued on 25 July. Confirm from the Statement itself.
  - Still missing: an account by an Israeli participant (for example Ben-Ami) and by a Palestinian one (for example Hanieh or Erekat).
- **Proposed patch:** add the NYRB source; new claim for perspective 1, with sourceIndex 2.
- **Coordinates:** ok.

### second-intifada-begins-2000
- **Verdict:** corrected.
- **Checked:** the Mitchell Report (30 Apr 2001) on Avalon (read); Al Jazeera, 3 Jan 2005, reporting B'Tselem's figures (read). B'Tselem itself returned 429.
- **Findings:**
  - The Mitchell Report says Sharon's visit did not cause the uprising but was poorly timed. It found no persuasive evidence that the Palestinian Authority planned the uprising, nor that the visit was more than an internal political act.
  - B'Tselem counts 3,174 Palestinians and 940 Israelis killed from Sep 2000 to the end of 2004. Al Jazeera's wording is loaded; use it only for these attributed figures.
  - Israeli government figures (Shin Bet or the Foreign Ministry) were not read and are still needed for balance.
- **Proposed patch:** new summary (55 words); add 2 sources.
- **Coordinates:** ok.

### west-bank-barrier-and-icj-opinion-2002-2004
- **Verdict:** corrected.
- **Checked (all read):** OCHA, 2016; ICJ case page 131; the UNISPAL copy of ICJ press release 2004/28.
- **Findings:**
  - The Court's votes:
    - the wall is contrary to international law: 14-1
    - Israel must stop building it and dismantle it: 14-1
    - reparation: 14-1
    - obligations of other States: 13-2
    - action by the UN: 14-1
  - The opinion covers the occupied territory "including in and around East Jerusalem", not only sections in the West Bank.
  - The OCHA length figures date from 2016; no newer figure was read.
  - The approval date of 23 June 2002 rests on Wikipedia alone (OCHA says only "2002"). Source it, or switch to year precision.
- **Proposed patch:** a summary clause giving the vote and the Court's wording; add the press release as a source.
- **Coordinates:** ok.

### gaza-disengagement-2005
- **Verdict:** corrected.
- **Checked:** Congressional Research Service report RS22000, 16 Sep 2005 (read).
- **Findings:**
  - The CRS report confirms:
    - implementation began on 15 Aug
    - settlers were evacuated on 17-23 Aug
    - the army finished withdrawing on 12 Sep, ending the military government
    - about 8,500 settlers lived in Gaza
  - It also gives the Palestinian Authority's position that Israel remains the occupying power while it controls the crossings.
  - The Weissglass quotation (Haaretz, Oct 2004) has still not been read. Israel's own plan text could not be reached (Foreign Ministry URL returned 404).
- **Proposed patch:** add the CRS source.
- **Coordinates:** ok.

### hamas-gaza-takeover-and-blockade-2007
- **Verdict:** needs owner decision.
- **Checked:** the UN Division for Palestinian Rights' Chronological Review for June 2007 (read); OCHA's blockade page, 2016 (read).
- **Findings:**
  - Hamas seized the Fatah and Preventive Security headquarters on 13-14 June. Abbas declared a state of emergency, dissolved the government and appointed Fayyad.
  - According to OCHA, Israel imposed a land, sea and air blockade in June 2007, citing security, and Egypt restricted the Rafah crossing.
  - The perspective describing a Hamas "coup" still rests on Wikipedia alone, as does the 7 June start date.
- **Proposed patch:** add the UN Division for Palestinian Rights source.
- **Coordinates:** ok.

### unga-non-member-observer-state-2012
- **Verdict:** corrected.
- **Checked:** UN News item 427052 and the UNISPAL copy of press release GA/11317 (both read).
- **Findings:**
  - Confirmed: 29 Nov 2012, a vote of 138-9-41, and the nine States that voted against.
  - The clause saying the name Palestine replaced "PLO" is not supported: the press release says the upgrade was without prejudice to the PLO's role.
  - The statement by the Israeli ambassador, Prosor, is available on UN News. The Nuland quotation still rests on Wikipedia alone.
- **Proposed patch:** new summary (52 words); add 2 sources.
- **Coordinates:** ok.

### icj-advisory-opinion-occupation-2024
- **Verdict:** corrected.
- **Checked (all read):** ICJ case page 186; the operative text with the votes on UNISPAL; UN News, 19 Jul 2024.
- **Findings:**
  - The date of 19 July 2024 is confirmed.
  - The Court's votes:
    - Israel's presence in the occupied territory is unlawful: 11-4 (against: Sebutinde, Tomka, Abraham and Aurescu)
    - Israel must end that presence: 11-4
    - settlements must stop and settlers be evacuated: 14-1
    - reparation: 14-1
    - other States must not recognise the situation: 12-3
  - The opinion is non-binding.
  - UN News cites media reports that Israel called the opinion "fundamentally wrong". Add this as an Israeli perspective (not in the JSON).
- **Proposed patch:** new summary (59 words); add 2 sources.
- **Coordinates:** ok.

### oct-7-attack-and-gaza-war-2023
- **Verdict:** needs owner decision.
- **Checked (all read):** OCHA's "Reported impact" snapshot of 28 Oct 2026 (page and PDF); OCHA updates of 8 Oct 2024 and 4 Sep 2026; UN News item 1165856; ICJ case page 192.
- **Findings:**
  - The figures, the genocide finding and the ICJ case are covered under top issue 1 above.
  - The war is in effect ongoing: OCHA reports continuing deaths after the ceasefire. Keep `ongoing: true` and give an as-of date.
  - OCHA's figures give no split between civilians and combatants, and no Israeli Foreign Ministry casualty page was read.
- **Proposed patch:** new summary (55 words), with figures as of 28 Oct 2026; add 3 sources. Whether to split or re-scope the event is the owner's decision.
- **Coordinates:** ok.

### rabin-assassination-1995
- **Verdict:** ok.
- **Checked:** CNN, 4 Nov 1995 (read); the Office of the Historian (read). The Jewish Virtual Library page could not be read.
- **Findings:** the date, the place (Kings of Israel Square), Ichilov Hospital, and the assassin Yigal Amir, a law student at Bar-Ilan, are all confirmed.
- **Proposed patch:** add the CNN source.
- **Coordinates:** ok.

### palestinian-legislative-elections-2006
- **Verdict:** corrected (placeholder resolved).
- **Checked:** the EU observer mission's preliminary statement, 26 Jan 2006 (read); UN News on the Quartet, 30 Jan 2006 (read); the Al-Haq and Scoop sources as before.
- **Findings:**
  - Polling was on 25 Jan 2006, with 77% turnout, and the observers found the process "open and fairly contested".
  - The Quartet said future aid would be reviewed against a set of conditions.
- **Proposed patch:** dateStart → 2006-01-25 at day precision; new summary (58 words); add 2 sources.
- **Coordinates:** ok.

### gaza-war-2008-2009
- **Verdict:** corrected.
- **Checked:** the UN Fact-Finding Mission's report A/HRC/12/48 (read).
- **Findings:**
  - Paragraph 30: Palestinians killed were 1,387-1,417 according to NGOs, 1,444 according to the Gaza authorities, and 1,166 according to Israel.
  - Paragraph 357: B'Tselem counts 1,387, of whom 773 took no part in the hostilities.
  - Paragraph 359: the Israeli army's breakdown of 709, 295 and 162.
  - Paragraphs 31 and 364: 13 Israelis were killed, 4 of them by friendly fire.
- **Proposed patch:** new summary (59 words); add the report as a source.
- **Coordinates:** ok.

### gaza-war-2014
- **Verdict:** corrected (placeholder resolved).
- **Checked:** the UN Commission report A/HRC/29/52 (read); OCHA's key figures, as before.
- **Findings:**
  - The operation ran from 7 July to 26 August 2014, with the ground phase from 17 July.
  - 2,251 Palestinians were killed, 1,462 of them civilians. On the Israeli side, 6 civilians and 67 soldiers were killed.
  - The current "8 July" start date is not supported.
  - The Israeli Foreign Ministry's casualty breakdown (its 2015 report) was not read, so that perspective is still missing.
- **Proposed patch:** dates → 2014-07-07 to 2014-08-26 at day precision; new summary (58 words); add the report as a source.
- **Coordinates:** ok.

### gaza-escalation-2021
- **Verdict:** ok.
- **Checked:** the OCHA flash update and situation report, as read earlier.
- **Findings:** the dates and figures are correctly attributed. No statement from the Israeli government or from Hamas is cited; adding one is optional.
- **Proposed patch:** none.
- **Coordinates:** ok.

### great-march-of-return-2018
- **Verdict:** corrected (placeholder resolved).
- **Checked:** the UN Commission report A/HRC/40/74, distributed on 6 Mar 2019 (read); UN News (read).
- **Findings:**
  - Per the report: the protests began on 30 Mar 2018 and were held weekly, with demands to lift the blockade and for refugees' return; 189 people were killed, 183 of them by live ammunition.
  - Paragraph 29 records the position of Israel's security forces, which replaces the unsupported quotation from a search snippet.
  - The protests continued after 2018. Leave dateEnd null and add a note that they went on; the end in December 2019 has not yet been read in a source.
- **Proposed patch:** dateStart → 2018-03-30 at day precision; new summary (59 words); add the report as a source; replace the viewpoint, claim and sourceIndex of perspective 0.
- **Coordinates:** ok.
